import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // loading সত্য হলে কিছু দেখাবে না (Context cookie থেকে user load করছে)
  if (loading) return null;

  // user থাকলে ভেতরে যাবে, না থাকলে login এ পাঠাবে
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
