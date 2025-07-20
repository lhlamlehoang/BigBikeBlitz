import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme, Button } from 'antd';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import MagazinePage from './pages/MagazinePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NewsletterContentPage from './pages/NewsletterContentPage';
import AIChat from './components/AIChat';
import LiveChat from './components/LiveChat';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { BACKEND_URL } from './config';
import './App.css';

const { Content } = Layout;

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

interface CartItem {
  id: number;
  bike: Bike;
  quantity: number;
}

interface WishlistItem {
  id: number;
  bikeId: number;
  userId: number;
  addedAt: string;
  bike: Bike;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBike, setEditBike] = useState<Bike | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroBikes = [
    { image: '/uploads/bmw-s1000-rr.jpg', name: 'BMW S1000 RR' },
    { image: '/uploads/bmw-r1250-gs.jpg', name: 'BMW R 1250 GS' },
    { image: '/uploads/bmw-f900-r.jpg', name: 'BMW F 900 R' },
    { image: '/uploads/bmw-g310-r.jpg', name: 'BMW G 310 R' }
  ];

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroBikes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBikes.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const fetchBikes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bikes/all`);
      if (response.ok) {
        const data = await response.json();
        setBikes(data);
      }
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.cartItems || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (bike: Bike) => {
    try {
      // Add to backend
      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bikeId: bike.id,
          quantity: 1
        })
      });

      if (response.ok) {
        const cartData = await response.json();
        // Update frontend state with backend data
        setCartItems(cartData.cartItems || []);
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (bikeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bikeId })
      });
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.cartItems || []);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (bikeId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(bikeId);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bikeId,
          quantity
        })
      });
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.cartItems || []);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      // Remove all items one by one
      const itemsToRemove = [...cartItems];
      for (const item of itemsToRemove) {
        for (let i = 0; i < item.quantity; i++) {
          await fetch(`${BACKEND_URL}/api/cart/remove`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ bikeId: item.bike.id })
          });
        }
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const addToWishlist = (bike: Bike) => {
    setWishlist(prev => {
      const existingItem = prev.find(item => item.bikeId === bike.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, {
        id: Date.now(),
        bikeId: bike.id,
        userId: user?.id || 0,
        addedAt: new Date().toISOString(),
        bike
      }];
    });
  };

  const removeFromWishlist = (bikeId: number) => {
    setWishlist(prev => prev.filter(item => item.bikeId !== bikeId));
  };

  const handleDeleteBike = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bikes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setBikes(prev => prev.filter(bike => bike.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroBikes.length);
  };

  const prevHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroBikes.length) % heroBikes.length);
  };

  // Chat state
  const [showAIChat, setShowAIChat] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <Content style={{ 
        padding: 0, 
        margin: 0,
        background: '#ffffff',
        minHeight: 'calc(100vh - 64px)',
        ...(isMobile && { minHeight: 'calc(100vh - 128px)' }) // Account for mobile search bar
      }}>
        <ErrorBoundary>
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
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                wishlist={wishlist}
              />
            } />
            <Route path="/categories" element={
              <CategoriesPage
                bikes={bikes}
                loading={loading}
                addToCart={addToCart}
                user={user}
              />
            } />
            <Route path="/product/:id" element={
              <ProductDetailsPage
                bikes={bikes}
                addToCart={addToCart}
                user={user}
              />
            } />
            <Route path="/cart" element={
              <CartPage
                cartItems={cartItems}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                user={user}
              />
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={
              user ? <ProfilePage user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/orders" element={
              user ? <OrdersPage user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/payment" element={
              user ? <PaymentPage cartItems={cartItems} clearCart={clearCart} /> : <Navigate to="/login" />
            } />
            <Route path="/admin" element={
              user && user.role === 'ADMIN' ? (
                <AdminPanel
                  bikes={bikes}
                  setBikes={setBikes}
                  setShowAddModal={setShowAddModal}
                  setEditBike={setEditBike}
                  handleDeleteBike={handleDeleteBike}
                />
              ) : <Navigate to="/" />
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route path="/magazine/:id" element={<MagazinePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/newsletter" element={<NewsletterContentPage />} />
          </Routes>
        </ErrorBoundary>
      </Content>
      
      <Footer />
      
      {/* AI Chat */}
      <AIChat 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
      
      {/* Floating Action Button for AI Chat */}
      <Button
        icon={<MessageOutlined />}
        onClick={() => setShowAIChat(true)}
        style={{
          color: '#ffffff',
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          width: isMobile ? 48 : 72,
          height: isMobile ? 48 : 72,
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #1677ff 0%, #67e8f9 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? 18 : 32
        }}
        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = 'linear-gradient(135deg, #67e8f9 0%, #1677ff 100%)'}
        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = 'linear-gradient(135deg, #1677ff 0%, #67e8f9 100%)'}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: 'Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
            fontWeight: 600,
          },
          Card: {
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(22, 119, 255, 0.08)',
          },
          Input: {
            borderRadius: 8,
          },
          Modal: {
            borderRadius: 16,
          },
          Drawer: {
            borderRadius: 16,
          },
        },
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App; 