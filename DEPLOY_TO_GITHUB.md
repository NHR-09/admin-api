# 🚀 Deploy Admin API to GitHub - Quick Guide

## Option 1: Automated Setup (Recommended)

### Windows (PowerShell)

```powershell
cd admin_api
.\setup-github.ps1
```

### macOS/Linux (Bash)

```bash
cd admin_api
chmod +x setup-github.sh
./setup-github.sh
```

The script will:
- ✅ Initialize Git repository
- ✅ Prepare README for GitHub
- ✅ Check for sensitive files
- ✅ Create initial commit
- ✅ Help you create GitHub repository
- ✅ Push code to GitHub

---

## Option 2: Manual Setup

### Step 1: Prepare Files

```bash
cd admin_api

# Rename README
# Windows:
move README.md README_OLD.md
move README_GITHUB.md README.md

# macOS/Linux:
mv README.md README_OLD.md
mv README_GITHUB.md README.md
```

### Step 2: Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Marvel Todo Admin API"
```

### Step 3: Create GitHub Repository

**Using GitHub CLI:**
```bash
gh auth login
gh repo create marvel-todo-admin-api --public --source=. --remote=origin --push
```

**Using GitHub Website:**
1. Go to https://github.com/new
2. Repository name: `marvel-todo-admin-api`
3. Description: `Admin API and web dashboard for Marvel Todo app`
4. Choose Public or Private
5. Don't initialize with README
6. Click "Create repository"

### Step 4: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
git branch -M main
git push -u origin main
```

---

## What Gets Committed

### ✅ Included Files:
- `server.js` - Main server file
- `package.json` - Dependencies
- `public/index.html` - Admin dashboard
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules
- `README.md` - Documentation
- `LICENSE` - MIT License
- `DEPLOYMENT.md` - Deployment guide
- `GITHUB_SETUP.md` - Setup instructions

### ❌ Excluded Files (in .gitignore):
- `node_modules/` - Dependencies (will be installed on deploy)
- `.env` - Your environment variables
- `serviceAccountKey.json` - Firebase key (NEVER commit this!)
- `*.log` - Log files

---

## After Pushing to GitHub

### 1. Verify Repository

Go to: `https://github.com/YOUR_USERNAME/marvel-todo-admin-api`

You should see:
- ✅ All files listed above
- ✅ README displayed on homepage
- ✅ No sensitive files (serviceAccountKey.json, .env)

### 2. Add Repository Details

On GitHub:
- Click "Edit" next to "About"
- Add description: "Admin API and web dashboard for Marvel Todo app - Send notifications to users"
- Add topics: `nodejs`, `express`, `firebase`, `admin-panel`, `notification-system`, `rest-api`

### 3. Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `marvel-todo-admin-api`
6. Railway auto-detects Node.js

**Add Environment Variables:**
- Click on your service
- Go to "Variables" tab
- Add: `ADMIN_API_KEY` = `your-secret-key-here`

**Upload Firebase Key:**
- Option A: Go to "Settings" → "Raw Editor" → Upload `serviceAccountKey.json`
- Option B: Add as base64 environment variable

**Deploy:**
- Railway automatically deploys
- Get your URL: `https://your-app.railway.app`

### 4. Test Deployment

```bash
# Health check
curl https://your-app.railway.app/health

# Test API
curl -H "x-api-key: your-key" https://your-app.railway.app/api/stats
```

### 5. Update Flutter App

Update your Flutter app to use the production URL:

```dart
// lib/services/notification_service.dart
static const String API_URL = 'https://your-app.railway.app';
```

---

## Troubleshooting

### "Permission denied (publickey)"

Use HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
```

### "remote origin already exists"

Remove and re-add:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
```

### "failed to push some refs"

Pull first:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Script won't run (Windows)

Enable script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script won't run (macOS/Linux)

Make executable:
```bash
chmod +x setup-github.sh
```

---

## Security Checklist

Before deploying:

- [ ] Changed default API key in `.env`
- [ ] Verified `serviceAccountKey.json` is NOT in Git
- [ ] Verified `.env` is NOT in Git
- [ ] Added `.gitignore` to repository
- [ ] Used strong API key (32+ characters)
- [ ] Enabled HTTPS on deployment platform

---

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Railway/Heroku
3. ✅ Add environment variables
4. ✅ Upload Firebase key
5. ✅ Test deployed API
6. ✅ Update Flutter app URL
7. ✅ Send first notification!

---

## Quick Commands Reference

### Check Git Status
```bash
git status
git log --oneline
git remote -v
```

### Update Repository
```bash
git add .
git commit -m "Update: description of changes"
git push
```

### View on GitHub
```bash
# Using GitHub CLI
gh repo view --web

# Or manually
# https://github.com/YOUR_USERNAME/marvel-todo-admin-api
```

---

## Need Help?

- **GitHub Docs:** https://docs.github.com
- **Railway Docs:** https://docs.railway.app
- **Heroku Docs:** https://devcenter.heroku.com
- **Git Basics:** https://git-scm.com/book/en/v2

---

**Happy Deploying! 🚀**

Your admin API will be live and ready to send notifications to your users!
