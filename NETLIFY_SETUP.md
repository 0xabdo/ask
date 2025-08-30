# 🚀 Netlify Setup with Backend Proxy

## Current Configuration

Your `netlify.toml` is now configured to:
- ✅ Build React app from `client/` folder
- ✅ Proxy API calls to your backend server
- ✅ Serve React app for all other routes
- ✅ Add security headers

## Step 1: Deploy Backend

You still need to deploy your backend to a cloud service:

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Deploy automatically
4. Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Get your backend URL

## Step 2: Update Netlify Configuration

After deploying your backend, update the `netlify.toml` file:

```toml
# Change this line in netlify.toml:
to = "https://your-backend-url.com/api/:splat"
```

Replace `https://your-backend-url.com` with your actual backend URL.

## Step 3: Set Environment Variables

In your backend deployment (Railway/Render), set these variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://jawabak.netlify.app
NODE_ENV=production
```

## Step 4: How It Works

1. **User visits**: `https://jawabak.netlify.app/admin`
2. **Netlify serves**: React app
3. **React makes API call**: `/api/admin/login`
4. **Netlify proxies**: `/api/admin/login` → `https://your-backend.com/api/admin/login`
5. **Backend responds**: With login data
6. **React receives**: The response

## Step 5: Test

1. Deploy backend to Railway/Render
2. Update `netlify.toml` with your backend URL
3. Push changes to GitHub
4. Netlify will auto-deploy
5. Test admin login at `https://jawabak.netlify.app/admin`

## Troubleshooting

- **404 errors**: Check your backend URL in `netlify.toml`
- **CORS errors**: Make sure `FRONTEND_URL` is set in backend
- **Database errors**: Check MongoDB connection string
- **Email errors**: Verify Gmail app password

## Quick Commands

```bash
# Test locally first
npm install
node setup.js
npm start

# In another terminal
cd client
npm install
npm start
```
