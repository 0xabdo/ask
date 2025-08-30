# 🚀 Quick Railway Deployment Guide

## Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect Node.js and deploy**

## Step 2: Set Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://jawabak.netlify.app
NODE_ENV=production
```

## Step 3: Get Your Backend URL

After deployment, Railway will give you a URL like:
`https://your-app-name.railway.app`

## Step 4: Update Netlify

1. **Go to Netlify dashboard**
2. **Your site settings**
3. **Environment variables**
4. **Add**: `REACT_APP_API_URL=https://your-app-name.railway.app`
5. **Redeploy** your site

## Step 5: Test

1. **Go to your Netlify site**
2. **Try admin login** at `/admin`
3. **Submit a test question**

## MongoDB Setup (if you don't have one)

1. **Go to [mongodb.com](https://mongodb.com)**
2. **Create free account**
3. **Create cluster**
4. **Get connection string**
5. **Add to Railway variables**

## Quick Commands for Local Testing

```bash
# Test locally first
npm install
node setup.js
npm start

# Backend will run on http://localhost:5000
# Test admin login with credentials from setup
```

## Troubleshooting

- **CORS errors**: Make sure `FRONTEND_URL` is set correctly
- **MongoDB errors**: Check connection string
- **Email errors**: Use Gmail app password, not regular password
