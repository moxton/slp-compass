import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const handleSwitchToSignUp = () => setAuthMode('signup');
  const handleSwitchToSignIn = () => setAuthMode('signin');
  const handleForgotPassword = () => setAuthMode('forgot-password');
  const handleBackToSignIn = () => setAuthMode('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
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
  );
}; 