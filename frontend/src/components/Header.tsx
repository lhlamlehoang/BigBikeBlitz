import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Button, Input, Avatar, Dropdown, Badge, Typography, Space, Divider, List } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  SearchOutlined,
  MenuOutlined,
  HeartOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BACKEND_URL } from '../config';

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;
const backendUrl = BACKEND_URL;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed, cartItemCount }) => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample search suggestions - in a real app, this would come from an API
  const searchSuggestionsData = [
    'BMW S1000 RR',
    'BMW R 1250 GS',
    'BMW F 900 R',
    'BMW G 310 R',
    'Sport Motorcycles',
    'Adventure Bikes',
    'Roadster Motorcycles',
    'Touring Bikes',
    'Ducati Panigale',
    'Honda CBR1000RR',
    'Yamaha R1',
    'Kawasaki Ninja ZX-10R',
    'Harley Davidson',
    'Triumph Street Triple',
    'KTM Duke',
    'Suzuki GSX-R1000'
  ];

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/categories?search=${encodeURIComponent(value.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      const filtered = searchSuggestionsData.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSearchDropdown(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSearchDropdown(false);
    navigate(`/categories?search=${encodeURIComponent(suggestion)}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'orders',
      icon: <AppstoreOutlined />,
      label: 'My Orders',
      onClick: () => navigate('/orders')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];



  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: 'Categories'
    },
    {
      key: '/magazine',
      icon: <BookOutlined />,
      label: 'Magazine'
    },
    {
      key: '/about',
      icon: <TeamOutlined />,
      label: 'About'
    },
    {
      key: '/contact',
      icon: <CustomerServiceOutlined />,
      label: 'Contact'
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: 'Help'
    }
  ];

  return (
    <AntHeader 
      style={{ 
        background: isScrolled 
          ? (isDarkMode ? '#1f1f1f' : '#fff') 
          : (isDarkMode ? 'rgba(31,31,31,0.95)' : 'rgba(255,255,255,0.95)'),
        backdropFilter: 'blur(10px)',
        borderBottom: isScrolled 
          ? (isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0') 
          : 'none',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0 32px',
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo and Mobile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', height: 80 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', height: '100%' }}>
          <img 
            src={BACKEND_URL + "/uploads/logo.jpg"} 
            alt="Big Bike Blitz" 
            style={{ 
              height: 50, 
              width: 50, 
              borderRadius: 10,
              marginRight: 16,
              alignSelf: 'center'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignSelf: 'center' }}>
            <Text strong style={{ fontSize: 30, color: '#1677ff', marginBottom: 0, lineHeight: 1 }}>
              Big Bike Blitz
            </Text>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1, marginTop: 2 }}>
              Premium Motorcycles
            </div>
          </div>
        </Link>
      </div>

      {/* Search Bar (centered vertically) */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: 500, margin: '0 24px', position: 'relative', display: 'flex', alignItems: 'center', height: 80 }}>
        <Search
          placeholder="Search motorcycles, brands, or models..."
          value={searchValue}
          onChange={handleSearchInputChange}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
          size="large"
          style={{ borderRadius: 8, width: '100%' }}
        />
        {/* Search Dropdown */}
        {showSearchDropdown && searchSuggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1001,
            maxHeight: 300,
            overflowY: 'auto'
          }}>
            <List
              size="small"
              dataSource={searchSuggestions}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  onClick={() => handleSuggestionClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SearchOutlined style={{ color: '#999', fontSize: 14 }} />
                    <Text>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      {/* Navigation Menu and User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            background: 'transparent', 
            border: 'none',
            flex: 1
          }}
          onClick={({ key }) => navigate(key)}
        />
        {/* Admin Panel Link (only for ADMIN users) */}
        {user && user.role === 'ADMIN' && (
          <Button type="dashed" onClick={() => navigate('/admin')} style={{ marginRight: 8 }}>
            Admin Panel
          </Button>
        )}
        {/* User Actions */}
        <Space size="middle">
          {/* Cart */}
          <Badge count={cartItemCount} size="small">
            <Button 
              type="text" 
              icon={<ShoppingCartOutlined />} 
              onClick={() => navigate('/cart')}
              style={{ fontSize: 22 }}
            />
          </Badge>
          {/* User Menu */}
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar 
                  size={40}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1677ff' }}
                />
                <Text style={{ color: '#333' }}>
                  {user.username}
                </Text>
              </div>
            </Dropdown>
          ) : (
            <Space>
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header; 