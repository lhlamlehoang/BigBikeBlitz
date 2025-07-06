import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, Typography, Result } from 'antd';
import { ReloadOutlined, HomeOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleContactSupport = () => {
    window.location.href = '/contact';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f7f9fb',
          padding: '20px'
        }}>
          <Card style={{ 
            maxWidth: 600, 
            width: '100%', 
            textAlign: 'center',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(22,119,255,0.1)'
          }}>
            <Result
              status="500"
              title="Oops! Something went wrong"
              subTitle="We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue."
              extra={[
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={this.handleReload}
                  size="large"
                  key="reload"
                  style={{ marginRight: 8 }}
                >
                  Reload Page
                </Button>,
                <Button 
                  icon={<HomeOutlined />} 
                  onClick={this.handleGoHome}
                  size="large"
                  key="home"
                  style={{ marginRight: 8 }}
                >
                  Go Home
                </Button>,
                <Button 
                  icon={<CustomerServiceOutlined />} 
                  onClick={this.handleContactSupport}
                  size="large"
                  key="support"
                >
                  Contact Support
                </Button>
              ]}
            />
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ 
                marginTop: 32, 
                textAlign: 'left',
                background: '#f5f5f5',
                padding: 16,
                borderRadius: 8,
                fontSize: 12,
                fontFamily: 'monospace'
              }}>
                <Title level={5}>Error Details (Development Only):</Title>
                <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                </Paragraph>
                {this.state.errorInfo && (
                  <Paragraph style={{ fontSize: 12 }}>
                    <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                  </Paragraph>
                )}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 