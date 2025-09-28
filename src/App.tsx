import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './globals.css';
//@ts-ignore
import otherBg from './assets/otherbg.jpg';
// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { SocialProvider } from './contexts/SocialContext';
// Common components
//@ts-ignore
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
import VerifyReports from './components/reports/ReportVerification';
import About from './pages/About';



// Subtle texture overlay for all pages except About, Login, Signup
const SubtleTexture: React.FC = () => (
  <div className="bg-texture" aria-hidden="true" />
);


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full flex flex-col bg-white relative">
    <SubtleTexture />
    <main className="flex-1 relative z-10 container mx-auto px-2 sm:px-4 py-8">
      {children}
    </main>
  </div>
);


const App: React.FC = () => {
  return (
  <div className="min-h-screen w-full bg-white flex flex-col">
    <AuthProvider>
      <ReportsProvider>
        <SocialProvider>
          <Router>
            <Header />
            <Routes>
              {/* Public Routes - Always accessible (do not apply MainLayout or texture) */}
              <Route path="/about" element={<About />} />
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

              {/* Main content pages use MainLayout and texture */}
              <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><MainLayout><Reports /></MainLayout></ProtectedRoute>} />
              <Route path="/create-report" element={<ProtectedRoute><MainLayout><CreateReport /></MainLayout></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><MainLayout><MapView /></MainLayout></ProtectedRoute>} />
              <Route path="/social-dashboard" element={<ProtectedRoute><MainLayout><SocialDashboard /></MainLayout></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />
              <Route path="/admin/verify-reports" element={<ProtectedRoute><MainLayout><VerifyReports /></MainLayout></ProtectedRoute>} />
              {/* Default and Catch-all */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </SocialProvider>
      </ReportsProvider>
    </AuthProvider>
  </div>
  );
};

export default App;