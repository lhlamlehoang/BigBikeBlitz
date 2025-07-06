import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, message, Checkbox } from 'antd';
import { MailOutlined, SendOutlined, GiftOutlined, BellOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  showBenefits?: boolean;
  compact?: boolean;
  onSubscribe?: (email: string) => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Stay in the Loop",
  description = "Get exclusive access to new motorcycle releases, special offers, and riding tips delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  showBenefits = true,
  compact = false,
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      message.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      message.error('Please enter a valid email address');
      return;
    }

    if (!agreed) {
      message.error('Please agree to receive our newsletter');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
      setAgreed(false);
      
      // Call the onSubscribe callback if provided
      if (onSubscribe) {
        onSubscribe(email);
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const benefits = [
    {
      icon: <GiftOutlined style={{ color: '#1677ff' }} />,
      text: "Exclusive offers and discounts"
    },
    {
      icon: <BellOutlined style={{ color: '#1677ff' }} />,
      text: "New motorcycle announcements"
    },
    {
      icon: <MailOutlined style={{ color: '#1677ff' }} />,
      text: "Riding tips and maintenance guides"
    }
  ];

  if (compact) {
    return (
      <Card 
        style={{ 
          background: 'linear-gradient(135deg, #1677ff 0%, #003580 100%)',
          color: 'white',
          borderRadius: 12,
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white', marginBottom: 8 }}>
            {title}
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 16 }}>
            {description}
          </Paragraph>
          
          <Space.Compact style={{ width: '100%', maxWidth: 400 }}>
            <Input
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSubscribe}
              icon={<SendOutlined />}
              style={{ 
                borderRadius: '0 8px 8px 0',
                background: 'white',
                color: '#1677ff',
                border: 'none'
              }}
            >
              {buttonText}
            </Button>
          </Space.Compact>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      style={{ 
        background: 'linear-gradient(135deg, #f7f9fb 0%, #eaf6ff 100%)',
        borderRadius: 16,
        border: '1px solid #e0e6ed',
        boxShadow: '0 4px 24px rgba(22,119,255,0.08)'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <Title level={3} style={{ marginBottom: 16, color: '#003580' }}>
          {title}
        </Title>
        
        <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
          {description}
        </Paragraph>

        {showBenefits && (
          <div style={{ marginBottom: 32 }}>
            <Space size="large" wrap style={{ justifyContent: 'center' }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {benefit.icon}
                  <Text style={{ color: '#666' }}>{benefit.text}</Text>
                </div>
              ))}
            </Space>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <Space.Compact style={{ width: '100%', maxWidth: 400 }}>
            <Input
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              prefix={<MailOutlined style={{ color: '#999' }} />}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSubscribe}
              icon={<SendOutlined />}
              style={{ borderRadius: '0 8px 8px 0' }}
            >
              {buttonText}
            </Button>
          </Space.Compact>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Checkbox 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          >
            <Text style={{ fontSize: 14, color: '#666' }}>
              I agree to receive email updates and newsletters from Big Bike Blitz. 
              I can unsubscribe at any time.
            </Text>
          </Checkbox>
        </div>

        <Text style={{ fontSize: 12, color: '#999' }}>
          We respect your privacy. Unsubscribe at any time. 
          <a href="/privacy" style={{ color: '#1677ff', marginLeft: 4 }}>
            Privacy Policy
          </a>
        </Text>
      </div>
    </Card>
  );
};

export default NewsletterSignup; 