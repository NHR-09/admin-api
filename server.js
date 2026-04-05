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
  try {
    serviceAccount = require('./serviceAccountKey.json');
    console.log('✅ Loaded Firebase config from serviceAccountKey.json');
  } catch {
    serviceAccount = require('./todo-a6267-firebase-adminsdk-fbsvc-c088bbea0e.json');
    console.log('✅ Loaded Firebase config from todo-a6267-firebase-adminsdk-fbsvc-c088bbea0e.json');
  }
} catch (error) {
  // Try to load from environment variable (Vercel)
  console.log('📝 Attempting to load from environment variables...');
  
  // Try individual environment variables first
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    console.log('🔍 Using individual Firebase environment variables');
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
      universe_domain: "googleapis.com"
    };
    console.log('✅ Successfully created Firebase config from individual env vars');
  }
  // Fallback to JSON string
  else if (process.env.FIREBASE_CONFIG) {
    try {
      console.log('🔍 FIREBASE_CONFIG found, parsing JSON...');
      serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
      console.log('✅ Successfully parsed FIREBASE_CONFIG');
    } catch (parseError) {
      console.error('❌ Failed to parse FIREBASE_CONFIG:', parseError.message);
      console.error('Raw FIREBASE_CONFIG length:', process.env.FIREBASE_CONFIG.length);
      console.error('First 100 chars:', process.env.FIREBASE_CONFIG.substring(0, 100));
      process.exit(1);
    }
  } else {
    console.error('❌ Firebase credentials not found!');
    console.error('Add serviceAccountKey.json or FIREBASE_CONFIG env variable');
    console.error('Or set individual env vars: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
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
    
    // Get user count
    const usersSnapshot = await db.collection('users').get();
    const usersCount = usersSnapshot.size;
    
    res.json({
      totalNotifications: notificationsCount.data().count,
      activeNotifications: activeNotifications.data().count,
      totalUsers: usersCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    
    const users = await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const stats = data.stats || {};
      
      // Get tasks count
      const tasksSnapshot = await db.collection('users').doc(doc.id).collection('tasks').get();
      const completedTasks = tasksSnapshot.docs.filter(t => t.data().completed).length;
      
      // Get lectures count
      const lecturesSnapshot = await db.collection('users').doc(doc.id).collection('lectures').get();
      const completedLectures = lecturesSnapshot.docs.filter(l => l.data().completed).length;
      
      // Handle timestamp conversion safely
      let lastActive = null;
      if (stats.lastActiveDate) {
        lastActive = stats.lastActiveDate;
      } else if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        lastActive = data.updatedAt.toDate().toISOString();
      }
      
      return {
        id: doc.id,
        username: stats.username || 'Super Hero',
        xp: stats.totalXP || 0,
        level: stats.currentLevel || 1,
        streakDays: stats.streakDays || 0,
        completedTasks: stats.totalTasksCompleted || completedTasks,
        completedLectures: stats.totalLecturesCompleted || completedLectures,
        totalTasks: tasksSnapshot.size,
        totalLectures: lecturesSnapshot.size,
        lastActiveDate: lastActive,
        currentTheme: stats.currentTheme || 'iron_man',
        totalStudyMinutes: stats.totalStudyMinutes || 0,
      };
    }));
    
    // Sort by last active date
    users.sort((a, b) => {
      if (!a.lastActiveDate) return 1;
      if (!b.lastActiveDate) return -1;
      return new Date(b.lastActiveDate) - new Date(a.lastActiveDate);
    });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user details
app.get('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const data = userDoc.data();
    const stats = data.stats || {};
    
    // Get user's tasks
    const tasksSnapshot = await db.collection('users').doc(id).collection('tasks').get();
    const tasks = tasksSnapshot.docs.map(doc => {
      const taskData = doc.data();
      return {
        id: doc.id,
        title: taskData.title || 'Untitled',
        description: taskData.description || '',
        completed: taskData.completed || false,
        xpValue: taskData.xpValue || 20,
        createdAt: taskData.createdAt || null,
        completedAt: taskData.completedAt || null,
        priority: taskData.priority || 1,
        category: taskData.category || 0,
      };
    });
    
    // Get user's lectures
    const lecturesSnapshot = await db.collection('users').doc(id).collection('lectures').get();
    const lectures = lecturesSnapshot.docs.map(doc => {
      const lectureData = doc.data();
      return {
        id: doc.id,
        title: lectureData.title || 'Untitled',
        subtitle: lectureData.subtitle || '',
        url: lectureData.url || '',
        completed: lectureData.completed || false,
        watchedSeconds: lectureData.watchedSeconds || 0,
        totalDurationSeconds: lectureData.totalDurationSeconds || 0,
        courseId: lectureData.courseId || null,
        courseTitle: lectureData.courseTitle || '',
        createdAt: lectureData.createdAt || null,
      };
    });
    
    // Skip daily stats to avoid Firebase index requirement
    const dailyStats = [];
    
    // Handle timestamp conversion safely
    let lastActive = null;
    if (stats.lastActiveDate) {
      lastActive = stats.lastActiveDate;
    } else if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
      lastActive = data.updatedAt.toDate().toISOString();
    }
    
    const userData = {
      id: userDoc.id,
      username: stats.username || 'Super Hero',
      xp: stats.totalXP || 0,
      level: stats.currentLevel || 1,
      heroTitle: _getHeroTitle(stats.currentLevel || 1),
      streakDays: stats.streakDays || 0,
      lastActiveDate: lastActive,
      totalTasksCompleted: stats.totalTasksCompleted || 0,
      totalLecturesCompleted: stats.totalLecturesCompleted || 0,
      totalStudyMinutes: stats.totalStudyMinutes || 0,
      currentTheme: stats.currentTheme || 'iron_man',
      unlockedThemes: stats.unlockedThemes ? stats.unlockedThemes.split(',') : ['iron_man'],
      tasks,
      lectures,
      dailyStats,
    };
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: error.message });
  }
});

function _getHeroTitle(level) {
  if (level >= 20) return 'LEGEND';
  if (level >= 15) return 'CHAMPION';
  if (level >= 10) return 'AVENGER';
  if (level >= 5) return 'AGENT';
  return 'RECRUIT';
}

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
