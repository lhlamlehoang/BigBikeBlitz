import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Slider, Select, Input, Row, Col, Spin, Empty, message, Divider, Modal, InputNumber } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../auth/authFetch';
import './CategoriesPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const { TabPane } = Tabs;

const categories = [
  { key: 'all', label: 'All' },
  { key: 'sport', label: 'Sport Bikes' },
  { key: 'adventure', label: 'Adventure Bikes' },
  { key: 'roadster', label: 'Roadsters' },
  { key: 'touring', label: 'Touring Bikes' },
  { key: 'naked', label: 'Naked Bikes' },
  { key: 'cruiser', label: 'Cruiser Bikes' },
  { key: 'scrambler', label: 'Scrambler Bikes' },
];

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

interface CategoriesPageProps {
  addToCart: (bike: any, quantity: number) => void;
  requireLogin: () => void;
  isGuest: boolean;
  addToWishlist?: (bike: Bike) => void;
  removeFromWishlist?: (bikeId: number) => void;
  wishlist?: WishlistItem[];
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ 
  addToCart, 
  requireLogin, 
  isGuest,
  addToWishlist,
  removeFromWishlist,
  wishlist = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [price, setPrice] = useState<[number, number]>([1000, 200000]);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBike, setSelectedBike] = useState<any | null>(null);
  const [quantityMap, setQuantityMap] = useState<{ [bikeId: number]: number }>({});
  const navigate = useNavigate();
  const location = useLocation();

  // Read search parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    api.get('/api/bikes/all')
      .then(res => {
        // Sort bikes by price descending
        const sortedBikes = [...res.data].sort((a, b) => b.price - a.price);
        setBikes(sortedBikes);
        setBrands([...new Set(sortedBikes.map((b: any) => b.brand))] as string[]);
        setTypes([...new Set(sortedBikes.map((b: any) => b.type))] as string[]);
      })
      .catch(() => message.error('Failed to load bikes'))
      .finally(() => setLoading(false));
  }, []);

  const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();

  const filteredBikes = bikes.filter(bike =>
    (selectedCategory === 'all' || (bike.type && bike.type.toLowerCase() === selectedCategory.toLowerCase())) &&
    (brand ? (bike.brand && bike.brand.toLowerCase() === brand.toLowerCase()) : true) &&
    (type ? (bike.type && bike.type.toLowerCase() === type.toLowerCase()) : true) &&
    (search ? (bike.name && normalize(bike.name).includes(normalize(search))) : true) &&
    bike.price >= price[0] && bike.price <= price[1]
  );

  return (
    <div className="categories-section">
      <div className="section-title" style={{ marginBottom: 16 }}>Categories</div>
      <Tabs
        defaultActiveKey="all"
        activeKey={selectedCategory}
        onChange={setSelectedCategory}
        centered
        className="categories-tabs"
        style={{ marginBottom: 32 }}
        items={categories}
      />
      <div className="categories-filters" style={{ maxWidth: 1100, margin: '0 auto 32px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(22,119,255,0.06)', padding: 24 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              style={{ borderRadius: 8, fontSize: 16, marginBottom: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%', marginBottom: 8 }}
              placeholder="Select brand"
              value={brand}
              onChange={setBrand}
              allowClear
            >
              {brands.map(b => <Select.Option key={b} value={b}>{b}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%', marginBottom: 8 }}
              placeholder="Select type"
              value={type}
              onChange={setType}
              allowClear
            >
              {types.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ padding: '0 8px' }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>Price Range ($)</span>
              <Slider
                range
                min={1000}
                max={200000}
                step={1000}
                value={price}
                onChange={val => setPrice(val as [number, number])}
                marks={{ 1000: '1k', 200000: '200k' }}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Divider />
      {loading ? <Spin style={{ display: 'block', margin: '64px auto' }} /> : (
        <Row gutter={[32, 32]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filteredBikes.length === 0 ? (
            <Col span={24}><Empty description="No bikes found" /></Col>
          ) : (
            filteredBikes.map(bike => (
              <Col xs={24} sm={12} md={8} lg={6} key={bike.id}>
                <Card
                  hoverable
                  className="category-product-card fade-in"
                  style={{ borderRadius: 18, minHeight: 340, boxShadow: '0 4px 24px rgba(22,119,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, padding: 16 } }}
                  cover={
                    <img
                      src={bike.image.startsWith('/uploads/') ? BACKEND_URL + bike.image : bike.image}
                      alt={bike.name}
                      style={{ display: 'block', margin: '0 auto', height: 140, objectFit: 'contain', borderRadius: 12, marginBottom: 12, boxShadow: '0 2px 8px #1677ff22' }}
                    />
                  }
                  onClick={() => navigate(`/product/${bike.id}`)}
                >
                  <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{bike.name}</div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>{bike.brand} &bull; {bike.type}</div>
                  <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>${bike.price.toLocaleString()}</div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
      <Modal
        open={modalVisible}
        title={null}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        styles={{ body: { padding: 0, borderRadius: 16, overflow: 'hidden', background: '#f7f9fb' } }}
        width={700}
      >
        {selectedBike && (
          <div style={{
            background: '#f7f9fb',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(22,119,255,0.13)',
            padding: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            minHeight: 320
          }}>
            <div style={{
              position: 'relative',
              width: 320,
              minWidth: 260,
              background: '#fff',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              padding: 0,
              height: 320,
            }}>
              <img
                src={selectedBike.image.startsWith('/uploads/') ? BACKEND_URL + selectedBike.image : selectedBike.image}
                alt={selectedBike.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: 16,
                  borderBottomLeftRadius: 16,
                  boxShadow: '0 2px 8px #1677ff22',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(22,119,255,0.85)',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 16px',
                fontWeight: 600,
                fontSize: 18,
                boxShadow: '0 2px 8px #1677ff22',
              }}>
                ${selectedBike.price?.toLocaleString()}
              </div>
            </div>
            <div style={{ flex: 1, padding: '32px 36px 24px 36px', background: '#f7f9fb', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 30, marginBottom: 10, color: '#222' }}>{selectedBike.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: 18 }}>
                <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 17 }}><b>Brand:</b> {selectedBike.brand}</div>
                <div style={{ color: '#1677ff', fontWeight: 600, fontSize: 17 }}><b>Type:</b> {selectedBike.type}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: 18 }}>
                {selectedBike.capacity && (
                  <div style={{ color: '#444', fontWeight: 500, fontSize: 17 }}><b>Capacity:</b> {selectedBike.capacity}</div>
                )}
                {selectedBike.date && (
                  <div style={{ color: '#444', fontWeight: 500, fontSize: 17 }}><b>Date Produce:</b> {selectedBike.date}</div>
                )}
                {selectedBike.driveMode && (
                  <div style={{ color: '#444', fontWeight: 500, fontSize: 17 }}><b>Drive Mode:</b> {selectedBike.driveMode}</div>
                )}
                {selectedBike.technology && (
                  <div style={{ color: '#444', fontWeight: 500, fontSize: 17 }}><b>Technology:</b> {selectedBike.technology}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CategoriesPage; 