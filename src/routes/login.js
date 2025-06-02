const express= require('express');
const {loginUser, logoutUser}= require('../controllers/loginController')
const loginRouter= express.Router();

loginRouter.post('/login',loginUser)
loginRouter.post('/logout',logoutUser)
module.exports= loginRouter;