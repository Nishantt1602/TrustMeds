# TrustMeds - Troubleshooting Guide

Solutions for common issues during development and deployment.

---

## 🚀 Getting Started Issues

### npm: command not found
**Problem**: Node.js not installed  
**Solution**:
- Download Node.js from https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version`

### EACCES: permission denied
**Problem**: Linux/Mac permission issues  
**Solution**:
```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
npm install -g npm
```

### Cannot find module 'xxx'
**Problem**: Dependencies not installed  
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🗄️ Database Issues

### MongoDB connection refused
**Problem**: MongoDB service not running  
**Solution**:
```bash
# Windows: Start from Services or
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: connect ECONNREFUSED 127.0.0.1:27017
**Problem**: MongoDB not running on localhost  
**Solution**:
- Start MongoDB service
- OR use MongoDB Atlas: https://www.mongodb.com/cloud/atlas

### OperationFailure: no such db
**Problem**: Database doesn't exist  
**Solution**:
```bash
# Seed the database with sample data
cd backend
npm run seed
```

### Duplicate key error for email
**Problem**: Email already registered  
**Solution**:
- Use different email for testing
- OR drop database and reseed:
```bash
# In MongoDB
db.users.deleteMany({})
npm run seed
```

---

## 🔐 Authentication Issues

### Invalid token error
**Problem**: JWT token expired or corrupted  
**Solution**:
- Clear localStorage in browser: DevTools → Application → localStorage → Clear All
- Login again
- Check JWT_SECRET matches in backend

### 401 Unauthorized on protected routes
**Problem**: Token not sent or invalid  
**Solution**:
- Check Authorization header in request
- Verify token format: "Bearer {token}"
- Login again to get fresh token

### CORS error when logging in
**Problem**: Frontend and backend CORS mismatch  
**Solution**:
- Backend CORS is already configured
- Restart backend after env changes
- Check frontend is on http://localhost:5173

### localStorage not persisting
**Problem**: Cookies/storage disabled  
**Solution**:
- Check browser privacy settings
- Try incognito mode
- Clear cache: DevTools → Network → Disable cache

---

## 💻 Frontend Issues

### Blank white page / nothing displays
**Problem**: React app didn't mount  
**Solution**:
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - verify API calls
4. Verify backend is running: `http://localhost:5000/api/health`

### VITE_API_URL is undefined
**Problem**: Environment variable not loaded  
**Solution**:
```bash
# Create .env in frontend folder
VITE_API_URL=http://localhost:5000/api

# Restart dev server
npm run dev
```

### Styles not loading (Tailwind CSS)
**Problem**: CSS build issue  
**Solution**:
```bash
# Restart dev server
npm run dev

# Or clear cache
rm -rf node_modules/.vite
npm run dev
```

### "Cannot find module" errors
**Problem**: Missing dependencies  
**Solution**:
```bash
cd frontend
npm install
npm run dev
```

### Port 5173 already in use
**Problem**: Another app using port  
**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

## ⚙️ Backend Issues

### Port 5000 already in use
**Problem**: Another app using port  
**Solution**:
```bash
# Change port in .env
PORT=5001

# Or kill existing process
lsof -ti:5000 | xargs kill -9
```

### "Cannot find module" in backend
**Problem**: Dependencies not installed  
**Solution**:
```bash
cd backend
npm install
npm run dev
```

### TypeError: Cannot read property 'headers'
**Problem**: Middleware order wrong  
**Solution**:
- Ensure middleware is applied before routes
- Check server.js for correct order

### Syntax error in ES6 modules
**Problem**: Node version doesn't support modules  
**Solution**:
- Update Node.js to 16+
- Check package.json has "type": "module"

### MongoValidationError
**Problem**: Invalid data format  
**Solution**:
- Check required fields are provided
- Verify email is valid format
- Check price/stock are numbers

---

## 🔄 API Issues

### Cannot POST / GET /api/xxx
**Problem**: Route not defined  
**Solution**:
- Check route file exists
- Verify route is imported in server.js
- Check spelling of endpoint

### Empty response from API
**Problem**: Server error or timeout  
**Solution**:
- Check backend logs
- Verify MongoDB is running
- Check for 500 errors in network tab

### Response is very slow
**Problem**: Database query optimization  
**Solution**:
- Add indexes (already done in models)
- Check MongoDB Atlas performance
- Use database connection pool

### "Socket hang up" error
**Problem**: Backend crashed  
**Solution**:
- Check server logs for errors
- Restart: npm run dev
- Check for infinite loops

---

## 🐳 Docker Issues

### docker: command not found
**Problem**: Docker not installed  
**Solution**:
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Restart terminal

### Port already in use
**Problem**: Container port conflict  
**Solution**:
```bash
# Stop all containers
docker-compose down

# Or use different port in docker-compose.yml
```

### Container exits immediately
**Problem**: Service crashed on startup  
**Solution**:
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose up --build
```

---

## 🚢 Deployment Issues

### 502 Bad Gateway
**Problem**: Backend not responding  
**Solution**:
- Check backend is running
- Verify environment variables
- Check MongoDB Atlas whitelist IP
- Check port forwarding

### Cannot connect to MongoDB in production
**Problem**: Connection string wrong  
**Solution**:
- Verify MONGODB_URI in production env
- Add your IP to MongoDB Atlas whitelist
- Check username/password special characters

### Frontend showing API 404 errors
**Problem**: API URL incorrect  
**Solution**:
- Update VITE_API_URL in production
- Verify backend URL is public
- Check CORS configuration

### Blank page in production
**Problem**: Build output missing  
**Solution**:
- Check dist/ folder exists
- Verify build command: npm run build
- Check build logs on deployment platform

### Static files not loading (404)
**Problem**: Asset path wrong  
**Solution**:
- Check dist folder has all files
- Verify base URL in vite.config.js
- Check web server is serving dist/

---

## 📊 Performance Issues

### API requests are slow
**Problem**: Network or database  
**Solution**:
- Check API response time in DevTools
- Add console.time() in routes
- Check MongoDB query performance
- Consider caching

### Frontend loads slowly
**Problem**: Bundle too large  
**Solution**:
```bash
# Check bundle size
npm run build
# Look at dist/ folder size

# Analyze
npm install -D rollup-plugin-visualizer
```

### Memory leak warnings
**Problem**: Uncleared intervals/listeners  
**Solution**:
- Check useEffect cleanup functions
- Verify timers are cleared
- Check event listeners removed

---

## 🔍 Debugging Tools

### Browser DevTools
```
F12 → Console → Check for errors
F12 → Network → Check API calls
F12 → Application → Check localStorage
```

### Backend Logging
```javascript
console.log('Debug:', data);
console.error('Error:', error);
// Use proper error logging in production
```

### MongoDB Compass
Download: https://www.mongodb.com/products/tools/compass
- Query database directly
- View documents
- Test connections

### Postman API Testing
Download: https://www.postman.com
- Test endpoints without frontend
- Save request collections
- Debug API responses

### VS Code Extensions
- **REST Client** - Test APIs in editor
- **Thunder Client** - Lightweight API testing
- **MongoDB for VS Code** - Database browsing
- **Debug Debugger for Chrome** - Frontend debugging

---

## 🎯 Testing Checklist

- [ ] Backend starts without errors: `npm run dev`
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Can register new account
- [ ] Can login with account
- [ ] Medicine search returns results
- [ ] Can add item to cart
- [ ] Vendor can manage inventory
- [ ] Chat endpoint responds
- [ ] All ports (5000, 5173) accessible
- [ ] No console errors or warnings

---

## 🆘 Still Not Fixed?

### Get Help
1. Check server/backend logs for error messages
2. Take screenshot of error
3. Note exact error message
4. Check GitHub issues
5. Ask in community forums

### Report Issues
When reporting:
- Include error message (full text)
- Note OS and Node version
- Steps to reproduce
- What you already tried

### Useful Commands
```bash
# Check versions
node --version
npm --version
mongod --version

# Show all running processes
ps aux | grep node
ps aux | grep mongod

# Kill processes
kill -9 <PID>

# Check port usage
lsof -i :5000
netstat -an | grep 5000
```

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [JWT.io](https://jwt.io)

---

**Still need help?** Check the main README.md or DEPLOYMENT.md files!
