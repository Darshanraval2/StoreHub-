import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const [shopsWithProducts, setShopsWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchShopsWithProducts();
  }, []);

  const fetchShopsWithProducts = async () => {
    try {
      console.log('Fetching shops with products...');
      const response = await axios.get('http://localhost:3000/api/shops/with-products');
      console.log('API Response:', response.data);
      setShopsWithProducts(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const buyProduct = async (productId) => {
    if (!user) {
      alert('Please login to buy products');
      return;
    }
    try {
      await axios.post(`http://localhost:3000/api/products/${productId}/buy`, { quantity: 1 });
      alert('Purchase successful!');
      fetchShopsWithProducts(); // Refresh to update stock
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center mb-12 py-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-pulse">
              🏪 StoreHub
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
              Discover amazing shops and their products in one place
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50 hover:scale-105 transition-transform">
                <span className="text-sm font-medium text-gray-700">🛍️ {shopsWithProducts.reduce((total, shop) => total + shop.products.length, 0)} Products</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50 hover:scale-105 transition-transform">
                <span className="text-sm font-medium text-gray-700">🏪 {shopsWithProducts.length} Shops</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shopsWithProducts.map((shop) => (
          <div key={shop._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">{shop.name}</h3>
                <p className="text-blue-100 text-sm mb-2">{shop.description}</p>
                <p className="text-blue-200 text-sm flex items-center">
                  <span className="mr-2">📍</span> {shop.location}
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Featured Products
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {shop.products.length} items
                  </span>
                </div>
                
                <div className="space-y-3">
                  {shop.products.slice(0, 3).map((product) => (
                    <div key={product._id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.photo ? (
                            <img 
                              src={product.photo} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs">📦</span>
                            </div>
                          )}
                          <div>
                            <h5 className="font-medium text-gray-800 text-sm">{product.name}</h5>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-bold text-sm">${product.price}</span>
                              <span className="text-gray-500 text-xs">• Stock: {product.stock}</span>
                            </div>
                          </div>
                        </div>
                        
                        {product.stock > 0 ? (
                          <button
                            onClick={() => buyProduct(product._id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            ⚡ Buy
                          </button>
                        ) : (
                          <span className="text-red-500 text-xs font-semibold bg-red-100 px-3 py-1.5 rounded-xl border border-red-200">
                            🚫 Sold Out
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {shop.products.length > 3 && (
                  <div className="text-center mt-3">
                    <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                      +{shop.products.length - 3} more products
                    </span>
                  </div>
                )}
              </div>
              
              <Link
                to={`/shops/${shop._id}`}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-center block transform hover:scale-105 shadow-md"
              >
                🏪 Explore Shop
              </Link>
            </div>
          </div>
        ))}
      </div>

      {shopsWithProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No shops available yet</h3>
          <p className="text-gray-500">Be the first to create a shop and start selling!</p>
        </div>
      )}
    </div>
  );
};

export default Home;


