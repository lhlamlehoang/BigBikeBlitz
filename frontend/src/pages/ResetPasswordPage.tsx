import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../auth/authFetch';

const { Title, Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage: React.FC = () => {
  const query = useQuery();
  const token = query.get('token');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/password-reset/confirm', {
        token,
        password: values.password,
      });
      if (res.data && res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data?.message || 'Failed to reset password.');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
        <Card style={{ width: 380, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: 'none' }}>
          <Alert message="Invalid or missing reset token." type="error" showIcon />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/forgot" style={{ color: '#1677ff', fontWeight: 500 }}>Request a new reset link</Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
      <Card style={{ width: 380, background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: 'none' }}>
        <Title level={3} style={{ color: '#1677ff', textAlign: 'center', marginBottom: 8 }}>Reset Password</Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24, color: '#888' }}>Enter your new password below.</Text>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {success ? (
          <Alert message="Password reset successful! Redirecting to login..." type="success" showIcon style={{ marginBottom: 16 }} />
        ) : (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="password"
              label={<span style={{ color: '#222' }}>New Password</span>}
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password autoComplete="new-password" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ marginBottom: 12, marginTop: 8 }} loading={loading}>Reset Password</Button>
          </Form>
        )}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/login" style={{ color: '#1677ff', fontWeight: 500 }}>Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 