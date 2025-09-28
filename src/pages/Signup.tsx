
import React from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';
//@ts-ignore
import { GlassButton } from '../components/ui';
import tsunamiBg from '../assets/tsunami.jpg';

const Signup: React.FC = () => {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-base text-blue-700">
              Join the Ocean Hazard Reporting Platform
            </p>
          </div>

          {/* Signup Form */}
          <div className="mt-8">
            <SignupForm />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-blue-700">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
