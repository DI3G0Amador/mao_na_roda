import React from 'react';
import { Navigate } from 'react-router-dom';
import { osService } from '@/services/osService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const activeUser = osService.getActiveUser();

  if (!activeUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
