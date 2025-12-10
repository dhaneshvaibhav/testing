# Deployment Guide - College Truth Board

## Overview
This project has two parts:
1. **Frontend**: React + Vite (deploy to Vercel, Netlify, or any static host)
2. **Backend**: Node.js + Express (deploy to Vercel, Railway, Render, or any Node.js host)

---

## Backend Deployment (Node.js API)

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Select your project
   - Settings → Environment Variables
   - Add:
     - `SUPABASE_URL`: Your Supabase URL
     - `SUPABASE_KEY`: Your Supabase key
   - Redeploy: `vercel --prod`

5. **Get Backend URL**
   - Vercel will provide a URL like: `https://yourproject.vercel.app`
   - This is your `VITE_API_URL` for the frontend

### Option 2: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Connect GitHub repo or upload project**
3. **Add environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `PORT=8000`
4. **Railway generates a public URL automatically**

### Option 3: Deploy to Render

1. **Go to [Render.com](https://render.com)**
2. **New → Web Service**
3. **Connect GitHub repo**
4. **Configuration**:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

---

## Frontend Deployment (React App)

### Option 1: Deploy to Vercel (Recommended)

1. **From frontend folder**
   ```bash
   cd college/collegescams
   vercel --prod
   ```

2. **Set Environment Variables**
   - Vercel Dashboard → Environment Variables
   - Add `VITE_API_URL` = `https://your-backend-url.vercel.app`
   - Redeploy: `vercel --prod`

### Option 2: Deploy to Netlify

1. **Build the app**
   ```bash
   cd college/collegescams
   npm run build
   ```

2. **Go to [Netlify.com](https://netlify.com)**
3. **Drag & drop the `dist` folder** or connect GitHub
4. **Set environment variable**:
   - Build Settings → Environment
   - Add `VITE_API_URL` = `https://your-backend-url`

### Option 3: Deploy to GitHub Pages

1. **Update frontend package.json**:
   ```json
   "homepage": "https://yourusername.github.io/repo-name"
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Push to GitHub and enable GitHub Pages** in Settings

---

## Complete Deployment Steps

### Step 1: Prepare Backend
```bash
cd backend

# Copy .env.example to .env and update
cp .env.example .env

# Install dependencies
npm install

# Test locally
npm run dev
```

### Step 2: Deploy Backend
- Follow one of the backend options above
- Get the deployed URL (e.g., `https://backend-xyz.vercel.app`)

### Step 3: Prepare Frontend
```bash
cd college/collegescams

# Update API URL in code or create .env file
echo "VITE_API_URL=https://backend-xyz.vercel.app" > .env.production

# Install dependencies
npm install

# Build
npm run build
```

### Step 4: Deploy Frontend
- Follow one of the frontend options above
- Ensure `VITE_API_URL` points to your backend

---

## Environment Variables Checklist

### Backend (.env)
- [ ] `SUPABASE_URL` - Get from Supabase dashboard
- [ ] `SUPABASE_KEY` - Get from Supabase dashboard
- [ ] `PORT` - Default: 8000

### Frontend (.env.production)
- [ ] `VITE_API_URL` - Your backend URL

---

## Testing After Deployment

1. **Test Backend API**:
   ```bash
   curl https://your-backend-url.vercel.app/api/posts
   ```

2. **Test Frontend**:
   - Visit your frontend URL
   - Try creating a post
   - Try upvoting/downvoting
   - Check browser console for errors

---

## Troubleshooting

### Frontend Can't Reach Backend
- Check `VITE_API_URL` is set correctly
- Ensure backend is deployed and running
- Check CORS settings in `backend/server.js`

### Backend Errors
- Check environment variables are set
- Verify Supabase credentials
- Check logs: `vercel logs <project-name>`

### Database Issues
- Ensure Supabase tables exist: `posts`, `post_meta`, `comments`, `reports`
- Run schema SQL if needed: See `backend/supabase_schema.sql`

---

## Quick Deploy Command

After first setup, deploy with:
```bash
# Backend
cd backend && vercel --prod

# Frontend
cd college/collegescams && vercel --prod
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **React Vite Docs**: https://vitejs.dev
