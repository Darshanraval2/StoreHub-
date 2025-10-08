# MERN Task - Shops & Products

A full-stack MERN application for managing shops and their products with user authentication.

## Features

- User authentication (register/login with JWT)
- Create, read, update, delete shops
- Create, read, update, delete products under shops
- Single API endpoint to fetch all shops with their products
- Responsive React frontend with Tailwind CSS
- MongoDB database with Mongoose ODM

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

**Frontend:**
- React (with Vite)
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

## Quick Start

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_task
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Shops
- `GET /api/shops` - Get user's shops (protected)
- `POST /api/shops` - Create new shop (protected)
- `PUT /api/shops/:id` - Update shop (protected)
- `DELETE /api/shops/:id` - Delete shop (protected)
- `GET /api/shops/with-products` - Get all shops with products (public)
- `GET /api/shops/:id` - Get single shop with products (public)

### Products
- `POST /api/products` - Create product under a shop (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Project Structure

```
mern-task/
├── server/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── client/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Features in Detail

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for shop/product management

### Shop Management
- Users can create multiple shops
- Each shop has name, description, and location
- Shop owners can edit/delete their shops

### Product Management
- Products belong to shops
- Each product has name, description, price, and stock
- Only shop owners can manage their shop's products

### Public API
- Single endpoint `/api/shops/with-products` returns all shops with their products
- Useful for displaying a marketplace view

## Development Notes

- The frontend uses React Context for authentication state
- API calls are made using Axios with automatic token inclusion
- Tailwind CSS provides responsive design
- Form validation on both frontend and backend
- Error handling throughout the application

## Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```

The build files will be in the `client/dist` directory, ready for deployment.



