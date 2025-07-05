import React, { useState } from 'react';
import { Button, Card as AntCard, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../auth/authFetch';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { notification } from 'antd';

const { Title } = Typography;

const passwordRequirements = [
  {
    label: '8-12 characters',
    test: (v: string) => v.length >= 8 && v.length <= 12,
  },
  {
    label: 'At least one lowercase letter',
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    label: 'At least one uppercase letter',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    label: 'At least one digit',
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    label: 'At least one symbol',
    test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
  },
];

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState('');

  const onFinish = async (values: { username: string; password: string }) => {
    console.log(values);
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/register', values);
      if (res.status === 201) {
        setSuccess('Registration successful! You can now log in.');
        notification.success({ message: 'Registration successful! You can now log in.' });
        setTimeout(() => navigate('/login'), 1200);
      } else {
        if (res.data?.error && res.data.error.toLowerCase().includes('username')) {
          setError('username exist');
          notification.error({ message: 'Username already exists' });
        } else {
          setError(res.data?.error || 'Registration failed');
          notification.error({ message: res.data?.error || 'Registration failed' });
        }
      }
    } catch (e: any) {
      if (e.response?.data?.error && e.response.data.error.toLowerCase().includes('username')) {
        setError('username exist');
        notification.error({ message: 'Username already exists' });
      } else if (e.response?.data?.error) {
        setError(e.response.data.error);
        notification.error({ message: e.response.data.error });
      } else {
        setError('Network error');
        notification.error({ message: 'Network error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <AntCard style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Register</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username!' }]}> 
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.length < 8 || value.length > 12) {
                  return Promise.reject(new Error('Password must be 8-12 characters.'));
                }
                if (!/[a-z]/.test(value)) {
                  return Promise.reject(new Error('Password must include a lowercase letter.'));
                }
                if (!/[A-Z]/.test(value)) {
                  return Promise.reject(new Error('Password must include an uppercase letter.'));
                }
                if (!/[0-9]/.test(value)) {
                  return Promise.reject(new Error('Password must include a digit.'));
                }
                if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
                  return Promise.reject(new Error('Password must include a symbol.'));
                }
                return Promise.resolve();
              }
            }
          ]}> 
            <Input.Password 
              autoComplete="new-password" 
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
            />
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
          <ul style={{ margin: '12px 0 0 0', padding: 0, listStyle: 'none' }}>
            {passwordRequirements.map((req, idx) => {
              const passed = req.test(passwordValue);
              return (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', color: passed ? '#52c41a' : '#888', fontSize: 14, marginBottom: 2 }}>
                  {passed ? <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 6 }} /> : <CloseCircleTwoTone twoToneColor="#bbb" style={{ marginRight: 6 }} />}
                  {req.label}
                </li>
              );
            })}
          </ul>
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