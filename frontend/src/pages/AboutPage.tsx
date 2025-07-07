import React from 'react';
import { Card, Typography, Row, Col, Avatar, Divider, Button } from 'antd';
import { TeamOutlined, TrophyOutlined, SafetyCertificateOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const backendUrl = "http://localhost:8080";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Lam Le',
      position: 'CEO & Founder',
      avatar: backendUrl + '/uploads/ceo-biker.png',
      description: 'Passionate motorcyclist with 10+ years of experience in the industry.'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers', icon: <HeartOutlined /> },
    { number: '15+', label: 'Years Experience', icon: <TrophyOutlined /> },
    { number: '100%', label: 'Satisfaction Rate', icon: <SafetyCertificateOutlined /> },
    { number: '24/7', label: 'Support Available', icon: <TeamOutlined /> }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero Section */}
      <Card style={{ 
        background: 'linear-gradient(135deg, #1677ff 0%, #003580 100%)', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: 32,
        borderRadius: 16
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          About Big Bike Blitz
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          Your premier destination for premium motorcycles since 2008
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          ghost
          onClick={() => navigate('/categories')}
          style={{ marginRight: 16 }}
        >
          Explore Our Bikes
        </Button>
        <Button 
          size="large" 
          ghost
          onClick={() => navigate('/contact')}
        >
          Contact Us
        </Button>
      </Card>

      {/* Mission & Vision */}
      <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
        <Col xs={24} md={12}>
          <Card title="Our Mission" style={{ height: '100%', borderRadius: 12 }}>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              To provide motorcycle enthusiasts with the highest quality bikes, exceptional service, 
              and an unparalleled shopping experience. We believe every rider deserves access to 
              premium motorcycles that deliver both performance and style.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Our Vision" style={{ height: '100%', borderRadius: 12 }}>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              To become the leading motorcycle marketplace, connecting riders with their dream bikes 
              while fostering a community of passionate motorcyclists who share our love for the open road.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Stats */}
      <Card style={{ marginBottom: 48, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Why Choose Big Bike Blitz?
        </Title>
        <Row gutter={[32, 32]}>
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 'bold', 
                  color: '#1677ff',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}>
                  {stat.icon}
                  {stat.number}
                </div>
                <Text style={{ fontSize: 16, color: '#666' }}>{stat.label}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Our Story */}
      <Card style={{ marginBottom: 48, borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Our Story
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Founded in 2008 by motorcycle enthusiast John Rider, Big Bike Blitz began as a small 
              local shop with a big dream. What started as a passion project has grown into one of 
              the most trusted names in the motorcycle industry.
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Over the years, we've expanded our inventory to include the latest models from 
              world-renowned manufacturers like BMW, Honda, Yamaha, Kawasaki, and Suzuki. 
              Our commitment to quality and customer satisfaction has never wavered.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Today, we serve customers nationwide, offering not just motorcycles, but a complete 
              riding experience. From expert advice to financing options, from maintenance services 
              to riding gear, we're here to support every aspect of your motorcycling journey.
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Our team of certified technicians and passionate riders ensures that every bike 
              we sell meets our high standards for performance, safety, and reliability.
            </Paragraph>
          </Col>
        </Row>
      </Card>

      {/* Team */}
      <Card style={{ marginBottom: 48, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Meet Our Team
        </Title>
        <Row justify="center">
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={16} md={8} key={index}>
              <Card 
                style={{ textAlign: 'center', borderRadius: 12 }}
                bodyStyle={{ padding: '24px 16px' }}
              >
                <Avatar 
                  size={80} 
                  src={member.avatar}
                  style={{ marginBottom: 16 }}
                />
                <Title level={4} style={{ marginBottom: 8 }}>{member.name}</Title>
                <Text style={{ color: '#1677ff', fontWeight: 600, display: 'block', marginBottom: 12 }}>
                  {member.position}
                </Text>
                <Paragraph style={{ fontSize: 14, color: '#666', margin: 0 }}>
                  {member.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Values */}
      <Card style={{ borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Our Values
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Quality</Title>
              <Paragraph style={{ color: '#666' }}>
                We never compromise on quality. Every bike in our inventory is carefully selected 
                and thoroughly inspected to ensure it meets our high standards.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <HeartOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Passion</Title>
              <Paragraph style={{ color: '#666' }}>
                Our love for motorcycles drives everything we do. We're not just selling bikes; 
                we're sharing our passion for the riding lifestyle.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Community</Title>
              <Paragraph style={{ color: '#666' }}>
                We believe in building a strong community of riders. From group rides to 
                maintenance workshops, we bring riders together.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AboutPage; 