import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, message, Popconfirm, Select, Form, InputNumber } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { BACKEND_URL } from '../config';

const { Title } = Typography;

const paymentOptions = [
  { label: 'Bank Transfer', value: 'Bank Transfer' },
];
const shippingOptions = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Express', value: 'Express' },
  { label: 'Pickup', value: 'Pickup' },
];

const CartPage: React.FC<{ requireLogin: () => void }> = ({ requireLogin }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/api/cart')
      .then(res => {
        setCart(res.data.cartItems || []);
      })
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  }, []);

  const setQuantityDirect = async (bikeId: number, newQuantity: number) => {
    setLoading(true);
    try {
      if (newQuantity <= 0) {
        // Remove item
        let item = cart.find((i: any) => i.bike.id === bikeId);
        while (item && item.quantity > 0) {
          const res = await api.post('/api/cart/remove', { bikeId });
          item = (res.data.cartItems || []).find((i: any) => i.bike.id === bikeId);
          setCart(res.data.cartItems || []);
        }
        message.success('Removed from cart');
      } else {
        // Set to new quantity: first remove all, then add newQuantity
        let item = cart.find((i: any) => i.bike.id === bikeId);
        while (item && item.quantity > 0) {
          const res = await api.post('/api/cart/remove', { bikeId });
          item = (res.data.cartItems || []).find((i: any) => i.bike.id === bikeId);
          setCart(res.data.cartItems || []);
        }
        if (newQuantity > 0) {
          const res = await api.post('/api/cart/add', { bikeId, quantity: newQuantity });
          setCart(res.data.cartItems || []);
        }
        message.success('Quantity updated');
      }
    } catch {
      message.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bikeId: number, delta: number) => {
    setLoading(true);
    try {
      if (delta > 0) {
        const res = await api.post('/api/cart/add', { bikeId, quantity: 1 });
        setCart(res.data.cartItems || []);
      } else {
        const res = await api.post('/api/cart/remove', { bikeId });
        setCart(res.data.cartItems || []);
      }
    } catch {
      message.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bikeId: number) => {
    setRemoving(bikeId);
    try {
      let item = cart.find((i: any) => i.bike.id === bikeId);
      while (item && item.quantity > 0) {
        const res = await api.post('/api/cart/remove', { bikeId });
        item = (res.data.cartItems || []).find((i: any) => i.bike.id === bikeId);
        setCart(res.data.cartItems || []);
      }
      message.success('Removed from cart');
    } catch {
      message.error('Failed to remove from cart');
    } finally {
      setRemoving(null);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post('/api/orders/place', { paymentMethod, shippingMethod });
      setCart([]);
      setOrderPlaced(true);
      message.success('Order placed!');
    } catch {
      message.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const shippingFee = shippingMethod === 'Standard' ? 20 : shippingMethod === 'Express' ? 50 : 0;
  const total = cart.reduce((sum, item) => sum + (item.bike.price || 0) * (item.quantity || 1), 0) + shippingFee;

  return (
    <div className="cart-section">
      <div className="section-title" style={{ marginBottom: 32 }}>Your Cart</div>
      <Card className="cart-card fade-in" style={{ background: '#fff', color: '#1a1a1a', borderRadius: 18, boxShadow: '0 4px 24px rgba(22,119,255,0.08)', maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <Table
          className="cart-table"
          dataSource={cart.map((item, idx) => ({ ...item, key: idx }))}
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
                    onChange={val => setQuantityDirect(record.bike.id, val ?? 1)}
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
                <Popconfirm title="Remove this bike from cart?" onConfirm={() => removeFromCart(id)} okText="Yes" cancelText="No">
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
        <Form layout="inline" style={{ marginBottom: 24, marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
          <Form.Item label="Payment">
            <Select value={paymentMethod} onChange={setPaymentMethod} options={paymentOptions} style={{ minWidth: 140 }} />
          </Form.Item>
          <Form.Item label="Shipping">
            <Select value={shippingMethod} onChange={setShippingMethod} options={shippingOptions} style={{ minWidth: 140 }} />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
            Shipping Fee: <span style={{ color: '#1677ff' }}>${shippingFee.toLocaleString()}</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, marginRight: 0 }}>Total: <span style={{ color: '#1677ff' }}>${total.toLocaleString()}</span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24 }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={placeOrder}
            disabled={cart.length === 0 || placing}
            size="large"
            style={{ fontWeight: 600, fontSize: 18, borderRadius: 8, transition: 'background 0.3s', boxShadow: placing ? '0 0 16px #1677ff' : undefined, transform: placing ? 'scale(1.08)' : undefined }}
            className={placing ? 'animated-bounce' : ''}
            loading={placing}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
          <Button
            type="default"
            size="large"
            style={{ marginLeft: 16, fontWeight: 600, fontSize: 18, borderRadius: 8, background: 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)', color: '#fff', border: 'none', transition: 'background 0.3s' }}
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