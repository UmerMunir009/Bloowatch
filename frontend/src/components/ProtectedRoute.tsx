import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
interface ProtectedRouteProps {
  element: React.ReactElement;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasShownToast.current) {
      showToast('Please log in first to access this page.', 'error');
      hasShownToast.current = true; 
    }
  }, [isAuthenticated, loading, showToast]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return element;
}
