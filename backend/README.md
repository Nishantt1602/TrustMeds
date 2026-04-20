# TrustMeds Backend

Express.js + MongoDB backend for the TrustMeds medicine search and comparison platform.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and update:
- `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET`: A strong secret key for JWT tokens
- `GROQ_API_KEY`: (Optional) API key for AI chatbot

### 3. Start MongoDB
```bash
# Using MongoDB Atlas (recommended for production)
# Add connection string to .env

# OR using local MongoDB
mongod
```

### 4. Seed Sample Medicines
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Medicines (Public)
- **GET** `/api/medicines/search?q=paracetamol` - Search medicines with store prices
- **GET** `/api/medicines/master` - Get all available medicines (for vendor dropdown)

### Vendor
- **POST** `/api/vendor/inventory` - Add/update store inventory (requires vendor role)
  ```json
  {
    "medicineId": "ObjectId",
    "price": 99,
    "stock": 50
  }
  ```
- **GET** `/api/vendor/inventory` - Get vendor's inventory (requires vendor role)

### Chat
- **POST** `/api/chat` - AI chatbot response
  ```json
  {
    "prompt": "I have a headache"
  }
  ```

## Project Structure
```
backend/
├── server.js              # Main server entry point
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── Medicine.js       # Medicine schema
│   └── Inventory.js      # Store inventory schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── medicines.js      # Medicine search endpoints
│   ├── vendor.js         # Vendor inventory endpoints
│   └── chat.js           # Chatbot endpoint
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── errorHandler.js   # Global error handling
├── seeds/
│   └── seedMedicines.js  # Sample medicine data
└── package.json
```

## Database Schema

### User
- name, email, password (hashed)
- role: 'customer' or 'vendor'
- storeName, address (for vendors)
- isVerified

### Medicine
- name, composition, uses
- sideEffects, dosage

### Inventory
- vendorId, medicineId
- price, stock
- storeName, address, isVerified

## Deployment

### Using MongoDB Atlas (Recommended)
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustmeds`

### Deploy Backend
- **Vercel**: `vercel deploy --prod`
- **Railway**: Connect GitHub repo
- **Render**: Select Node.js environment
- **Heroku**: `git push heroku main`

Update frontend API baseURL to production domain:
```javascript
const API = axios.create({
  baseURL: 'https://your-backend-domain.com/api',
});
```

## Testing

### Register Vendor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MediStore",
    "email": "vendor@med.com",
    "password": "pass123",
    "role": "vendor",
    "storeName": "MediStore",
    "address": "123 Main St"
  }'
```

### Search Medicines
```bash
curl http://localhost:5000/api/medicines/search?q=paracetamol
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Environment Files for Deployment

### Production (.env.production)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/trustmeds
JWT_SECRET=your_super_secure_key_here
NODE_ENV=production
```

### Local Development (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustmeds
JWT_SECRET=dev_key
NODE_ENV=development
```
