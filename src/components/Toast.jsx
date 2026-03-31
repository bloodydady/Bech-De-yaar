import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        className: 'font-sans font-medium',
        duration: 3000,
        style: {
          background: '#1C2F5E',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(28, 47, 94, 0.4)',
        },
        success: {
          duration: 3000,
          style: {
            background: '#22C55E',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#22C55E',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#E84040',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#E84040',
          },
        },
      }}
    />
  );
};

export default Toast;
