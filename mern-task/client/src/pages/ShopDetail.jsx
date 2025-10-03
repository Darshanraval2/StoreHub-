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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!shop) {
    return <div className="text-center">Shop not found</div>;
  }

  const isOwner = user && shop.owner === user.id;

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
            <p className="text-gray-600 mb-2">{shop.description}</p>
            <p className="text-gray-500">📍 {shop.location}</p>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-shop/${shop._id}`}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Edit Shop
              </Link>
              <Link
                to={`/create-product/${shop._id}`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Product
              </Link>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Products ({shop.products?.length || 0})
        </h2>
        
        {shop.products && shop.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shop.products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {product.photo && (
                  <img 
                    src={product.photo} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ${product.price}
                  </p>
                  <p className="text-gray-500 mb-3">Stock: {product.stock}</p>
                  
                  {isOwner && (
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p className="mb-4">No products in this shop yet.</p>
            {isOwner && (
              <Link
                to={`/create-product/${shop._id}`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add First Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;


