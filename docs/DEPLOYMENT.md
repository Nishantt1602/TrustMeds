# TrustMeds - Full Stack Deployment Guide

Complete guide to deploy TrustMeds as a full-stack application.

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB (Cloud Atlas or local)
- Git
- Code editor (VS Code recommended)

## 🚀 Local Development Setup

### Step 1: Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/trustmeds

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustmeds
```

### Step 2: Seed Database

```bash
npm run seed
```

This will add 10 sample medicines to your database.

### Step 3: Start Backend

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 4: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 5: Test Everything

1. Go to `http://localhost:5173`
2. Register a new account
3. Search for "Paracetamol"
4. Try the chatbot

## 📦 Database Setup

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string
4. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustmeds?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

```bash
# Windows
# Download from https://www.mongodb.com/try/download/community
# Run mongod in separate terminal

# Mac
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

## 🌐 Production Deployment

### Backend Deployment (Vercel, Railway, or Render)

#### Using Railway (Easiest)

1. Push code to GitHub
2. Go to https://railway.app
3. Connect GitHub account
4. Create new project from GitHub repo
5. Add MongoDB plugin
6. Set environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your_very_secret_key_here
   ```
7. Deploy automatically on push

#### Using Render

1. Go to https://render.com
2. New -> Web Service
3. Connect GitHub
4. Settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables
5. Create PostgreSQL/MongoDB add-on
6. Deploy

#### Using Vercel (Requires Next.js conversion or serverless)

Alternative: Use as API routes in Next.js setup

### Frontend Deployment (Vercel or Netlify)

#### Using Vercel (Recommended)

1. Go to https://vercel.com
2. Import project from GitHub
3. Set build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
5. Deploy

#### Using Netlify

1. Go to https://netlify.com
2. New site from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable from `.env`
5. Deploy

### Update Frontend API Base URL

After backend deployment, update `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ... rest of the code
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔐 Environment Variables Checklist

### Backend (.env)
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret key (min 32 chars)
- [ ] `PORT` - Server port (5000)
- [ ] `NODE_ENV` - 'production' or 'development'

### Frontend (.env.production)
- [ ] `VITE_API_URL` - Backend URL https://your-backend-domain.com/api

## 🧪 Testing Production

### Test Backend API

```bash
# Health check
curl https://your-backend-domain.com/api/health

# Register user
curl -X POST https://your-backend-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123","role":"customer"}'

# Search medicines
curl https://your-backend-domain.com/api/medicines/search?q=paracetamol
```

### Test Frontend

1. Visit your frontend domain
2. Register account
3. Search for medicine
4. Test chatbot
5. Test vendor dashboard (if vendor account)

## 📊 Monitoring & Logs

### Backend Logs
- Railway: Dashboard -> Logs tab
- Render: Dashboard -> Logs tab
- Vercel: Deployments -> Logs

### Database Logs
- MongoDB Atlas: Dashboard -> Logs

### Performance Monitoring
- Add Sentry for error tracking: https://sentry.io
- Add LogRocket for frontend: https://logrocket.com

## 🔧 Troubleshooting

### Backend won't start
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB connection fails
- Check connection string in .env
- Verify MongoDB Atlas IP whitelist
- Test with MongoDB Compass: Download https://www.mongodb.com/products/tools/compass

### CORS errors
- Already configured in server.js
- If still issues, update CORS origin:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com']
}));
```

### API not found in production
- Verify backend deployment URL
- Check VITE_API_URL in frontend
- Ensure backend routes are correct

## 📚 API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Medicines
```
GET /api/medicines/search?q=query
GET /api/medicines/master
```

### Vendor
```
POST /api/vendor/inventory [Protected]
GET /api/vendor/inventory [Protected]
```

### Chat
```
POST /api/chat
```

## 🎉 Final Checklist

- [ ] Backend deployed and running
- [ ] MongoDB connected
- [ ] Frontend deployed
- [ ] API baseURL updated in frontend
- [ ] JWT_SECRET set (not default)
- [ ] CORS configured
- [ ] Environment variables in production
- [ ] Database seeded with sample data
- [ ] Test register/login flow
- [ ] Test medicine search
- [ ] Test vendor dashboard

## 🆘 Support

### Common Issues & Solutions

**Issue**: Blank page on frontend
- **Solution**: Check browser console for errors, verify API URL

**Issue**: 401 Unauthorized errors
- **Solution**: Ensure JWT_SECRET is same on backend, clear localStorage

**Issue**: Slow database queries
- **Solution**: Add indexes (already done in models), optimize queries

**Issue**: High API latency
- **Solution**: Use CDN, add caching, optimize database queries

## 📈 Next Steps

1. Add payment integration (Stripe/Razorpay)
2. Implement order management
3. Add order history in frontend
4. Admin dashboard for platform management
5. Email notifications on orders
6. SMS notifications
7. Push notifications
8. Analytics dashboard
