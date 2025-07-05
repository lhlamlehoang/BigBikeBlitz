import React, { useEffect, useState, useRef } from 'react';
import { ConfigProvider, Layout, Menu, Card, Typography, Button, Row, Col, Spin, Dropdown, message, Tabs, MenuProps, Modal } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined, FacebookFilled, InstagramOutlined, YoutubeFilled } from '@ant-design/icons';
import './App.css';
import api from './auth/authFetch';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useAuth } from './auth/AuthContext';
import RegisterPage from './pages/RegisterPage';
import { Menu as AntMenu } from 'antd';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import MagazinePage from './pages/MagazinePage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import { notification } from 'antd';
import FooterComponent from './components/Footer';

const { Header, Sider, Content, Footer: LayoutFooter } = Layout;
const { Title } = Typography;

interface Bike {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  type: string;
}

const bmwBikes: Bike[] = [
  {
    id: 4,
    name: 'BMW S1000 RR',
    price: 16995,
    image: '../public/assets/bmw-s1000-rr.jpg',
    brand: 'BMW',
    type: 'Sport',
  },
  {
    id: 5,
    name: 'BMW R 1250 GS',
    price: 17995,
    image: '/assets/bmw-r1250gs.jpg',
    brand: 'BMW',
    type: 'Adventure',
  },
  {
    id: 6,
    name: 'BMW F 900 R',
    price: 8950,
    image: '/assets/bmw-f900r.jpg',
    brand: 'BMW',
    type: 'Roadster',
  },
  {
    id: 7,
    name: 'BMW G 310 R',
    price: 5750,
    image: '/assets/bmw-g310r.jpg',
    brand: 'BMW',
    type: 'Roadster',
  },
];

const heroBikes = [
  {
    image: '../public/assets/bmw-s1000-rr.jpg',
    name: 'BMW S 1000 RR',
  },
  {
    image: '../public/assets/bmw-r1250-gs.jpg',
    name: 'BMW R 1250 GS',
  },
  {
    image: '../public/assets/bmw-f900-r.jpg',
    name: 'BMW F 900 R',
  },
  {
    image: '../public/assets/bmw-g310-r.jpg',
    name: 'BMW G 310 R',
  },
];

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBike, setEditBike] = useState<Bike | null>(null);
  const [cart, setCart] = useState<Bike[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimeout = useRef<number | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.get('/api/bikes/all')
      .then(res => {
        if (res.status !== 200) throw new Error('Not authorized');
        return res.data;
      })
      .then(data => {
        setBikes(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
        setBikes([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = 'Big Bike Blitz';
  }, []);

  const getInitials = (username?: string) => {
    if (!username) return '';
    return username.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  // CRUD handlers (admin only)
  const handleAddBike = async (bike: Partial<Bike>) => {
    const res = await api.post('/api/bikes', bike);
    setBikes(prev => [...prev, res.data]);
    setShowAddModal(false);
  };
  const handleEditBike = async (bike: Bike) => {
    const res = await api.put(`/api/bikes/${bike.id}`, bike);
    setBikes(prev => prev.map(b => b.id === bike.id ? res.data : b));
    setEditBike(null);
  };
  const handleDeleteBike = async (id: number) => {
    await api.delete(`/api/bikes/${id}`);
    setBikes(prev => prev.filter(b => b.id !== id));
  };

  // Handler to show login modal
  const requireLogin = () => setLoginModalVisible(true);
  const handleLoginModalOk = () => {
    setLoginModalVisible(false);
    navigate('/login');
  };
  const handleLoginModalCancel = () => setLoginModalVisible(false);

  // Cart handlers
  const addToCart = async (bike: Bike, quantity: number = 1) => {
    if (!token) {
      requireLogin();
      return;
    }
    try {
      const res = await api.post('/api/cart/add', { bikeId: bike.id, quantity });
      setCart(res.data.bikes || []);
      notification.success({ message: `${quantity} x ${bike.name} added to cart!` });
    } catch (err) {
      notification.error({ message: 'Failed to add to cart. Please login.' });
    }
  };

  // Tab navigation handler
  const handleTabChange = (key: string) => {
    // If guest tries to access cart or orders, show login modal
    if (!token && (key === '/cart' || key === '/orders')) {
      requireLogin();
      return;
    }
    navigate(key);
  };

  const nextHero = () => {
    setHeroIndex(i => (i + 1) % heroBikes.length);
  };
  const prevHero = () => {
    setHeroIndex(i => (i - 1 + heroBikes.length) % heroBikes.length);
  };

  useEffect(() => {
    if (heroTimeout.current) clearTimeout(heroTimeout.current);
    heroTimeout.current = setTimeout(() => {
      setHeroIndex(i => (i + 1) % heroBikes.length);
    }, 4000);
    return () => {
      if (heroTimeout.current) clearTimeout(heroTimeout.current);
    };
  }, [heroIndex]);

  // Avatar dropdown items
  const userMenuItems: MenuProps['items'] = user ? [
    { key: 'profile', label: 'Profile', onClick: () => navigate('/profile') },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', onClick: () => { logout(); localStorage.removeItem('token'); } },
  ] : [
    { key: 'login', label: 'Login', onClick: () => navigate('/login', { state: { from: location.pathname } }) },
  ];

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/reset" element={<ResetPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/magazine" element={<MagazinePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} requireLogin={requireLogin} isGuest={!token} />} />
      <Route path="/*" element={
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              colorBgBase: '#ffffff',
              colorTextBase: '#1a1a1a',
              colorBgContainer: '#ffffff',
              colorBorder: '#e0e0e0',
            },
            components: {
              Layout: {
                headerBg: '#ffffff',
                colorBgBase: '#ffffff',
                colorText: '#1a1a1a',
              },
              Tabs: {
                inkBarColor: '#1677ff',
                itemColor: '#1a1a1a',
                itemSelectedColor: '#1677ff',
                itemHoverColor: '#4096ff',
                cardBg: '#f7f9fb',
              },
              Card: {
                colorBgContainer: '#ffffff',
                colorText: '#1a1a1a',
              },
              Button: {
                colorPrimary: '#1677ff',
                colorPrimaryHover: '#4096ff',
                colorPrimaryActive: '#0958d9',
                colorTextLightSolid: '#ffffff',
              },
            },
          }}
        >
          <Layout style={{ minHeight: '100vh', background: '#f7f9fb' }}>
            <Header className="header-animate" style={{ background: '#fff', padding: 0, boxShadow: '0 2px 8px #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, height: 96 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
                <img src="../public/assets/logo.jpg" alt="Store Logo" style={{ height: 56, width: 56, marginLeft: 32, cursor: 'pointer' }} onClick={() => navigate('/')} />
                <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontSize: 38, letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>Big Bike Blitz</Title>
                <Tabs
                  className="tabs-animate"
                  defaultActiveKey={window.location.pathname === '/categories' ? '/categories' : window.location.pathname === '/cart' ? '/cart' : '/'}
                  activeKey={window.location.pathname}
                  onChange={handleTabChange}
                  style={{ marginLeft: 48 }}
                  items={[
                    { key: '/', label: <span style={{ fontSize: 24, padding: '0 32px' }}>Home</span> },
                    { key: '/categories', label: <span style={{ fontSize: 24, padding: '0 32px' }}>Categories</span> },
                    { key: '/cart', label: <span style={{ fontSize: 24, padding: '0 32px' }}>Cart</span> },
                    { key: '/orders', label: <span style={{ fontSize: 24, padding: '0 32px' }}>Orders</span> },
                    ...(user?.role === 'ADMIN' ? [{ key: '/admin', label: <span style={{ fontSize: 24, padding: '0 32px' }}>Admin</span> }] : []),
                  ]}
                  tabBarStyle={{ fontWeight: 600, fontSize: 24, minHeight: 64 }}
                />
              </div>
              <div style={{ marginRight: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button
                    shape="circle"
                    icon={<UserOutlined style={{ fontSize: 28 }} />}
                    style={{ background: '#f3f4f6', color: '#1677ff', border: 'none', boxShadow: '0 2px 8px #e0e6ed' }}
                    aria-label="User menu"
                  />
                </Dropdown>
              </div>
            </Header>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', background: '#f7f9fb' }}>
              <Routes>
                <Route path="/" element={
                  <HomePage
                    bikes={bikes}
                    user={user}
                    loading={loading}
                    addToCart={addToCart}
                    setEditBike={setEditBike}
                    handleDeleteBike={handleDeleteBike}
                    setShowAddModal={setShowAddModal}
                    heroIndex={heroIndex}
                    heroBikes={heroBikes}
                    nextHero={nextHero}
                    prevHero={prevHero}
                    navigate={navigate}
                  />
                } />
                <Route path="/categories" element={<CategoriesPage addToCart={addToCart} requireLogin={requireLogin} isGuest={!token} />} />
                <Route path="/cart" element={<CartPage requireLogin={requireLogin} />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage requireLogin={requireLogin} />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
              <Modal
                open={loginModalVisible}
                onOk={handleLoginModalOk}
                onCancel={handleLoginModalCancel}
                title="Login Required"
                okText="Go to Login"
                cancelText="Cancel"
                centered
              >
                <div style={{ fontSize: 18, marginBottom: 12 }}>
                  You need to be logged in to perform this action.
                </div>
              </Modal>
            </Content>
            <FooterComponent />
          </Layout>
        </ConfigProvider>
      } />
    </Routes>
  );
};

export default App; 