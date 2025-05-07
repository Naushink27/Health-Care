const express = require('express');
const doctorController = require('../controllers/doctorController');
const doctorRouter = express.Router();
const {doctorAuth} = require('../middlewares/doctorAuth')
doctorRouter.patch('/doctor/update/profile/:doctorId',doctorAuth, doctorController.updateDoctorProfile);
doctorRouter.get('/doctor/get/profile/:doctorId',doctorAuth, doctorController.getDoctorProfile);

module.exports = doctorRouter;
