import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    photo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Since we don't have a direct product endpoint, we'll fetch from shop
      const shopsResponse = await axios.get('http://localhost:3000/api/shops/with-products');
      const allShops = shopsResponse.data;
      
      let foundProduct = null;
      let foundShop = null;
      
      for (const shop of allShops) {
        const product = shop.products.find(p => p._id === id);
        if (product) {
          foundProduct = product;
          foundShop = shop;
          break;
        }
      }
      
      if (foundProduct) {
        setProduct({ ...foundProduct, shop: foundShop });
        setFormData({
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price.toString(),
          stock: foundProduct.stock.toString(),
          photo: foundProduct.photo || ''
        });
      } else {
        setError('Product not found');
      }
    } catch (error) {
      setError('Failed to fetch product details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:3000/api/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      });
      navigate(`/shops/${product.shop._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to edit product</h2>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Edit Product</h2>
      {product && product.shop && (
        <p className="text-center text-gray-600 mb-6">in {product.shop.name}</p>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Photo URL
          </label>
          <input
            type="url"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;


