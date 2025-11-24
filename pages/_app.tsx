// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/components/shared/Notification';
import React from 'react';

// We create a new component that has access to the AuthContext
function AppContent({ Component, pageProps }: AppProps) {
  const { notification, hideNotification } = useAuth(); // Get notification state

  return (
    <>
      <Component {...pageProps} />
      {/* If a notification exists, render it */}
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </>
  );
}

// We wrap our new AppContent in the provider
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}