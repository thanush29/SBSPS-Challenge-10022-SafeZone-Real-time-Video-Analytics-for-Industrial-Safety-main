import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Video, Camera, Home, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Video Detection', href: '/video', icon: Video },
    { name: 'Live Webcam', href: '/webcam', icon: Camera },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/home' && location.pathname === '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SafeZone</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">SafeZone</span>
              </div>
              <p className="mt-4 text-gray-300 text-sm leading-6">
                Advanced real-time video analytics for industrial safety monitoring using YOLOv8 object detection.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Features</h3>
              <ul className="mt-4 space-y-2">
                <li><span className="text-gray-300 text-sm">Real-time PPE Detection</span></li>
                <li><span className="text-gray-300 text-sm">Live Video Monitoring</span></li>
                <li><span className="text-gray-300 text-sm">Safety Compliance Tracking</span></li>
                <li><span className="text-gray-300 text-sm">Accident Prevention</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Technology</h3>
              <ul className="mt-4 space-y-2">
                <li><span className="text-gray-300 text-sm">YOLOv8 Object Detection</span></li>
                <li><span className="text-gray-300 text-sm">Deep Learning</span></li>
                <li><span className="text-gray-300 text-sm">Computer Vision</span></li>
                <li><span className="text-gray-300 text-sm">Real-time Processing</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              © 2024 SafeZone. Built for industrial safety monitoring and accident prevention.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;