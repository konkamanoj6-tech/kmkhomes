import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Amenities from './pages/Amenities';
import NRICorner from './pages/NRICorner';
import HappyClients from './pages/HappyClients';
import News from './pages/News';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminBanners from './pages/AdminBanners';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminHappyClients from './pages/AdminHappyClients';
import AdminNewsEvents from './pages/AdminNewsEvents';
import AdminNRICorner from './pages/AdminNRICorner';
import AdminContactInfo from './pages/AdminContactInfo';
import AdminSubmissions from './pages/AdminSubmissions';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Public Layout Component
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
            <Route path="/property/:id" element={<PublicLayout><PropertyDetail /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/amenities" element={<PublicLayout><Amenities /></PublicLayout>} />
            <Route path="/nri-corner" element={<PublicLayout><NRICorner /></PublicLayout>} />
            <Route path="/clients" element={<PublicLayout><HappyClients /></PublicLayout>} />
            <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="happy-clients" element={<AdminHappyClients />} />
              <Route path="news-events" element={<AdminNewsEvents />} />
              <Route path="nri-corner" element={<AdminNRICorner />} />
              <Route path="contact" element={<AdminContactInfo />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="settings" element={<div className="text-center text-gray-600 py-20">Settings - Coming Soon</div>} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;