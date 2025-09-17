import React from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {showSidebar && <Navigation />}
        
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
