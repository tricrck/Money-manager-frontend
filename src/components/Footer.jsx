import React from 'react';
import { Container } from 'react-bootstrap';
import { Wallet } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MoneyManager</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering African communities through innovative group finance solutions.
              </p>
            </div>
            
            {[
              {
                title: "Platform",
                links: ["Features", "Group Types", "Security", "Pricing"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "FAQ", "Community"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Compliance", "Licenses"]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-white font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Built with ❤️ by Nerdware Systems Technologies Inc.
            </p>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} MoneyManager. All rights reserved. Licensed by Central Bank of Kenya.
            </p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;