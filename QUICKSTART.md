# Quick Deploy Guide

## 1. Push to GitHub (2 minutes)

```bash
cd admin_api
git init
git add .
git commit -m "Admin API"
```

Create repo on GitHub: https://github.com/new (name it `admin-api`)

```bash
git remote add origin https://github.com/YOUR_USERNAME/admin-api.git
git push -u origin main
```

## 2. Deploy to Vercel (3 minutes)

1. Go to https://vercel.com/new
2. Import your `admin-api` repo
3. Add environment variables:
   - `ADMIN_API_KEY` = `your-secret-key`
   - `FIREBASE_CONFIG` = (paste entire serviceAccountKey.json content)
4. Click Deploy

Done! Your API is live at: `https://your-app.vercel.app`

## 3. Test It

```bash
curl https://your-app.vercel.app/health
```

## 4. Update Flutter App

Change API URL in your Flutter app to: `https://your-app.vercel.app`

That's it! 🎉
