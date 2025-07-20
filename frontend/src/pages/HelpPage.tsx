import React, { useState } from 'react';
import { Card, Typography, Row, Col, Collapse, Input, Button, Tag, Divider } from 'antd';
import './HelpPage.css';
import { 
  QuestionCircleOutlined, 
  SearchOutlined, 
  BookOutlined, 
  ToolOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: <BookOutlined />,
      color: '#1677ff',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Register" button in the top right corner. Fill in your details including name, email, and password. Verify your email address to complete registration.'
        },
        {
          question: 'How do I browse motorcycles?',
          answer: 'Use the "Categories" tab in the navigation to view all available motorcycles. You can filter by brand, type, and price range.'
        },
        {
          question: 'Can I view motorcycles without creating an account?',
          answer: 'Yes, you can browse all motorcycles without an account. However, you\'ll need to register to add items to cart or make purchases.'
        }
      ]
    },
    {
      title: 'Purchasing',
      icon: <SafetyCertificateOutlined />,
      color: '#52c41a',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Financing options are also available.'
        },
        {
          question: 'Do you offer financing?',
          answer: 'Yes, we offer competitive financing options through our partner lenders. Contact our sales team to discuss available options and get pre-approved.'
        },
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused motorcycles in original condition. Custom orders and special builds may have different terms.'
        },
        {
          question: 'Do you ship motorcycles?',
          answer: 'Yes, we offer nationwide shipping. Delivery times vary by location. Contact us for specific shipping quotes and timelines.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: <ToolOutlined />,
      color: '#fa8c16',
      faqs: [
        {
          question: 'How do I schedule maintenance?',
          answer: 'Contact our service department at service@bigbikeblitz.com or call +1 (555) 123-4569 to schedule maintenance appointments.'
        },
        {
          question: 'What warranty do you provide?',
          answer: 'All motorcycles come with manufacturer warranty. We also offer extended warranty options for additional coverage.'
        },
        {
          question: 'Do you provide roadside assistance?',
          answer: 'Yes, we offer roadside assistance for motorcycles purchased through us. Coverage details are provided at the time of purchase.'
        }
      ]
    },
    {
      title: 'Account & Orders',
      icon: <CustomerServiceOutlined />,
      color: '#722ed1',
      faqs: [
        {
          question: 'How do I track my order?',
          answer: 'Log into your account and visit the "Orders" section to view order status and tracking information.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'Orders can be cancelled within 24 hours of placement if the motorcycle hasn\'t been prepared for shipping. Contact us immediately.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and visit the "Profile" section to update your personal information, address, and preferences.'
        }
      ]
    }
  ];

  const quickLinks = [
    {
      title: 'User Manual',
      description: 'Complete guide to using our platform',
      icon: <FileTextOutlined />,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: <VideoCameraOutlined />,
      link: '#'
    },
    {
      title: 'Contact Support',
      description: 'Get in touch with our team',
      icon: <CustomerServiceOutlined />,
      link: '/contact'
    },
    {
      title: 'Maintenance Guide',
      description: 'Motorcycle care and maintenance tips',
      icon: <ToolOutlined />,
      link: '#'
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ 
        background: 'linear-gradient(135deg, #1677ff 0%, #003580 100%)', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: 32,
        borderRadius: 16
      }}>
        <QuestionCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Help Center
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          Find answers to common questions and get the support you need
        </Paragraph>
        
        {/* Search */}
        <div className="help-search-container">
          <div className="help-search-box">
            <div className="help-search-icon">
              <SearchOutlined style={{ fontSize: 16 }} />
            </div>
            <Input
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => {
                // Trigger search on Enter key
                setIsSearching(true);
                setTimeout(() => {
                  setIsSearching(false);
                  console.log('Searching for:', searchTerm);
                }, 500);
              }}
              size="large"
              className="help-search-input"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              className="help-search-button"
              loading={isSearching}
              onClick={() => {
                setIsSearching(true);
                // Simulate search delay
                setTimeout(() => {
                  setIsSearching(false);
                  console.log('Searching for:', searchTerm);
                }, 500);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <Card style={{ marginBottom: 32, borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Quick Links
        </Title>
        <Row gutter={[24, 24]}>
          {quickLinks.map((link, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                style={{ textAlign: 'center', borderRadius: 12, height: '100%' }}
                bodyStyle={{ padding: '24px 16px' }}
              >
                <div style={{ 
                  fontSize: 32, 
                  color: '#1677ff', 
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {link.icon}
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>{link.title}</Title>
                <Paragraph style={{ color: '#666', fontSize: 14, margin: 0 }}>
                  {link.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* FAQ Categories */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          Frequently Asked Questions
        </Title>
        
        {filteredCategories.map((category, categoryIndex) => (
          <Card 
            key={categoryIndex} 
            style={{ marginBottom: 24, borderRadius: 12 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ color: category.color, fontSize: 24 }}>
                  {category.icon}
                </div>
                <span>{category.title}</span>
              </div>
            }
          >
            <Collapse 
              ghost 
              expandIconPosition="end"
              style={{ background: 'transparent' }}
            >
              {category.faqs.map((faq, faqIndex) => (
                <Panel 
                  header={
                    <div style={{ fontWeight: 500, fontSize: 16 }}>
                      {faq.question}
                    </div>
                  } 
                  key={faqIndex}
                  style={{ 
                    border: '1px solid #f0f0f0', 
                    borderRadius: 8, 
                    marginBottom: 8,
                    background: '#fff'
                  }}
                >
                  <Paragraph style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card style={{ borderRadius: 12, background: '#f8f9fa' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={16}>
            <Title level={3} style={{ marginBottom: 16 }}>
              Still Need Help?
            </Title>
            <Paragraph style={{ color: '#666', fontSize: 16, marginBottom: 24 }}>
              Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
            </Paragraph>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Button size="large" icon={<CustomerServiceOutlined />}>
                Contact Support
              </Button>
              <Button size="large" icon={<PhoneOutlined />}>
                Call Us: +1 (555) 123-4567
              </Button>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <CustomerServiceOutlined style={{ fontSize: 64, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>
                24/7 Support
              </Title>
              <Text style={{ color: '#666' }}>
                We're here to help you every step of the way
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Additional Resources */}
      <Card style={{ marginTop: 32, borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Additional Resources
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div
              style={{ padding: 20, border: '1px solid #f0f0f0', borderRadius: 8, cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
              onClick={() => navigate('/magazine')}
              onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(22,119,255,0.10)')}
              onMouseOut={e => (e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)')}
              tabIndex={0}
              role="button"
              aria-label="Go to Knowledge Base"
            >
              <BookOutlined style={{ fontSize: 32, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>Knowledge Base</Title>
              <Paragraph style={{ color: '#666', marginBottom: 16 }}>
                Comprehensive articles and guides covering all aspects of motorcycling.
              </Paragraph>
              <Button type="link" style={{ padding: 0 }}>
                Browse Articles →
              </Button>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ padding: 20, border: '1px solid #f0f0f0', borderRadius: 8 }}>
              <VideoCameraOutlined style={{ fontSize: 32, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>Video Tutorials</Title>
              <Paragraph style={{ color: '#666', marginBottom: 16 }}>
                Step-by-step video guides for common tasks and features.
              </Paragraph>
              <Button type="link" style={{ padding: 0 }}>
                Watch Videos →
              </Button>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ padding: 20, border: '1px solid #f0f0f0', borderRadius: 8 }}>
              <ToolOutlined style={{ fontSize: 32, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>Maintenance Tips</Title>
              <Paragraph style={{ color: '#666', marginBottom: 16 }}>
                Essential maintenance tips to keep your motorcycle in top condition.
              </Paragraph>
              <Button type="link" style={{ padding: 0 }}>
                Learn More →
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default HelpPage; 