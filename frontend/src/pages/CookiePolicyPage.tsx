import React from 'react';
import { Card, Typography, Divider, Row, Col, Button } from 'antd';
import { SettingOutlined, InfoCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const CookiePolicyPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ 
        background: 'linear-gradient(135deg, #1677ff 0%, #003580 100%)', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: 32,
        borderRadius: 16
      }}>
        <SafetyCertificateOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Cookie Policy
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          How we use cookies and similar technologies on our website
        </Paragraph>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </Card>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              What Are Cookies?
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing how you use our site, and personalizing content.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Types of Cookies We Use
            </Title>
            
            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 12, color: '#1677ff' }}>
                Essential Cookies
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                These cookies are necessary for the website to function properly. They enable basic 
                functions like page navigation, access to secure areas, and shopping cart functionality.
              </Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 12, color: '#1677ff' }}>
                Performance Cookies
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously. This helps us improve our website performance.
              </Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 12, color: '#1677ff' }}>
                Functional Cookies
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                These cookies enable enhanced functionality and personalization, such as remembering 
                your language preferences and login status.
              </Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 12, color: '#1677ff' }}>
                Marketing Cookies
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                These cookies are used to track visitors across websites to display relevant and 
                engaging advertisements.
              </Paragraph>
            </div>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              How We Use Cookies
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We use cookies for the following purposes:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>To remember your preferences and settings</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To provide personalized content and recommendations</li>
              <li>To improve our website functionality and user experience</li>
              <li>To process your orders and maintain your shopping cart</li>
              <li>To provide customer support and security features</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Third-Party Cookies
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We may also use third-party cookies from trusted partners for:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Analytics and performance monitoring</li>
              <li>Payment processing and security</li>
              <li>Social media integration</li>
              <li>Advertising and marketing</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Managing Your Cookie Preferences
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              You can control and manage cookies in several ways:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Browser settings: Most browsers allow you to block or delete cookies</li>
              <li>Cookie consent: Use our cookie consent banner to manage preferences</li>
              <li>Third-party opt-outs: Visit third-party websites to opt out of their cookies</li>
              <li>Contact us: Reach out if you need help managing your preferences</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Updates to This Policy
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any 
              material changes by posting the new policy on our website.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Contact Us
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              If you have questions about our use of cookies, please contact us:
            </Paragraph>
            <div style={{ marginTop: 16 }}>
              <Text strong>Email:</Text> privacy@bigbikeblitz.com<br />
              <Text strong>Phone:</Text> +1 (555) 123-4567<br />
              <Text strong>Address:</Text> Dai Nam racecourse
            </div>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              Related Policies
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/privacy" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/contact" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CookiePolicyPage; 