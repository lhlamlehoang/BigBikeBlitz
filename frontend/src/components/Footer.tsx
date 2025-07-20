import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AntFooter className="site-footer" style={{ 
      padding: isMobile ? '2rem 0 1rem 0' : '3rem 0 1.5rem 0',
      background: '#f8f9fa',
      color: '#333',
      borderTop: '1px solid #e9ecef'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: isMobile ? '0 1rem' : '0 1.5rem' 
      }}>
        <Row gutter={[isMobile ? 24 : 32, isMobile ? 24 : 32]}>
          {/* Company Info */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <div style={{ 
              marginBottom: isMobile ? 20 : 24,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              <Title level={4} style={{ 
                color: '#333', 
                marginBottom: 16, 
                fontSize: isMobile ? 18 : 20,
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <Link to="/" style={{ 
                  color: '#1677ff', 
                  textDecoration: 'none',
                  fontWeight: 700
                }}>
                  Big Bike Blitz
                </Link>
              </Title>
              <Text style={{ 
                color: '#666', 
                lineHeight: 1.6, 
                display: 'block', 
                marginBottom: 16,
                fontSize: isMobile ? 14 : 16,
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Your premier destination for premium motorcycles. Experience the thrill of the open road with our curated selection of high-performance bikes.
              </Text>
              <div style={{ 
                display: 'flex', 
                gap: 12,
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
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
          <Col xs={12} sm={12} md={8} lg={6}>
            <Title level={5} style={{ 
              color: '#333', 
              marginBottom: 16, 
              fontSize: isMobile ? 14 : 16,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Quick Links
            </Title>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? 6 : 8,
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
              <Link to="/" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>Home</Link>
              <Link to="/categories" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>Categories</Link>
              <Link to="/cart" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>Cart</Link>
              <Link to="/orders" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>Orders</Link>
            </div>
          </Col>

          {/* Company */}
          <Col xs={12} sm={12} md={8} lg={6}>
            <Title level={5} style={{ 
              color: '#333', 
              marginBottom: 16, 
              fontSize: isMobile ? 14 : 16,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Company
            </Title>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? 6 : 8,
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
              <Link to="/about" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>
                <TeamOutlined style={{ marginRight: 8 }} />
                About Us
              </Link>
              <Link to="/magazine" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>
                <BookOutlined style={{ marginRight: 8 }} />
                Bike Magazine
              </Link>
            </div>
          </Col>

          {/* Support */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <Title level={5} style={{ 
              color: '#333', 
              marginBottom: 16, 
              fontSize: isMobile ? 14 : 16,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Support
            </Title>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? 6 : 8,
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
              <Link to="/help" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>
                <QuestionCircleOutlined style={{ marginRight: 8 }} />
                Help Center
              </Link>
              <Link to="/contact" className="footer-link" style={{ fontSize: isMobile ? 13 : 14 }}>
                <CustomerServiceOutlined style={{ marginRight: 8 }} />
                Contact Us
              </Link>
            </div>
          </Col>
        </Row>

        <Divider style={{ 
          margin: isMobile ? '24px 0 20px 0' : '32px 0 24px 0', 
          borderColor: '#e0e0e0' 
        }} />

        {/* Contact Info */}
        <Row gutter={[isMobile ? 16 : 32, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 20 : 24 }}>
          <Col xs={24} sm={24} md={8}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <PhoneOutlined style={{ color: '#1677ff', fontSize: isMobile ? 14 : 16 }} />
              <Text style={{ 
                color: '#666', 
                fontSize: isMobile ? 13 : 14 
              }}>
                +1 (555) 123-4567
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <MailOutlined style={{ color: '#1677ff', fontSize: isMobile ? 14 : 16 }} />
              <Text style={{ 
                color: '#666', 
                fontSize: isMobile ? 13 : 14 
              }}>
                bigbikeblitz@gmail.com
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <EnvironmentOutlined style={{ color: '#1677ff', fontSize: isMobile ? 14 : 16 }} />
              <Text style={{ 
                color: '#666', 
                fontSize: isMobile ? 13 : 14 
              }}>
                Dai Nam racecourse
              </Text>
            </div>
          </Col>
        </Row>

        {/* Bottom Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: isMobile ? 12 : 16,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 12 : 16, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Text style={{ 
              color: '#666', 
              fontSize: isMobile ? 12 : 14 
            }}>
              &copy; {currentYear} Big Bike Blitz. All rights reserved.
            </Text>
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? 12 : 16,
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <Link to="/privacy" style={{ 
                color: '#666', 
                fontSize: isMobile ? 12 : 14, 
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ 
                color: '#666', 
                fontSize: isMobile ? 12 : 14, 
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Terms of Service
              </Link>
              <Link to="/cookies" style={{ 
                color: '#666', 
                fontSize: isMobile ? 12 : 14, 
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}>
                Cookie Policy
              </Link>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Text style={{ 
              color: '#666', 
              fontSize: isMobile ? 12 : 14 
            }}>
              Made with ❤️ for riders
            </Text>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 