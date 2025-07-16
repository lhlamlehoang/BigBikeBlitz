import React, { useEffect, useState, useRef } from 'react';
import { ConfigProvider, Layout, Menu, Card, Typography, Button, Row, Col, Spin, Dropdown, message, Tabs, MenuProps, Modal, Badge } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined, FacebookFilled, InstagramOutlined, YoutubeFilled, HeartOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import { notification } from 'antd';
import FooterComponent from './components/Footer';

// Import new professional components
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import CookieConsent from './components/CookieConsent';
import NewsletterSignup from './components/NewsletterSignup';
import LoadingSpinner from './components/LoadingSpinner';
import ReviewsSection from './components/ReviewsSection';
import LiveChat from './components/LiveChat';
import SearchSuggestions from './components/SearchSuggestions';
import analytics from './utils/analytics';
import { ThemeProvider } from './contexts/ThemeContext';
import NewsletterContentPage from './pages/NewsletterContentPage';

const { Header: AntHeader, Sider, Content, Footer: LayoutFooter } = Layout;
const { Title } = Typography;

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

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const bmwBikes: Bike[] = [
  {
    id: 4,
    name: 'BMW S1000 RR',
    price: 16995,
    image: '/uploads/bmw-s1000-rr.jpg',
    brand: 'BMW',
    type: 'Sport',
  },
  {
    id: 5,
    name: 'BMW R 1250 GS',
    price: 17995,
    image: '/uploads/bmw-r1250gs.jpg',
    brand: 'BMW',
    type: 'Adventure',
  },
  {
    id: 6,
    name: 'BMW F 900 R',
    price: 8950,
    image: '/uploads/bmw-f900r.jpg',
    brand: 'BMW',
    type: 'Roadster',
  },
  {
    id: 7,
    name: 'BMW G 310 R',
    price: 5750,
    image: '/uploads/bmw-g310r.jpg',
    brand: 'BMW',
    type: 'Roadster',
  },
];

const heroBikes = [
  {
    image: '/uploads/bmw-s1000-rr.jpg',
    name: 'BMW S 1000 RR',
  },
  {
    image: '/uploads/bmw-r1250-gs.jpg',
    name: 'BMW R 1250 GS',
  },
  {
    image: '/uploads/bmw-f900-r.jpg',
    name: 'BMW F 900 R',
  },
  {
    image: '/uploads/bmw-g310-r.jpg',
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

  // New state for additional features
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showLiveChat, setShowLiveChat] = useState(false);

  // Initialize analytics
  useEffect(() => {
    analytics.trackPageView();
  }, [location.pathname]);

  useEffect(() => {
    api.get('/api/bikes/all')
      .then(res => {
        if (res.status !== 200) throw new Error('Not authorized');
        return res.data;
      })
      .then(data => {
        setBikes(data);
        setLoading(false);
        analytics.trackEvent('data', 'load', 'bikes', data.length);
      })
      .catch(err => {
        console.log(err)
        setBikes([]);
        setLoading(false);
        analytics.trackError('Failed to load bikes', 'API');
      });
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (token && user) {
      loadUserData();
    }
  }, [token, user]);

  const loadUserData = async () => {
    try {
      // Load cart
      const cartRes = await api.get('/api/cart');
      setCart(cartRes.data.bikes || []);
      setCartItemCount(cartRes.data.bikes?.length || 0);

      // Load wishlist
      const wishlistRes = await api.get('/api/wishlist');
      setWishlist(wishlistRes.data || []);

      // Load notifications
      const notificationsRes = await api.get('/api/notifications');
      setNotifications(notificationsRes.data || []);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    document.title = 'Big Bike Blitz - Premium Motorcycles';
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
    analytics.trackEvent('admin', 'add', 'bike', bike.price);
  };
  
  const handleEditBike = async (bike: Bike) => {
    const res = await api.put(`/api/bikes/${bike.id}`, bike);
    setBikes(prev => prev.map(b => b.id === bike.id ? res.data : b));
    setEditBike(null);
    analytics.trackEvent('admin', 'edit', 'bike');
  };
  
  const handleDeleteBike = async (id: number) => {
    await api.delete(`/api/bikes/${id}`);
    setBikes(prev => prev.filter(b => b.id !== id));
    analytics.trackEvent('admin', 'delete', 'bike');
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
      setCartItemCount(res.data.bikes?.length || 0);
      notification.success({ message: `${quantity} x ${bike.name} added to cart!` });
      analytics.trackAddToCart(bike.id.toString(), bike.name, bike.price, quantity);
    } catch (err) {
      notification.error({ message: 'Failed to add to cart. Please login.' });
      analytics.trackError('Failed to add to cart', 'Cart');
    }
  };

  // Wishlist handlers
  const addToWishlist = async (bike: Bike) => {
    if (!token) {
      requireLogin();
      return;
    }
    try {
      const res = await api.post('/api/wishlist/add', { bikeId: bike.id });
      setWishlist(prev => [...prev, res.data]);
      notification.success({ message: `${bike.name} added to wishlist!` });
      analytics.trackEvent('wishlist', 'add', bike.name);
    } catch (err) {
      notification.error({ message: 'Failed to add to wishlist.' });
    }
  };

  const removeFromWishlist = async (bikeId: number) => {
    try {
      await api.delete(`/api/wishlist/${bikeId}`);
      setWishlist(prev => prev.filter(item => item.bikeId !== bikeId));
      notification.success({ message: 'Removed from wishlist!' });
      analytics.trackEvent('wishlist', 'remove', 'bike');
    } catch (err) {
      notification.error({ message: 'Failed to remove from wishlist.' });
    }
  };

  // Cookie consent handlers
  const handleCookieAccept = (preferences: any) => {
    setCookiePreferences(preferences);
    setShowCookieConsent(false);
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    analytics.trackEvent('privacy', 'cookie_accept', JSON.stringify(preferences));
  };

  const handleCookieDecline = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiePreferences', JSON.stringify({ necessary: true, analytics: false, marketing: false, functional: false }));
    analytics.trackEvent('privacy', 'cookie_decline');
  };

  // Newsletter handlers
  const handleNewsletterSubscribe = (email: string) => {
    analytics.trackEvent('marketing', 'newsletter_subscribe', email);
    setShowNewsletter(false);
  };

  // Tab navigation handler
  const handleTabChange = (key: string) => {
    // If guest tries to access cart or orders, show login modal
    if (!token && (key === '/cart' || key === '/orders' || key === '/wishlist')) {
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

  // Check for saved cookie preferences
  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      setCookiePreferences(JSON.parse(saved));
      setShowCookieConsent(false);
    }
  }, []);

  // Show newsletter signup after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('newsletterShown')) {
        setShowNewsletter(true);
        localStorage.setItem('newsletterShown', 'true');
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading Big Bike Blitz..." />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Layout style={{ minHeight: '100vh', background: '#f7f9fb' }}>
          <Header 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            cartItemCount={cartItemCount}
          />
          
          <Content style={{ margin: '24px 16px 0', overflow: 'initial', background: '#f7f9fb' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/reset" element={<ResetPasswordPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/magazine" element={<MagazinePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/product/:id" element={
                <ProductDetailsPage 
                  addToCart={addToCart} 
                  requireLogin={requireLogin} 
                  isGuest={!token}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  wishlist={wishlist}
                />
              } />
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
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  wishlist={wishlist}
                />
              } />
              <Route path="/categories" element={
                <CategoriesPage 
                  addToCart={addToCart} 
                  requireLogin={requireLogin} 
                  isGuest={!token}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  wishlist={wishlist}
                />
              } />
              <Route path="/cart" element={<CartPage requireLogin={requireLogin} />} />
              <Route path="/wishlist" element={
                <RequireAuth>
                  <WishlistPage 
                    wishlist={wishlist}
                    removeFromWishlist={removeFromWishlist}
                    addToCart={addToCart}
                  />
                </RequireAuth>
              } />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage requireLogin={requireLogin} />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/magazine/:id" element={<NewsletterContentPage />} />
            </Routes>

            {/* Newsletter Signup Modal */}
            <Modal
              open={showNewsletter}
              onCancel={() => setShowNewsletter(false)}
              footer={null}
              centered
              width={600}
            >
              <NewsletterSignup 
                title="Stay Updated with Big Bike Blitz"
                description="Get exclusive access to new motorcycle releases, special offers, and riding tips delivered to your inbox."
                onSubscribe={handleNewsletterSubscribe}
              />
            </Modal>

            {/* Login Required Modal */}
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

        {/* Cookie Consent */}
        {showCookieConsent && (
          <CookieConsent
            onAccept={handleCookieAccept}
            onDecline={handleCookieDecline}
          />
        )}

        {/* Live Chat */}
        <LiveChat 
          isOpen={showLiveChat}
          onClose={() => setShowLiveChat(false)}
        />

        {/* Floating Action Buttons */}
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <Button
            className="fab-chat-btn"
            icon={<MessageOutlined />}
            onClick={() => setShowLiveChat(true)}
            title="Live Chat Support"
          />
        </div>

      </ThemeProvider>
    </ErrorBoundary>
  );
};

// Wishlist Page Component
const WishlistPage: React.FC<{
  wishlist: WishlistItem[];
  removeFromWishlist: (bikeId: number) => void;
  addToCart: (bike: Bike, quantity?: number) => void;
}> = ({ wishlist, removeFromWishlist, addToCart }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 32, textAlign: 'center' }}>
        My Wishlist
      </Title>
      
      {wishlist.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <HeartOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#666' }}>Your wishlist is empty</Title>
          <p style={{ color: '#999', marginBottom: 24 }}>
            Start adding motorcycles to your wishlist to save them for later.
          </p>
          <Button type="primary" size="large" onClick={() => navigate('/categories')}>
            Browse Motorcycles
          </Button>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {wishlist.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <img 
                    alt={item.bike.name} 
                    src={item.bike.image} 
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button 
                    type="primary" 
                    onClick={() => addToCart(item.bike)}
                    icon={<ShoppingCartOutlined />}
                  >
                    Add to Cart
                  </Button>,
                  <Button 
                    danger 
                    onClick={() => removeFromWishlist(item.bike.id)}
                    icon={<DeleteOutlined />}
                  >
                    Remove
                  </Button>
                ]}
              >
                <Card.Meta
                  title={item.bike.name}
                  description={
                    <div>
                      <p style={{ color: '#1677ff', fontSize: 18, fontWeight: 'bold' }}>
                        ${item.bike.price?.toLocaleString()}
                      </p>
                      <p>{item.bike.brand} • {item.bike.type}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default App; 