import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, CreditCard, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NavButton = ({ to, children, variant = 'primary' }) => {
  const base = 'font-medium px-4 py-2 rounded-md transition-colors';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    outline:
      'text-blue-600 border border-blue-600 hover:bg-blue-50 ' +
      'dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30',
    text: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
  };

  return (
    <Link to={to}>
      <button className={`${base} ${variants[variant]}`}>{children}</button>
    </Link>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const promotionData = {
    text: 'Get 2% cashback on all transactions this month!',
    link: '/promotions/cashback-offer',
    ctaText: 'Learn More',
  };

  return (
    <div className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-4 py-2 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
            <p className="flex items-center gap-2">
              <span>{promotionData.text}</span>
              <a
                href={promotionData.link}
                className="underline font-semibold hover:no-underline"
              >
                {promotionData.ctaText}
              </a>
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1"
              aria-label="Close announcement"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Money Manager
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Globe size={18} />
                <span className="text-sm">EN</span>
              </button>
              <NavButton to="/login" variant="text">
                Log In
              </NavButton>
              <NavButton to="/register" variant="primary">
                Sign Up
              </NavButton>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 space-y-3 flex flex-col items-center">
              <NavButton to="/login" variant="outline">
                Log In
              </NavButton>
              <NavButton to="/register" variant="primary">
                Sign Up
              </NavButton>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;