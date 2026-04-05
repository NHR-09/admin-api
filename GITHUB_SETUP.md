# Setup Script for GitHub Repository

## Step-by-Step Guide to Create GitHub Repo

### 1. Prepare the Admin API Directory

First, make sure you're in the admin_api directory:

```bash
cd admin_api
```

### 2. Initialize Git (if not already done)

```bash
git init
```

### 3. Create .gitignore (already exists)

The `.gitignore` file is already created with:
- node_modules/
- .env
- serviceAccountKey.json
- logs/
- *.log

### 4. Rename README for GitHub

```bash
# Windows
move README.md README_OLD.md
move README_GITHUB.md README.md

# macOS/Linux
mv README.md README_OLD.md
mv README_GITHUB.md README.md
```

### 5. Stage All Files

```bash
git add .
```

### 6. Create Initial Commit

```bash
git commit -m "Initial commit: Marvel Todo Admin API

- Express REST API for notifications
- Firebase Admin SDK integration
- Beautiful web dashboard
- API key authentication
- Complete documentation
- Ready for deployment"
```

### 7. Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**

```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: See https://github.com/cli/cli#installation

# Login to GitHub
gh auth login

# Create repository
gh repo create marvel-todo-admin-api --public --source=. --remote=origin --push

# Or for private repo
gh repo create marvel-todo-admin-api --private --source=. --remote=origin --push
```

**Option B: Using GitHub Website**

1. Go to https://github.com/new
2. Repository name: `marvel-todo-admin-api`
3. Description: `Admin API and web dashboard for Marvel Todo app - Send notifications to users`
4. Choose Public or Private
5. Don't initialize with README (we already have one)
6. Click "Create repository"

Then connect your local repo:

```bash
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
git branch -M main
git push -u origin main
```

### 8. Verify Repository

```bash
# Check remote
git remote -v

# Check status
git status

# View on GitHub
gh repo view --web
# Or manually go to: https://github.com/YOUR_USERNAME/marvel-todo-admin-api
```

### 9. Add Repository Topics (Optional)

On GitHub website:
- Go to your repository
- Click ⚙️ next to "About"
- Add topics: `nodejs`, `express`, `firebase`, `admin-panel`, `notification-system`, `rest-api`

### 10. Enable GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for auto-deployment.

## Quick Commands (Copy-Paste)

### For Windows (PowerShell)

```powershell
cd admin_api
git init
git add .
git commit -m "Initial commit: Marvel Todo Admin API"

# Then create repo on GitHub and run:
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
git branch -M main
git push -u origin main
```

### For macOS/Linux (Bash)

```bash
cd admin_api
git init
git add .
git commit -m "Initial commit: Marvel Todo Admin API"

# Then create repo on GitHub and run:
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
git branch -M main
git push -u origin main
```

## Files That Will Be Committed

✅ Included:
- server.js
- package.json
- public/index.html
- .env.example
- .gitignore
- README.md
- LICENSE
- DEPLOYMENT.md

❌ Excluded (in .gitignore):
- node_modules/
- .env
- serviceAccountKey.json
- *.log

## After Pushing to GitHub

### 1. Add Repository Description

On GitHub:
- Go to your repository
- Click "Edit" next to the description
- Add: "Admin API and web dashboard for Marvel Todo app - Send notifications to users"

### 2. Add Website URL (After Deployment)

- Click "Edit" next to "About"
- Add your deployed URL: `https://your-app.railway.app`

### 3. Update README with Your URLs

Replace placeholders in README.md:
- `yourusername` → Your GitHub username
- `your-email@example.com` → Your email
- Add screenshots (optional)

### 4. Create Releases (Optional)

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Deploy to Railway

After pushing to GitHub:

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `marvel-todo-admin-api`
5. Add environment variables:
   - `ADMIN_API_KEY` = your-secret-key
6. Upload `serviceAccountKey.json`
7. Deploy!

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
```

### "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### "Permission denied (publickey)"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/marvel-todo-admin-api.git
```

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Railway/Heroku
3. ✅ Test the deployed API
4. ✅ Update Flutter app with production URL
5. ✅ Send your first notification!

---

**Need Help?**
- GitHub Docs: https://docs.github.com
- Railway Docs: https://docs.railway.app
- Heroku Docs: https://devcenter.heroku.com

**Happy Deploying! 🚀**
