require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const app=express()


connectDB().then(()=>{
    console.log("DB connected")
    app.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
})

