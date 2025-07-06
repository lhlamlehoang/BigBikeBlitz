import React from 'react';
import { Card, Typography, Divider, Row, Col } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicyPage: React.FC = () => {
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
        <SecurityScanOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Privacy Policy
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          How we collect, use, and protect your personal information
        </Paragraph>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </Card>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Information We Collect
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support. This may include:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Name, email address, and contact information</li>
              <li>Payment and billing information</li>
              <li>Purchase history and preferences</li>
              <li>Communications with our customer service team</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              How We Use Your Information
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We use the information we collect to:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Process your orders and payments</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send you updates about your orders and account</li>
              <li>Improve our products and services</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Information Sharing
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except in the following circumstances:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist in our operations</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Data Security
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Your Rights
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              You have the right to:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <LockOutlined style={{ marginRight: 8 }} />
              Contact Us
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us:
            </Paragraph>
            <div style={{ marginTop: 16 }}>
              <Text strong>Email:</Text> privacy@bigbikeblitz.com<br />
              <Text strong>Phone:</Text> +1 (555) 123-4567<br />
              <Text strong>Address:</Text> Dai Nam racecourse
            </div>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <SafetyCertificateOutlined style={{ marginRight: 8 }} />
              Quick Links
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/terms" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/cookies" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Cookie Policy
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

export default PrivacyPolicyPage; 