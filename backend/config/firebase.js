const admin = require('firebase-admin');

let isFirebaseInitialized = false;

try {
  // If we have a local service account file, initialize
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseInitialized = true;
    console.log('Firebase Admin initialized');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found. Firebase Admin is NOT initialized. Using mock auth for POC.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

// Express middleware for verifying Firebase ID tokens
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!isFirebaseInitialized) {
    // Mock token verification for POC
    console.log(`[MOCK AUTH] Verifying token: ${token.substring(0, 10)}...`);
    req.user = { uid: 'MOCK_USER_1042', role: 'Supervisor' };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { admin, verifyToken };
