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
const Appointment = require('./src/models/appointment');

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






// Start server
connectDB().then(() => {
  console.log("DB connected");
  server.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
});