"""
OAuth-based Authentication Manager for Cross-LLM Bridge
Based on research of Claude Code and OpenAI Codex CLI patterns
"""

import asyncio
import json
import base64
import hashlib
import secrets
import webbrowser
import urllib.parse
from typing import Dict, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import os
from pathlib import Path
import httpx
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time


@dataclass
class OAuthCredentials:
    llm_type: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    id_token: Optional[str] = None
    api_key: Optional[str] = None
    expires_at: Optional[datetime] = None
    subscription_info: Optional[Dict[str, Any]] = None


class CallbackHandler(BaseHTTPRequestHandler):
    """HTTP handler for OAuth callback"""
    
    def do_GET(self):
        # Parse the callback URL
        url_parts = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(url_parts.query)
        
        # Store the authorization code
        if 'code' in query_params:
            self.server.auth_code = query_params['code'][0]
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Success</title>
                <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">✅ Authentication Successful!</h1>
                <p>Cross-LLM Bridge OAuth authentication completed.</p>
                <p style="color: #666;">You can close this window and return to the terminal.</p>
                <script>setTimeout(() => window.close(), 3000);</script>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
        else:
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            error_html = """
            <!DOCTYPE html>
            <html>
            <head><title>Authentication Error</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: red;">❌ Authentication Failed</h1>
                <p>Please try again from the terminal.</p>
            </body>
            </html>
            """
            self.wfile.write(error_html.encode())
    
    def log_message(self, format, *args):
        # Suppress HTTP server logs
        pass


class OAuthAuthManager:
    """OAuth-based authentication manager following proven patterns"""
    
    def __init__(self):
        self.credentials: Dict[str, OAuthCredentials] = {}
        self.logger = logging.getLogger(__name__)
        self.callback_port = 1455  # Use standard OpenAI CLI port
        self.claude_callback_port = None  # Claude uses dynamic ports
        self.auth_server = None
        self.setup_auth_endpoints()
        self.setup_storage()
    
    def setup_auth_endpoints(self):
        """Setup OAuth endpoints for each provider"""
        self.auth_config = {
            "openai": {
                "client_id": "app_EMoamEEZ73f0CkXaXp7hrann",  # Correct OpenAI client ID from CLIProxyAPI
                "discovery_url": "https://auth.openai.com/.well-known/openid-configuration",
                "auth_url": "https://auth.openai.com/authorize",
                "token_url": "https://auth.openai.com/oauth/token",
                "scopes": ["openid", "profile", "email", "offline_access"],
                "redirect_uri": f"http://localhost:{self.callback_port}/auth/callback"
            },
            "anthropic": {
                # Real Claude OAuth endpoints from OpenCode implementation
                "client_id": "9d1c250a-e61b-44d9-88ed-5944d1962f5e",  # Real Claude Code client ID
                "auth_url": "https://console.anthropic.com/oauth/authorize",  # Real endpoint
                "token_url": "https://console.anthropic.com/oauth/token",  # Real endpoint
                "scopes": ["org:create_api_key", "user:profile", "user:inference"],
                "redirect_uri": None  # Will be set dynamically like Claude Code does
            }
        }
    
    def setup_storage(self):
        """Setup secure credential storage"""
        self.storage_dir = Path.home() / ".cross-llm-bridge" / "auth"
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        
        # Set secure permissions (Unix only)
        try:
            os.chmod(self.storage_dir, 0o700)
        except:
            pass
    
    def generate_pkce(self) -> tuple[str, str]:
        """Generate PKCE code verifier and challenge"""
        # Generate code verifier (random string)
        code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
        
        # Generate code challenge (SHA256 hash of verifier)
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode('utf-8')).digest()
        ).decode('utf-8').rstrip('=')
        
        return code_verifier, code_challenge
    
    async def authenticate_openai(self) -> bool:
        """Authenticate with OpenAI using OAuth (like Codex CLI)"""
        print("\n🤖 OpenAI Authentication (OAuth)")
        print("=" * 40)
        
        try:
            # Generate PKCE parameters
            code_verifier, code_challenge = self.generate_pkce()
            
            # Build authorization URL
            auth_params = {
                "response_type": "code",
                "client_id": self.auth_config["openai"]["client_id"],
                "redirect_uri": self.auth_config["openai"]["redirect_uri"],
                "scope": " ".join(self.auth_config["openai"]["scopes"]),
                "code_challenge": code_challenge,
                "code_challenge_method": "S256",
                "id_token_add_organizations": "true",
                "codex_cli_simplified_flow": "true"  # CRITICAL parameter that was missing!
            }
            
            auth_url = f"{self.auth_config['openai']['auth_url']}?" + urllib.parse.urlencode(auth_params)
            
            # Start local callback server
            self.auth_server = HTTPServer(("localhost", self.callback_port), CallbackHandler)
            self.auth_server.auth_code = None
            
            server_thread = threading.Thread(target=self.auth_server.serve_forever)
            server_thread.daemon = True
            server_thread.start()
            
            print(f"1. Opening browser for OAuth authentication...")
            print(f"2. If browser doesn't open, visit: {auth_url}")
            print(f"3. Complete the login process in your browser")
            print(f"4. Return here after authentication")
            
            # Open browser
            webbrowser.open(auth_url)
            
            # Wait for callback
            print("\n⏳ Waiting for authentication callback...")
            
            timeout = 300  # 5 minutes
            start_time = time.time()
            
            while self.auth_server.auth_code is None and (time.time() - start_time) < timeout:
                await asyncio.sleep(1)
            
            if self.auth_server.auth_code is None:
                print("❌ Authentication timed out")
                return False
            
            auth_code = self.auth_server.auth_code
            self.auth_server.shutdown()
            
            print("✅ Authorization code received!")
            
            # Exchange code for tokens
            token_data = {
                "grant_type": "authorization_code",
                "client_id": self.auth_config["openai"]["client_id"],
                "code": auth_code,
                "redirect_uri": self.auth_config["openai"]["redirect_uri"],
                "code_verifier": code_verifier
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.auth_config["openai"]["token_url"],
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
            
            if response.status_code != 200:
                print(f"❌ Token exchange failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
            
            tokens = response.json()
            print("✅ Tokens received!")
            
            # Generate API key (like Codex CLI does)
            api_key = await self.generate_openai_api_key(tokens["id_token"])
            
            # Store credentials
            credentials = OAuthCredentials(
                llm_type="openai",
                access_token=tokens.get("access_token"),
                refresh_token=tokens.get("refresh_token"),
                id_token=tokens.get("id_token"),
                api_key=api_key,
                expires_at=datetime.now() + timedelta(seconds=tokens.get("expires_in", 3600)),
                subscription_info=self.parse_subscription_info(tokens.get("id_token"))
            )
            
            self.credentials["openai"] = credentials
            await self.save_credentials("openai")
            
            print("✅ OpenAI authentication successful!")
            return True
            
        except Exception as e:
            self.logger.error(f"OpenAI authentication failed: {e}")
            print(f"❌ Authentication failed: {e}")
            return False
        finally:
            if self.auth_server:
                try:
                    self.auth_server.shutdown()
                except:
                    pass
    
    async def generate_openai_api_key(self, id_token: str) -> Optional[str]:
        """Generate API key using ID token (like Codex CLI)"""
        try:
            # Token exchange for API key
            key_data = {
                "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
                "requested_token_type": "urn:x-oath:params:oauth:token-type:api-key",
                "subject_token": id_token,
                "subject_token_type": "urn:ietf:params:oauth:token-type:id_token"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/oauth/token",
                    json=key_data,
                    headers={
                        "Authorization": f"Bearer {id_token}",
                        "Content-Type": "application/json"
                    }
                )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("access_token")  # This is actually the API key
            else:
                self.logger.warning(f"API key generation failed: {response.status_code}")
                return None
                
        except Exception as e:
            self.logger.warning(f"API key generation error: {e}")
            return None
    
    def parse_subscription_info(self, id_token: str) -> Dict[str, Any]:
        """Parse subscription information from ID token"""
        try:
            # Decode JWT payload (simplified - should use proper JWT library)
            import base64
            
            # Split JWT and decode payload
            parts = id_token.split('.')
            if len(parts) >= 2:
                # Add padding if needed
                payload = parts[1]
                padding = len(payload) % 4
                if padding:
                    payload += '=' * (4 - padding)
                
                decoded = base64.urlsafe_b64decode(payload)
                claims = json.loads(decoded)
                
                # Extract OpenAI-specific subscription info
                auth_claims = claims.get("https://api.openai.com/auth", {})
                
                return {
                    "plan_type": auth_claims.get("chatgpt_plan_type"),
                    "subscription_active": bool(auth_claims.get("chatgpt_subscription_active_start")),
                    "organization_id": auth_claims.get("organization_id"),
                    "is_owner": auth_claims.get("is_org_owner", False)
                }
        except Exception as e:
            self.logger.warning(f"Failed to parse subscription info: {e}")
        
        return {}
    
    def find_available_port(self, start_port=54000, max_attempts=100):
        """Find an available port for Claude OAuth callback (like Claude Code does)"""
        import socket
        for port in range(start_port, start_port + max_attempts):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.bind(('localhost', port))
                sock.close()
                return port
            except OSError:
                continue
        raise Exception("No available ports found")

    async def authenticate_anthropic(self) -> bool:
        """Authenticate with Anthropic using OAuth (like Claude Code)"""
        print("\n🤖 Claude Authentication (OAuth)")
        print("=" * 40)
        
        try:
            # Find available port dynamically (like Claude Code)
            self.claude_callback_port = self.find_available_port()
            dynamic_redirect_uri = f"http://localhost:{self.claude_callback_port}/callback"
            
            print(f"🔧 Using dynamic port: {self.claude_callback_port}")
            print(f"🔧 Redirect URI: {dynamic_redirect_uri}")
            
            # Generate PKCE parameters
            code_verifier, code_challenge = self.generate_pkce()
            
            # Build authorization URL
            auth_params = {
                "response_type": "code",
                "client_id": self.auth_config["anthropic"]["client_id"],
                "redirect_uri": dynamic_redirect_uri,
                "scope": " ".join(self.auth_config["anthropic"]["scopes"]),
                "code_challenge": code_challenge,
                "code_challenge_method": "S256",
                "state": secrets.token_urlsafe(32)  # Required security parameter
            }
            
            auth_url = f"{self.auth_config['anthropic']['auth_url']}?" + urllib.parse.urlencode(auth_params)
            
            # Start local callback server on dynamic port
            self.auth_server = HTTPServer(("localhost", self.claude_callback_port), CallbackHandler)
            self.auth_server.auth_code = None
            
            server_thread = threading.Thread(target=self.auth_server.serve_forever)
            server_thread.daemon = True
            server_thread.start()
            
            print(f"1. Opening browser for Claude OAuth authentication...")
            print(f"2. If browser doesn't open, visit: {auth_url}")
            print(f"3. Complete the login with your Claude Pro/Max subscription")
            print(f"4. Return here after authentication")
            
            # Open browser
            webbrowser.open(auth_url)
            
            # Wait for callback
            print("\n⏳ Waiting for authentication callback...")
            
            timeout = 300  # 5 minutes
            start_time = time.time()
            
            while self.auth_server.auth_code is None and (time.time() - start_time) < timeout:
                await asyncio.sleep(1)
            
            if self.auth_server.auth_code is None:
                print("❌ Authentication timed out")
                return False
            
            auth_code = self.auth_server.auth_code
            self.auth_server.shutdown()
            
            print("✅ Authorization code received!")
            
            # Exchange code for tokens
            token_data = {
                "grant_type": "authorization_code",
                "client_id": self.auth_config["anthropic"]["client_id"],
                "code": auth_code,
                "redirect_uri": dynamic_redirect_uri,  # Use the same dynamic URI
                "code_verifier": code_verifier
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.auth_config["anthropic"]["token_url"],
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
            
            if response.status_code != 200:
                print(f"❌ Token exchange failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
            
            tokens = response.json()
            print("✅ Tokens received!")
            
            # Store credentials
            credentials = OAuthCredentials(
                llm_type="anthropic",
                access_token=tokens.get("access_token"),
                refresh_token=tokens.get("refresh_token"),
                expires_at=datetime.now() + timedelta(seconds=tokens.get("expires_in", 3600)),
                subscription_info={"plan_type": "subscription", "subscription_active": True}
            )
            
            self.credentials["anthropic"] = credentials
            await self.save_credentials("anthropic")
            
            print("✅ Claude authentication successful!")
            return True
            
        except Exception as e:
            self.logger.error(f"Claude authentication failed: {e}")
            print(f"❌ Authentication failed: {e}")
            return False
        finally:
            if self.auth_server:
                try:
                    self.auth_server.shutdown()
                except:
                    pass
    
    async def save_credentials(self, provider: str):
        """Save credentials securely"""
        creds = self.credentials.get(provider)
        if not creds:
            return
        
        creds_file = self.storage_dir / f"{provider}-auth.json"
        
        # Convert to serializable format
        creds_data = {
            "llm_type": creds.llm_type,
            "access_token": creds.access_token,
            "refresh_token": creds.refresh_token,
            "id_token": creds.id_token,
            "api_key": creds.api_key,
            "expires_at": creds.expires_at.isoformat() if creds.expires_at else None,
            "subscription_info": creds.subscription_info,
            "last_updated": datetime.now().isoformat()
        }
        
        with open(creds_file, 'w') as f:
            json.dump(creds_data, f, indent=2)
        
        # Set secure permissions
        try:
            os.chmod(creds_file, 0o600)
        except:
            pass
        
        self.logger.info(f"Saved {provider} credentials to {creds_file}")
    
    async def load_credentials(self, provider: str) -> bool:
        """Load stored credentials"""
        creds_file = self.storage_dir / f"{provider}-auth.json"
        
        if not creds_file.exists():
            return False
        
        try:
            with open(creds_file, 'r') as f:
                creds_data = json.load(f)
            
            expires_at = None
            if creds_data.get("expires_at"):
                expires_at = datetime.fromisoformat(creds_data["expires_at"])
            
            # Check if expired
            if expires_at and expires_at < datetime.now():
                self.logger.info(f"{provider} credentials expired")
                return False
            
            self.credentials[provider] = OAuthCredentials(
                llm_type=creds_data["llm_type"],
                access_token=creds_data.get("access_token"),
                refresh_token=creds_data.get("refresh_token"),
                id_token=creds_data.get("id_token"),
                api_key=creds_data.get("api_key"),
                expires_at=expires_at,
                subscription_info=creds_data.get("subscription_info", {})
            )
            
            self.logger.info(f"Loaded {provider} credentials")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to load {provider} credentials: {e}")
            return False
    
    def is_authenticated(self, provider: str) -> bool:
        """Check if authenticated with provider"""
        creds = self.credentials.get(provider)
        if not creds:
            return False
        
        if creds.expires_at and creds.expires_at < datetime.now():
            return False
        
        return bool(creds.access_token or creds.api_key)
    
    def get_auth_headers(self, provider: str) -> Dict[str, str]:
        """Get authentication headers for API requests"""
        creds = self.credentials.get(provider)
        if not creds:
            return {}
        
        headers = {
            "User-Agent": "Cross-LLM-Bridge/1.0.0"
        }
        
        if provider == "openai" and creds.api_key:
            headers["Authorization"] = f"Bearer {creds.api_key}"
        elif provider == "anthropic" and creds.access_token:
            headers["Authorization"] = f"Bearer {creds.access_token}"
            headers["Content-Type"] = "application/json"
        elif creds.access_token:
            headers["Authorization"] = f"Bearer {creds.access_token}"
        
        return headers
    
    def get_status(self) -> Dict[str, Any]:
        """Get authentication status for all providers"""
        status = {}
        
        for provider in ["openai", "anthropic"]:
            creds = self.credentials.get(provider)
            if creds:
                status[provider] = {
                    "authenticated": self.is_authenticated(provider),
                    "expires_at": creds.expires_at.isoformat() if creds.expires_at else None,
                    "subscription_info": creds.subscription_info,
                    "has_api_key": bool(creds.api_key)
                }
            else:
                status[provider] = {
                    "authenticated": False,
                    "expires_at": None,
                    "subscription_info": None,
                    "has_api_key": False
                }
        
        return status