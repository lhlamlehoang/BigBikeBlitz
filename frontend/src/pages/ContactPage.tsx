import React, { useState } from 'react';
import { Card, Typography, Row, Col, Form, Input, Button, message, Divider } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <PhoneOutlined />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'info@bigbikeblitz.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: <EnvironmentOutlined />,
      title: 'Address',
      content: '123 Motorcycle Ave, Bike City, BC 12345',
      subtitle: 'Visit our showroom'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM',
      subtitle: 'Saturday: 10:00 AM - 4:00 PM'
    }
  ];

  const departments = [
    {
      name: 'Sales',
      email: 'sales@bigbikeblitz.com',
      phone: '+1 (555) 123-4568',
      description: 'Questions about our motorcycles and pricing'
    },
    {
      name: 'Service',
      email: 'service@bigbikeblitz.com',
      phone: '+1 (555) 123-4569',
      description: 'Maintenance, repairs, and technical support'
    },
    {
      name: 'Support',
      email: 'support@bigbikeblitz.com',
      phone: '+1 (555) 123-4570',
      description: 'General inquiries and customer service'
    }
  ];

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Thank you for your message! We\'ll get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <MessageOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Contact Us
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          Get in touch with our team. We're here to help with all your motorcycle needs.
        </Paragraph>
      </Card>

      {/* Contact Information */}
      <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
        {contactInfo.map((info, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={{ textAlign: 'center', borderRadius: 12, height: '100%' }}>
              <div style={{ 
                fontSize: 32, 
                color: '#1677ff', 
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'center'
              }}>
                {info.icon}
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>{info.title}</Title>
              <Text style={{ fontSize: 16, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {info.content}
              </Text>
              <Text style={{ color: '#666', fontSize: 14 }}>{info.subtitle}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[32, 32]}>
        {/* Contact Form */}
        <Col xs={24} lg={14}>
          <Card title="Send us a Message" style={{ borderRadius: 12 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Your first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Your last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="your.email@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Your phone number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input prefix={<MessageOutlined />} placeholder="What can we help you with?" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  style={{ resize: 'vertical' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SendOutlined />}
                  style={{ width: '100%' }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Department Contacts */}
        <Col xs={24} lg={10}>
          <Card title="Contact by Department" style={{ borderRadius: 12, marginBottom: 24 }}>
            {departments.map((dept, index) => (
              <div key={index} style={{ marginBottom: index < departments.length - 1 ? 24 : 0 }}>
                <Title level={5} style={{ marginBottom: 8, color: '#1677ff' }}>
                  {dept.name}
                </Title>
                <Paragraph style={{ color: '#666', marginBottom: 8 }}>
                  {dept.description}
                </Paragraph>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: 600 }}>Email: </Text>
                  <Text>{dept.email}</Text>
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Phone: </Text>
                  <Text>{dept.phone}</Text>
                </div>
                {index < departments.length - 1 && <Divider style={{ margin: '16px 0' }} />}
              </div>
            ))}
          </Card>

          {/* Location Card */}
          <Card title="Visit Our Showroom" style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 8 }} />
              <Text style={{ fontWeight: 600 }}>Address:</Text>
            </div>
            <Paragraph style={{ marginBottom: 16 }}>
              123 Motorcycle Ave<br />
              Bike City, BC 12345<br />
              United States
            </Paragraph>
            
            <div style={{ marginBottom: 16 }}>
              <ClockCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />
              <Text style={{ fontWeight: 600 }}>Hours:</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text>Monday - Friday: 9:00 AM - 6:00 PM</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text>Saturday: 10:00 AM - 4:00 PM</Text>
            </div>
            <div>
              <Text>Sunday: Closed</Text>
            </div>

            <Button 
              type="primary" 
              block 
              style={{ marginTop: 16 }}
              icon={<HomeOutlined />}
            >
              Get Directions
            </Button>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Card title="Frequently Asked Questions" style={{ marginTop: 32, borderRadius: 12 }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 8 }}>How can I schedule a test ride?</Title>
              <Paragraph style={{ color: '#666' }}>
                Contact our sales department to schedule a test ride. We'll need your driver's license 
                and proof of insurance. Test rides are available during business hours.
              </Paragraph>
            </div>
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 8 }}>Do you offer financing options?</Title>
              <Paragraph style={{ color: '#666' }}>
                Yes, we offer competitive financing options through our partner lenders. 
                Contact our sales team to discuss available options and get pre-approved.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 8 }}>What warranty do you provide?</Title>
              <Paragraph style={{ color: '#666' }}>
                All our motorcycles come with manufacturer warranty. We also offer extended 
                warranty options for additional peace of mind.
              </Paragraph>
            </div>
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 8 }}>Do you provide maintenance services?</Title>
              <Paragraph style={{ color: '#666' }}>
                Yes, our certified technicians provide comprehensive maintenance and repair 
                services for all motorcycle brands we carry.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ContactPage; 