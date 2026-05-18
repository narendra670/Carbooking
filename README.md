# CarBook - Car Booking Platform

A full-stack car booking platform with unique AI-powered features built with React, Node.js, Express, and MongoDB.

## Features

### Core Features
- User signup/login/logout with JWT authentication
- Browse cars with filters (brand, fuel type, transmission, body type, price)
- Car details with specifications and features
- Booking system with date selection and driver option
- Online payment integration (Razorpay)
- User dashboard with booking management
- Admin dashboard for managing bookings
- Wishlist functionality
- Fully responsive design

### Unique Features
1. **Smart Budget Recommendation** - Enter your daily budget and get the best cars in that range
2. **AI-Powered Car Suggestions** - Get car recommendations based on purpose (Family Trip, Office Work, Solo Travel)
3. **Compare Cars** - Select 2 cars and compare mileage, price, seating, fuel type, and more

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **API**: Apify API (CarDekho car data)
- **Payment**: Razorpay (demo integration)

## Project Structure

```
carbooking/
├── backend/
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth middleware
│   │   ├── utils/        # Apify service, DB connection
│   │   └── server.js     # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service
│   │   ├── context/      # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Installation

1. Install dependencies:
```bash
npm run install:all
```

2. Configure environment variables:
- Backend: Edit `backend/.env` with your MongoDB URI and JWT secret
- Frontend: Edit `frontend/.env` with your API URL

3. Start MongoDB (if running locally):
```bash
mongod
```

### Running the App

Start backend and frontend separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Or run both with:
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `POST /api/auth/wishlist` - Toggle wishlist (auth required)

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `GET /api/cars/budget?budget=X` - Get cars within budget
- `GET /api/cars/purpose?purpose=X` - Get cars by purpose
- `GET /api/cars/compare?car1=X&car2=Y` - Compare two cars
- `GET /api/cars/search?query=X` - Search cars

### Bookings
- `POST /api/bookings` - Create booking (auth required)
- `GET /api/bookings` - Get user bookings (auth required)
- `GET /api/bookings/:id` - Get booking by ID (auth required)
- `PUT /api/bookings/:id/cancel` - Cancel booking (auth required)
- `PUT /api/bookings/:id/payment` - Update payment (auth required)
- `GET /api/bookings/admin/all` - Get all bookings (admin only)
- `PUT /api/bookings/admin/:id/status` - Update booking status (admin only)

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, search, featured cars, budget & AI features |
| Cars Listing | `/cars` | All cars with filters |
| Car Details | `/cars/:id` | Car specs, features, book now |
| Booking | `/booking/:id` | Select dates, driver, total calculation |
| Payment | `/payment/:id` | Payment summary and checkout |
| Dashboard | `/dashboard` | User bookings management |
| Admin | `/admin` | Admin booking management |
| Login | `/login` | User login |
| Signup | `/signup` | User registration |
| Compare | `/compare` | Compare two cars side-by-side |

## License

MIT
