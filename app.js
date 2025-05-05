require('dotenv').config();
const express = require('express');
const signupRouter=require('./src/routes/signup')
const loginRouter=require('./src/routes/login')
const connectDB = require('./src/config/database');
const app=express()
app.use(express.json())


app.use('/',signupRouter)
app.use('/',loginRouter)

connectDB().then(()=>{
    console.log("DB connected")
    app.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
})

