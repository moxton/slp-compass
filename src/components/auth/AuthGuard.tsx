import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import LandingPage from '@/pages/LandingPage';
import ProtectedIndex from '@/pages/ProtectedIndex';

export const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <ProtectedIndex />;
  }

  return <LandingPage />;
}; 