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
    <GoogleOAuthProvider clientId="129408361066-g5s6n8v1e6ph5qm8ohpfunn73d2gkn3q.apps.googleusercontent.com">
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