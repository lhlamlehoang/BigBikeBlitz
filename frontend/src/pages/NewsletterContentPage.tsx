import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Duplicate the articles array from MagazinePage (for demo; ideally import or fetch from backend)
const articles = [
  {
    id: 1,
    title: 'BMW S1000RR: The Ultimate Sport Bike Experience',
    excerpt: 'Discover why the BMW S1000RR continues to dominate the sport bike segment with its cutting-edge technology and unmatched performance.',
    content: `The BMW S1000RR is a marvel of engineering, blending raw power with advanced electronics to deliver an exhilarating ride.\n\n**Key Features:**\n- 205 HP inline-four engine\n- Dynamic Traction Control\n- Multiple riding modes (Rain, Road, Dynamic, Race)\n- Lightweight aluminum frame\n\nWhether you're carving up the track or enjoying a spirited ride on the open road, the S1000RR offers unmatched agility and confidence.\n\n**Why Riders Love It:**\n- Razor-sharp handling\n- Superb braking performance\n- Intuitive electronics suite\n\n*"The S1000RR is the ultimate sport bike for those who demand the best."*`,
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
    content: `Winter can be tough on motorcycles, but with the right care, your bike will be ready to ride when spring arrives.\n\n**Top 10 Tips:**\n1. Clean and lubricate your chain regularly.\n2. Check tire pressure and tread depth.\n3. Use a battery tender to keep your battery charged.\n4. Change the oil and filter before storage.\n5. Add fuel stabilizer to prevent fuel degradation.\n6. Cover your bike to protect it from dust and moisture.\n7. Inspect brake pads and fluid levels.\n8. Keep your bike on a stand to avoid flat spots on tires.\n9. Check coolant and antifreeze levels.\n10. Start your bike occasionally to circulate fluids.\n\nFollowing these tips will ensure your motorcycle stays in top shape all winter long!`,
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
    content: `Electric motorcycles are gaining traction as technology advances. In 2024, expect to see:\n\n- **Longer range batteries**: New chemistries offer up to 300 miles per charge.\n- **Faster charging**: 80% charge in under 30 minutes.\n- **More affordable models**: Entry-level electrics for new riders.\n- **Smart connectivity**: Integrated apps and ride analytics.\n\n**Industry Leaders:**\n- Zero Motorcycles\n- Energica\n- Harley-Davidson LiveWire\n\nThe future is bright for electric two-wheelers, with more options and better performance than ever before.`,
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
    content: `Our cross-country adventure took us from the Atlantic to the Pacific, covering over 4,000 miles.\n\n**Highlights:**\n- The Blue Ridge Parkway\n- Route 66\n- Rocky Mountain National Park\n- Pacific Coast Highway\n\n**Travel Tips:**\n- Pack light but bring rain gear.\n- Plan fuel stops in remote areas.\n- Stay flexible—unexpected detours can lead to the best memories.\n\n*"The freedom of the open road is like nothing else."*`,
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
    content: `The Honda Gold Wing is synonymous with comfort and innovation.\n\n**What Makes It Special:**\n- Plush seating for rider and passenger\n- Integrated navigation and audio system\n- Smooth six-cylinder engine\n- Ample luggage space\n\n**Touring Experience:**\nRiders praise the Gold Wing for its effortless cruising and advanced features, making long journeys a pleasure.\n\nIf you crave luxury on two wheels, the Gold Wing is the ultimate choice.`,
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
    content: `Riding safely starts with the right gear. Here are the essentials every rider should have:\n\n- **Helmet**: DOT or ECE certified for maximum protection.\n- **Jacket**: Abrasion-resistant with armor in key areas.\n- **Gloves**: Full-fingered and padded for grip and safety.\n- **Pants**: Reinforced or armored for lower body protection.\n- **Boots**: Over-the-ankle with non-slip soles.\n\n**Pro Tip:**\nInvest in high-visibility gear and always check your equipment before every ride.\n\nStay safe and enjoy the ride!`,
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

const NewsletterContentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === Number(id));

  if (!article) return <div style={{ textAlign: 'center', marginTop: 64 }}>Article not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>Back</Button>
      <Card>
        <img src={article.image} alt={article.title} style={{ width: '100%', borderRadius: 12, marginBottom: 24 }} />
        <Title>{article.title}</Title>
        <div style={{ marginBottom: 12 }}>
          {article.tags.map(tag => (
            <Tag key={tag} color="blue" style={{ marginRight: 4 }}>{tag}</Tag>
          ))}
        </div>
        <Text type="secondary">{article.author} • {article.date} • {article.readTime}</Text>
        <Paragraph style={{ marginTop: 24 }}>{article.content}</Paragraph>
      </Card>
    </div>
  );
};

export default NewsletterContentPage; 