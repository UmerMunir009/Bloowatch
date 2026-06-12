import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { ToastType } from '../utils/constants';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      showToast('Please log in first to access this page.', ToastType.Error);
      hasShownToast.current = true; 
    }
  }, [isAuthenticated, showToast]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
}