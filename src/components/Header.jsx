import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  Menu, 
  X, 
  CreditCard,
  Globe
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Simulated promotion data - in real app this would come from an API
  const hasActivePromotion = true;
  const promotionData = {
    text: "Get 2% cashback on all transactions this month!",
    link: "/promotions/cashback-offer",
    ctaText: "Learn More"
  };

  return (
    <div className="w-full">
      {/* Announcement Bar */}
      {hasActivePromotion && showAnnouncement && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{promotionData.text}</span>
              <a 
                href={promotionData.link}
                className="underline hover:no-underline font-semibold"
              >
                {promotionData.ctaText}
              </a>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <LinkContainer to="/home">
                  <span className="text-xl font-bold text-gray-900">Money Manager</span>
                  </LinkContainer>
                </div>
              </div>
            </div>


            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <button className="hidden md:flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                <Globe size={18} />
                <span className="text-sm">EN</span>
              </button>

              {/* Login & Register Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <LinkContainer to="/login">
                <button className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Log In
                </button>
                </LinkContainer>
                <LinkContainer to="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors shadow-sm">
                  Sign Up
                </button>
                </LinkContainer>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Language Selector */}
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 py-2 transition-colors">
                <Globe size={18} />
                <span className="text-sm">English</span>
              </button>

              {/* Mobile Login & Register */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors">
                  Log In
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;