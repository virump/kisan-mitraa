import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import CropsPage from './pages/CropsPage';
import CropDetailPage from './pages/CropDetailPage';
import DiseasesPage from './pages/DiseasesPage';
import MarketPricesPage from './pages/MarketPricesPage';
import NewsPage from './pages/NewsPage';
import SchemesPage from './pages/SchemesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCropsPage from './pages/admin/AdminCropsPage';
import AdminDiseasesPage from './pages/admin/AdminDiseasesPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminSchemesPage from './pages/admin/AdminSchemesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/crops/:id" element={<CropDetailPage />} />
          <Route path="/diseases" element={<DiseasesPage />} />
          <Route path="/market-prices" element={<MarketPricesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />

          {/* Protected Farmer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/crops" element={<AdminCropsPage />} />
            <Route path="/admin/diseases" element={<AdminDiseasesPage />} />
            <Route path="/admin/news" element={<AdminNewsPage />} />
            <Route path="/admin/schemes" element={<AdminSchemesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
