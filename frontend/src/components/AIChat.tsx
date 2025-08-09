import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Typography, Avatar, Space, Divider, Badge, Tooltip } from 'antd';
import { MessageOutlined, SendOutlined, CloseOutlined, RobotOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Array<{ title: string; url: string }>;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isConnected) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      connectWebSocket(newSessionId);
    }
  }, [isOpen]);

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const connectWebSocket = (sessionId: string) => {
          try {
        setConnectionStatus('connecting');
        // const ws = new WebSocket(`wss://bigbikeblitz-agent.up.railway.app/ws/chat/${sessionId}`);
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${sessionId}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('WebSocket connected to AI Agent');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received AI message:', data);
        
        if (data.type === 'response') {
          setIsLoading(false);
          addMessage('bot', data.message, data.sources);
        } else if (data.type === 'system') {
          setIsLoading(false);
          addMessage('bot', data.message);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('error');
        setIsLoading(false);
        console.log('WebSocket disconnected from AI Agent');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('error');
        setIsLoading(false);
        addMessage('bot', 'Sorry, I\'m having trouble connecting to the AI service. Please try again later.');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus('error');
      setIsLoading(false);
      addMessage('bot', 'Sorry, I\'m having trouble connecting to the AI service. Please try again later.');
    }
  };

  const addMessage = (sender: 'user' | 'bot', text: string, sources?: Array<{ title: string; url: string }>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      sources
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    setIsLoading(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        message: userMessage,
        user_id: user?.id || 'anonymous'
      }));
    } else {
      // Fallback to REST API if WebSocket is not available
      try {
        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            user_id: user?.id || 'anonymous',
            session_id: sessionId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          addMessage('bot', data.response, data.sources);
        } else {
          setIsLoading(false);
          addMessage('bot', 'Sorry, I\'m having trouble processing your request. Please try again.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setIsLoading(false);
        addMessage('bot', 'Sorry, I\'m having trouble connecting to the AI service. Please try again later.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#52c41a';
      case 'connecting': return '#faad14';
      case 'error': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'AI Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: isMobile ? 0 : 0,
      left: isMobile ? 0 : 'auto',
      width: isMobile ? '100vw' : '40vw',
      minWidth: isMobile ? undefined : '400px',
      maxWidth: isMobile ? '100vw' : '900px',
      height: '60vh',
      margin: 'auto',
      zIndex: 1000,
      backgroundColor: '#fff',
      borderRadius: isMobile ? '16px 16px 0 0' : 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #f0f0f0'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ fontSize: 20 }} />
          <div>
            <Text strong style={{ color: '#fff', fontSize: 16 }}>
              AI Assistant
            </Text>
            <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: getConnectionStatusColor() 
              }}></div>
              {getConnectionStatusText()}
            </div>
          </div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{ color: '#fff' }}
        />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#666'
          }}>
            <RobotOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
            <div style={{ fontSize: 16, marginBottom: 8 }}>
              Welcome to BigBikeBlitz AI Assistant!
            </div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Ask me about motorcycles, products, services, or anything related to BigBikeBlitz.
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: 18,
              backgroundColor: message.sender === 'user' ? '#667eea' : '#fff',
              color: message.sender === 'user' ? '#fff' : '#000',
              wordWrap: 'break-word',
              boxShadow: message.sender === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
              border: message.sender === 'user' ? 'none' : '1px solid #e8e8e8'
            }}>
              <div style={{ marginBottom: 4, lineHeight: 1.5 }}>
                {message.text}
              </div>
              {message.sources && message.sources.length > 0 && (
                <div style={{ 
                  marginTop: 8, 
                  padding: '8px 12px', 
                  backgroundColor: '#f0f8ff', 
                  borderRadius: 8,
                  border: '1px solid #e6f7ff'
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#1890ff' }}>
                    Sources:
                  </div>
                  {message.sources.map((source, index) => (
                    <div key={index} style={{ fontSize: 11, marginBottom: 2, color: '#666' }}>
                      • {source.title}
                    </div>
                  ))}
                </div>
              )}
              <div style={{
                fontSize: 11,
                opacity: 0.7,
                textAlign: message.sender === 'user' ? 'right' : 'left',
                marginTop: 4
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: 18,
              backgroundColor: '#fff',
              color: '#666',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e8e8e8',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RobotOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    backgroundColor: '#1890ff', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite ease-in-out' 
                  }}></div>
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    backgroundColor: '#1890ff', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite ease-in-out 0.2s' 
                  }}></div>
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    backgroundColor: '#1890ff', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite ease-in-out 0.4s' 
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fff'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about motorcycles, products, or services..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ borderRadius: 20 }}
            disabled={!isConnected || isLoading}
          />
          <Button
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || !isConnected}
            style={{ 
              borderRadius: '50%', 
              width: 40, 
              height: 40,
              background: 'linear-gradient(135deg, #1677ff 0%, #67e8f9 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 2px 12px rgba(22,119,255,0.10)',
              transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #67e8f9 0%, #1677ff 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1677ff 0%, #67e8f9 100%)'}
          />
        </div>
        <div style={{ 
          fontSize: 11, 
          color: '#666', 
          marginTop: 8, 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4
        }}>
          <RobotOutlined style={{ fontSize: 12 }} />
          Powered by Llama 3.2 1B • BigBikeBlitz Assistant
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AIChat; 