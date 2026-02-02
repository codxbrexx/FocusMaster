# Deployment Guide

Guide for deploying FocusMaster to production.

##  Deployment Options

FocusMaster can be deployed to:
- **Vercel** (Recommended) - Zero-config deployment
- **Heroku** - Traditional platform
- **AWS** - Full control
- **DigitalOcean** - VPS hosting
- **Railway** - Modern platform

This guide focuses on **Vercel** as it's the recommended platform.

---

##  Deploying to Vercel

### Prerequisites

- GitHub account with FocusMaster repository
- Vercel account (free tier available)
- MongoDB Atlas cluster
- Google OAuth credentials
- (Optional) Spotify Developer credentials

---

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free M0 cluster
   - Choose your preferred region

2. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Click "Confirm"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   
   Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focusmaster?retryWrites=true&w=majority`

---

### Step 2: Configure OAuth

#### Google OAuth

1. **Update Authorized Origins**
   - Go to Google Cloud Console
   - Navigate to Credentials
   - Edit your OAuth 2.0 Client
   - Add authorized JavaScript origins:
     - `https://your-app.vercel.app`
   
2. **Update Redirect URIs**
   - Add authorized redirect URIs:
     - `https://your-app.vercel.app`
     - `https://your-api.vercel.app`

#### Spotify (Optional)

1. **Update Redirect URI**
   - Go to Spotify Developer Dashboard
   - Edit your app settings
   - Add redirect URI:
     - `https://your-api.vercel.app/api/spotify/callback`

---

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your FocusMaster repository

2. **Configure Frontend**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
3. **Set Frontend Environment Variables**
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL (e.g., `https://focusmaster.vercel.app`)

5. **Deploy Backend (Separate Project)**
   - Go to https://vercel.com/new again
   - Import the same repository
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

6. **Set Backend Environment Variables**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/focusmaster
   NODE_ENV=production
   JWT_SECRET=your_super_secret_production_key
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   FRONTEND_URL=https://focusmaster.vercel.app
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=https://your-backend.vercel.app/api/spotify/callback
   ```

7. **Deploy Backend**
   - Click "Deploy"
   - Note the backend URL

8. **Update Frontend with Backend URL**
   - Go to frontend project settings
   - Update `VITE_API_URL` to backend deployment URL
   - Redeploy frontend

---

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd ../frontend
vercel --prod
```

---

### Step 4: Configure vercel.json

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

---

### Step 5: Verify Deployment

1. **Test Frontend**
   ```bash
   curl https://your-app.vercel.app
   # Should return HTML
   ```

2. **Test Backend Health**
   ```bash
   curl https://your-backend.vercel.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

3. **Test Authentication**
   - Visit your deployed app
   - Try logging in with Google
   - Verify JWT cookies are set

4. **Check Functionality**
   - Create a session
   - Create a task
   - Check analytics
   - Test all major features

---

##  Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use production MongoDB cluster
- [ ] Enable MongoDB IP whitelist (if not using 0.0.0.0/0)
- [ ] Set `NODE_ENV=production`
- [ ] Update OAuth redirect URIs
- [ ] Enable HTTPS (handled by Vercel)
- [ ] Remove console.logs from code
- [ ] Set secure cookie flags
- [ ] Implement rate limiting (future enhancement)

---

##  Monitoring & Logging

### Vercel Analytics

1. **Enable Analytics**
   - Go to project settings in Vercel
   - Navigate to "Settings" → "Analytics"
   - Enable analytics

### Error Tracking (Future)

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for infrastructure monitoring

### Database Monitoring

- **MongoDB Atlas Monitoring**
  - View metrics in Atlas dashboard
  - Set up alerts for:
    - High connection count
    - Slow queries
    - Storage usage

---

##  CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys on:
- **Push to main** → Production deployment
- **Pull requests** → Preview deployments

### Manual Deployment

```bash
# Deploy latest changes
git push origin main

# Or using Vercel CLI
vercel --prod
```

---

##  Custom Domain (Optional)

### Add Custom Domain

1. **In Vercel Dashboard**
   - Go to project settings
   - Navigate to "Domains"
   - Add your domain (e.g., `focusmaster.com`)

2. **Configure DNS**
   - Add CNAME record:
     ```
     focusmaster.com → cname.vercel-dns.com
     ```
   - Or A record:
     ```
     @ → 76.76.21.21
     ```

3. **Update Environment Variables**
   ```bash
   FRONTEND_URL=https://focusmaster.com
   ```

4. **Update OAuth Credentials**
   - Add new domain to authorized origins
   - Add new redirect URIs

---

##  Progressive Web App (PWA)

### Enable PWA Features

1. **Add manifest.json**
   ```json
   {
     "name": "FocusMaster",
     "short_name": "FocusMaster",
     "description": "Productivity ecosystem for achieving flow state",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#3b82f6",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Add Service Worker**
   - Vite PWA plugin (future enhancement)

---

##  Troubleshooting Deployment Issues

### Build Fails

```bash
# Check build logs in Vercel dashboard

# Test build locally
cd frontend
npm run build

cd backend
npm start
```

### 500 Internal Server Error

1. Check Vercel function logs
2. Verify environment variables
3. Check MongoDB connection
4. Test API endpoints directly

### CORS Issues in Production

```javascript
// backend/src/app.js
// Ensure production URL is in allowed origins
const allowedOrigins = [
  'https://focusmaster.vercel.app',
  'https://your-custom-domain.com'
];
```

### Environment Variables Not Working

- Ensure they're set in Vercel project settings
- Redeploy after changing env vars
- Check variable names (case-sensitive)

---

##  Cost Estimation

### Free Tier Limits (Vercel)
- 100GB bandwidth/month
- Unlimited projects
- 100 GB-hours of serverless function execution

### MongoDB Atlas Free Tier
- 512MB storage
- Shared RAM
- No backups

### When to Upgrade

Upgrade when you exceed:
- 10,000 active users
- 500GB bandwidth/month
- Need guaranteed uptime SLA

---

##  Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
cd frontend
npm run build
npx vite-bundle-visualizer

# Optimize images
# Use WebP format
# Implement lazy loading
```

### Backend Optimization

```javascript
// Add database indexes
db.sessions.createIndex({ user: 1, startTime: -1 });
db.tasks.createIndex({ user: 1, status: 1 });

// Use projection to limit fields
Session.find().select('type duration startTime');

// Implement caching (future)
```

### CDN Configuration

Vercel automatically provides:
- Global CDN
- Edge caching
- Automatic compression

---

##  Rollback Strategy

### Revert to Previous Deployment

1. **Via Vercel Dashboard**
   - Go to "Deployments"
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via Git**
   ```bash
   git revert HEAD
   git push origin main
   # Vercel will auto-deploy
   ```

---

##  Deployment Checklist

Pre-deployment:
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Database migrations run (if any)
- [ ] OAuth credentials updated
- [ ] Security audit completed

Post-deployment:
- [ ] Test all major features
- [ ] Verify authentication works
- [ ] Check API performance
- [ ] Monitor error logs
- [ ] Test on multiple devices
- [ ] Verify database connections

---

##  Support

If you encounter deployment issues:

1. Check Vercel documentation: https://vercel.com/docs
2. Review deployment logs in Vercel dashboard
3. Test locally before deploying
4. Create an issue on GitHub if needed

---

**Congratulations! Your app is now live! **
