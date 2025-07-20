import React from 'react';
import { Card, Typography, Button, Divider, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const { Title, Text } = Typography;

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <Title level={3}>No order selected</Title>
        <Button type="primary" onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '48px auto', padding: 24, animation: 'fadeInUp 0.7s cubic-bezier(.23,1.12,.32,1)' }}>
      <Card style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(22,119,255,0.10)', background: '#fff', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')} style={{ marginRight: 16 }} />
          <Title level={3} style={{ margin: 0, color: '#1677ff', letterSpacing: 1 }}>Payment for Order #{order.id}</Title>
        </div>
        <Divider />
        <Row gutter={24} align="middle">
          <Col xs={24} md={12} style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={BACKEND_URL + "/uploads/momo-qr.png"} alt="MoMo QR code for 0938591504" style={{ width: 180, height: 180, borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px #1677ff22' }} />
              <div style={{ marginTop: 16, fontWeight: 600, color: '#1677ff', textAlign: 'center' }}>Scan to pay</div>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Order Summary</div>
            <div><Text strong>Total:</Text> <span style={{ color: '#1677ff', fontWeight: 600 }}>${order.total?.toLocaleString()}</span></div>
            <div><Text strong>Payment Method:</Text> {order.paymentMethod}</div>
            <div><Text strong>Shipping:</Text> {order.shippingMethod}</div>
            <div><Text strong>Shipping Address:</Text> {order.address || '-'}</div>
            <div><Text strong>Phone:</Text> {order.phone || '-'}</div>
            <div><Text strong>Order Date:</Text> {order.orderDate}</div>
            <div><Text strong>Ship Date:</Text> {order.shipDate}</div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Bikes:</div>
            <ul style={{ paddingLeft: 18 }}>
              {order.orderItems && order.orderItems.length > 0 ? order.orderItems.map((item: any) => (
                <li key={item.bike.id} style={{ marginBottom: 4 }}>
                  {item.bike.name} <span style={{ color: '#888' }}>(${item.bike.price?.toLocaleString()})</span>
                  <span style={{ color: '#222', marginLeft: 8 }}>Qty: {item.quantity}</span>
                </li>
              )) : <li style={{ color: '#888' }}>No bikes</li>}
            </ul>
          </Col>
        </Row>
      </Card>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage; 