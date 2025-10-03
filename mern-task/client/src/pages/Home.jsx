import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [shopsWithProducts, setShopsWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to StoreHub
        </h1>
        <p className="text-gray-600">
          Discover shops and their products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopsWithProducts.map((shop) => (
          <div key={shop._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
              <p className="text-gray-600 mb-2">{shop.description}</p>
              <p className="text-gray-500 mb-4">📍 {shop.location}</p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Products ({shop.products.length})
                </h4>
                {shop.products.slice(0, 3).map((product) => (
                  <div key={product._id} className="flex items-center gap-2 mb-1">
                    {product.photo && (
                      <img 
                        src={product.photo} 
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div className="text-sm text-gray-600">
                      {product.name} - ${product.price}
                    </div>
                  </div>
                ))}
                {shop.products.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{shop.products.length - 3} more
                  </div>
                )}
              </div>
              
              <Link
                to={`/shops/${shop._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Shop
              </Link>
            </div>
          </div>
        ))}
      </div>

      {shopsWithProducts.length === 0 && (
        <div className="text-center text-gray-600">
          No shops available yet.
        </div>
      )}
    </div>
  );
};

export default Home;


