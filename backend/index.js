require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectMySQL, initSchema, getPool } = require('./config/db');
const { connectMongo } = require('./config/mongo');
const { verifyToken } = require('./config/firebase');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Initialize Databases
let dbPool;
const initDbs = async () => {
  dbPool = await connectMySQL();
  if (dbPool) await initSchema(dbPool);
  await connectMongo();
};
initDbs();

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// --- API Endpoints ---

// 1. Fetch assigned shift/checkpoints (Mocked for POC)
app.get('/api/shift/today', verifyToken, async (req, res) => {
  const mockShift = {
    shiftId: 'SH-1024',
    siteName: 'Hinjewadi IT Campus',
    checkpoints: [
      { id: 1, name: 'Main Gate', lat: 18.5913, lng: 73.7389 },
      { id: 2, name: 'Server Room', lat: 18.5915, lng: 73.7390 },
      { id: 3, name: 'Parking Lot', lat: 18.5910, lng: 73.7385 },
    ]
  };
  res.json({ success: true, data: mockShift });
});

// 2. Submit completed checklist
app.post('/api/patrol/submit', verifyToken, async (req, res) => {
  const { shiftId, checklistResponses, location } = req.body;
  const uid = req.user.uid;
  console.log(`[PATROL] Checklist submitted by ${uid} for shift ${shiftId}`);
  
  try {
    const pool = getPool();
    if (pool && checklistResponses && checklistResponses.length > 0) {
      for (const response of checklistResponses) {
        // imageRef mock since actual image upload is pending Phase 2 cloud storage
        const imageRef = response.photoUri ? `img_${Date.now()}_${response.id}` : null;
        
        await pool.execute(
          'INSERT INTO patrol_logs (user_id, shift_id, checkpoint_name, status, remarks, image_ref) VALUES (?, ?, ?, ?, ?, ?)',
          [uid, shiftId, response.title, response.status, response.remarks || '', imageRef]
        );
      }
      console.log('Saved checklist to MySQL patrol_logs.');
    }
    
    // TODO: Save any MongoDB specific high-res imagery mappings here later
    
    res.status(201).json({ success: true, message: 'Patrol checklist saved successfully.' });
  } catch (error) {
    console.error('Error saving patrol log:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// 3. Submit occurrence logs
app.post('/api/occurrences', verifyToken, async (req, res) => {
  const { occurrences, shiftId } = req.body;
  console.log(`[OCCURRENCE] Received ${occurrences?.length || 0} occurrences from ${req.user.uid}`);
  // TODO: Save to MongoDB
  res.status(201).json({ success: true, message: 'Occurrences logged successfully.' });
});

// 4. Trigger SOS alert
app.post('/api/sos', verifyToken, async (req, res) => {
  const { location, batteryLevel } = req.body;
  console.log(`[SOS] ALERT TRIGGERED by ${req.user.uid} at location`, location);
  
  // Broadcast via Socket.io to any listening command centers
  io.emit('emergency_sos', {
    userId: req.user.uid,
    location,
    batteryLevel,
    timestamp: new Date()
  });

  res.status(200).json({ success: true, message: 'SOS Alert Broadcasted' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
