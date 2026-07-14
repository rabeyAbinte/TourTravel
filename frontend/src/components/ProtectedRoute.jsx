import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      // Check if user is authenticated
      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // If no specific role required, just check authentication
      if (!requiredRole) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // If role is required, verify with backend
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const userRole = userData.role || 'user';
          
          // Store role in localStorage for consistency
          localStorage.setItem('userRole', userRole);
          
          // Check if user has required role
          if (userRole === requiredRole) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error verifying user role:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [token, requiredRole]);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthorized && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not authorized for specific role
  if (!isAuthorized && token) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render children
  return children;
}
