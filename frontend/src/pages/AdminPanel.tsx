import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { useAuth } from '../auth/AuthContext';
import api from '../auth/authFetch';
import { BACKEND_URL } from '../config';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userModal, setUserModal] = useState<{ open: boolean, user?: any }>({ open: false });
  // Bikes
  const [bikes, setBikes] = useState<any[]>([]);
  const [bikeModal, setBikeModal] = useState<{ open: boolean, bike?: any }>({ open: false });
  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [form] = Form.useForm(); // <-- Add form instance for bike modal

  const isMobile = useMediaQuery({ maxWidth: 900 });

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, bikesRes, ordersRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/bikes'),
        api.get('/api/admin/orders'),
      ]);
      setUsers(usersRes.data);
      setBikes(bikesRes.data);
      setOrders(ordersRes.data);
    } catch {
      message.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // --- Users CRUD ---
  const handleUserSave = async (values: any) => {
    try {
      let payload = { ...values };
      if (!userModal.user) {
        // Creating new user: password is required
        if (!payload.password) {
          message.error('Password is required for new users');
          return;
        }
      } else {
        // Editing: if password is empty, don't send it
        if (!payload.password) delete payload.password;
      }
      if (userModal.user) {
        await api.put(`/api/admin/users/${userModal.user.id}`, payload);
        message.success('User updated');
      } else {
        await api.post('/api/admin/users', payload);
        message.success('User created');
      }
      setUserModal({ open: false });
      fetchAll();
    } catch {
      message.error('Failed to save user');
    }
  };
  const handleUserDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      message.success('User deleted');
      fetchAll();
    } catch {
      message.error('Failed to delete user');
    }
  };

  // --- Bikes CRUD ---
  const handleBikeSave = async (values: any) => {
    try {
      // Check if a new image file is selected
      const fileInput = document.querySelector('input[type="file"][title="Select image file to upload"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      let imagePath = values.image;
      // If adding a new bike and no image is selected, show alert and do not submit
      if (!bikeModal.bike && !file) {
        message.error('Please upload an image before saving the bike.');
        return;
      }
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token'); // Adjust if you use a different storage or context
        const res = await fetch(`${BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          message.error('Image upload failed');
          return;
        }
        imagePath = await res.text();
        values.image = imagePath;
      }
      if (bikeModal.bike) {
        await api.put(`/api/admin/bikes/${bikeModal.bike.id}`, values);
        message.success('Bike updated');
      } else {
        await api.post('/api/admin/bikes', values);
        message.success('Bike created');
      }
      setBikeModal({ open: false });
      fetchAll();
    } catch {
      message.error('Failed to save bike');
    }
  };
  const handleBikeDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/bikes/${id}`);
      message.success('Bike deleted');
      fetchAll();
    } catch {
      message.error('Failed to delete bike');
    }
  };

  // --- Orders CRUD ---
  const handleOrderDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/orders/${id}`);
      message.success('Order deleted');
      fetchAll();
    } catch {
      message.error('Failed to delete order');
    }
  };

  const handleOrderStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status });
      message.success(`Order status set to ${status}`);
      fetchAll();
    } catch {
      message.error('Failed to update order status');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #1677ff22', background: '#fff' }}>
          <Title level={3} style={{ color: '#ff4d4f' }}>Access Denied</Title>
          <Text type="danger">You do not have permission to view this page.</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-responsive" style={{ maxWidth: 1100, margin: '48px auto', padding: 24 }}>
      <Tabs activeKey={tab} onChange={setTab} tabBarStyle={{ marginBottom: 24 }}>
        <TabPane tab="Users" key="users">
          <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setUserModal({ open: true })}>Add User</Button>
          <Table
            dataSource={users.map((u, i) => ({ ...u, key: u.id || i }))}
            columns={isMobile ? [
              { title: 'Username', dataIndex: 'username', ellipsis: true, className: 'user-col-username' },
              { title: 'Role', dataIndex: 'role', width: 60, className: 'user-col-role' },
              {
                title: 'Actions',
                width: 80,
                className: 'user-col-actions',
                render: (_: any, record: any) => (
                  <>
                    <Button size="small" onClick={() => setUserModal({ open: true, user: record })} style={{ marginRight: 8 }}>Edit</Button>
                    <Popconfirm title="Delete user?" onConfirm={() => handleUserDelete(record.id)}><Button size="small" danger>Delete</Button></Popconfirm>
                  </>
                ),
              },
            ] : [
              { title: 'Username', dataIndex: 'username', ellipsis: true, className: 'user-col-username', width: 220 },
              { title: 'Role', dataIndex: 'role', width: 80, className: 'user-col-role' },
              { title: 'Enabled', dataIndex: 'enabled', render: (v: boolean) => v ? 'Yes' : 'No', width: 80 },
              { title: 'Phone', dataIndex: 'phone', width: 140 },
              { title: 'Address', dataIndex: 'address', width: 320 },
              {
                title: 'Actions',
                width: 120,
                className: 'user-col-actions',
                render: (_: any, record: any) => (
                  <>
                    <Button size="small" onClick={() => setUserModal({ open: true, user: record })} style={{ marginRight: 8 }}>Edit</Button>
                    <Popconfirm title="Delete user?" onConfirm={() => handleUserDelete(record.id)}><Button size="small" danger>Delete</Button></Popconfirm>
                  </>
                ),
              },
            ]}
            loading={loading}
            pagination={false}
            className="user-table-responsive"
          />
          <Modal
            open={userModal.open}
            onCancel={() => setUserModal({ open: false })}
            title={userModal.user ? 'Edit User' : 'Add User'}
            footer={null}
            destroyOnClose
          >
            <Form
              layout="vertical"
              initialValues={{
                ...userModal.user,
                password: '', // Always show password as empty
                enabled: userModal.user ? userModal.user.enabled : true,
              }}
              onFinish={handleUserSave}
              style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}
            >
              <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="password" label="Password" rules={userModal.user ? [] : [{ required: true }]}><Input.Password autoComplete="new-password" placeholder={userModal.user ? 'Leave blank to keep current password' : ''} /></Form.Item>
              <Form.Item name="phone" label="Phone"><Input /></Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}><Select options={[{ value: 'USER' }, { value: 'ADMIN' }]} /></Form.Item>
              <Form.Item name="enabled" label="Enabled"><Select options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]} /></Form.Item>
              <Form.Item name="address" label="Address"><Input /></Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Save</Button>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="Bikes" key="bikes">
          <Button type="primary" style={{ marginBottom: 16 }} onClick={() => { setBikeModal({ open: true }); setSelectedImage(null); setSelectedFileName(null); }}>Add Bike</Button>
          <Table
            dataSource={bikes.map((b, i) => ({ ...b, key: b.id || i }))}
            columns={isMobile ? [
              { title: 'Name', dataIndex: 'name', className: 'bike-col-name' },
              { title: 'Brand', dataIndex: 'brand', className: 'bike-col-brand' },
              {
                title: 'Actions',
                className: 'bike-col-actions',
                render: (_: any, record: any) => (
                  <>
                    <Button size="small" onClick={() => { setBikeModal({ open: true, bike: record }); setSelectedImage(record.image); setSelectedFileName(record.image?.split('/').pop() || null); }} style={{ marginRight: 8 }}>Edit</Button>
                    <Popconfirm title="Delete bike?" onConfirm={() => handleBikeDelete(record.id)}><Button size="small" danger>Delete</Button></Popconfirm>
                  </>
                ),
              },
            ] : [
              { title: 'Name', dataIndex: 'name', className: 'bike-col-name' },
              { title: 'Brand', dataIndex: 'brand', className: 'bike-col-brand' },
              { title: 'Type', dataIndex: 'type', className: 'bike-col-type bike-col-hide-mobile' },
              { title: 'Price', dataIndex: 'price', render: (v: number) => `$${v?.toLocaleString()}`, className: 'bike-col-price bike-col-hide-mobile' },
              { title: 'Year', dataIndex: 'year' },
              { title: 'Capacity', dataIndex: 'capacity' },
              { title: 'Drive Mode', dataIndex: 'driveMode' },
              { title: 'Technology', dataIndex: 'technology' },
              {
                title: 'Actions',
                className: 'bike-col-actions',
                render: (_: any, record: any) => (
                  <>
                    <Button size="small" onClick={() => { setBikeModal({ open: true, bike: record }); setSelectedImage(record.image); setSelectedFileName(record.image?.split('/').pop() || null); }} style={{ marginRight: 8 }}>Edit</Button>
                    <Popconfirm title="Delete bike?" onConfirm={() => handleBikeDelete(record.id)}><Button size="small" danger>Delete</Button></Popconfirm>
                  </>
                ),
              },
            ]}
            loading={loading}
            pagination={false}
            className="bike-table-responsive"
          />
          <Modal
            open={bikeModal.open}
            onCancel={() => setBikeModal({ open: false })}
            title={bikeModal.bike ? 'Edit Bike' : 'Add Bike'}
            footer={null}
            destroyOnClose
          >
            <Form
              form={form} // <-- Pass form instance
              layout="vertical"
              initialValues={bikeModal.bike}
              onFinish={handleBikeSave}
              style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="brand" label="Brand" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}><Input type="number" /></Form.Item>
              {/* Hidden image field for validation, no longer required */}
              <Form.Item
                name="image"
                style={{ display: 'none' }}
                // Remove required rule
              >
                <Input />
              </Form.Item>
              <Form.Item 
                label={<span>Image File (local upload) <span style={{color: '#ff4d4f'}}>*</span></span>}
                // No required prop
              >
                <input
                  type="file"
                  accept="image/*"
                  title="Select image file to upload"
                  placeholder="Choose image file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFileName(file.name);
                      setSelectedImage(URL.createObjectURL(file));
                      form.setFieldsValue({ image: `/uploads/${file.name}` });
                    } else {
                      setSelectedFileName(null);
                      setSelectedImage(null);
                      form.setFieldsValue({ image: undefined });
                    }
                  }}
                />
                {selectedImage && (
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <img src={selectedImage.startsWith('/uploads/') ? BACKEND_URL + selectedImage : selectedImage} alt="Preview" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, boxShadow: '0 2px 8px #1677ff22' }} />
                  </div>
                )}
                {selectedFileName && (
                  <div style={{ marginTop: 8, color: '#1677ff', fontWeight: 500 }}>
                    Set image path: <span style={{ fontFamily: 'monospace' }}>{`/uploads/${selectedFileName}`}</span>
                  </div>
                )}
              </Form.Item>
              <Form.Item name="year" label="Year"><Input /></Form.Item>
              <Form.Item name="capacity" label="Capacity"><Input /></Form.Item>
              <Form.Item name="driveMode" label="Drive Mode"><Input /></Form.Item>
              <Form.Item name="technology" label="Technology"><Input /></Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Save</Button>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="Orders" key="orders">
          <Table
            dataSource={orders.map((o, i) => ({ ...o, key: o.id || i }))}
            columns={isMobile ? [
              { title: 'User ID', dataIndex: 'userId' },
              { title: 'Total', dataIndex: 'total', render: (v: number) => `$${v?.toLocaleString()}` },
              { title: 'Status', dataIndex: 'status', render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span> },
              {
                title: 'Actions',
                render: (_: any, record: any) => (
                  <>
                    <Button
                      size="small"
                      type={record.status === 'confirmed' ? 'default' : 'primary'}
                      style={{ marginRight: 8 }}
                      onClick={() => handleOrderStatus(record.id, record.status === 'confirmed' ? 'ordered' : 'confirmed')}
                    >
                      {record.status === 'confirmed' ? 'Set Ordered' : 'Confirm'}
                    </Button>
                    <Popconfirm title="Delete order?" onConfirm={() => handleOrderDelete(record.id)}>
                      <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                  </>
                ),
              },
            ] : [
              { title: 'User ID', dataIndex: 'userId', width: 80 },
              { title: 'Total', dataIndex: 'total', render: (v: number) => `$${v?.toLocaleString()}` , width: 120 },
              { title: 'Status', dataIndex: 'status', render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span>, width: 110 },
              { title: 'Phone', dataIndex: 'phone', width: 140 },
              { title: 'Shipping Address', dataIndex: 'address', width: 200 },
              {
                title: 'Actions',
                width: 160,
                render: (_: any, record: any) => (
                  <>
                    <Button
                      size="small"
                      type={record.status === 'confirmed' ? 'default' : 'primary'}
                      style={{ marginRight: 8 }}
                      onClick={() => handleOrderStatus(record.id, record.status === 'confirmed' ? 'ordered' : 'confirmed')}
                    >
                      {record.status === 'confirmed' ? 'Set Ordered' : 'Confirm'}
                    </Button>
                    <Popconfirm title="Delete order?" onConfirm={() => handleOrderDelete(record.id)}>
                      <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                  </>
                ),
              },
            ]}
            loading={loading}
            pagination={false}
          />
        </TabPane>
      </Tabs>
      <style>{`
        @media (max-width: 900px) {
          .admin-panel-responsive {
            padding: 8px !important;
            margin: 0 !important;
          }
          .admin-panel-responsive .ant-tabs-nav {
            font-size: 15px !important;
            padding: 0 2vw !important;
          }
          .admin-panel-responsive .ant-table-wrapper {
            overflow-x: auto !important;
          }
          .admin-panel-responsive .ant-table, .admin-panel-responsive .ant-table-content, .admin-panel-responsive .ant-table-thead > tr > th, .admin-panel-responsive .ant-table-tbody > tr > td {
            font-size: 13px !important;
            padding: 6px 4px !important;
            min-width: 80px !important;
          }
          .admin-panel-responsive .ant-table-thead > tr > th {
            background: #f7f9fb !important;
            font-weight: 700 !important;
          }
          .admin-panel-responsive .ant-table-tbody > tr > td {
            background: #fff !important;
          }
          .admin-panel-responsive .ant-btn {
            font-size: 14px !important;
            padding: 6px 0 !important;
            margin-bottom: 4px !important;
            width: 100% !important;
          }
          .admin-panel-responsive .ant-btn + .ant-btn {
            margin-left: 0 !important;
          }
          .admin-panel-responsive .ant-modal-content {
            padding: 8px !important;
          }
          .admin-panel-responsive .ant-modal-body {
            padding: 8px !important;
          }
          .admin-panel-responsive .ant-form-item {
            margin-bottom: 10px !important;
          }
          .admin-panel-responsive .ant-card {
            padding: 8px !important;
          }
          .admin-panel-responsive .ant-modal {
            max-width: 98vw !important;
            min-width: 0 !important;
          }
          .bike-table-responsive .bike-col-type,
          .bike-table-responsive .bike-col-price {
            display: none !important;
          }
          .user-table-responsive .user-col-username {
            max-width: none !important;
            min-width: 0 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            padding-right: 2px !important;
          }
          .user-table-responsive .user-col-role {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            text-align: center !important;
            white-space: nowrap !important;
            padding-left: 2px !important;
            padding-right: 2px !important;
          }
          .user-table-responsive .user-col-actions {
            width: 80px !important;
            min-width: 60px !important;
            max-width: 90px !important;
            text-align: right !important;
            padding-left: 2px !important;
            padding-right: 2px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel; 