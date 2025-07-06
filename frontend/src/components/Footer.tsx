import React from 'react';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import { 
  FacebookFilled, 
  InstagramOutlined, 
  YoutubeFilled, 
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  TeamOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="site-footer" style={{ padding: '48px 0 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ color: '#1a1a1a', marginBottom: 16, fontSize: 20 }}>
                <Link to="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>
                  Big Bike Blitz
                </Link>
              </Title>
              <Text style={{ color: '#666', lineHeight: 1.6, display: 'block', marginBottom: 16 }}>
                Your premier destination for premium motorcycles. Experience the thrill of the open road with our curated selection of high-performance bikes.
              </Text>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-link">
                  <FacebookFilled />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                  <InstagramOutlined />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-link">
                  <YoutubeFilled />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="footer-social-link">
                  <TwitterOutlined />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link">
                  <LinkedinOutlined />
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#1a1a1a', marginBottom: 16, fontSize: 16 }}>
              Quick Links
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/categories" className="footer-link">Categories</Link>
              <Link to="/cart" className="footer-link">Cart</Link>
              <Link to="/orders" className="footer-link">Orders</Link>
            </div>
          </Col>

          {/* Company */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#1a1a1a', marginBottom: 16, fontSize: 16 }}>
              Company
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/about" className="footer-link">
                <TeamOutlined style={{ marginRight: 8 }} />
                About Us
              </Link>
              <Link to="/magazine" className="footer-link">
                <BookOutlined style={{ marginRight: 8 }} />
                Bike Magazine
              </Link>
            </div>
          </Col>

          {/* Support */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#1a1a1a', marginBottom: 16, fontSize: 16 }}>
              Support
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/help" className="footer-link">
                <QuestionCircleOutlined style={{ marginRight: 8 }} />
                Help Center
              </Link>
              <Link to="/contact" className="footer-link">
                <CustomerServiceOutlined style={{ marginRight: 8 }} />
                Contact Us
              </Link>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: '32px 0 24px 0', borderColor: '#e0e0e0' }} />

        {/* Contact Info */}
        <Row gutter={[32, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PhoneOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <Text style={{ color: '#666' }}>+1 (555) 123-4567</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MailOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <Text style={{ color: '#666' }}>bigbikeblitz@gmail.com</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <EnvironmentOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <Text style={{ color: '#666' }}>Dai Nam racecourse</Text>
            </div>
          </Col>
        </Row>

        {/* Bottom Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Text style={{ color: '#666', fontSize: 14 }}>
              &copy; {currentYear} Big Bike Blitz. All rights reserved.
            </Text>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link to="/privacy" style={{ color: '#666', fontSize: 14, textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: '#666', fontSize: 14, textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/cookies" style={{ color: '#666', fontSize: 14, textDecoration: 'none' }}>
                Cookie Policy
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#666', fontSize: 14 }}>Made with ❤️ for riders</Text>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 