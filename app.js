require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors=require('cors')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const signupRouter = require('./src/routes/signup');
const loginRouter = require('./src/routes/login');
const patientRouter = require('./src/routes/patient');
const doctorRouter = require('./src/routes/doctor');
const adminRouter = require('./src/routes/admin');
const connectDB = require('./src/config/database');
const Message = require('./src/models/Message');
const Appointment = require('./src/models/Appointment');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                 
}));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', signupRouter);
app.use('/', loginRouter);
app.use('/', patientRouter);
app.use('/', doctorRouter);
app.use('/', adminRouter);

// Store connected clients
const clients = new Map(); // userId -> WebSocket

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  // Extract JWT from cookie or initial message
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      const { token, type, userId, receiverId, appointmentId, content } = message;

      // Handle initial connection with token
      if (type === 'connect') {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Assume JWT contains userId

        // Store WebSocket connection
        clients.set(userId, ws);
        ws.userId = userId; // Attach userId to WebSocket

        ws.send(JSON.stringify({ status: 'connected', message: 'Connected to chat' }));
        return;
      }

      // Handle chat message
      if (type === 'message') {
        // Verify appointment
        const appointment = await Appointment.findOne({
          _id: appointmentId,
          status: 'confirmed',
          $or: [
            { patientId: userId, doctorId: receiverId },
            { patientId: receiverId, doctorId: userId },
          ],
        });

        if (!appointment) {
          ws.send(JSON.stringify({ status: 'error', message: 'No confirmed appointment' }));
          return;
        }

        // Save message
        const newMessage = new Message({
          senderId: userId,
          receiverId,
          appointmentId,
          content,
        });
        await newMessage.save();

        // Send to receiver
        const receiverWs = clients.get(receiverId);
        if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
          receiverWs.send(JSON.stringify({
            senderId: userId,
            content,
            timestamp: newMessage.timestamp,
          }));
        }

        // Confirm to sender
        ws.send(JSON.stringify({ status: 'sent', message: 'Message sent' }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ status: 'error', message: 'Invalid message or token' }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    clients.delete(ws.userId);
    console.log(`Client ${ws.userId} disconnected`);
  });
});

// API to get chat history
app.get('/chat/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const messages = await Message.find({ appointmentId }).sort({ timestamp: 1 });
  res.json(messages);
});

// Start server
connectDB().then(() => {
  console.log("DB connected");
  server.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
});