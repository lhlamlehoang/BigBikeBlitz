import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, message, Divider, Image, Carousel, InputNumber, Card } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';
import { BACKEND_URL } from '../config';

interface Bike {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  type: string;
}

interface WishlistItem {
  id: number;
  bikeId: number;
  userId: number;
  addedAt: string;
  bike: Bike;
}

const ProductDetailsPage: React.FC<{ 
  bikes: Bike[];
  addToCart: (bike: any, quantity?: number) => void, 
  user: any;
}> = ({ 
  bikes,
  addToCart, 
  user
}) => {
  const { id } = useParams();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();
  const [otherBikes, setOtherBikes] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/bikes/${id}`)
      .then(res => setBike(res.data))
      .catch(() => message.error('Failed to load bike'))
      .finally(() => setLoading(false));
    // Fetch all bikes for recommendations
    api.get('/api/bikes/all')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setOtherBikes(res.data.filter((b: any) => String(b.id) !== String(id)).slice(0, 4));
        }
      });
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
                <Image src={BACKEND_URL + img} alt={bike.name} style={{ maxHeight: 480, maxWidth: '100%', width: '100%', borderRadius: 12, objectFit: 'contain', margin: '0 auto' }} />
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
            className="hero-btn tricolor"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={async () => {
              if (!user) {
                message.error('Please login to add items to cart');
                navigate('/login');
                return;
              }
              try {
                await addToCart(bike, 1);
                message.success('Added to cart!');
              } catch (error) {
                message.error('Failed to add to cart');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'auto',
              lineHeight: 'normal'
            }}
          >
            Add to Cart
          </Button>
        </Col>
      </Row>
      {/* Maybe you also like section */}
      <div style={{ maxWidth: 1100, margin: '32px auto 0 auto', padding: '0 32px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: '40px 0 24px 0', color: '#003580' }}>Maybe you also like...</h2>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {otherBikes.map(b => (
            <Card
              key={b.id}
              hoverable
              style={{ width: 240, borderRadius: 16, boxShadow: '0 2px 12px #1677ff11', cursor: 'pointer' }}
              cover={<img alt={b.name} src={BACKEND_URL + b.image} style={{ height: 160, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />}
              onClick={() => navigate(`/product/${b.id}`)}
            >
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{b.name}</div>
              <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>${b.price?.toLocaleString()}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage; 