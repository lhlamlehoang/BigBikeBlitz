import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, message, Popconfirm, Select, Form, InputNumber } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { BACKEND_URL } from '../config';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const paymentOptions = [
  { label: 'Bank Transfer', value: 'Bank Transfer' },
];
const shippingOptions = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Express', value: 'Express' },
  { label: 'Pickup', value: 'Pickup' },
];

const CartPage: React.FC<{ 
  cartItems: any[];
  updateCartQuantity: (bikeId: number, quantity: number) => void;
  removeFromCart: (bikeId: number) => void;
  clearCart: () => void;
  user: any;
}> = ({ 
  cartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  user
}) => {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch user profile for address
    api.get('/user/profile').then(res => {
      setUserAddress(res.data?.address || null);
    });
  }, []);

  const handleQuantityChange = (bikeId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(bikeId);
    } else {
      updateCartQuantity(bikeId, newQuantity);
    }
  };

  const handleRemoveFromCart = (bikeId: number) => {
    setRemoving(bikeId);
    removeFromCart(bikeId);
    setRemoving(null);
  };

  const placeOrder = async () => {
    if (!userAddress || userAddress.trim() === '') {
      message.error('Please update your address in your profile before placing an order.');
      navigate('/profile');
      return;
    }
    setPlacing(true);
    try {
      await api.post('/api/orders/place', { paymentMethod, shippingMethod });
      clearCart();
      setOrderPlaced(true);
      message.success('Order placed!');
    } catch {
      message.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const shippingFee = shippingMethod === 'Standard' ? 20 : shippingMethod === 'Express' ? 50 : 0;
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.bike.price || 0) * (item.quantity || 1), 0) + shippingFee;

  const sortedCartItems = Array.isArray(cartItems) && cartItems.length > 0
    ? [...cartItems].sort((a, b) => a.id - b.id)
    : cartItems;

  return (
    <div className="cart-section">
      <div className="section-title" style={{ marginBottom: 32 }}>Your Cart</div>
      <Card className="cart-card fade-in" style={{ background: '#fff', color: '#1a1a1a', borderRadius: 18, boxShadow: '0 4px 24px rgba(22,119,255,0.08)', maxWidth: 900, margin: '0 auto', padding: 32 }}>
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sortedCartItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', margin: '32px 0' }}>Your cart is empty.</div>
            ) : sortedCartItems.map((item: any) => (
              <div key={item.bike.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f7f9fb', borderRadius: 10, padding: 10, boxShadow: '0 2px 8px #e0e0e0' }}>
                <img src={item.bike.image.startsWith('/uploads/') ? BACKEND_URL + item.bike.image : item.bike.image} alt={item.bike.name} style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{item.bike.name}</div>
                  <div style={{ color: '#1677ff', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>${item.bike.price.toLocaleString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>Qty:</span>
                    <InputNumber
                      min={0}
                      value={item.quantity}
                      onChange={val => handleQuantityChange(item.bike.id, val ?? 1)}
                      disabled={loading}
                      style={{ width: 44 }}
                    />
                  </div>
                </div>
                <Popconfirm title="Remove this bike from cart?" onConfirm={() => handleRemoveFromCart(item.bike.id)} okText="Yes" cancelText="No">
                  <Button danger icon={<DeleteOutlined />} loading={removing === item.bike.id} size="small" style={{ borderRadius: 6 }} />
                </Popconfirm>
              </div>
            ))}
          </div>
        ) : (
          <Table
            className="cart-table"
            dataSource={sortedCartItems.map((item: any, idx: number) => ({ ...item, key: idx }))}
            columns={[
              {
                title: 'Image',
                dataIndex: ['bike', 'image'],
                render: (image: string) => image ? <img src={image.startsWith('/uploads/') ? BACKEND_URL + image : image} alt="Bike" style={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #e0e0e0' }} /> : null,
              },
              { title: 'Name', dataIndex: ['bike', 'name'], render: (name: string) => <span style={{ fontWeight: 600, fontSize: 18 }}>{name}</span> },
              { title: 'Price', dataIndex: ['bike', 'price'], render: (price: number) => <span style={{ color: '#1677ff', fontWeight: 500 }}>${price.toLocaleString()}</span> },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                render: (quantity: number, record: any) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InputNumber
                      min={0}
                      value={quantity}
                      onChange={val => handleQuantityChange(record.bike.id, val ?? 1)}
                      disabled={loading}
                      style={{ width: 60 }}
                    />
                  </div>
                ),
              },
              {
                title: '',
                dataIndex: ['bike', 'id'],
                align: 'right' as const,
                render: (id: number) => (
                  <Popconfirm title="Remove this bike from cart?" onConfirm={() => handleRemoveFromCart(id)} okText="Yes" cancelText="No">
                    <Button danger icon={<DeleteOutlined />} loading={removing === id} size="small" style={{ borderRadius: 6, marginLeft: 8 }} />
                  </Popconfirm>
                ),
                width: 80,
              },
            ]}
            pagination={false}
            loading={loading}
            style={{ marginBottom: 24 }}
          />
        )}
        <Form layout="inline" style={{ marginBottom: 24, marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 24, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <Form.Item label="Payment">
            <Select value={paymentMethod} onChange={setPaymentMethod} options={paymentOptions} style={{ minWidth: 140 }} />
          </Form.Item>
          <Form.Item label="Shipping">
            <Select value={shippingMethod} onChange={setShippingMethod} options={shippingOptions} style={{ minWidth: 140 }} />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', marginTop: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
            Shipping Fee: <span style={{ color: '#1677ff' }}>${shippingFee.toLocaleString()}</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, marginRight: 0 }}>Total: <span style={{ color: '#1677ff' }}>${total.toLocaleString()}</span></span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 12,
          marginTop: 24,
          alignItems: isMobile ? 'center' : 'flex-end',
          width: '100%',
          justifyContent: isMobile ? 'center' : 'flex-end'
        }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={placeOrder}
            disabled={cartItems.length === 0 || placing}
            size="large"
            style={{
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 8,
              transition: 'background 0.3s',
              boxShadow: placing ? '0 0 16px #1677ff' : undefined,
              transform: placing ? 'scale(1.08)' : undefined,
              width: isMobile ? '100%' : undefined,
              maxWidth: isMobile ? 240 : undefined,
              marginBottom: isMobile ? 10 : 0,
              marginLeft: isMobile ? 8 : 0,
              marginRight: 0,
              display: 'block',
              textAlign: 'center',
              alignSelf: isMobile ? 'center' : undefined
            }}
            className={placing ? 'animated-bounce' : ''}
            loading={placing}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
          <Button
            type="default"
            size="large"
            style={{
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)',
              color: '#fff',
              border: 'none',
              transition: 'background 0.3s',
              width: isMobile ? '100%' : undefined,
              maxWidth: isMobile ? 240 : undefined,
              marginLeft: 0,
              marginRight: 0,
              display: 'block',
              textAlign: 'center',
              alignSelf: isMobile ? 'center' : undefined
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #67e8f9 0%, #2196f3 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)'}
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CartPage; 