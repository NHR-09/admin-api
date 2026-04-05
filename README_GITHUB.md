# Marvel Todo - Admin API

> Web-based admin panel and REST API for sending notifications to Marvel Todo app users

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-orange.svg)](https://firebase.google.com/)

## 🚀 Features

- 📢 **Send Notifications** - Broadcast updates, announcements, and features to all users
- 🎨 **Beautiful Dashboard** - Modern, responsive web interface
- 🔐 **Secure API** - API key authentication
- 📊 **Statistics** - View notification metrics
- 🗑️ **Manage Notifications** - View and delete sent notifications
- ☁️ **Firebase Integration** - Cloud-based storage with Firestore
- 🚀 **Easy Deployment** - Deploy to Railway, Heroku, or any Node.js host

## 📸 Screenshots

### Admin Dashboard
Beautiful, gradient-based UI for managing notifications.

### Notification Types
- 🔄 **Update** (Green) - App updates, bug fixes
- 📢 **Announcement** (Purple) - General announcements
- ✨ **Feature** (Orange) - New features
- 🔧 **Maintenance** (Gray) - Maintenance notices

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Cloud database
- **Firestore** - NoSQL database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📦 Installation

### Prerequisites

- Node.js 16 or higher
- Firebase project with Firestore enabled
- Firebase Admin SDK service account key

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/marvel-todo-admin-api.git
   cd marvel-todo-admin-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get Firebase Admin SDK key:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Click ⚙️ Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in the root directory

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PORT=3000
   ADMIN_API_KEY=your-super-secret-api-key-here
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the dashboard:**
   Open your browser: `http://localhost:3000`

## 🚀 Deployment

### Deploy to Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click the button above or go to [Railway.app](https://railway.app)
2. Create a new project from GitHub
3. Connect this repository
4. Add environment variables:
   - `ADMIN_API_KEY` - Your secret API key
5. Add `serviceAccountKey.json` as a secret file
6. Deploy!

Your API will be live at: `https://your-app.railway.app`

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create marvel-todo-admin

# Set environment variables
heroku config:set ADMIN_API_KEY=your-secret-key

# Deploy
git push heroku main

# Open dashboard
heroku open
```

### Deploy to DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create new app
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

### Deploy to AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/yourusername/marvel-todo-admin-api.git
cd marvel-todo-admin-api
npm install

# Install PM2
sudo npm install -g pm2

# Start server
pm2 start server.js --name marvel-admin

# Setup auto-restart
pm2 startup
pm2 save
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All endpoints (except `/health`) require an API key in the header:
```
x-api-key: your-api-key-here
```

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Notifications
```http
GET /api/notifications
Headers: x-api-key: your-key
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "New Feature",
      "message": "Check out our new feature!",
      "type": "feature",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "active": true,
      "actionUrl": "https://example.com",
      "imageUrl": null,
      "metadata": {}
    }
  ]
}
```

#### Broadcast Notification
```http
POST /api/notifications/broadcast
Headers: 
  Content-Type: application/json
  x-api-key: your-key

Body:
{
  "title": "New Feature Released!",
  "message": "Check out our new dark mode feature!",
  "type": "feature",
  "actionUrl": "https://yourapp.com/features"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification broadcasted to all users",
  "notification": { ... }
}
```

#### Delete Notification
```http
DELETE /api/notifications/:id
Headers: x-api-key: your-key
```

#### Get Statistics
```http
GET /api/stats
Headers: x-api-key: your-key
```

**Response:**
```json
{
  "totalNotifications": 10,
  "activeNotifications": 8,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 💻 Usage Examples

### cURL

```bash
# Send notification
curl -X POST http://localhost:3000/api/notifications/broadcast \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "title": "New Feature",
    "message": "Check out dark mode!",
    "type": "feature"
  }'

# Get all notifications
curl -H "x-api-key: your-api-key" \
  http://localhost:3000/api/notifications

# Get statistics
curl -H "x-api-key: your-api-key" \
  http://localhost:3000/api/stats
```

### JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/api/notifications/broadcast', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    title: 'New Feature',
    message: 'Check out our new feature!',
    type: 'feature'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

url = 'http://localhost:3000/api/notifications/broadcast'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
}
data = {
    'title': 'New Feature',
    'message': 'Check out our new feature!',
    'type': 'feature'
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## 🔒 Security

### Best Practices

1. **Change the default API key** immediately
2. **Use strong API keys** (at least 32 characters)
3. **Never commit** `serviceAccountKey.json` to Git
4. **Use HTTPS** in production
5. **Rotate API keys** regularly
6. **Monitor API usage** for suspicious activity
7. **Restrict API access** by IP if possible

### Environment Variables

Never commit these to Git:
- `ADMIN_API_KEY` - Your secret API key
- `serviceAccountKey.json` - Firebase Admin SDK key

## 📊 Database Schema

### Firestore Collection: `notifications`

```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Notification title
  message: string,               // Notification message
  type: string,                  // 'update' | 'announcement' | 'feature' | 'maintenance'
  createdAt: string,             // ISO 8601 timestamp
  active: boolean,               // Is notification active
  actionUrl?: string,            // Optional URL to open
  imageUrl?: string,             // Optional image URL
  metadata?: object,             // Optional metadata
  broadcast?: boolean            // Is broadcast notification
}
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in .env
PORT=3001
```

**Cannot find serviceAccountKey.json:**
- Make sure the file is in the root directory
- Check file name is exactly `serviceAccountKey.json`

**401 Unauthorized:**
- Verify API key matches `.env` file
- Check header is `x-api-key` (lowercase)
- Remove any extra spaces

**Cannot connect to Firebase:**
- Verify `serviceAccountKey.json` is valid
- Check Firestore is enabled in Firebase Console
- Verify network connectivity

## 📈 Monitoring

### Check Server Status
```bash
curl http://localhost:3000/health
```

### View Logs (PM2)
```bash
pm2 logs marvel-admin
```

### View Logs (Heroku)
```bash
heroku logs --tail
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for [Marvel Todo](https://github.com/yourusername/marvel-todo) app
- Uses [Firebase](https://firebase.google.com/) for cloud storage
- Powered by [Express.js](https://expressjs.com/)

## 📞 Support

- **Documentation:** See this README
- **Issues:** [GitHub Issues](https://github.com/yourusername/marvel-todo-admin-api/issues)
- **Email:** your-email@example.com

## 🔮 Roadmap

- [ ] Push notifications (FCM)
- [ ] Scheduled notifications
- [ ] User-specific targeting
- [ ] Rich media support
- [ ] Notification templates
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] Multi-language support

---

**Built with ❤️ for Marvel Todo**

[Report Bug](https://github.com/yourusername/marvel-todo-admin-api/issues) · [Request Feature](https://github.com/yourusername/marvel-todo-admin-api/issues)
