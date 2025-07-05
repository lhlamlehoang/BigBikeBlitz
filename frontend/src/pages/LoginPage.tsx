import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, Alert } from 'antd';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../auth/authFetch';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth', values);
      const data = res.data;
      login(data.token);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/google', { credential: credentialResponse.credential });
      const data = res.data;
      login(data.token);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
      <Card style={{ width: 380, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: 'none' }}>
        <Title level={3} style={{ color: '#1677ff', textAlign: 'center', marginBottom: 8 }}>Sign in to Big Bike Blitz</Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24, color: '#888' }}>Welcome back! Please login to your account.</Text>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label={<span style={{ color: '#222' }}>Username</span>} rules={[{ required: true }]}> 
            <Input autoComplete="username" size="large" /> 
          </Form.Item>
          <Form.Item name="password" label={<span style={{ color: '#222' }}>Password</span>} rules={[{ required: true }]}> 
            <Input.Password autoComplete="current-password" size="large" /> 
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ marginBottom: 12, marginTop: 8 }}>Login</Button>
        </Form>
        <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
          <Link to="/forgot" style={{ color: '#1677ff', fontWeight: 500 }}>Forgot your password?</Link>
        </div>
        <div style={{ textAlign: 'center', margin: '12px 0', color: '#888' }}>or</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Google login failed')}
            width="340"
            useOneTap
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text style={{ color: '#888' }}>Don't have an account? </Text>
          <Link to="/register" style={{ color: '#1677ff', fontWeight: 500 }}>Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage; 