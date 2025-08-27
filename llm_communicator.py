"""
LLM Communicator for Cross-LLM Bridge
Handles actual communication with Claude and ChatGPT via subscription interfaces
"""

import asyncio
import json
import re
from typing import Dict, List, Optional, Any, Tuple
import httpx
from datetime import datetime
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time

from auth_manager import SubscriptionAuthManager, AuthCredentials


class LLMCommunicator:
    """Handles direct communication with LLMs using subscription authentication"""
    
    def __init__(self, auth_manager: SubscriptionAuthManager):
        self.auth_manager = auth_manager
        self.logger = logging.getLogger(__name__)
        self._setup_browser_options()
        
    def _setup_browser_options(self):
        """Setup browser options for LLM communication"""
        self.chrome_options = Options()
        # Use headless for production, visible for debugging
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        
    async def send_to_claude(self, prompt: str, context: str = "", session_id: str = "") -> str:
        """
        Send a prompt to Claude using subscription access
        
        Args:
            prompt: The message to send to Claude
            context: Additional context or conversation history
            session_id: Optional session ID for conversation continuity
            
        Returns:
            Claude's response as a string
        """
        if not self.auth_manager.is_authenticated("claude"):
            raise Exception("Not authenticated with Claude. Please run authentication first.")
        
        try:
            # For MVP, we'll use browser automation to interact with Claude
            return await self._browser_communicate_claude(prompt, context)
        except Exception as e:
            self.logger.error(f"Error communicating with Claude: {e}")
            # Fallback to mock response for testing
            return f"[Claude Error] Could not send message: {str(e)}"
    
    async def send_to_chatgpt(self, prompt: str, context: str = "", session_id: str = "") -> str:
        """
        Send a prompt to ChatGPT using subscription access
        
        Args:
            prompt: The message to send to ChatGPT
            context: Additional context or conversation history
            session_id: Optional session ID for conversation continuity
            
        Returns:
            ChatGPT's response as a string
        """
        if not self.auth_manager.is_authenticated("chatgpt"):
            raise Exception("Not authenticated with ChatGPT. Please run authentication first.")
        
        try:
            # For MVP, we'll use browser automation to interact with ChatGPT
            return await self._browser_communicate_chatgpt(prompt, context)
        except Exception as e:
            self.logger.error(f"Error communicating with ChatGPT: {e}")
            # Fallback to mock response for testing
            return f"[ChatGPT Error] Could not send message: {str(e)}"
    
    async def _browser_communicate_claude(self, prompt: str, context: str = "") -> str:
        """Use browser automation to communicate with Claude"""
        driver = None
        try:
            # Use visible browser for now to help with debugging
            options = Options()
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            
            driver = webdriver.Chrome(options=options)
            
            # Load Claude and restore session
            driver.get("https://claude.ai/chats")
            
            # Restore cookies
            cookies = self.auth_manager.get_cookies("claude")
            for name, value in cookies.items():
                try:
                    driver.add_cookie({"name": name, "value": value})
                except Exception as e:
                    self.logger.debug(f"Could not add cookie {name}: {e}")
            
            # Refresh to apply cookies
            driver.refresh()
            
            # Wait for page to load
            await asyncio.sleep(3)
            
            # Look for new chat button or existing chat
            try:
                # Try to start a new chat
                new_chat_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Start new chat') or contains(@aria-label, 'new chat')]"))
                )
                new_chat_button.click()
                await asyncio.sleep(2)
            except:
                # If new chat button not found, we might already be in a chat
                self.logger.info("New chat button not found, continuing with current page")
            
            # Find the message input area
            message_input = None
            input_selectors = [
                "textarea[placeholder*='message']",
                "textarea[placeholder*='Claude']", 
                "[contenteditable='true']",
                "textarea",
                "div[contenteditable='true']"
            ]
            
            for selector in input_selectors:
                try:
                    message_input = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    break
                except:
                    continue
            
            if not message_input:
                return "[Claude Error] Could not find message input field"
            
            # Prepare the full message
            full_message = prompt
            if context:
                full_message = f"Context: {context}\n\nQuestion: {prompt}"
            
            # Type the message
            message_input.clear()
            message_input.send_keys(full_message)
            
            # Send the message (try different methods)
            try:
                # Method 1: Press Enter
                message_input.send_keys(Keys.RETURN)
            except:
                try:
                    # Method 2: Look for send button
                    send_button = driver.find_element(By.XPATH, "//button[contains(@aria-label, 'Send') or contains(text(), 'Send')]")
                    send_button.click()
                except:
                    # Method 3: Try Ctrl+Enter
                    message_input.send_keys(Keys.CONTROL + Keys.RETURN)
            
            # Wait for response
            await asyncio.sleep(2)
            
            # Wait for Claude's response to appear and complete
            max_wait_time = 60  # seconds
            start_time = time.time()
            
            response_text = ""
            while time.time() - start_time < max_wait_time:
                try:
                    # Look for response elements
                    response_selectors = [
                        "[data-testid='conversation'] div:last-child",
                        ".message:last-child",
                        "[role='article']:last-child", 
                        ".chat-message:last-child"
                    ]
                    
                    for selector in response_selectors:
                        try:
                            response_element = driver.find_element(By.CSS_SELECTOR, selector)
                            current_text = response_element.text.strip()
                            
                            if current_text and current_text != prompt and len(current_text) > 10:
                                response_text = current_text
                                break
                        except:
                            continue
                    
                    if response_text:
                        # Check if response seems complete (not actively typing)
                        await asyncio.sleep(2)
                        new_text = ""
                        try:
                            for selector in response_selectors:
                                try:
                                    response_element = driver.find_element(By.CSS_SELECTOR, selector)
                                    new_text = response_element.text.strip()
                                    break
                                except:
                                    continue
                        except:
                            pass
                        
                        if new_text == response_text:
                            # Response hasn't changed, likely complete
                            break
                        else:
                            response_text = new_text
                    
                    await asyncio.sleep(1)
                except Exception as e:
                    self.logger.debug(f"Error while waiting for response: {e}")
                    await asyncio.sleep(1)
            
            if not response_text:
                # Fallback: get all text from the page
                try:
                    page_text = driver.find_element(By.TAG_NAME, "body").text
                    # Extract what looks like a response
                    lines = page_text.split('\n')
                    for i, line in enumerate(lines):
                        if prompt.lower() in line.lower() and i + 1 < len(lines):
                            response_text = lines[i + 1]
                            break
                except:
                    pass
            
            return response_text if response_text else "[Claude Error] No response received within timeout period"
            
        except Exception as e:
            self.logger.error(f"Browser communication with Claude failed: {e}")
            return f"[Claude Error] Communication failed: {str(e)}"
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass
    
    async def _browser_communicate_chatgpt(self, prompt: str, context: str = "") -> str:
        """Use browser automation to communicate with ChatGPT"""
        driver = None
        try:
            options = Options()
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            
            driver = webdriver.Chrome(options=options)
            
            # Load ChatGPT
            driver.get("https://chat.openai.com/")
            
            # Restore cookies
            cookies = self.auth_manager.get_cookies("chatgpt")
            for name, value in cookies.items():
                try:
                    driver.add_cookie({"name": name, "value": value})
                except Exception as e:
                    self.logger.debug(f"Could not add cookie {name}: {e}")
            
            # Refresh to apply cookies
            driver.refresh()
            await asyncio.sleep(3)
            
            # Find message input
            message_input = None
            input_selectors = [
                "textarea[placeholder*='message']",
                "textarea[data-id='root']",
                "#prompt-textarea",
                "textarea",
                "[contenteditable='true']"
            ]
            
            for selector in input_selectors:
                try:
                    message_input = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    break
                except:
                    continue
            
            if not message_input:
                return "[ChatGPT Error] Could not find message input field"
            
            # Prepare message
            full_message = prompt
            if context:
                full_message = f"Context: {context}\n\nQuestion: {prompt}"
            
            # Type and send message
            message_input.clear()
            message_input.send_keys(full_message)
            
            # Send message
            try:
                # Look for send button first
                send_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'Send') or contains(text(), 'Send')]"))
                )
                send_button.click()
            except:
                # Fallback to Enter key
                message_input.send_keys(Keys.RETURN)
            
            # Wait for response
            await asyncio.sleep(3)
            
            max_wait_time = 60
            start_time = time.time()
            response_text = ""
            
            while time.time() - start_time < max_wait_time:
                try:
                    # Look for response
                    response_selectors = [
                        "[data-message-author-role='assistant']:last-child",
                        ".message.assistant:last-child",
                        "[role='presentation']:last-child .whitespace-pre-wrap",
                        ".conversation-turn:last-child .markdown"
                    ]
                    
                    for selector in response_selectors:
                        try:
                            response_element = driver.find_element(By.CSS_SELECTOR, selector)
                            current_text = response_element.text.strip()
                            
                            if current_text and len(current_text) > 10:
                                response_text = current_text
                                break
                        except:
                            continue
                    
                    if response_text:
                        # Check if complete
                        await asyncio.sleep(2)
                        new_text = ""
                        try:
                            for selector in response_selectors:
                                try:
                                    response_element = driver.find_element(By.CSS_SELECTOR, selector)
                                    new_text = response_element.text.strip()
                                    break
                                except:
                                    continue
                        except:
                            pass
                        
                        if new_text == response_text:
                            break
                        else:
                            response_text = new_text
                    
                    await asyncio.sleep(1)
                except Exception as e:
                    self.logger.debug(f"Error waiting for ChatGPT response: {e}")
                    await asyncio.sleep(1)
            
            return response_text if response_text else "[ChatGPT Error] No response received within timeout period"
            
        except Exception as e:
            self.logger.error(f"Browser communication with ChatGPT failed: {e}")
            return f"[ChatGPT Error] Communication failed: {str(e)}"
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass
    
    async def compare_responses(self, prompt: str, analysis_focus: str = "general") -> Dict[str, str]:
        """Get responses from both LLMs and return comparison"""
        try:
            # Get responses concurrently (though browser automation makes this sequential)
            claude_task = asyncio.create_task(self.send_to_claude(prompt))
            chatgpt_task = asyncio.create_task(self.send_to_chatgpt(prompt))
            
            claude_response = await claude_task
            chatgpt_response = await chatgpt_task
            
            # Simple analysis for now
            analysis = self._analyze_responses(claude_response, chatgpt_response, analysis_focus)
            
            return {
                "claude_response": claude_response,
                "chatgpt_response": chatgpt_response,
                "analysis": analysis,
                "prompt": prompt,
                "focus": analysis_focus
            }
            
        except Exception as e:
            return {
                "claude_response": f"Error: {e}",
                "chatgpt_response": f"Error: {e}",
                "analysis": f"Comparison failed: {e}",
                "prompt": prompt,
                "focus": analysis_focus
            }
    
    def _analyze_responses(self, claude_resp: str, chatgpt_resp: str, focus: str) -> str:
        """Analyze differences between responses"""
        analysis_parts = []
        
        # Basic length comparison
        claude_len = len(claude_resp)
        chatgpt_len = len(chatgpt_resp)
        analysis_parts.append(f"Response lengths: Claude ({claude_len} chars) vs ChatGPT ({chatgpt_len} chars)")
        
        # Focus-specific analysis
        if focus == "accuracy":
            analysis_parts.append("Accuracy analysis: Manual verification needed for factual claims")
        elif focus == "creativity":
            analysis_parts.append("Creativity analysis: Compare unique approaches and novel ideas")
        elif focus == "code_quality":
            analysis_parts.append("Code quality analysis: Check syntax, best practices, and efficiency")
        else:
            analysis_parts.append("General analysis: Compare overall approach and comprehensiveness")
        
        # Simple keyword analysis
        claude_words = set(claude_resp.lower().split())
        chatgpt_words = set(chatgpt_resp.lower().split())
        
        unique_claude = claude_words - chatgpt_words
        unique_chatgpt = chatgpt_words - claude_words
        
        if unique_claude:
            analysis_parts.append(f"Claude-specific terms: {', '.join(list(unique_claude)[:5])}")
        if unique_chatgpt:
            analysis_parts.append(f"ChatGPT-specific terms: {', '.join(list(unique_chatgpt)[:5])}")
        
        return "\n".join(analysis_parts)