import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-all duration-300 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🏪</span>
              <span>StoreHub</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/shops" className="text-gray-700 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium">
                    My Shops
                  </Link>
                  <Link to="/create-shop" className="text-gray-700 hover:text-purple-600 hover:scale-105 transition-all duration-200 font-medium">
                    Create Shop
                  </Link>
                  <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">Hello, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 hover:scale-105 transition-all duration-200 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;


