import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Result, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';
import { notification } from 'antd';

const { Title, Text } = Typography;

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    // Prevent multiple API calls
    if (hasAttemptedVerification.current) {
      return;
    }

    hasAttemptedVerification.current = true;

    const verifyEmail = async () => {
      try {
        const response = await api.post('/verify-email', { token });
        
        if (response.status === 200) {
          setVerificationStatus('success');
          notification.success({
            message: 'Email Verified!',
            description: 'Your email has been verified successfully. You can now log in.',
          });
        } else {
          setVerificationStatus('error');
          setErrorMessage(response.data?.error || 'Verification failed');
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.response?.data?.error || 'Verification failed');
        notification.error({
          message: 'Verification Failed',
          description: error.response?.data?.error || 'Verification failed',
        });
      }
    };

    verifyEmail();
  }, []); // Remove searchParams dependency

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  if (verificationStatus === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#fff' 
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
            size="large"
          />
          <Title level={4} style={{ marginTop: 16 }}>Verifying your email...</Title>
          <Text type="secondary">Please wait while we verify your email address.</Text>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#fff' 
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            status="success"
            title="Email Verified Successfully!"
            subTitle="Your email has been verified. You can now log in to your account."
            extra={[
              <Button type="primary" key="login" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#fff' 
    }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Result
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          status="error"
          title="Verification Failed"
          subTitle={errorMessage}
          extra={[
            <Button type="primary" key="register" onClick={handleGoToRegister}>
              Register Again
            </Button>,
            <Button key="login" onClick={handleGoToLogin}>
              Go to Login
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default VerifyEmailPage; 