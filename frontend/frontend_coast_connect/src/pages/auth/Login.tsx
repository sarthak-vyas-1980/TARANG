import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui';
import { APP_NAME } from '../../utils/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const handleLoginSuccess = () => {
    // Get the intended destination from location state
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
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
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              {APP_NAME}
            </h1>
            <p className="text-gray-600">
              Ocean hazard reporting and monitoring platform
            </p>
          </div>

          <Card padding="lg">
            <LoginForm onSuccess={handleLoginSuccess} />
          </Card>

          {/* Additional Links */}
          <div className="text-center space-y-4">
            <div>
              <Link 
                to="/signup" 
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Don't have an account? Create one here
              </Link>
            </div>
            
            <div>
              <Link 
                to="/forgot-password" 
                className="text-gray-600 hover:text-gray-500 text-sm"
              >
                Forgot your password?
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
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

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary-600 to-blue-800">
        <div className="text-center text-white px-8">
          <div className="text-6xl mb-6">🌊</div>
          <h2 className="text-3xl font-bold mb-4">
            Monitor Ocean Hazards
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Report and track coastal hazards to keep communities safe
          </p>
          
          <div className="grid grid-cols-1 gap-6 max-w-md">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                📊
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <p className="text-sm text-blue-100">Track hazards as they develop</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                👥
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Community Reports</h3>
                <p className="text-sm text-blue-100">Citizens and officials collaborate</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                🗺️
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Geographic Mapping</h3>
                <p className="text-sm text-blue-100">Visualize hazard locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
