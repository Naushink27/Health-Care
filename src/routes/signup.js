const express = require('express');
const signupRouter= express.Router();
const { signupUser } = require('../controllers/signupController');

signupRouter.post('/signup',signupUser)

module.exports = signupRouter;