// src/components/common/Header.tsx
import React from 'react';
import logo from '../../assets/logo.jpg';
import { GlassButton } from '../ui';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  Waves, Home, FileText, MapPin, PlusCircle,
  Shield, LogOut, User as UserIcon, BarChart3, CheckCircle
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuthContext();
  const location = useLocation();

  // Don't render navigation links while auth is loading
  if (isLoading) {
    return (
      <header className="glass-card shadow-lg border-b border-white/30">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Coast-Connect Logo" className="w-10 h-10 rounded-lg shadow" />
            <div>
              <Link to="/about" className="text-xl font-bold text-blue-900 hover:text-blue-600">
                Coast
                Connect
              </Link>
              
            </div>
          </div>
          {/* Loading indicator */}
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-500">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  const isOfficial = user?.role === 'official';

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm"
      style={{ WebkitBackdropFilter: 'blur(0px)', backdropFilter: 'none' }}
    >
  <div className="container mx-auto flex items-center justify-between h-20 px-4">
    {/* App Name Leftmost */}
    <div className="flex-shrink-0">
      <Link to={user ? "/dashboard" : "/about"} className="text-2xl font-extrabold tracking-tight text-primary hover:text-secondary leading-tight block" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
        <span className="block">Coast</span>
        <span className="block">Connect</span>
      </Link>
    </div>

    {/* Navigation */}
  <nav className="hidden md:flex space-x-6 items-center">
          {user ? (
            // User is authenticated - show protected links only (no About)
            <>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary underline underline-offset-4'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/reports"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === '/reports'
                    ? 'bg-primary/10 text-primary underline underline-offset-4'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </Link>
              
              <Link
                to="/create-report"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === '/create-report'
                    ? 'bg-secondary/10 text-secondary underline underline-offset-4'
                    : 'text-gray-700 hover:bg-secondary/10 hover:text-secondary'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Hazard</span>
              </Link>
              
              <Link
                to="/map"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === '/map'
                    ? 'bg-primary/10 text-primary underline underline-offset-4'
                    : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Map View</span>
              </Link>

              {/* Official-only links */}
              {isOfficial && (
                <>
                  <Link
                    to="/admin/verify-reports"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                      location.pathname === '/admin/verify-reports'
                        ? 'bg-primary/10 text-primary underline underline-offset-4'
                        : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify Reports</span>
                  </Link>
                  
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                      location.pathname === '/admin/dashboard'
                        ? 'bg-primary/10 text-primary underline underline-offset-4'
                        : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </>
              )}
            </>
          ) : (
            // User is NOT authenticated - show About + Login/Signup
            <>
              <Link to="/about">
                <GlassButton
                  className={`flex items-center space-x-1 px-3 py-2 rounded shadow-none bg-transparent border-none text-blue-900 hover:text-blue-700 hover:bg-blue-50 transition-colors ${
                    location.pathname === '/about' ? 'font-bold underline' : ''
                  }`}
                  style={{ boxShadow: 'none', background: 'none' }}
                >
                  <Home className="w-4 h-4" />
                  <span>About</span>
                </GlassButton>
              </Link>
              <Link to="/login">
                <GlassButton
                  className={`flex items-center space-x-1 px-3 py-2 rounded shadow-none bg-transparent border-none text-blue-900 hover:text-blue-700 hover:bg-blue-50 transition-colors ${
                    location.pathname === '/login' ? 'font-bold underline' : ''
                  }`}
                  style={{ boxShadow: 'none', background: 'none' }}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </GlassButton>
              </Link>
              <Link to="/signup">
                <GlassButton
                  className={`flex items-center space-x-1 px-3 py-2 rounded shadow-none bg-transparent border-none text-blue-900 hover:text-blue-700 hover:bg-blue-50 transition-colors ${
                    location.pathname === '/signup' ? 'font-bold underline' : ''
                  }`}
                  style={{ boxShadow: 'none', background: 'none' }}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Sign Up</span>
                </GlassButton>
              </Link>
            </>
          )}
        </nav>

        {/* Right side - User menu or Login buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            // User is authenticated - show user menu
            <>
              {isOfficial && (
                <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Official
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-black">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <GlassButton
                onClick={logout}
                className="flex items-center space-x-1 bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 text-sm rounded-md"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </GlassButton>
            </>
          ) : (
            // User is NOT authenticated - show login buttons (mobile)
            <div className="flex items-center space-x-2 md:hidden">
              <Link
                to="/login"
                className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
  <div className="md:hidden border-t border-gray-200 px-4 py-2 bg-white mt-1">
        <div className="flex space-x-4 overflow-x-auto">
          {user ? (
            // Authenticated mobile navigation (no About)
            <>
              <Link
                to="/dashboard"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/reports'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                Reports
              </Link>
              <Link
                to="/map"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/map'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                Map
              </Link>
              {isOfficial && (
                <Link
                  to="/admin/verify-reports"
                  className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                    location.pathname === '/admin/verify-reports'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600'
                  }`}
                >
                  Verify
                </Link>
              )}
            </>
          ) : (
            // Public mobile navigation (includes About)
            <>
              <Link
                to="/about"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/about'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                About
              </Link>
              <Link
                to="/login"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/login'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`whitespace-nowrap px-3 py-1 text-sm rounded ${
                  location.pathname === '/signup'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
