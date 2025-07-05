import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { App as AntdApp } from 'antd';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="289507347461-mgafjfuj13imphhd4kdja07ukpuh7n13.apps.googleusercontent.com">
      <AuthProvider>
        <AntdApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntdApp>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
); 