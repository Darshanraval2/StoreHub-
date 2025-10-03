import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your shops</h2>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Shops</h1>
        <Link
          to="/create-shop"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">You haven't created any shops yet.</p>
          <Link
            to="/create-shop"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
              <p className="text-gray-600 mb-2">{shop.description}</p>
              <p className="text-gray-500 mb-4">📍 {shop.location}</p>
              
              <div className="flex space-x-2">
                <Link
                  to={`/shops/${shop._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View
                </Link>
                <Link
                  to={`/edit-shop/${shop._id}`}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteShop(shop._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shops;


