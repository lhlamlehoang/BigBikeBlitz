import React, { useEffect, useState } from 'react';
import { Card as AntCard, Typography, Tag, Row, Col, Divider, Empty, Spin, Button } from 'antd';
import { useAuth } from '../auth/AuthContext';
import api from '../auth/authFetch';
import { useNavigate } from 'react-router-dom';
import { DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrdersPage: React.FC<{ requireLogin: () => void }> = ({ requireLogin }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:8080";

  useEffect(() => {
    setLoading(true);
    api.get('/api/orders').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: '#1677ff', margin: 0, letterSpacing: 1 }}>Your Orders</Title>
        <Button type="default" size="large" style={{ fontWeight: 600, fontSize: 18, borderRadius: 8, background: '#f7f9fb', border: '1px solid #1677ff', color: '#1677ff', transition: 'background 0.3s' }} onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '64px 0' }}><Spin size="large" /></div>
      ) : orders.length === 0 ? (
        <Empty description="No orders yet" style={{ margin: '64px 0' }} />
      ) : (
        <Row gutter={[32, 32]}>
          {orders.map((order, idx) => (
            <Col xs={24} md={12} key={order.id}>
              <AntCard
                className="order-card animated-fade-in"
                style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(22,119,255,0.08)', background: '#fff', marginBottom: 24, transition: 'transform 0.4s cubic-bezier(.23,1.12,.32,1)', animationDelay: `${idx * 0.1}s` }}
                bodyStyle={{ padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#1677ff' }}>Order #{order.id}</Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="blue" style={{ fontSize: 16 }}>{order.paymentMethod}</Tag>
                    <Tag color={order.status === 'confirmed' ? 'green' : 'orange'} style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{order.status}</Tag>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Shipping:</Text> <Tag color="geekblue">{order.shippingMethod}</Tag>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Order Date:</Text> {order.orderDate}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Ship Date:</Text> {order.shipDate}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Total:</Text> <span style={{ color: '#1677ff', fontWeight: 600, fontSize: 18 }}>${order.total?.toLocaleString()}</span>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Bikes:</Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
                    {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item: any) => (
                      <AntCard
                        key={item.bike.id}
                        hoverable
                        style={{ width: 160, borderRadius: 12, boxShadow: '0 2px 8px #e0e0e0', marginBottom: 8, transition: 'transform 0.3s', padding: 0, cursor: 'pointer' }}
                        bodyStyle={{ padding: 8 }}
                        className="animated-scale-in"
                        onClick={() => navigate(`/product/${item.bike.id}`)}
                      >
                        <img src={item.bike.image.startsWith('/uploads/') ? backendUrl + item.bike.image : item.bike.image} alt={item.bike.name} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{item.bike.name}</div>
                        <div style={{ color: '#1677ff', fontWeight: 500 }}>${item.bike.price?.toLocaleString()}</div>
                        <div style={{ color: '#222', fontWeight: 500, fontSize: 14, marginTop: 4 }}>Qty: {item.quantity}</div>
                      </AntCard>
                    )) : <Text type="secondary">No bikes</Text>}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <Button
                    type="primary"
                    icon={<DollarCircleOutlined />}
                    size="large"
                    style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, boxShadow: '0 2px 12px #1677ff33', transition: 'transform 0.2s', animation: 'fadeInUp 0.7s cubic-bezier(.23,1.12,.32,1)' }}
                    onClick={() => navigate('/payment', { state: { order } })}
                  >
                    Pay Now
                  </Button>
                </div>
              </AntCard>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default OrdersPage; 