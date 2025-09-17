import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupForm } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui';
import { APP_NAME } from '../../utils/constants';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignupSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-green-600 to-teal-800">
        <div className="text-center text-white px-8">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Help protect coastal communities by reporting ocean hazards
          </p>
          
          <div className="space-y-6 max-w-sm">
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">🌊 Report Hazards</h3>
              <p className="text-green-100">
                Quickly report tsunamis, storm surges, and coastal flooding to alert authorities and communities.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">📈 Track Progress</h3>
              <p className="text-green-100">
                Monitor the status of your reports and see how they help improve community safety.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-2">🤝 Collaborate</h3>
              <p className="text-green-100">
                Work with officials, analysts, and other citizens to build a comprehensive hazard database.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              {APP_NAME}
            </h1>
            <p className="text-gray-600">
              Create your account to get started
            </p>
          </div>

          <Card padding="lg">
            <SignupForm onSuccess={handleSignupSuccess} />
          </Card>

          {/* Additional Content */}
          <div className="text-center space-y-4">
            <div>
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Already have an account? Sign in here
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Why join our platform?
              </h3>
              <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Report hazards in real-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Access verified hazard data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Contribute to community safety</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Collaborate with officials</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
