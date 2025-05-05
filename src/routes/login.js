const express= require('express');
const {loginUser}= require('../controllers/loginController')
const loginRouter= express.Router();

loginRouter.post('/login',loginUser)
module.exports= loginRouter;