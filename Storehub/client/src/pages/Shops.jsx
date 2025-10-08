import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchShops();
    }
  }, [user]);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShop = async (shopId) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await axios.delete(`http://localhost:3000/api/shops/${shopId}`);
        setShops(shops.filter(shop => shop._id !== shopId));
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your shops</p>
          <Link to="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">🏪 My Shops</h1>
            <p className="text-gray-600">Manage your online stores</p>
          </div>
          <Link
            to="/create-shop"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium flex items-center gap-2"
          >
            ➕ Create New Shop
          </Link>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🏪</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Shops Yet</h3>
              <p className="text-gray-600 mb-6">Start your entrepreneurial journey by creating your first shop!</p>
              <Link
                to="/create-shop"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium"
              >
                Create Your First Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <div key={shop._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-2 group">
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-6 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">{shop.name}</h3>
                    <p className="text-blue-100 text-sm">{shop.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="text-lg mr-2">📍</span>
                    <span className="text-sm">{shop.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/shops/${shop._id}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl font-semibold"
                    >
                      👁️ View
                    </Link>
                    <Link
                      to={`/edit-shop/${shop._id}`}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl font-semibold"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => deleteShop(shop._id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shops;


