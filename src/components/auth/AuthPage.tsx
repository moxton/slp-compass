import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-8 h-8" />
);

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const handleSwitchToSignUp = () => setAuthMode('signup');
  const handleSwitchToSignIn = () => setAuthMode('signin');
  const handleForgotPassword = () => setAuthMode('forgot-password');
  const handleBackToSignIn = () => setAuthMode('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                <CompassLogo />
                <span className="text-xl font-semibold text-blue-600">SLP Compass</span>
              </a>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Content */}
      <div className="flex items-center justify-center p-4 flex-1">
        <div className="w-full max-w-md">
          {authMode === 'signin' && (
            <SignInForm
              onSwitchToSignUp={handleSwitchToSignUp}
              onForgotPassword={handleForgotPassword}
            />
          )}
          
          {authMode === 'signup' && (
            <SignUpForm onSwitchToSignIn={handleSwitchToSignIn} />
          )}
          
          {authMode === 'forgot-password' && (
            <ForgotPasswordForm onBackToSignIn={handleBackToSignIn} />
          )}
        </div>
      </div>
    </div>
  );
}; 