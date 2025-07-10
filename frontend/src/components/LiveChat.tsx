import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Typography, Avatar, Space, Badge, Drawer, List, message, Spin } from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined, 
  UserOutlined, 
  CustomerServiceOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';
import { BACKEND_URL } from '../config';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'image';
  agentName?: string;
  agentAvatar?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [agentInfo, setAgentInfo] = useState<{
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to AI agent WebSocket
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      try {
        // Generate a unique session ID
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${newSessionId}`);
        
        ws.onopen = () => {
          console.log('Connected to AI agent');
          setIsConnected(true);
          setAgentInfo({
            name: 'BigBikeBlitz AI',
            avatar: BACKEND_URL + '/uploads/logo.jpg',
            status: 'online'
          });
          
          // Add welcome message
          addMessage({
            id: 'welcome',
            text: `Hi ${user?.username || 'there'}! 👋 I'm your BigBikeBlitz AI assistant. I can help you with motorcycle information, recommendations, and more. What would you like to know?`,
            sender: 'agent',
            timestamp: new Date(),
            type: 'text',
            agentName: 'BigBikeBlitz AI'
          });
          
          setLoading(false);
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'response' && data.message) {
              setIsTyping(false);
              addMessage({
                id: Date.now().toString(),
                text: data.message,
                sender: 'agent',
                timestamp: new Date(),
                type: 'text',
                agentName: 'BigBikeBlitz AI'
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            setIsTyping(false);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setLoading(false);
          message.error('Failed to connect to AI agent. Please try again.');
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
        };
        
        setWsConnection(ws);
        
        // Cleanup on unmount
        return () => {
          ws.close();
        };
      } catch (error) {
        console.error('Failed to connect to AI agent:', error);
        setIsConnected(false);
        setLoading(false);
        message.error('Failed to connect to AI agent. Please ensure the AI agent is running.');
      }
    }
  }, [isOpen, user]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isConnected || !wsConnection) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send message to AI agent
      wsConnection.send(JSON.stringify({
        message: inputMessage,
        user_id: user?.id || 'anonymous'
      }));


    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      message.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "Tell me about financing options",
    "What's the warranty coverage?",
    "Can I schedule a test ride?",
    "What's the delivery time?",
    "Do you have this in stock?"
  ];

  const sendQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Avatar 
              size={32} 
              src={agentInfo?.avatar} 
              icon={<CustomerServiceOutlined />}
            />
            <Badge 
              status={agentInfo?.status === 'online' ? 'success' : 'default'} 
              style={{ position: 'absolute', bottom: 0, right: 0 }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>
              {agentInfo?.name || 'Customer Support'}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {agentInfo?.status === 'online' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      }
      placement="right"
      width={'40vw'}
      open={isOpen}
      onClose={onClose}
      maskClosable={false}
      styles={{
        header: { padding: '16px 24px' },
        body: { padding: 0, minWidth: 400, maxWidth: 900 }
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px',
          background: '#f8f9fa'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: '#666' }}>
                Connecting to support...
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                  }}>
                    {/* Avatar always visible */}
                    <div style={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                      {message.sender === 'agent' ? (
                        <Avatar 
                          size={32} 
                          src={message.agentAvatar || agentInfo?.avatar}
                          icon={<CustomerServiceOutlined />}
                        />
                      ) : (
                        <Avatar size={32} icon={<UserOutlined />} />
                      )}
                    </div>
                    {/* Message bubble */}
                    <div style={{
                      background: message.sender === 'user' ? '#1677ff' : '#fff',
                      color: message.sender === 'user' ? '#fff' : '#333',
                      padding: '12px 16px',
                      borderRadius: 18,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      wordBreak: 'break-word',
                      maxWidth: '80vw',
                      minWidth: 0,
                    }}>
                      <div>{message.text}</div>
                      <div style={{
                        fontSize: 11,
                        opacity: 0.7,
                        marginTop: 4,
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                      }}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <Avatar size={32} src={BACKEND_URL + '/uploads/logo.jpg'} />
                  <div style={{
                    background: '#fff',
                    padding: '12px 16px',
                    borderRadius: 18,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && !loading && (
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Quick questions:
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  size="small"
                  onClick={() => sendQuickReply(reply)}
                  style={{ fontSize: 11 }}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #f0f0f0',
          background: '#fff'
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={!isConnected}
                style={{ borderRadius: 20 }}
              />
            </div>
            <Button
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              style={{ 
                borderRadius: '50%', 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)',
                border: 'none', 
                color: '#fff',
                fontWeight: 700,
                boxShadow: '0 2px 12px rgba(33,150,243,0.10)',
                transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #67e8f9 0%, #2196f3 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)'}
            />
          </div>
        </div>
      </div>

      <style>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #999;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </Drawer>
  );
};

export default LiveChat; 