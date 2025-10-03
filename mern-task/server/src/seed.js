import 'dotenv/config';
import mongoose from 'mongoose';
import { connectToDatabase } from './config/db.js';
import User from './models/User.js';
import Shop from './models/Shop.js';
import Product from './models/Product.js';

const sampleData = {
  users: [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    }
  ],
  shops: [
    {
      name: 'Tech Gadgets Store',
      description: 'Latest electronics and gadgets',
      location: 'New York, NY'
    },
    {
      name: 'Fashion Boutique',
      description: 'Trendy clothing and accessories',
      location: 'Los Angeles, CA'
    },
    {
      name: 'Book Corner',
      description: 'Books for all ages and interests',
      location: 'Chicago, IL'
    }
  ],
  products: [
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system',
      price: 999.99,
      stock: 50,
      photo: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'
    },
    {
      name: 'MacBook Pro',
      description: 'Powerful laptop for professionals',
      price: 1999.99,
      stock: 25,
      photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    },
    {
      name: 'Designer Jeans',
      description: 'Premium denim jeans',
      price: 89.99,
      stock: 100,
      photo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'
    },
    {
      name: 'Summer Dress',
      description: 'Elegant summer dress',
      price: 59.99,
      stock: 75,
      photo: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
    },
    {
      name: 'JavaScript Guide',
      description: 'Complete guide to modern JavaScript',
      price: 29.99,
      stock: 200,
      photo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    },
    {
      name: 'React Cookbook',
      description: 'Advanced React patterns and techniques',
      price: 34.99,
      stock: 150,
      photo: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400'
    }
  ]
};

async function seedDatabase() {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    
    // Clear existing data
    await Product.deleteMany({});
    await Shop.deleteMany({});
    await User.deleteMany({});
    
    // Create users
    const users = [];
    for (const userData of sampleData.users) {
      const passwordHash = await User.hashPassword(userData.password);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash
      });
      users.push(user);
    }
    
    // Create shops
    const shops = [];
    for (let i = 0; i < sampleData.shops.length; i++) {
      const shopData = sampleData.shops[i];
      const owner = users[i % users.length]; // Distribute shops among users
      const shop = await Shop.create({
        ...shopData,
        owner: owner._id
      });
      shops.push(shop);
    }
    
    // Create products
    for (let i = 0; i < sampleData.products.length; i++) {
      const productData = sampleData.products[i];
      const shop = shops[i % shops.length]; // Distribute products among shops
      await Product.create({
        ...productData,
        shop: shop._id
      });
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`Created ${users.length} users, ${shops.length} shops, and ${sampleData.products.length} products`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedDatabase();
