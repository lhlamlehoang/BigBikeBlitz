import React, { useState, useEffect } from 'react';
import { Button, Spin, Modal, Descriptions } from 'antd';
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined, PlusOutlined, LeftOutlined, RightOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { BACKEND_URL } from '../config';

interface Bike {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  type: string;
  dateProduce?: string;
  capacity?: string;
  driveMode?: string;
  technology?: string;
  description?: string;
  year?: string;
}

interface WishlistItem {
  id: number;
  bikeId: number;
  userId: number;
  addedAt: string;
  bike: Bike;
}

interface HomePageProps {
  bikes: Bike[];
  user: any;
  loading: boolean;
  addToCart: (bike: Bike) => void;
  setEditBike: (bike: Bike) => void;
  handleDeleteBike: (id: number) => void;
  setShowAddModal: (show: boolean) => void;
  heroIndex: number;
  heroBikes: { image: string; name: string }[];
  nextHero: () => void;
  prevHero: () => void;
  navigate: (path: string) => void;
  addToWishlist?: (bike: Bike) => void;
  removeFromWishlist?: (bikeId: number) => void;
  wishlist?: WishlistItem[];
}

const HomePage: React.FC<HomePageProps> = ({
  bikes,
  user,
  loading,
  addToCart,
  setEditBike,
  handleDeleteBike,
  setShowAddModal,
  heroIndex,
  heroBikes,
  nextHero,
  prevHero,
  navigate,
  addToWishlist,
  removeFromWishlist,
  wishlist = [],
}) => {
  const [viewBike, setViewBike] = useState<Bike | null>(null);

  useEffect(() => {
    // Intersection Observer for swipe-up animation
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.swipe-up-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [bikes]);

  return (
    <>
      <div className="hero-section-bg" style={{
        backgroundImage: `url(${BACKEND_URL + heroBikes[heroIndex].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        borderRadius: 24,
        minHeight: 340,
        marginBottom: 48,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="hero-bg-overlay" style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(10,20,40,0.72) 60%, rgba(22,119,255,0.12) 100%)',
          zIndex: 1,
        }} />
        <Button className="hero-arrow left" icon={<LeftOutlined />} onClick={prevHero} style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
        <div className="hero-content">
          <div className="hero-title">Unleash the Power of BMW Motorcycles</div>
          <div className="hero-desc">Experience the thrill of the open road with our premium selection of bikes. Discover, compare, and shop the latest models from BMW and more.</div>
          <Button className="hero-btn tricolor" size="large" onClick={() => navigate('/categories')}>Race Now</Button>
          <div className="hero-bike-label">{heroBikes[heroIndex].name}</div>
        </div>
        <Button className="hero-arrow right" icon={<RightOutlined />} onClick={nextHero} style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
      </div>
      {/* Hero dots indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '12px 0 24px 0' }}>
        {heroBikes.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: heroIndex === idx ? 16 : 10,
              height: heroIndex === idx ? 16 : 10,
              borderRadius: '50%',
              background: heroIndex === idx ? '#1677ff' : '#e0e6ed',
              transition: 'all 0.2s',
              boxShadow: heroIndex === idx ? '0 2px 8px #1677ff44' : 'none',
              border: heroIndex === idx ? '2px solid #1677ff' : '1px solid #e0e6ed',
              cursor: 'pointer',
              margin: 0,
              padding: 0
            }}
            onClick={() => {
              if (idx !== heroIndex) navigate && navigate('/');
              // Optionally, you can expose a setHeroIndex prop to allow direct dot navigation
            }}
          />
        ))}
      </div>
      <div className="section-title">Featured Bikes</div>
      {loading ? <Spin /> : (
        <div className="vertical-bike-list">
          {bikes.slice(0, 8).map((bike, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div className="vertical-bike-section swipe-up-on-scroll" key={bike.id} style={{ display: 'flex', flexDirection: isEven ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'center', margin: '64px 0', gap: 64, opacity: 0, transform: 'translateY(60px)', transition: 'opacity 0.7s, transform 0.7s' }}>
                <div className="vertical-bike-image" style={{ flex: '0 0 700px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 400 }}>
                  <img src={bike.image.startsWith('/uploads/') ? BACKEND_URL + bike.image : bike.image} alt={bike.name} style={{ width: 640, height: 400, objectFit: 'cover', borderRadius: 24, boxShadow: '0 8px 32px rgba(22,119,255,0.18)', filter: 'brightness(1)', transition: 'transform 0.2s' }} />
                </div>
                <div className="vertical-bike-info" style={{ flex: 1, background: 'none', borderRadius: 16, padding: '32px 40px', minWidth: 320, color: '#003580', zIndex: 2 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: '#1677ff', marginBottom: 8, textTransform: 'uppercase' }}>{bike.brand}</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#18191A', marginBottom: 12, lineHeight: 1.1 }}>{bike.name}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#003580', marginBottom: 24 }}>{bike.type}</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: '#222', marginBottom: 32, lineHeight: 1.5, letterSpacing: 0.5, fontFamily: 'Segoe UI, Arial, sans-serif', background: 'linear-gradient(90deg, #e0e6ed 0%, #fff 100%)', borderRadius: 12, padding: '18px 28px', boxShadow: '0 2px 16px rgba(22,119,255,0.07)' }}>
                    {bike.description || `Experience the thrill of the ${bike.name} - a ${bike.type?.toLowerCase() || 'bike'} with outstanding performance and style.`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal
        open={!!viewBike}
        onCancel={() => setViewBike(null)}
        title={viewBike?.name}
        footer={null}
        centered
      >
        {viewBike && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Image">
              <img src={viewBike.image.startsWith('/uploads/') ? BACKEND_URL + viewBike.image : viewBike.image} alt={viewBike.name} style={{ width: 180, borderRadius: 8 }} />
            </Descriptions.Item>
            <Descriptions.Item label="Brand">{viewBike.brand}</Descriptions.Item>
            <Descriptions.Item label="Type">{viewBike.type}</Descriptions.Item>
            <Descriptions.Item label="Price">${viewBike.price?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Year">{viewBike.year || '-'}</Descriptions.Item>
            <Descriptions.Item label="Capacity">{viewBike.capacity || '-'}</Descriptions.Item>
            <Descriptions.Item label="Drive Mode">{viewBike.driveMode || '-'}</Descriptions.Item>
            <Descriptions.Item label="Technology">{viewBike.technology || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      {/* Add modals for add/edit bike here if needed */}
    </>
  );
};

export default HomePage; 