import React from 'react';
import { Card, Typography, Divider, Row, Col } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const TermsOfServicePage: React.FC = () => {
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
        <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Terms of Service
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          The terms and conditions governing your use of Big Bike Blitz
        </Paragraph>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </Card>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Acceptance of Terms
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              By accessing and using Big Bike Blitz, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Use License
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              Permission is granted to temporarily download one copy of the materials on Big Bike Blitz 
              for personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title, and under this license you may not:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software on the website</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              User Accounts
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for safeguarding the password and for all activities that occur 
              under your account. You agree to:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Not share your account credentials with others</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Product Information
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We strive to provide accurate product information, but we do not warrant that product 
              descriptions, prices, or other content is accurate, complete, reliable, current, or 
              error-free. If a product offered by us is not as described, your sole remedy is to 
              contact us for a refund or exchange.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Payment Terms
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              All purchases are subject to our payment terms:
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Payment is due at the time of purchase</li>
              <li>We accept major credit cards and other payment methods</li>
              <li>Prices are subject to change without notice</li>
              <li>Sales tax will be added where applicable</li>
              <li>Refunds are processed according to our refund policy</li>
            </ul>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Limitation of Liability
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              In no event shall Big Bike Blitz or its suppliers be liable for any damages arising 
              out of the use or inability to use the materials on our website, even if we have been 
              notified orally or in writing of the possibility of such damage.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Governing Law
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              These terms and conditions are governed by and construed in accordance with the laws 
              of the jurisdiction in which Big Bike Blitz operates, and you irrevocably submit to 
              the exclusive jurisdiction of the courts in that location.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <CheckCircleOutlined style={{ marginRight: 8 }} />
              Key Points
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Text strong>Account Security:</Text>
                <br />
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Keep your login credentials secure
                </Text>
              </div>
              <div>
                <Text strong>Payment:</Text>
                <br />
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Due at time of purchase
                </Text>
              </div>
              <div>
                <Text strong>Returns:</Text>
                <br />
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Subject to our refund policy
                </Text>
              </div>
            </div>
          </Card>

          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              <ExclamationCircleOutlined style={{ marginRight: 8 }} />
              Contact Support
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              If you have questions about these terms, please contact us:
            </Paragraph>
            <div style={{ marginTop: 16 }}>
              <Text strong>Email:</Text> legal@bigbikeblitz.com<br />
              <Text strong>Phone:</Text> +1 (555) 123-4567<br />
              <Text strong>Address:</Text> Dai Nam racecourse
            </div>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              Related Documents
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/privacy" style={{ color: '#1677ff', textDecoration: 'none' }}>
                Privacy Policy
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

export default TermsOfServicePage; 