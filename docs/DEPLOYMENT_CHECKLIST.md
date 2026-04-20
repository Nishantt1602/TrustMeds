# TrustMeds - Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

## ✅ Pre-Deployment Checklist

### Backend Setup
- [ ] All environment variables set in `.env`
- [ ] MongoDB connection string verified
- [ ] JWT_SECRET is a strong, random string (32+ characters)
- [ ] PORT set correctly (5000)
- [ ] NODE_ENV=production
- [ ] CORS origins configured correctly
- [ ] All npm dependencies installed: `npm install`
- [ ] Backend runs without errors: `npm run dev`
- [ ] Test endpoints with curl/Postman

### Frontend Setup
- [ ] `.env.production` created with VITE_API_URL
- [ ] API baseURL points to production backend domain
- [ ] All npm dependencies installed: `npm install`
- [ ] Frontend builds without errors: `npm run build`
- [ ] Build output in `dist/` folder
- [ ] Test build locally: `npm run preview`

### Database
- [ ] MongoDB Atlas cluster created and whitelist IPs
- [ ] Database seeded with sample medicines: `npm run seed`
- [ ] Database backup created
- [ ] MongoDB indexes created (automatic in models)
- [ ] Connection string doesn't contain hardcoded passwords in code

### Security
- [ ] Remove `.env` files from Git (check `.gitignore`)
- [ ] Set strong JWT_SECRET (not 'dev_secret_key')
- [ ] API keys / secrets not committed to repository
- [ ] HTTPS enabled on frontend
- [ ] CORS configured to only allow your domain
- [ ] SQL injection protection (using Mongoose models)
- [ ] No sensitive data in localStorage (except JWT token)

### Code Quality
- [ ] No console.log() statements in production code
- [ ] No hardcoded URLs (use environment variables)
- [ ] Error handling implemented properly
- [ ] Input validation on all API endpoints
- [ ] No unused imports or variables
- [ ] Code follows consistent style

### Testing
- [ ] User registration works
- [ ] User login works with JWT token
- [ ] Medicine search returns correct results
- [ ] Vendor inventory update works
- [ ] Chat endpoint responds correctly
- [ ] Cart functionality works
- [ ] Test on mobile devices
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)

### Performance
- [ ] Frontend optimized (code splitting, lazy loading)
- [ ] Images optimized and compressed
- [ ] Database queries are efficient
- [ ] API response times acceptable (<200ms)
- [ ] No memory leaks detected
- [ ] Bundle size reasonable

### Documentation
- [ ] README.md updated with setup instructions
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deploy instructions documented
- [ ] Troubleshooting guide written

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Clean up
rm -rf node_modules
npm install
npm run build

# Commit changes
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy Backend

#### Option A: Railway
- [ ] Create Railway account (railway.app)
- [ ] Connect GitHub repository
- [ ] Select backend folder
- [ ] Add MongoDB plugin
- [ ] Set environment variables:
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
- [ ] Deploy
- [ ] Note the backend URL: `https://xxx.railway.app`

#### Option B: Render
- [ ] Create Render account (render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub
- [ ] Configure settings:
  - [ ] Build command: `npm install`
  - [ ] Start command: `npm run dev` or `node server.js`
  - [ ] Add environment variables
- [ ] Deploy
- [ ] Note the backend URL

#### Option C: Heroku
- [ ] Create Heroku account
- [ ] Install Heroku CLI
- [ ] Run: `heroku create trustmeds-backend`
- [ ] Set config vars: `heroku config:set JWT_SECRET=xxxxx`
- [ ] Deploy: `git push heroku main`

### Step 3: Deploy Frontend

#### Option A: Vercel
- [ ] Go to vercel.com
- [ ] Import project from GitHub
- [ ] Select frontend folder
- [ ] Add environment variable:
  - [ ] VITE_API_URL: `https://your-backend-url.com/api`
- [ ] Deploy
- [ ] Note the frontend URL

#### Option B: Netlify
- [ ] Connect GitHub repository to netlify.com
- [ ] Build settings:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Add environment variables
- [ ] Deploy

### Step 4: Verify Deployment

Test these endpoints:
- [ ] `https://backend-url.com/api/health` - Should return OK
- [ ] `https://backend-url.com/api/medicines/search?q=paracetamol` - Returns results
- [ ] Frontend loads without console errors
- [ ] Register new account
- [ ] Login with account
- [ ] Search for medicine
- [ ] Test chatbot
- [ ] Check all pages load correctly

### Step 5: Post-Deployment

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Set up automated backups
- [ ] Configure email alerts for errors
- [ ] Document any configuration changes
- [ ] Create incident response plan

---

## ⚠️ Common Deployment Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on API endpoints | Check backend deployment URL in frontend |
| CORS errors | Verify CORS configuration in backend |
| MongoDB connection fails | Check whitelist IP in MongoDB Atlas |
| Blank frontend page | Check browser console, verify API URL |
| Slow API responses | Check database indexes, optimize queries |
| Out of memory | Increase container memory allocations |
| Static files not loading | Check Vite build output directory |

---

## 📊 Monitoring After Deployment

### Set Up Alerts For:
- [ ] API downtime (Uptime Robot)
- [ ] High error rates (Sentry)
- [ ] Database connection issues
- [ ] Memory/CPU usage spikes
- [ ] API response time degradation

### Recommended Tools:
- **Error Tracking**: Sentry (https://sentry.io)
- **Monitoring**: DataDog, New Relic
- **Uptime Monitoring**: Uptime Robot
- **Analytics**: Google Analytics, Mixpanel
- **Logs**: LogRocket, Papertrail

---

## 🔄 Continuous Deployment (Optional)

Set up auto-deploy on push to main branch:

**Railway/Render/Vercel**: Automatically deploy on Git push (default)

**GitHub Actions** (for custom workflows):
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm run build
      - run: # Deploy command here
```

---

## 📞 Support & Troubleshooting

If deployment fails:
1. Check deployment logs in platform dashboard
2. Verify environment variables are set
3. Check database connectivity
4. Review backend error logs
5. Test API endpoints with curl/Postman
6. Check frontend browser console for errors

---

**✅ All items checked? Ready to launch! 🚀**
