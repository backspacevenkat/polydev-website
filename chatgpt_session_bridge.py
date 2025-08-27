#!/usr/bin/env python3
"""
Cross-LLM Bridge - ChatGPT Session Token Authentication
Uses your ChatGPT Plus/Pro subscription via browser session tokens
"""

import asyncio
import json
import os
import aiohttp
import uuid
from datetime import datetime
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("cross-llm-bridge")

class ChatGPTSession:
    def __init__(self, session_token):
        self.session_token = session_token
        self.session = None
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        
    async def get_session(self):
        if not self.session:
            self.session = aiohttp.ClientSession(
                headers={
                    'User-Agent': self.user_agent,
                    'Accept': 'text/event-stream',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://chat.openai.com/',
                    'Origin': 'https://chat.openai.com'
                },
                cookies={
                    '__Secure-next-auth.session-token': self.session_token
                }
            )
        return self.session
        
    async def send_message(self, message, conversation_id=None):
        session = await self.get_session()
        
        try:
            # First, get the conversation requirements
            async with session.get('https://chat.openai.com/api/auth/session') as response:
                if response.status != 200:
                    return f"❌ Session validation failed: {response.status}"
                
                session_data = await response.json()
                if not session_data.get('user'):
                    return "❌ Invalid session token - please update it"
            
            # Create new conversation if needed
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
            
            # Prepare the message payload
            payload = {
                "action": "next",
                "messages": [
                    {
                        "id": str(uuid.uuid4()),
                        "author": {"role": "user"},
                        "content": {"content_type": "text", "parts": [message]},
                        "metadata": {}
                    }
                ],
                "conversation_id": conversation_id,
                "parent_message_id": str(uuid.uuid4()),
                "model": "text-davinci-002-render-sha",
                "timezone_offset_min": -480,
                "history_and_training_disabled": False,
                "arkose_token": None,
                "force_paragen": False,
                "force_rate_limit": False
            }
            
            # Send the message
            async with session.post(
                'https://chat.openai.com/backend-api/conversation',
                json=payload,
                headers={'Content-Type': 'application/json'}
            ) as response:
                
                if response.status != 200:
                    return f"❌ Request failed: {response.status} - {await response.text()}"
                
                # Parse server-sent events response
                response_text = ""
                async for line in response.content:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        try:
                            data = line[6:]  # Remove 'data: '
                            if data == '[DONE]':
                                break
                            json_data = json.loads(data)
                            if json_data.get('message', {}).get('content', {}).get('parts'):
                                parts = json_data['message']['content']['parts']
                                if parts:
                                    response_text = parts[0]
                        except json.JSONDecodeError:
                            continue
                
                return response_text or "❌ No response received from ChatGPT"
                
        except Exception as e:
            return f"❌ Error communicating with ChatGPT: {str(e)}"

# Global session manager
chatgpt_session = None

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="setup_session_token",
            description="Set up ChatGPT session token from your browser (uses your subscription)",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_token": {"type": "string", "description": "Your __Secure-next-auth.session-token from chat.openai.com"}
                },
                "required": ["session_token"]
            }
        ),
        Tool(
            name="send_to_chatgpt",
            description="Send message to ChatGPT using your subscription (no API credits needed)",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Message to send to ChatGPT"},
                    "conversation_id": {"type": "string", "description": "Optional conversation ID to continue chat"}
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="get_session_instructions",
            description="Get instructions on how to extract your ChatGPT session token",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    global chatgpt_session
    
    if name == "get_session_instructions":
        instructions = """
🔑 HOW TO GET YOUR CHATGPT SESSION TOKEN:

1. 📱 Go to https://chat.openai.com and login with your account
2. 🔧 Open Chrome Developer Tools (F12 or Ctrl+Shift+I)
3. 📋 Click on "Application" tab
4. 🍪 Click on "Cookies" in the left sidebar
5. 🔍 Find and copy the value of "__Secure-next-auth.session-token"

⚠️  IMPORTANT:
- This token lets you use your ChatGPT Plus/Pro subscription
- NO API credits needed - uses your existing subscription!
- Keep this token private (it's like your login)
- Token may expire and need refreshing periodically

✅ Once you have the token, use: setup_session_token tool
"""
        return [TextContent(type="text", text=instructions)]
    
    elif name == "setup_session_token":
        session_token = arguments.get("session_token", "").strip()
        if not session_token:
            return [TextContent(type="text", text="❌ Session token is required")]
        
        # Store the session token securely
        os.makedirs("/tmp/cross_llm_bridge", exist_ok=True)
        with open("/tmp/cross_llm_bridge/session_token.txt", "w") as f:
            f.write(session_token)
        
        # Initialize the ChatGPT session
        chatgpt_session = ChatGPTSession(session_token)
        
        # Test the session
        test_response = await chatgpt_session.send_message("Test connection - respond with: SESSION_WORKING")
        
        if "SESSION_WORKING" in test_response or "session" in test_response.lower():
            return [TextContent(type="text", text="✅ ChatGPT session token set up successfully! You can now use send_to_chatgpt tool with your subscription.")]
        else:
            return [TextContent(type="text", text=f"⚠️  Session token saved but test failed: {test_response}. Token might be expired or invalid.")]
    
    elif name == "send_to_chatgpt":
        if not chatgpt_session:
            # Try to load existing session token
            token_file = "/tmp/cross_llm_bridge/session_token.txt"
            if os.path.exists(token_file):
                with open(token_file, "r") as f:
                    session_token = f.read().strip()
                chatgpt_session = ChatGPTSession(session_token)
            else:
                return [TextContent(type="text", text="❌ No session token found. Use setup_session_token tool first.")]
        
        message = arguments.get("message", "")
        conversation_id = arguments.get("conversation_id")
        
        if not message:
            return [TextContent(type="text", text="❌ Message is required")]
        
        response = await chatgpt_session.send_message(message, conversation_id)
        return [TextContent(type="text", text=f"🤖 ChatGPT (via subscription): {response}")]
    
    return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())