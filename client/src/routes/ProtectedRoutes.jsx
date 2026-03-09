import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user } = useContext(AuthContext);

  // ইউজার না থাকলে লগিন পেজে পাঠিয়ে দিবে, থাকলে চাইল্ড রাউট (Outlet) রেন্ডার করবে
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
