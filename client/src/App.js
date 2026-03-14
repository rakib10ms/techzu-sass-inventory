import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import AdminLayout from './layouts/AdminLayout';
import { StyledEngineProvider } from '@mui/material/styles';
import Login from './pages/Login';
// import HQDashboard from './pages/HQDashboard';
import POS from './pages/POSTerminal';
import MasterMenuItem from './pages/MasterMenuItem';
import OutletProducts from './pages/OutletProduct';
import SalesReport from './pages/SaleReport';

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/master-menu" element={<MasterMenuItem />} />
                <Route path="/outlet-products" element={<OutletProducts />} />
                <Route path="/sales-report" element={<SalesReport />} />
                <Route path="/pos" element={<POS outletId={1} />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StyledEngineProvider>
  );
}
