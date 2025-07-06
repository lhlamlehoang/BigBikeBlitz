import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Checkbox, Space, Divider } from 'antd';
import { InfoCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  const handleAcceptAll = () => {
    onAccept({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    });
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 600,
        margin: '0 auto',
        zIndex: 1000,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e0e6ed'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <InfoCircleOutlined style={{ fontSize: 24, color: '#1677ff', marginTop: 4 }} />
        
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ marginBottom: 8 }}>
            We value your privacy
          </Title>
          
          <Paragraph style={{ color: '#666', marginBottom: 16 }}>
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </Paragraph>

          {showDetails && (
            <div style={{ marginBottom: 16 }}>
              <Divider style={{ margin: '16px 0' }} />
              
              <div style={{ marginBottom: 12 }}>
                <Checkbox checked={preferences.necessary} disabled>
                  <Text strong>Necessary Cookies</Text>
                </Checkbox>
                <Paragraph style={{ margin: '4px 0 0 24px', fontSize: 14, color: '#666' }}>
                  Required for the website to function properly. Cannot be disabled.
                </Paragraph>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Checkbox 
                  checked={preferences.analytics}
                  onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                >
                  <Text strong>Analytics Cookies</Text>
                </Checkbox>
                <Paragraph style={{ margin: '4px 0 0 24px', fontSize: 14, color: '#666' }}>
                  Help us understand how visitors interact with our website.
                </Paragraph>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Checkbox 
                  checked={preferences.functional}
                  onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                >
                  <Text strong>Functional Cookies</Text>
                </Checkbox>
                <Paragraph style={{ margin: '4px 0 0 24px', fontSize: 14, color: '#666' }}>
                  Enable enhanced functionality and personalization.
                </Paragraph>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Checkbox 
                  checked={preferences.marketing}
                  onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                >
                  <Text strong>Marketing Cookies</Text>
                </Checkbox>
                <Paragraph style={{ margin: '4px 0 0 24px', fontSize: 14, color: '#666' }}>
                  Used to track visitors across websites for marketing purposes.
                </Paragraph>
              </div>
            </div>
          )}

          <Space size="middle" wrap>
            <Button 
              type="primary" 
              onClick={handleAcceptAll}
              icon={<CheckOutlined />}
            >
              Accept All
            </Button>
            
            {showDetails && (
              <Button 
                onClick={handleAcceptSelected}
                icon={<CheckOutlined />}
              >
                Accept Selected
              </Button>
            )}
            
            <Button 
              type="text" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </Button>
            
            <Button 
              type="text" 
              onClick={onDecline}
              icon={<CloseOutlined />}
              danger
            >
              Decline
            </Button>
          </Space>

          <div style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: '#999' }}>
              By continuing to use our site, you agree to our{' '}
              <a href="/privacy" style={{ color: '#1677ff' }}>Privacy Policy</a> and{' '}
              <a href="/terms" style={{ color: '#1677ff' }}>Terms of Service</a>.
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CookieConsent; 