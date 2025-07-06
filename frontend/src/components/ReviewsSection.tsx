import React, { useState, useEffect } from 'react';
import { Card, Rate, Button, Input, Avatar, Typography, Row, Col, Divider, Progress, Modal, message, Space } from 'antd';
import { UserOutlined, StarFilled, StarOutlined, EditOutlined, DeleteOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Review {
  id: number;
  userId: number;
  bikeId: number;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    avatar?: string;
  };
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface ReviewsSectionProps {
  bikeId: number;
  bikeName: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ bikeId, bikeName }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userReview, setUserReview] = useState<{
    rating: number;
    title: string;
    comment: string;
  }>({
    rating: 0,
    title: '',
    comment: ''
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, [bikeId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch(`/api/bikes/${bikeId}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!userReview.rating || !userReview.title || !userReview.comment) {
      message.error('Please fill in all fields');
      return;
    }

    try {
      const endpoint = editingReview 
        ? `/api/reviews/${editingReview.id}`
        : `/api/bikes/${bikeId}/reviews`;
      
      const method = editingReview ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userReview)
      });

      if (response.ok) {
        message.success(editingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
        setShowReviewModal(false);
        setUserReview({ rating: 0, title: '', comment: '' });
        setEditingReview(null);
        loadReviews();
      } else {
        message.error('Failed to submit review');
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('Review deleted successfully!');
        loadReviews();
      } else {
        message.error('Failed to delete review');
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setUserReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowReviewModal(true);
  };

  const handleHelpful = async (reviewId: number, isHelpful: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ helpful: isHelpful })
      });

      if (response.ok) {
        loadReviews();
      }
    } catch (error) {
      console.error('Failed to vote on review:', error);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  const userHasReviewed = reviews.some(review => review.userId === user?.id);

  return (
    <div style={{ marginTop: 32 }}>
      <Title level={3}>Customer Reviews</Title>
      
      {/* Review Summary */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 'bold', color: '#1677ff' }}>
                {averageRating.toFixed(1)}
              </div>
              <Rate disabled defaultValue={averageRating} style={{ fontSize: 20 }} />
              <div style={{ marginTop: 8, color: '#666' }}>
                Based on {reviews.length} reviews
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ width: 40 }}>{rating}★</Text>
                  <Progress 
                    percent={percentage} 
                    showInfo={false} 
                    strokeColor="#1677ff"
                    style={{ flex: 1, margin: '0 12px' }}
                  />
                  <Text style={{ width: 40, textAlign: 'right' }}>{count}</Text>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Write Review Button */}
      {token && !userHasReviewed && (
        <Button 
          type="primary" 
          size="large" 
          onClick={() => setShowReviewModal(true)}
          style={{ marginBottom: 24 }}
        >
          Write a Review
        </Button>
      )}

      {/* Reviews List */}
      <div>
        {reviews.map((review) => (
          <Card key={review.id} style={{ marginBottom: 16, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar 
                  size={40} 
                  src={review.user.avatar} 
                  icon={<UserOutlined />}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{review.user.username}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Rate disabled defaultValue={review.rating} size="small" />
                    {review.verified && (
                      <Text type="success" style={{ fontSize: 12 }}>
                        ✓ Verified Purchase
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: 12 }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <Title level={5} style={{ marginBottom: 8 }}>{review.title}</Title>
            <Paragraph style={{ marginBottom: 16 }}>{review.comment}</Paragraph>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<LikeOutlined />}
                  onClick={() => handleHelpful(review.id, true)}
                >
                  Helpful ({review.helpful})
                </Button>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DislikeOutlined />}
                  onClick={() => handleHelpful(review.id, false)}
                >
                  Not Helpful ({review.notHelpful})
                </Button>
              </Space>
              
              {user?.id === review.userId && (
                <Space>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => handleEditReview(review)}
                  >
                    Edit
                  </Button>
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      <Modal
        title={editingReview ? 'Edit Review' : 'Write a Review'}
        open={showReviewModal}
        onOk={handleSubmitReview}
        onCancel={() => {
          setShowReviewModal(false);
          setUserReview({ rating: 0, title: '', comment: '' });
          setEditingReview(null);
        }}
        okText={editingReview ? 'Update Review' : 'Submit Review'}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Rating:</Text>
          <Rate 
            value={userReview.rating} 
            onChange={(value) => setUserReview(prev => ({ ...prev, rating: value }))}
            style={{ marginLeft: 12 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>Title:</Text>
          <Input
            value={userReview.title}
            onChange={(e) => setUserReview(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Summarize your experience"
            style={{ marginTop: 8 }}
          />
        </div>
        
        <div>
          <Text strong>Review:</Text>
          <TextArea
            value={userReview.comment}
            onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Share your detailed experience with this motorcycle..."
            rows={6}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ReviewsSection; 