// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './globals.css'
// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { SocialProvider } from './contexts/SocialContext';

// Common components
import { Header, ProtectedRoute, PublicRoute, OfficialRoute } from './components/common';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import CreateReport from './pages/CreateReport';
import MapView from './pages/MapView';
import SocialDashboard from './pages/SocialDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerifyReports from './components/reports/ReportVerification'; // If you also have a page wrapper, swap the import

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ReportsProvider>
        <SocialProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />

              <main className="container mx-auto px-4 py-6">
                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  {/* Protected (all authenticated users) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-report"
                    element={
                      <ProtectedRoute>
                        <CreateReport />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <ProtectedRoute>
                        <MapView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/social-dashboard"
                    element={
                      <ProtectedRoute>
                        <SocialDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Official-only */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <OfficialRoute>
                        <AdminDashboard />
                      </OfficialRoute>
                    }
                  />
                  <Route
                    path="/admin/verify-reports"
                    element={
                      <OfficialRoute>
                        <VerifyReports />
                      </OfficialRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </SocialProvider>
      </ReportsProvider>
    </AuthProvider>
  );
};

export default App;
