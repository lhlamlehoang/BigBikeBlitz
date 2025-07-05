import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { Link } from 'react-router-dom';
import api from '../auth/authFetch';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/password-reset/request', { email: values.email });
      if (res.data && res.data.success) {
        setSubmitted(true);
      } else {
        setError(res.data?.message || 'Failed to send reset link.');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
      <Card style={{ width: 380, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: 'none' }}>
        <Title level={3} style={{ color: '#1677ff', textAlign: 'center', marginBottom: 8 }}>Forgot Password</Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24, color: '#888' }}>Enter your email address to receive a password reset link.</Text>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {submitted ? (
          <Alert
            message="If an account with that email exists, a password reset link has been sent."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label={<span style={{ color: '#222' }}>Email</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input autoComplete="email" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ marginBottom: 12, marginTop: 8 }} loading={loading}>Send Reset Link</Button>
          </Form>
        )}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/login" style={{ color: '#1677ff', fontWeight: 500 }}>Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage; 