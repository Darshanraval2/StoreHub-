import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/shops/${id}`);
      setShop(response.data);
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${productId}`);
        setShop({
          ...shop,
          products: shop.products.filter(product => product._id !== productId)
        });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const buyProduct = async (productId, quantity = 1) => {
    if (!user) {
      alert('Please login to buy products');
      return;
    }
    try {
      await axios.post(`http://localhost:3000/api/products/${productId}/buy`, { quantity });
      alert('Purchase successful!');
      fetchShop(); // Refresh to update stock
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Not Found</h2>
          <p className="text-gray-600 mb-6">The shop you're looking for doesn't exist</p>
          <Link to="/" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && shop.owner === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-purple-600 transition-colors duration-200 mb-6 font-medium">
            ← Back to Home
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-3">🏪 {shop.name}</h1>
                  <p className="text-blue-100 text-lg mb-2">{shop.description}</p>
                  <p className="text-blue-200 flex items-center">
                    <span className="mr-2">📍</span> {shop.location}
                  </p>
                </div>
                {isOwner && (
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/edit-shop/${shop._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium text-center"
                    >
                      ✏️ Edit Shop
                    </Link>
                    <Link
                      to={`/create-product/${shop._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium text-center"
                    >
                      ➕ Add Product
                    </Link>
                    <Link
                      to={`/orders/${shop._id}`}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium text-center"
                    >
                      📦 View Orders
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              🛍️ Products
            </h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
              {shop.products?.length || 0} items
            </span>
          </div>
          
          {shop.products && shop.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.products.map((product) => (
                <div key={product._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-105">
                  {product.photo ? (
                    <img 
                      src={product.photo} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-6xl text-white">📦</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {!isOwner && product.stock > 0 && (
                        <button
                          onClick={() => buyProduct(product._id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md font-medium flex-1"
                        >
                          🛒 Buy Now
                        </button>
                      )}
                      {!isOwner && product.stock === 0 && (
                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium flex-1 text-center">
                          ❌ Out of Stock
                        </span>
                      )}
                      {isOwner && (
                        <>
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md font-medium"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Products Yet</h3>
              <p className="text-gray-500 mb-6">This shop doesn't have any products listed.</p>
              {isOwner && (
                <Link
                  to={`/create-product/${shop._id}`}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium"
                >
                  ➕ Add First Product
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;


