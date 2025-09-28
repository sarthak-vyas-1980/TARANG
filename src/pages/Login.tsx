
import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
//@ts-ignore
import { GlassButton } from '../components/ui';
import tsunamiBg from '../assets/tsunami.jpg';

const Login: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Full viewport background image */}
      <div
        className="fixed inset-0 w-screen h-screen"
        style={{
          backgroundImage: `url(${tsunamiBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 glass-card p-8">
          {/* Header */}
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 shadow">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-base text-blue-700">
              Access the Ocean Hazard Reporting Platform
            </p>
          </div>

          {/* Login Form */}
          <div className="mt-8">
            <LoginForm />
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-blue-700">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-blue-600 hover:underline transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-blue-600">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure Login
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Role-Based Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
