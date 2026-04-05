const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Firebase Admin
let serviceAccount;
try {
  // Try to load from file (local development)
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  // Try to load from environment variable (Vercel)
  if (process.env.FIREBASE_CONFIG) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  } else {
    console.error('❌ Firebase credentials not found!');
    console.error('Add serviceAccountKey.json or FIREBASE_CONFIG env variable');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Simple API key authentication
const API_KEY = process.env.ADMIN_API_KEY || 'your-secret-api-key-change-this';

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all notifications
app.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification
app.post('/api/notifications', authenticate, async (req, res) => {
  try {
    const { title, message, type, actionUrl, imageUrl, metadata } = req.body;
    
    if (!title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, message, type' 
      });
    }

    const notification = {
      id: uuidv4(),
      title,
      message,
      type, // 'update', 'announcement', 'feature', 'maintenance'
      createdAt: new Date().toISOString(),
      active: true,
      actionUrl: actionUrl || null,
      imageUrl: imageUrl || null,
      metadata: metadata || {}
    };

    await db.collection('notifications').doc(notification.id).set(notification);
    
    res.status(201).json({ 
      success: true, 
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update notification
app.put('/api/notifications/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('notifications').doc(id).update(updates);
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
app.delete('/api/notifications/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).delete();
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate notification (soft delete)
app.post('/api/notifications/:id/deactivate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).update({ active: false });
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Broadcast notification to all users
app.post('/api/notifications/broadcast', authenticate, async (req, res) => {
  try {
    const { title, message, type, actionUrl, imageUrl } = req.body;
    
    if (!title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, message, type' 
      });
    }

    const notification = {
      id: uuidv4(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      active: true,
      actionUrl: actionUrl || null,
      imageUrl: imageUrl || null,
      broadcast: true
    };

    await db.collection('notifications').doc(notification.id).set(notification);
    
    res.status(201).json({ 
      success: true, 
      message: 'Notification broadcasted to all users',
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get app statistics
app.get('/api/stats', authenticate, async (req, res) => {
  try {
    const notificationsCount = await db.collection('notifications').count().get();
    const activeNotifications = await db.collection('notifications')
      .where('active', '==', true)
      .count()
      .get();
    
    res.json({
      totalNotifications: notificationsCount.data().count,
      activeNotifications: activeNotifications.data().count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Admin API running on http://localhost:${PORT}`);
    console.log(`📝 API Key: ${API_KEY}`);
    console.log(`🔐 Use header: x-api-key: ${API_KEY}`);
  });
}

// Export for Vercel
module.exports = app;
