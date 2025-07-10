import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Sparkles, Target, Clock, Shield, ArrowRight } from 'lucide-react';

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-10 h-10 inline-block align-middle mr-2" />
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-600 mb-6 flex items-center justify-center gap-3">
            <CompassLogo />
            <span>SLP Compass</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Effortless, evidence-based therapy planning for speech-language pathologists
          </p>
          <p className="text-lg text-blue-600 italic font-medium mb-8">
            SLP Compass saves you hours every month by writing evidence-based goals, treatment plans, and data sheets the right way, so you can spend your time where it matters - actually helping kids.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate evidence-based therapy goals, objectives, and treatment protocols in minutes, not hours.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>SMART Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create specific, measurable, achievable, relevant, and time-bound objectives that drive progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Focus on what matters most - your patients. Let SLP Compass handle the documentation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Built for Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="text-base">
              SLP Compass is designed with confidentiality in mind. We never store protected health information (PHI) 
              or personally identifiable information (PII). Use initials or codes only, and maintain full compliance 
              with HIPAA and other privacy regulations.
            </CardDescription>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Transform Your Therapy Planning?</CardTitle>
              <CardDescription>
                Join hundreds of speech-language pathologists who are already saving time and improving outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full sm:w-auto"
                onClick={() => window.location.href = '/auth'}
              >
                Start Creating Plans Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 