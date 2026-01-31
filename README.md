# Raftlabs Food Order App

A full-stack food delivery order management system built with React, TypeScript, Express, and MongoDB.

## 🚀 Live Demo

- **Application**: [https://food-order-frontend-xi.vercel.app/]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Sample Credentials](#sample-credentials)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)

## ✨ Features

### Customer Features
- 🔐 User authentication (login/register)
- 🍕 Browse menu items by category
- 🛒 Add items to cart
- 📦 Place orders with delivery details
- 📋 View order history
- 📊 Track order status in real-time

### Admin Features
- 📊 Dashboard with order statistics
- 📝 Manage menu items (CRUD operations)
- 📦 View all orders
- 🔄 Update order status
- 👥 User management

### Order Status Workflow
1. **Order Received** → 2. **Preparing** → 3. **Out for Delivery** → 4. **Delivered**

Orders can be cancelled until they reach "Out for Delivery" status.

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Testing
- **Jest** - Testing framework
- **Supertest** - API testing
- **ts-jest** - TypeScript support

## 📁 Project Structure

```
food_delivery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts (Auth, Cart)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── tests/          # Test files
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities (JWT, validation)
│   └── dist/               # Compiled output
├── shared/                 # Shared types
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/food-delivery.git
   cd food-delivery
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRE=7d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ADMIN_SECRET_CODE=123456
   ```

   Create `.env` file in `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Seed the database** (optional)
   ```bash
   cd server
   SEED_DATABASE=true npm run dev
   ```

5. **Run the application**
   
   Terminal 1 - Start server:
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 - Start client:
   ```bash
   cd client
   npm run dev
   ```

6. **Open the app**
   - Frontend: http://localhost:5173
   - API: http://localhost:5000/api

## 🔐 Environment Variables

### Server
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |
| `JWT_EXPIRE` | Token expiration time | No (default: 7d) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `CLIENT_URL` | Frontend URL for CORS | No |
| `ADMIN_SECRET_CODE` | Admin registration code | Yes |

### Client
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## 👤 Sample Credentials

### Customer Account
- **Email**: `customer123@gmail.com`
- **Password**: `12345678`

### Admin Account
- **Email**: `admin123@gmail.com`
- **Password**: `12345678`
- **Secret Code**: `123456`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "...",
      "quantity": 2
    }
  ],
  "deliveryDetails": {
    "name": "John Doe",
    "address": "123 Main St, City",
    "phone": "+1234567890"
  }
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get All Orders (Admin)
```http
GET /api/orders/all
Authorization: Bearer <admin_token>
```

#### Update Order Status (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Preparing"
}
```

### Menu Endpoints

#### Get All Menu Items
```http
GET /api/menu
```

#### Create Menu Item (Admin)
```http
POST /api/menu
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and cheese",
  "price": 12.99,
  "image": "https://example.com/pizza.jpg",
  "category": "Pizza",
  "available": true
}
```

## 🧪 Testing

Run the test suite:

```bash
cd server
npm test
```

### Test Coverage
- **130+ tests** covering:
  - Order model validation
  - Input validation utilities
  - CRUD operations
  - Order status workflow
  - Authentication

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Backend**
   - Connect your repo to Vercel
   - Set root directory to `server/`
   - Add environment variables

3. **Deploy Frontend**
   - Create new project on Vercel
   - Set root directory to `client/`
   - Add `VITE_API_URL` environment variable

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- Built for Raftlabs
- Inspired by modern food delivery apps

---

**Note**: Replace placeholder URLs in this README with your actual deployed URLs after deployment.
