require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import routes and DB config
const signupRouter = require('./src/routes/signup');
const loginRouter = require('./src/routes/login');
const patientRouter = require('./src/routes/patient');
const doctorRouter = require('./src/routes/doctor');
const adminRouter = require('./src/routes/admin');
const connectDB = require('./src/config/database');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                 
}));
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
  app.listen(7777, () => {
    console.log("Server is running on port 7777");
  });
});
