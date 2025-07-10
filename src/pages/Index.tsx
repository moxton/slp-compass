
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, Clock, Shield, ArrowRight } from 'lucide-react';

const CompassLogo = () => (
  <img src="/compass.svg" alt="Compass Logo" className="w-10 h-10 inline-block align-middle mr-2" />
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center mb-2">
            <img src="/compass.svg" alt="Compass Logo" className="w-16 h-16 mb-2" />
            <h1 className="text-5xl font-bold text-blue-600">SLP Compass</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Effortless, evidence-based therapy planning for speech-language pathologists
          </p>
          <div className="flex justify-center mb-8">
            <div className="bg-white border border-blue-100 shadow-sm rounded-md px-6 py-4 text-blue-600 italic text-lg font-medium max-w-xl w-full mx-auto">
              SLP Compass saves you hours every month by writing evidence-based goals, treatment plans, and data sheets the right way, so you can spend your time where it matters - actually helping kids.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/patient'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md font-semibold transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 inline-block" />
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="border border-blue-600 text-blue-600 px-8 py-3 text-lg rounded-md font-semibold transition-colors hover:bg-blue-50"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <Card className="text-center max-w-xs w-full">
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

          <Card className="text-center max-w-xs w-full">
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

          <Card className="text-center max-w-xs w-full">
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
        <div className="flex justify-center mb-16">
          <Card className="max-w-xl w-full mx-auto">
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
        </div>

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
              <button 
                onClick={() => window.location.href = '/patient'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full sm:w-auto rounded-md font-semibold transition-colors"
              >
                Start Creating Plans Today
                <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
