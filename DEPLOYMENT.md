# Deployment Checklist

## Pre-deployment Setup ✅

### Backend Preparation

- [x] Created railway.json configuration
- [x] Created .env.example with all required variables
- [x] Backend package.json has correct start script
- [x] MongoDB connection string ready

### Frontend Preparation

- [x] Created vercel.json configuration
- [x] Updated vite.config.js for production
- [x] Created .env.production file
- [x] Created .env.example file

## Backend Deployment (Railway) 🚂

### Option 1: Railway Dashboard (Recommended)

1. [ ] Go to https://railway.app and sign up
2. [ ] Click "New Project" → "Deploy from GitHub repo"
3. [ ] Connect your GitHub repository
4. [ ] Select root directory as `Sparkathon_Backend`
5. [ ] Add environment variables:
   - [ ] `PORT=5000`
   - [ ] `MONGODB_URL=<your_mongodb_connection_string>`
   - [ ] `JWT_SECRET=<your_jwt_secret>`
   - [ ] `EMAIL_USER=<your_email>`
   - [ ] `EMAIL_PASS=<your_email_password>`
   - [ ] `NODE_ENV=production`
6. [ ] Deploy and note the Railway URL (e.g., https://your-app.railway.app)

### Option 2: Railway CLI

```bash
cd Sparkathon_Backend
railway login
railway init
railway up
```

## Database Setup (MongoDB Atlas) 🗄️

1. [ ] Go to https://mongodb.com/atlas
2. [ ] Create a free cluster
3. [ ] Create database user
4. [ ] Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. [ ] Get connection string
6. [ ] Add connection string to Railway environment variables

## Frontend Deployment (Vercel) ⚡

### Option 1: Vercel Dashboard (Recommended)

1. [ ] Go to https://vercel.com and sign up
2. [ ] Click "New Project"
3. [ ] Import your GitHub repository
4. [ ] Configure project settings:
   - [ ] Framework Preset: Vite
   - [ ] Root Directory: `Sparkathon_frontend`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
5. [ ] Add environment variable:
   - [ ] `VITE_API_URL=https://your-railway-backend.railway.app/api`
6. [ ] Deploy

### Option 2: Vercel CLI

```bash
cd Sparkathon_frontend
vercel login
vercel --prod
```

## Post-Deployment Testing 🧪

1. [ ] Test backend API endpoints (Railway URL)
2. [ ] Test frontend application (Vercel URL)
3. [ ] Test frontend-backend connectivity
4. [ ] Test authentication flow
5. [ ] Test file upload functionality
6. [ ] Test all major features

## Security & Optimization 🔒

1. [ ] Verify CORS configuration
2. [ ] Check environment variables are properly set
3. [ ] Test API rate limiting
4. [ ] Verify SSL certificates
5. [ ] Test responsive design on mobile

## Monitoring & Maintenance 📊

1. [ ] Set up Railway logs monitoring
2. [ ] Set up Vercel analytics
3. [ ] Configure error tracking (optional: Sentry)
4. [ ] Set up uptime monitoring

## URLs to Save 📝

- **Backend (Railway):** `https://your-app.railway.app`
- **Frontend (Vercel):** `https://your-app.vercel.app`
- **MongoDB Atlas:** `mongodb+srv://...`

## Common Issues & Solutions 🔧

### Backend Issues:

- **503 Error:** Check Railway logs, usually environment variables
- **Database Connection:** Verify MongoDB connection string
- **CORS Error:** Check cors() configuration in app.js

### Frontend Issues:

- **API Connection Failed:** Verify VITE_API_URL environment variable
- **Build Failure:** Check Vite configuration and dependencies
- **Routing Issues:** Verify vercel.json rewrite rules

### General:

- **Slow Loading:** Check bundling and code splitting
- **Authentication Issues:** Verify JWT_SECRET matches between environments
