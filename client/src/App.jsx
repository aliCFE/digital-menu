import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import RequireAuth from './components/admin/RequireAuth';

import CustomerMenuPage from './pages/menu/CustomerMenuPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ItemsPage from './pages/admin/ItemsPage';
import OrdersPage from './pages/admin/OrdersPage';
import SettingsPage from './pages/admin/SettingsPage';
import QrCodePage from './pages/admin/QrCodePage';
import ProfilePage from './pages/admin/ProfilePage';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/r/tannour" replace />} />
                <Route path="/r/:slug" element={<CustomerMenuPage />} />
                <Route path="/menu/:slug" element={<RedirectToR />} />

                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="items" element={<ItemsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="qr" element={<QrCodePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

function RedirectToR() {
  const slug = window.location.pathname.split('/').pop();
  return <Navigate to={`/r/${slug}`} replace />;
}
