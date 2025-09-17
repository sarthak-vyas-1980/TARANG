import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ReportsProvider } from './ReportsContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <AuthProvider>
    <ReportsProvider>{children}</ReportsProvider>
  </AuthProvider>
);
