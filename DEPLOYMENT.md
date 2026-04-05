# Deployment Guide

Complete guide for deploying the Marvel Todo Admin API to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Easiest - Recommended)

**Time: 5 minutes**

1. **Create Railway Account:**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `marvel-todo-admin-api` repository
   - Railway will auto-detect Node.js

3. **Configure:**
   - Go to Variables tab
   - Add: `ADMIN_API_KEY` = `your-secret-key-here`
   - Add: `PORT` = `3000` (optional, Railway sets this automatically)

4. **Upload Firebase Key:**
   - Go to Settings → Raw Editor
   - Upload `serviceAccountKey.json`
   - Or add as environment variable (base64 encoded)

5. **Deploy:**
   - Railway automatically deploys
   - Get your URL: `https://your-app.railway.app`

**Cost:** Free tier available, then $5/month

---

### Option 2: Heroku

**Time: 10 minutes**

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   cd admin_api
   heroku create marvel-todo-admin
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set ADMIN_API_KEY=your-secret-key-here
   ```

5. **Add Firebase Key:**
   ```bash
   # Option A: As environment variable (base64)
   cat serviceAccountKey.json | base64 | heroku config:set FIREBASE_KEY_BASE64=-
   
   # Option B: Commit to private repo (not recommended)
   # Make sure .gitignore doesn't include it
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

7. **Open:**
   ```bash
   heroku open
   ```

**Cost:** Free tier discontinued, starts at $7/month

---

### Option 3: Render

**Time: 7 minutes**

1. **Create Account:**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `marvel-todo-admin-api`

3. **Configure:**
   - **Name:** `marvel-todo-admin`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   - Add `ADMIN_API_KEY` = `your-secret-key`
   - Add `PORT` = `10000` (Render default)

5. **Upload Firebase Key:**
   - Go to Environment → Secret Files
   - Upload `serviceAccountKey.json`

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment

**Cost:** Free tier available

---

### Option 4: DigitalOcean App Platform

**Time: 10 minutes**

1. **Create Account:**
   - Go to [DigitalOcean](https://www.digitalocean.com/)
   - Sign up and add payment method

2. **Create App:**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select `marvel-todo-admin-api`

3. **Configure:**
   - **Name:** `marvel-todo-admin`
   - **Type:** Web Service
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

4. **Environment Variables:**
   - Add `ADMIN_API_KEY`
   - Add Firebase key as encrypted variable

5. **Deploy:**
   - Click "Create Resources"
   - Wait for deployment

**Cost:** $5/month minimum

---

### Option 5: AWS EC2 (Advanced)

**Time: 30 minutes**

1. **Launch EC2 Instance:**
   - Go to AWS Console → EC2
   - Launch Ubuntu 22.04 instance
   - Choose t2.micro (free tier)
   - Configure security group (allow port 80, 443, 22)

2. **Connect to Instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install Git:**
   ```bash
   sudo apt-get install git
   ```

5. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/marvel-todo-admin-api.git
   cd marvel-todo-admin-api
   ```

6. **Install Dependencies:**
   ```bash
   npm install
   ```

7. **Configure Environment:**
   ```bash
   nano .env
   # Add ADMIN_API_KEY and PORT
   ```

8. **Upload Firebase Key:**
   ```bash
   # From local machine
   scp -i your-key.pem serviceAccountKey.json ubuntu@your-ec2-ip:~/marvel-todo-admin-api/
   ```

9. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

10. **Start Server:**
    ```bash
    pm2 start server.js --name marvel-admin
    pm2 startup
    pm2 save
    ```

11. **Setup Nginx (Optional):**
    ```bash
    sudo apt-get install nginx
    sudo nano /etc/nginx/sites-available/default
    ```
    
    Add:
    ```nginx
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```
    
    ```bash
    sudo systemctl restart nginx
    ```

12. **Setup SSL (Optional):**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

**Cost:** Free tier for 12 months, then ~$10/month

---

### Option 6: Google Cloud Run

**Time: 15 minutes**

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 8080
   CMD ["npm", "start"]
   ```

2. **Build and Push:**
   ```bash
   gcloud builds submit --tag gcr.io/your-project/marvel-admin
   ```

3. **Deploy:**
   ```bash
   gcloud run deploy marvel-admin \
     --image gcr.io/your-project/marvel-admin \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars ADMIN_API_KEY=your-key
   ```

**Cost:** Free tier available, pay per use

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default API key to a strong, random key
- [ ] Never commit `serviceAccountKey.json` to Git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Monitor API usage
- [ ] Set up rate limiting (optional)
- [ ] Configure firewall rules
- [ ] Enable logging
- [ ] Set up backups

## 🔧 Post-Deployment

### 1. Test Your Deployment

```bash
# Health check
curl https://your-app-url.com/health

# Test API (replace with your API key)
curl -H "x-api-key: your-key" https://your-app-url.com/api/stats
```

### 2. Update Flutter App

Update your Flutter app to use the production URL:

```dart
// lib/services/notification_service.dart
static const String API_URL = 'https://your-app-url.com';
```

### 3. Monitor

- Check logs regularly
- Monitor API usage
- Set up alerts for errors
- Track notification delivery

### 4. Backup

- Backup Firebase data regularly
- Keep a copy of your API keys
- Document your deployment

## 📊 Comparison Table

| Platform | Ease | Cost | Free Tier | SSL | Auto-Deploy |
|----------|------|------|-----------|-----|-------------|
| Railway | ⭐⭐⭐⭐⭐ | $5/mo | Yes | ✅ | ✅ |
| Render | ⭐⭐⭐⭐⭐ | Free | Yes | ✅ | ✅ |
| Heroku | ⭐⭐⭐⭐ | $7/mo | No | ✅ | ✅ |
| DigitalOcean | ⭐⭐⭐⭐ | $5/mo | No | ✅ | ✅ |
| AWS EC2 | ⭐⭐⭐ | $10/mo | 12mo | ⚠️ | ❌ |
| Google Cloud | ⭐⭐⭐ | Pay/use | Yes | ✅ | ⚠️ |

**Recommendation:** Railway or Render for easiest deployment with free tier.

## 🆘 Troubleshooting

### Deployment Fails

**Check:**
- Node.js version (should be 16+)
- All dependencies in package.json
- Build command is correct
- Start command is correct

### App Crashes on Start

**Check:**
- Environment variables are set
- serviceAccountKey.json is uploaded
- Port is correct
- Logs for error messages

### Cannot Access Dashboard

**Check:**
- URL is correct
- App is running
- Firewall allows traffic
- SSL certificate is valid

### 401 Unauthorized

**Check:**
- API key is set correctly
- No extra spaces in API key
- Header is `x-api-key` (lowercase)

## 📞 Need Help?

- Check platform-specific documentation
- Review logs for errors
- Test locally first
- Verify all environment variables

---

**Happy Deploying! 🚀**
