import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  text = 'Loading Big Bike Blitz...',
  fullScreen = false 
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#1677ff' }} spin />;

  const content = (
    <div style={{ 
      textAlign: 'center', 
      padding: fullScreen ? '20vh 0' : '40px 0',
      background: fullScreen ? '#f7f9fb' : 'transparent',
      minHeight: fullScreen ? '100vh' : 'auto'
    }}>
      <Spin indicator={antIcon} size={size} />
      <div style={{ 
        marginTop: 16, 
        color: '#666', 
        fontSize: 16,
        fontWeight: 500 
      }}>
        {text}
      </div>
      <div style={{ 
        marginTop: 8, 
        color: '#999', 
        fontSize: 14 
      }}>
        Your premium motorcycle experience is loading...
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#f7f9fb'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner; 