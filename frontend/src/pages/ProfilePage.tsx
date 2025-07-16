import React, { useEffect, useState } from 'react';
import { Card, Typography, Input, Button, message, Form } from 'antd';
import { useAuth } from '../auth/AuthContext';
import api from '../auth/authFetch';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const res = await api.get('/user/profile');
        if (res.status === 200) {
          const data = res.data;
          form.setFieldsValue({
            email: data.email ?? '',
            phone: data.phone ?? '',
            username: data.username ?? '',
            role: data.role ?? '',
            address: data.address ?? '',
          });
        }
      } catch {
        // ignore error
      }
      setFetching(false);
    };
    fetchProfile();
  }, [form]);

  const onFinish = async (values: any) => {
    console.log(values)
    setLoading(true);
    try {
      await api.put('/user/profile', {
        email: values.email,
        phone: values.phone,
        address: values.address,
      });
      message.success('Profile updated!');
    } catch {
      message.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Profile</Title>
        {!fetching && (
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item label="Username" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Invalid email' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your phone' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address' }]}> 
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>Update Profile</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage; 