import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Building2, 
  Image, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  Newspaper,
  Globe,
  Zap
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Properties',
      href: '/admin/properties',
      icon: Building2
    },
    {
      name: 'Our Projects',
      href: '/admin/our-projects',
      icon: Building2
    },
    {
      name: 'Budget Homes',
      href: '/admin/budget-homes',
      icon: HomeIcon
    },
    {
      name: 'Home Banners',
      href: '/admin/banners',
      icon: Image
    },
    {
      name: 'Testimonials',
      href: '/admin/testimonials',
      icon: MessageSquare
    },
    {
      name: 'Amenities',
      href: '/admin/amenities',
      icon: Zap
    },
    {
      name: 'Happy Clients',
      href: '/admin/happy-clients',
      icon: Users
    },
    {
      name: 'News & Events',
      href: '/admin/news-events',
      icon: Newspaper
    },
    {
      name: 'NRI Corner',
      href: '/admin/nri-corner',
      icon: Globe
    },
    {
      name: 'Contact Info',
      href: '/admin/contact',
      icon: Phone
    },
    {
      name: 'Contact Forms',
      href: '/admin/submissions',
      icon: Mail
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-kmk-navy transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-kmk-navy border-b border-kmk-gold/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-kmk-gold rounded-lg flex items-center justify-center">
                <span className="text-kmk-navy font-bold text-sm">KMK</span>
              </div>
              <span className="text-white font-semibold">CMS Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-kmk-gold"
            >
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-kmk-gold/20">
            <div className="text-white">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-300">{user?.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-kmk-gold text-kmk-navy'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-kmk-gold/20">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link
                to="/"
                target="_blank"
                className="text-sm font-medium text-gray-700 hover:text-kmk-gold"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;