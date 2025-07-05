import React, { useState } from 'react';
import { Button, Card as AntCard, Form, Input, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../auth/authFetch';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    console.log(values);
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/register', values);
      if (res.status === 201) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        if (res.data?.error && res.data.error.toLowerCase().includes('username')) {
          setError('username exist');
        } else {
          setError(res.data?.error || 'Registration failed');
        }
      }
    } catch (e: any) {
      if (e.response?.data?.error && e.response.data.error.toLowerCase().includes('username')) {
        setError('username exist');
      } else if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <AntCard style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Register</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username!' }]}> 
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password!' }]}> 
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[{ required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Register</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href="/login" style={{ color: '#1677ff', fontWeight: 500 }}>Back to Login</a>
        </div>
      </AntCard>
    </div>
  );
};

export default RegisterPage; 