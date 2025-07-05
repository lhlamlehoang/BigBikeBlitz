import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, message, Divider, Image, Carousel, InputNumber } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';

const ProductDetailsPage: React.FC<{ addToCart: (bike: any, quantity?: number) => void, requireLogin: () => void, isGuest: boolean }> = ({ addToCart, requireLogin, isGuest }) => {
  const { id } = useParams();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/api/bikes/${id}`)
      .then(res => setBike(res.data))
      .catch(() => message.error('Failed to load bike'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin style={{ display: 'block', margin: '64px auto' }} />;
  if (!bike) return <div style={{ textAlign: 'center', marginTop: 64 }}>Bike not found.</div>;

  // For gallery, use an array with the main image (can be extended)
  const images = [bike.image];

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #1677ff22', padding: 32 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>Back</Button>
      <Row gutter={32}>
        <Col xs={24} md={10}>
          <Carousel dots style={{ background: '#f7f9fb', borderRadius: 12, marginBottom: 16 }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <Image src={img} alt={bike.name} style={{ maxHeight: 480, maxWidth: '100%', width: '100%', borderRadius: 12, objectFit: 'contain', margin: '0 auto' }} />
              </div>
            ))}
          </Carousel>
        </Col>
        <Col xs={24} md={14}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{bike.name}</h1>
          <div style={{ fontSize: 22, color: '#1677ff', fontWeight: 600, marginBottom: 12 }}>${bike.price?.toLocaleString()}</div>
          <div style={{ marginBottom: 18 }}>
            <b>Brand:</b> {bike.brand} &nbsp;|&nbsp; <b>Type:</b> {bike.type}
          </div>
          <Divider />
          <div style={{ marginBottom: 18 }}>
            <b>Capacity:</b> {bike.capacity} <br />
            <b>Year:</b> {bike.year} <br />
            <b>Drive Mode:</b> {bike.driveMode} <br />
            <b>Technology:</b> {bike.technology}
          </div>
          <Divider />
          <div style={{ marginBottom: 18 }}>
            <b>Description:</b> <br />
            {bike.description || 'No description available.'}
          </div>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            style={{
              background: '#1677ff',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 16px rgba(22,119,255,0.12)',
              fontWeight: 700,
              borderRadius: 12,
              padding: '10px 36px',
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.2s, color 0.2s',
            }}
            className="product-btn-force-blue"
            onClick={() => isGuest ? requireLogin() : addToCart(bike, 1)}
          >
            Add to Cart
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailsPage; 