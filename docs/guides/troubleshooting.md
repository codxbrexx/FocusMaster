# Troubleshooting Guide

Common issues and their solutions for FocusMaster development.

##  Quick Diagnostics

Before diving into specific issues, run these checks:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if MongoDB is running
mongosh --eval "db.version()"

# Check if ports are available
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
```

---

##  Backend Issues

### Issue: Backend won't start

**Symptom:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: MongoDB connection failed

**Symptom:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

**Option 1: Start local MongoDB**
```bash
# Ubuntu/Debian
sudo systemctl start mongodb
sudo systemctl status mongodb

# macOS
brew services start mongodb-community

# Check if running
mongosh
```

**Option 2: Check MongoDB Atlas**
```bash
# Verify connection string in .env
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/

# Common issues:
# - Wrong password
# - IP not whitelisted (add 0.0.0.0/0 for development)
# - Network connectivity issues
```

**Option 3: Test connection**
```bash
cd backend
node -e "require('mongoose').connect(process.env.MONGO_URI || 'mongodb://localhost:27017/focusmaster').then(() => console.log('Connected!')).catch(e => console.error(e))"
```

---

### Issue: 401 Unauthorized errors

**Symptom:**
```
{
  "message": "Not authorized, token failed"
}
```

**Solutions:**

1. **Check JWT_SECRET in .env**
   ```bash
   # backend/.env
   JWT_SECRET=your_secret_key_here  # Should be the same across restarts
   ```

2. **Clear cookies and re-login**
   ```javascript
   // In browser console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC";
   });
   ```

3. **Check token expiration**
   ```javascript
   // In backend/src/utils/generateToken.js
   // Make sure expiresIn is reasonable (e.g., '30d')
   ```

---

### Issue: CORS errors

**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Check FRONTEND_URL in backend .env**
   ```bash
   # backend/.env
   FRONTEND_URL=http://localhost:5173
   ```

2. **Verify CORS configuration**
   ```javascript
   // backend/src/app.js
   // Make sure frontend URL is allowed in allowedOrigins
   ```

3. **Check API URL in frontend**
   ```bash
   # frontend/.env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### Issue: Port 5000 already in use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
# In backend/.env
PORT=5001
```

---

##  Frontend Issues

### Issue: Frontend won't start

**Symptom:**
```
Error: Cannot find module 'vite'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue: API calls failing

**Symptom:**
```
Network Error
or
404 Not Found
```

**Solutions:**

1. **Check if backend is running**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Verify API URL**
   ```bash
   # frontend/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Check browser console**
   ```javascript
   // Look for CORS errors, 404s, or network failures
   ```

4. **Test API directly**
   ```bash
   # Test GET request
   curl http://localhost:5000/api/sessions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

### Issue: Environment variables not working

**Symptom:**
```
import.meta.env.VITE_API_URL is undefined
```

**Solutions:**

1. **Ensure variable starts with VITE_**
   ```bash
   # ✅ Correct
   VITE_API_URL=http://localhost:5000/api
   
   # ❌ Wrong (won't be exposed to client)
   API_URL=http://localhost:5000/api
   ```

2. **Restart dev server after changing .env**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev  # Start again
   ```

3. **Check .env location**
   ```bash
   # Should be in frontend/ directory
   ls frontend/.env
   ```

---

### Issue: Styles not loading

**Symptom:**
Unstyled page or Tailwind classes not working

**Solutions:**

1. **Check Tailwind configuration**
   ```bash
   # Verify tailwind.config.js exists
   ls frontend/tailwind.config.js
   ```

2. **Verify CSS import**
   ```typescript
   // frontend/src/main.tsx
   import './index.css';  // Must be imported
   ```

3. **Rebuild**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

---

##  Authentication Issues

### Issue: Google OAuth not working

**Symptom:**
```
Error: invalid_client
```

**Solutions:**

1. **Verify Google Client ID**
   ```bash
   # Must be the same in both .env files
   # backend/.env
   GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
   
   # frontend/.env
   VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
   ```

2. **Check authorized origins**
   - Go to Google Cloud Console
   - Credentials → OAuth 2.0 Client IDs
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5000`

3. **Check redirect URIs**
   - Add authorized redirect URIs:
     - `http://localhost:5173`

---

### Issue: Can't login as admin

**Symptom:**
User doesn't have admin access

**Solution:**

```bash
# Option 1: Use the script
cd backend
node src/scripts/createAdmin.js

# Option 2: Update manually in MongoDB
mongosh
use focusmaster
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🎵 Spotify Integration Issues

### Issue: Spotify auth not working

**Symptom:**
```
Error: Invalid client
```

**Solutions:**

1. **Check Spotify credentials**
   ```bash
   # backend/.env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
   ```

2. **Verify redirect URI in Spotify Dashboard**
   - Go to https://developer.spotify.com/dashboard
   - Edit Settings
   - Add redirect URI: `http://localhost:5000/api/spotify/callback`

3. **Requires Spotify Premium**
   - Spotify API playback control requires Premium subscription

---

##  Testing Issues

### Issue: Tests failing

**Symptom:**
```
TypeError: Cannot read property 'find' of undefined
```

**Solutions:**

1. **Check test environment**
   ```bash
   # backend/.env.test (if using)
   NODE_ENV=test
   MONGO_URI=mongodb://localhost:27017/focusmaster-test
   ```

2. **Clear test database**
   ```bash
   mongosh
   use focusmaster-test
   db.dropDatabase()
   ```

3. **Run tests in isolation**
   ```bash
   # Run single test file
   npm test -- session.test.js
   ```

---

##  Database Issues

### Issue: Duplicate key error

**Symptom:**
```
MongoServerError: E11000 duplicate key error
```

**Solutions:**

1. **Clear problematic data**
   ```bash
   mongosh
   use focusmaster
   db.users.deleteOne({ email: "duplicate@email.com" })
   ```

2. **Drop and recreate index**
   ```bash
   db.users.dropIndex("email_1")
   db.users.createIndex({ email: 1 }, { unique: true })
   ```

---

### Issue: Document not found

**Symptom:**
```
Session not found
```

**Solutions:**

1. **Verify ObjectId format**
   ```javascript
   // Check if valid MongoDB ObjectId
   const mongoose = require('mongoose');
   const isValid = mongoose.Types.ObjectId.isValid(id);
   ```

2. **Check if document exists**
   ```bash
   mongosh
   use focusmaster
   db.sessions.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })
   ```

---

##  Deployment Issues

### Issue: Vercel deployment fails

**Symptom:**
Build fails on Vercel

**Solutions:**

1. **Check build logs in Vercel dashboard**

2. **Verify environment variables**
   - Add all required env vars in Vercel dashboard
   - Don't include `VITE_` prefix in backend vars

3. **Test build locally**
   ```bash
   # Frontend
   cd frontend
   npm run build
   
   # Backend
   cd backend
   npm start  # Should work without errors
   ```

4. **Check Node version**
   ```json
   // package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

---

##  Browser Issues

### Issue: App not working in specific browser

**Solutions:**

1. **Clear browser cache**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **Disable browser extensions**
   - Try incognito/private mode

3. **Check browser console for errors**
   - F12 → Console tab

4. **Update browser**
   - Ensure using latest version

---

##  Performance Issues

### Issue: Slow API responses

**Solutions:**

1. **Check database indexes**
   ```bash
   mongosh
   use focusmaster
   db.sessions.getIndexes()
   # Should have index on { user: 1, startTime: -1 }
   ```

2. **Enable query logging**
   ```javascript
   // backend/src/config/db.js
   mongoose.set('debug', true);
   ```

3. **Optimize queries**
   ```javascript
   // Use select to limit fields
   await Session.find({ user: userId })
     .select('type duration startTime')
     .limit(50);
   ```

---

### Issue: Frontend lag

**Solutions:**

1. **Check React DevTools Profiler**
   - Identify slow components
   - Add React.memo() where needed

2. **Check Network tab**
   - Look for large payloads
   - Implement pagination

3. **Optimize images**
   - Use WebP format
   - Lazy load images

---

##  Still Having Issues?

If you're still experiencing problems:

1. **Check GitHub Issues**
   - Search existing issues: https://github.com/codxbrexx/FocusMaster/issues

2. **Create a New Issue**
   - Provide error messages
   - Include steps to reproduce
   - Specify environment (OS, Node version, etc.)

3. **Include Debug Information**
   ```bash
   # System info
   node --version
   npm --version
   
   # Check logs
   # Backend logs (in terminal running backend)
   # Browser console logs (F12 → Console)
   ```

---

**Pro Tip**: Always check the browser console and backend terminal for error messages first! 
