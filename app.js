require('dotenv').config();
const express = require('express');
const signupRouter=require('./src/routes/signup')
const loginRouter=require('./src/routes/login')
const patientRouter=require('./src/routes/patient')
const doctorRouter=require('./src/routes/doctor')
const connectDB = require('./src/config/database');
const cookieParser=require("cookie-parser");
const app=express()
app.use(express.json())

app.use(cookieParser());


app.use('/',signupRouter)
app.use('/',loginRouter)
app.use('/',patientRouter)
app.use('/',doctorRouter)

connectDB().then(()=>{
    console.log("DB connected")
    app.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
})

