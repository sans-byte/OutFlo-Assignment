import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, MessageSquare, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Zap size={24} className="text-white" />
            <Link to="/" className="text-xl font-bold">OutFlo</Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/')}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/campaigns/new" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/campaigns/new')}`}
              >
                New Campaign
              </Link>
              <Link 
                to="/message-generator" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/message-generator')}`}
              >
                Message Generator
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-blue-500">
        <div className="flex justify-around">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 flex-1 hover:bg-blue-700 transition-colors ${isActive('/')}`}
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/campaigns/new" 
            className={`flex flex-col items-center py-2 flex-1 hover:bg-blue-700 transition-colors ${isActive('/campaigns/new')}`}
          >
            <Zap size={20} />
            <span className="text-xs mt-1">New</span>
          </Link>
          <Link 
            to="/message-generator" 
            className={`flex flex-col items-center py-2 flex-1 hover:bg-blue-700 transition-colors ${isActive('/message-generator')}`}
          >
            <MessageSquare size={20} />
            <span className="text-xs mt-1">Messages</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;