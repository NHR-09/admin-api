# Deploy to GitHub & Vercel

## Step 1: Push to GitHub

```bash
cd admin_api
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/admin-api.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `admin-api` repository
5. Add environment variable:
   - Name: `ADMIN_API_KEY`
   - Value: `your-secret-key-here`
6. Click "Deploy"

## Step 3: Upload Firebase Key

After deployment:
1. Go to your project settings in Vercel
2. Go to "Environment Variables"
3. Add `FIREBASE_CONFIG` as a secret
4. Paste your `serviceAccountKey.json` content (as JSON string)

OR upload via Vercel CLI:
```bash
npm i -g vercel
vercel
vercel env add FIREBASE_CONFIG
# Paste serviceAccountKey.json content
```

## Step 4: Update Flutter App

```dart
// lib/services/notification_service.dart
static const String API_URL = 'https://your-app.vercel.app';
```

Done! Your API is live at `https://your-app.vercel.app`
