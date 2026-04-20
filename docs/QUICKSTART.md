# Quick Start Guide - TrustMeds

Get TrustMeds running in 5 minutes!

## Option 1: With Docker (Easiest)

### Prerequisites
- Docker & Docker Compose installed

### Run
```bash
docker-compose up
```

Then visit:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health
- MongoDB: localhost:27017 (admin/password123)

---

## Option 2: Manual Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

✅ Backend on http://localhost:5000

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend on http://localhost:5173

---

## Test the Application

1. **Register**: Click "Sign Up" on http://localhost:5173
2. **Search**: Type "Paracetamol" in search box
3. **Chatbot**: Try "I have a headache"
4. **Vendor**: Register with `role: vendor` and manage inventory

---

## Quick API Test

```bash
# Search medicines
curl http://localhost:5000/api/medicines/search?q=paracetamol

# Health check
curl http://localhost:5000/api/health
```

---

## Default .env Values

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustmeds
JWT_SECRET=dev_secret_key_change_in_production
NODE_ENV=development
```

**Frontend** Uses localhost API automatically via Vite

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB not found | Install MongoDB locally or use MongoDB Atlas |
| Port 5000 in use | Change PORT in backend/.env |
| CORS error | Restart backend after env changes |
| Blank frontend | Open DevTools console and check API URL |

---

## Next Steps

1. ✅ Customize sample medicines in `backend/seeds/seedMedicines.js`
2. ✅ Deploy backend (Railway/Render)
3. ✅ Deploy frontend (Vercel/Netlify)
4. ✅ Add payment integration
5. ✅ Set up email notifications

See `DEPLOYMENT.md` for detailed production setup.
