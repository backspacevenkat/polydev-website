#!/usr/bin/env python3

import os
import sys
import json
import argparse
import sqlite3
import hashlib
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ProjectMemory:
    """Handles local project memory with TF-IDF based snippet selection"""
    
    def __init__(self, root_path: str, cache_dir: str = None):
        self.root_path = Path(root_path).resolve()
        self.cache_dir = Path(cache_dir or os.path.expanduser("~/.polydev/cache"))
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize SQLite database for caching
        self.db_path = self.cache_dir / "project_memory.db"
        self.init_database()
        
        # Default file patterns
        self.default_includes = [
            "**/*.py", "**/*.js", "**/*.ts", "**/*.tsx", "**/*.jsx",
            "**/*.java", "**/*.cpp", "**/*.c", "**/*.h", "**/*.cs",
            "**/*.go", "**/*.rs", "**/*.php", "**/*.rb", "**/*.swift",
            "**/*.kt", "**/*.scala", "**/*.md", "**/*.txt", "**/*.yml",
            "**/*.yaml", "**/*.json", "**/*.xml", "**/*.html", "**/*.css"
        ]
        
        self.default_excludes = [
            "node_modules/**", "venv/**", "env/**", "__pycache__/**",
            ".git/**", ".next/**", "dist/**", "build/**", "target/**",
            "*.pyc", "*.pyo", "*.so", "*.dll", "*.exe", "*.o", "*.obj"
        ]
    
    def init_database(self):
        """Initialize SQLite database for caching file content and TF-IDF vectors"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS file_cache (
                    file_path TEXT PRIMARY KEY,
                    content_hash TEXT NOT NULL,
                    content TEXT NOT NULL,
                    tfidf_vector TEXT,
                    last_modified REAL NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_last_modified ON file_cache(last_modified)')
    
    def get_file_hash(self, file_path: Path) -> str:
        """Get SHA-256 hash of file content"""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()
        except Exception:
            return ""
    
    def should_include_file(self, file_path: Path, includes: List[str], excludes: List[str]) -> bool:
        """Check if file should be included based on patterns"""
        relative_path = file_path.relative_to(self.root_path)
        path_str = str(relative_path)
        
        # Check excludes first
        for pattern in excludes:
            if relative_path.match(pattern):
                return False
        
        # Check includes
        for pattern in includes:
            if relative_path.match(pattern):
                return True
        
        return False
    
    def extract_file_content(self, file_path: Path, max_size: int = 100000) -> str:
        """Extract readable content from file"""
        try:
            if file_path.stat().st_size > max_size:
                return f"[File too large: {file_path.name}]"
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Add file header for context
            relative_path = file_path.relative_to(self.root_path)
            return f"File: {relative_path}\n{'='*50}\n{content}\n\n"
            
        except Exception as e:
            return f"[Error reading {file_path.name}: {str(e)}]"
    
    def scan_project_files(self, includes: List[str] = None, excludes: List[str] = None) -> List[Dict[str, Any]]:
        """Scan project files and return list with metadata"""
        includes = includes or self.default_includes
        excludes = excludes or self.default_excludes
        
        files = []
        
        for file_path in self.root_path.rglob("*"):
            if file_path.is_file() and self.should_include_file(file_path, includes, excludes):
                try:
                    stat = file_path.stat()
                    content_hash = self.get_file_hash(file_path)
                    
                    files.append({
                        'path': file_path,
                        'relative_path': file_path.relative_to(self.root_path),
                        'size': stat.st_size,
                        'modified': stat.st_mtime,
                        'hash': content_hash
                    })
                except Exception:
                    continue
        
        return files
    
    def get_cached_content(self, file_path: Path, content_hash: str, modified_time: float) -> Optional[Tuple[str, Optional[str]]]:
        """Get cached content and TF-IDF vector if available and up-to-date"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                'SELECT content, tfidf_vector, content_hash, last_modified FROM file_cache WHERE file_path = ?',
                (str(file_path),)
            )
            row = cursor.fetchone()
            
            if row and row[2] == content_hash and row[3] == modified_time:
                return row[0], row[1]
        
        return None
    
    def cache_content(self, file_path: Path, content: str, content_hash: str, modified_time: float, tfidf_vector: str = None):
        """Cache file content and TF-IDF vector"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT OR REPLACE INTO file_cache 
                (file_path, content_hash, content, tfidf_vector, last_modified)
                VALUES (?, ?, ?, ?, ?)
            ''', (str(file_path), content_hash, content, tfidf_vector, modified_time))
    
    def build_corpus(self, includes: List[str] = None, excludes: List[str] = None) -> Dict[str, str]:
        """Build text corpus from project files"""
        files = self.scan_project_files(includes, excludes)
        corpus = {}
        
        print(f"Scanning {len(files)} files...")
        
        for file_info in files:
            file_path = file_info['path']
            content_hash = file_info['hash']
            modified_time = file_info['modified']
            
            # Check cache first
            cached = self.get_cached_content(file_path, content_hash, modified_time)
            if cached:
                content = cached[0]
            else:
                content = self.extract_file_content(file_path)
                self.cache_content(file_path, content, content_hash, modified_time)
            
            if content and not content.startswith("["):  # Skip error messages
                corpus[str(file_path)] = content
        
        return corpus
    
    def select_relevant_snippets(self, query: str, k: int = 5, includes: List[str] = None, 
                               excludes: List[str] = None, budget_chars: int = 8000) -> str:
        """Select most relevant code snippets using TF-IDF similarity"""
        
        # Build corpus
        corpus = self.build_corpus(includes, excludes)
        
        if not corpus:
            return "No files found in project."
        
        # Prepare documents for TF-IDF
        file_paths = list(corpus.keys())
        documents = [corpus[path] for path in file_paths]
        documents.append(query)  # Add query as last document
        
        # Compute TF-IDF vectors
        print("Computing TF-IDF vectors...")
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2),
            max_df=0.8,
            min_df=2
        )
        
        try:
            tfidf_matrix = vectorizer.fit_transform(documents)
        except ValueError:
            # Fallback if TF-IDF fails
            return self.fallback_selection(corpus, k, budget_chars)
        
        # Compute similarity between query and documents
        query_vector = tfidf_matrix[-1]  # Last document is the query
        document_vectors = tfidf_matrix[:-1]  # All except query
        
        similarities = cosine_similarity(query_vector, document_vectors).flatten()
        
        # Get top-k most similar documents
        top_indices = similarities.argsort()[-k:][::-1]
        
        # Build result within budget
        result_parts = []
        total_chars = 0
        
        for idx in top_indices:
            if total_chars >= budget_chars:
                break
                
            file_path = file_paths[idx]
            content = corpus[file_path]
            similarity_score = similarities[idx]
            
            if similarity_score > 0.01:  # Minimum similarity threshold
                # Truncate content if needed
                remaining_budget = budget_chars - total_chars
                if len(content) > remaining_budget:
                    content = content[:remaining_budget] + "... [truncated]"
                
                result_parts.append(f"Similarity: {similarity_score:.3f}\n{content}")
                total_chars += len(content)
        
        if not result_parts:
            return self.fallback_selection(corpus, k, budget_chars)
        
        return "\n" + "="*80 + "\n".join(result_parts)
    
    def fallback_selection(self, corpus: Dict[str, str], k: int, budget_chars: int) -> str:
        """Fallback selection when TF-IDF fails - use most recently modified files"""
        files = [(path, content) for path, content in corpus.items()]
        
        # Sort by modification time (get from filesystem)
        def get_mtime(item):
            try:
                return Path(item[0]).stat().st_mtime
            except:
                return 0
        
        files.sort(key=get_mtime, reverse=True)
        
        result_parts = []
        total_chars = 0
        
        for file_path, content in files[:k]:
            if total_chars >= budget_chars:
                break
            
            remaining_budget = budget_chars - total_chars
            if len(content) > remaining_budget:
                content = content[:remaining_budget] + "... [truncated]"
            
            result_parts.append(content)
            total_chars += len(content)
        
        return "\n" + "="*80 + "\n".join(result_parts)

class PerspectivesCLI:
    """CLI tool for the Perspectives API"""
    
    def __init__(self):
        self.config_dir = Path.home() / ".polydev"
        self.config_file = self.config_dir / "config.json"
        self.config_dir.mkdir(exist_ok=True)
        
        self.default_config = {
            "api_url": "http://localhost:3000/api/perspectives",
            "mode": "managed",
            "default_models": ["gpt-4", "claude-3-sonnet", "gemini-pro"],
            "project_memory": "light",
            "max_messages": 10,
            "temperature": 0.7,
            "max_tokens": 2000,
            "byo_keys": {}
        }
        
        self.config = self.load_config()
    
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from file"""
        try:
            if self.config_file.exists():
                with open(self.config_file) as f:
                    saved_config = json.load(f)
                    config = self.default_config.copy()
                    config.update(saved_config)
                    return config
        except Exception:
            pass
        return self.default_config.copy()
    
    def save_config(self):
        """Save configuration to file"""
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def call_perspectives_api(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Call the perspectives API"""
        # Merge with defaults
        request_data = {
            "prompt": prompt,
            "models": kwargs.get("models", self.config["default_models"]),
            "mode": kwargs.get("mode", self.config["mode"]),
            "project_memory": kwargs.get("project_memory", self.config["project_memory"]),
            "max_messages": kwargs.get("max_messages", self.config["max_messages"]),
            "temperature": kwargs.get("temperature", self.config["temperature"]),
            "max_tokens": kwargs.get("max_tokens", self.config["max_tokens"])
        }
        
        # Add BYO keys if in BYO mode
        if request_data["mode"] == "byo":
            request_data["byo_keys"] = kwargs.get("byo_keys", self.config["byo_keys"])
        
        # Add project context if memory is enabled
        if request_data["project_memory"] != "none" and "project_root" in kwargs:
            project_memory = ProjectMemory(kwargs["project_root"])
            
            # Get relevant snippets
            context = project_memory.select_relevant_snippets(
                query=prompt,
                k=kwargs.get("context_files", 5),
                includes=kwargs.get("includes"),
                excludes=kwargs.get("excludes"),
                budget_chars=kwargs.get("context_budget", 8000)
            )
            
            # Enhance the prompt with context
            enhanced_prompt = f"Context from project:\n{context}\n\nPrompt: {prompt}"
            request_data["prompt"] = enhanced_prompt
            
            request_data["project_context"] = {
                "root_path": kwargs["project_root"],
                "includes": kwargs.get("includes"),
                "excludes": kwargs.get("excludes")
            }
        
        # Make API request
        headers = {"Content-Type": "application/json"}
        auth_token = os.getenv("POLYDEV_API_TOKEN")
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        response = requests.post(
            self.config["api_url"],
            json=request_data,
            headers=headers,
            timeout=60
        )
        
        response.raise_for_status()
        return response.json()
    
    def format_response(self, response: Dict[str, Any]) -> str:
        """Format API response for display"""
        lines = []
        lines.append("=" * 80)
        lines.append(f"PERSPECTIVES RESPONSE")
        lines.append(f"Total Tokens: {response.get('total_tokens', 'N/A')}")
        lines.append(f"Total Latency: {response.get('total_latency_ms', 'N/A')}ms")
        lines.append("=" * 80)
        
        for i, resp in enumerate(response.get('responses', []), 1):
            lines.append(f"\n{i}. {resp['model']}")
            lines.append("-" * 40)
            
            if resp.get('error'):
                lines.append(f"ERROR: {resp['error']}")
            else:
                lines.append(resp['content'])
            
            if resp.get('tokens_used'):
                lines.append(f"\nTokens: {resp['tokens_used']}, Latency: {resp.get('latency_ms', 0)}ms")
        
        return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser(description="Polydev Perspectives CLI")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Get perspectives command
    perspectives_parser = subparsers.add_parser('get', help='Get perspectives on a prompt')
    perspectives_parser.add_argument('prompt', help='The prompt to get perspectives on')
    perspectives_parser.add_argument('--models', nargs='+', help='Models to query')
    perspectives_parser.add_argument('--mode', choices=['managed', 'byo'], help='API key mode')
    perspectives_parser.add_argument('--memory', choices=['none', 'light', 'full'], 
                                   help='Project memory level')
    perspectives_parser.add_argument('--project-root', help='Project root directory')
    perspectives_parser.add_argument('--includes', nargs='+', help='File patterns to include')
    perspectives_parser.add_argument('--excludes', nargs='+', help='File patterns to exclude')
    perspectives_parser.add_argument('--context-files', type=int, default=5, 
                                   help='Number of context files to include')
    perspectives_parser.add_argument('--context-budget', type=int, default=8000,
                                   help='Character budget for context')
    perspectives_parser.add_argument('--temperature', type=float, help='Model temperature')
    perspectives_parser.add_argument('--max-tokens', type=int, help='Max tokens per response')
    perspectives_parser.add_argument('--output', choices=['json', 'text'], default='text',
                                   help='Output format')
    
    # Config command
    config_parser = subparsers.add_parser('config', help='Manage configuration')
    config_parser.add_argument('--set', nargs=2, metavar=('KEY', 'VALUE'), 
                             help='Set configuration value')
    config_parser.add_argument('--get', help='Get configuration value')
    config_parser.add_argument('--list', action='store_true', help='List all configuration')
    
    # Keys command
    keys_parser = subparsers.add_parser('keys', help='Manage BYO API keys')
    keys_parser.add_argument('--set', nargs=2, metavar=('PROVIDER', 'KEY'),
                           help='Set API key for provider (openai, anthropic, google)')
    keys_parser.add_argument('--remove', help='Remove API key for provider')
    keys_parser.add_argument('--list', action='store_true', help='List configured keys')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = PerspectivesCLI()
    
    try:
        if args.command == 'get':
            # Build kwargs from args
            kwargs = {}
            if args.models:
                kwargs['models'] = args.models
            if args.mode:
                kwargs['mode'] = args.mode
            if args.memory:
                kwargs['project_memory'] = args.memory
            if args.project_root:
                kwargs['project_root'] = args.project_root
            if args.includes:
                kwargs['includes'] = args.includes
            if args.excludes:
                kwargs['excludes'] = args.excludes
            if args.temperature is not None:
                kwargs['temperature'] = args.temperature
            if args.max_tokens:
                kwargs['max_tokens'] = args.max_tokens
            
            kwargs['context_files'] = args.context_files
            kwargs['context_budget'] = args.context_budget
            
            response = cli.call_perspectives_api(args.prompt, **kwargs)
            
            if args.output == 'json':
                print(json.dumps(response, indent=2))
            else:
                print(cli.format_response(response))
        
        elif args.command == 'config':
            if args.set:
                key, value = args.set
                # Try to parse as JSON, fallback to string
                try:
                    value = json.loads(value)
                except:
                    pass
                
                cli.config[key] = value
                cli.save_config()
                print(f"Set {key} = {value}")
            
            elif args.get:
                value = cli.config.get(args.get)
                if value is not None:
                    print(json.dumps(value, indent=2))
                else:
                    print(f"Key '{args.get}' not found")
            
            elif args.list:
                print(json.dumps(cli.config, indent=2))
        
        elif args.command == 'keys':
            if args.set:
                provider, key = args.set
                if provider not in ['openai', 'anthropic', 'google']:
                    print(f"Invalid provider: {provider}")
                    print("Valid providers: openai, anthropic, google")
                    return
                
                cli.config['byo_keys'][provider] = key
                cli.save_config()
                print(f"Set API key for {provider}")
            
            elif args.remove:
                if args.remove in cli.config['byo_keys']:
                    del cli.config['byo_keys'][args.remove]
                    cli.save_config()
                    print(f"Removed API key for {args.remove}")
                else:
                    print(f"No API key found for {args.remove}")
            
            elif args.list:
                keys = cli.config.get('byo_keys', {})
                if keys:
                    for provider in keys:
                        print(f"{provider}: {'*' * 20}...{keys[provider][-4:]}")
                else:
                    print("No BYO API keys configured")
    
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()