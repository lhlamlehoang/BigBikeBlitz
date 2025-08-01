import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag, Button, Input, Select, Avatar, Divider } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, EyeOutlined, LikeOutlined, BookOutlined, FireOutlined, StarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const MagazinePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { value: 'all', label: 'All Articles' },
    { value: 'reviews', label: 'Bike Reviews' },
    { value: 'news', label: 'Industry News' },
    { value: 'tips', label: 'Riding Tips' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'travel', label: 'Travel Stories' }
  ];

  const articles = [
    {
      id: 1,
      title: 'BMW S1000RR: The Ultimate Sport Bike Experience',
      excerpt: 'Discover why the BMW S1000RR continues to dominate the sport bike segment with its cutting-edge technology and unmatched performance.',
      category: 'reviews',
      author: 'Mike Speed',
      date: '2024-01-15',
      readTime: '8 min read',
      views: 1247,
      likes: 89,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: true,
      tags: ['BMW', 'Sport Bike', 'Review']
    },
    {
      id: 2,
      title: 'Top 10 Motorcycle Maintenance Tips for Winter',
      excerpt: 'Keep your bike in perfect condition during the cold months with these essential maintenance tips from our expert mechanics.',
      category: 'maintenance',
      author: 'Sarah Mechanic',
      date: '2024-01-12',
      readTime: '6 min read',
      views: 892,
      likes: 67,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=250&fit=crop',
      featured: false,
      tags: ['Maintenance', 'Winter', 'Tips']
    },
    {
      id: 3,
      title: 'The Future of Electric Motorcycles: What to Expect in 2024',
      excerpt: 'Electric motorcycles are revolutionizing the industry. Learn about the latest developments and what the future holds.',
      category: 'news',
      author: 'John Tech',
      date: '2024-01-10',
      readTime: '10 min read',
      views: 1567,
      likes: 123,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: true,
      tags: ['Electric', 'Future', 'Technology']
    },
    {
      id: 4,
      title: 'Cross-Country Adventure: Riding from Coast to Coast',
      excerpt: 'Follow our epic journey across America on two wheels, exploring the most scenic routes and hidden gems.',
      category: 'travel',
      author: 'Lisa Rider',
      date: '2024-01-08',
      readTime: '12 min read',
      views: 2034,
      likes: 156,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=250&fit=crop',
      featured: false,
      tags: ['Adventure', 'Travel', 'Road Trip']
    },
    {
      id: 5,
      title: 'Honda Gold Wing: Luxury Touring Redefined',
      excerpt: 'Experience the pinnacle of touring comfort with the legendary Honda Gold Wing, a bike that sets the standard for luxury touring.',
      category: 'reviews',
      author: 'Tom Tourer',
      date: '2024-01-05',
      readTime: '9 min read',
      views: 987,
      likes: 78,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      featured: false,
      tags: ['Honda', 'Touring', 'Luxury']
    },
    {
      id: 6,
      title: 'Essential Safety Gear Every Rider Should Own',
      excerpt: 'Safety should never be compromised. Here\'s our comprehensive guide to the essential gear that could save your life.',
      category: 'tips',
      author: 'Safety Sam',
      date: '2024-01-03',
      readTime: '7 min read',
      views: 1456,
      likes: 112,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=250&fit=crop',
      featured: false,
      tags: ['Safety', 'Gear', 'Protection']
    }
  ];

  // If an ID is provided, show individual article view
  if (id) {
    const article = articles.find(a => a.id === Number(id));
    if (!article) {
      return (
        <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2}>Article not found</Title>
          <Button type="primary" onClick={() => navigate('/magazine')}>
            Back to Magazine
          </Button>
        </div>
      );
    }

    return (
      <div style={{ padding: isMobile ? '16px' : '24px', maxWidth: 800, margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/magazine')} 
          style={{ marginBottom: isMobile ? 16 : 24 }}
          size={isMobile ? "middle" : "large"}
        >
          Back to Magazine
        </Button>
        
        <Card style={{ borderRadius: isMobile ? 12 : 16 }}>
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ 
              width: '100%', 
              height: isMobile ? 200 : 300, 
              objectFit: 'cover', 
              borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0',
              marginBottom: isMobile ? 16 : 24
            }} 
          />
          
          <div style={{ padding: isMobile ? '0 16px 16px 16px' : '0 24px 24px 24px' }}>
            <div style={{ marginBottom: 16 }}>
              {article.tags.map(tag => (
                <Tag key={tag} color="blue" style={{ marginRight: 8, marginBottom: 8 }}>
                  {tag}
                </Tag>
              ))}
            </div>
            
            <Title level={isMobile ? 2 : 1} style={{ marginBottom: 16, lineHeight: 1.3, fontSize: isMobile ? '1.5rem' : '2rem' }}>
              {article.title}
            </Title>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: isMobile ? 8 : 16, 
              marginBottom: 24, 
              color: '#666' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <UserOutlined />
                <Text>{article.author}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CalendarOutlined />
                <Text>{article.date}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <EyeOutlined />
                <Text>{article.views} views</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <LikeOutlined />
                <Text>{article.likes} likes</Text>
              </div>
            </div>
            
            <Paragraph style={{ fontSize: 18, lineHeight: 1.8, color: '#333', marginBottom: 24 }}>
              {article.excerpt}
            </Paragraph>
            
            <Divider />
            
            <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 12 }}>
              <Title level={4} style={{ marginBottom: 16 }}>Article Content</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.7, color: '#555' }}>
                This is where the full article content would be displayed. In a real application, 
                this would contain the complete article text, images, and any other media content.
                <br /><br />
                For now, this is a placeholder that shows the article structure and layout.
                The actual content would be loaded from a database or CMS system.
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

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
        <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          Big Bike Blitz Magazine
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
          Your source for motorcycle news, reviews, tips, and stories from the riding community
        </Paragraph>
      </Card>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 32, borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: '100%' }}
            >
              {categories.map(category => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              size="large"
              block
              style={{
                background: 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                borderRadius: 12,
              }}
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #67e8f9 0%, #2196f3 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2196f3 0%, #67e8f9 100%)'}
              onClick={() => navigate('/categories')}
            >
              Shop Bikes
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <Title level={2} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FireOutlined style={{ color: '#ff4d4f' }} />
            Featured Articles
          </Title>
          <Row gutter={[32, 32]}>
            {featuredArticles.map(article => (
              <Col xs={24} md={12} key={article.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, height: '100%' }}
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={article.title}
                        src={article.image}
                        style={{ height: 200, objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                      />
                      <Tag 
                        color="red" 
                        style={{ 
                          position: 'absolute', 
                          top: 12, 
                          left: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        FEATURED
                      </Tag>
                    </div>
                  }
                  onClick={() => navigate(`/magazine/${article.id}`)}
                >
                  <div style={{ marginBottom: 12 }}>
                    {article.tags.map(tag => (
                      <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <Title level={4} style={{ marginBottom: 12, lineHeight: 1.4 }}>
                    {article.title}
                  </Title>
                  <Paragraph style={{ color: '#666', marginBottom: 16 }}>
                    {article.excerpt}
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <UserOutlined />
                        <Text style={{ fontSize: 12 }}>{article.author}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarOutlined />
                        <Text style={{ fontSize: 12 }}>{article.date}</Text>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <EyeOutlined />
                        <Text style={{ fontSize: 12 }}>{article.views}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <LikeOutlined />
                        <Text style={{ fontSize: 12 }}>{article.likes}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Regular Articles */}
      <div>
        <Title level={2} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarOutlined style={{ color: '#faad14' }} />
          Latest Articles
        </Title>
        <Row gutter={[32, 32]}>
          {regularArticles.map(article => (
            <Col xs={24} md={8} key={article.id}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: '100%' }}
                cover={
                  <img
                    alt={article.title}
                    src={article.image}
                    style={{ height: 180, objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                  />
                }
                onClick={() => navigate(`/magazine/${article.id}`)}
              >
                <div style={{ marginBottom: 8 }}>
                  {article.tags.slice(0, 2).map(tag => (
                    <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Title level={5} style={{ marginBottom: 8, lineHeight: 1.4 }}>
                  {article.title}
                </Title>
                <Paragraph style={{ color: '#666', marginBottom: 12, fontSize: 14 }}>
                  {article.excerpt.length > 100 ? article.excerpt.substring(0, 100) + '...' : article.excerpt}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text style={{ fontSize: 12 }}>{article.author}</Text>
                  </div>
                  <Text style={{ fontSize: 12, color: '#999' }}>{article.readTime}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MagazinePage; 