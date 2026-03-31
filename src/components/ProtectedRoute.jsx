import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { Ban } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, userProfile, loading, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Enforce email verification
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Enforce ban
  if (userProfile?.is_banned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-red-600 mb-4">Account Suspended</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Your account has been suspended for violating our community guidelines. 
            If you believe this is a mistake, please contact support.
          </p>
          <a href="mailto:monsterproduction21@gmail.com" className="block w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition mb-3">
            Contact Support
          </a>
          <button onClick={logout} className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

