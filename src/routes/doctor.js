const express = require('express');
const doctorController = require('../controllers/doctorController');
const doctorRouter = express.Router();
const {doctorAuth} = require('../middlewares/doctorAuth')
doctorRouter.patch('/doctor/update/profile/:doctorId',doctorAuth, doctorController.updateDoctorProfile);
doctorRouter.get('/doctor/get/profile/:doctorId', doctorController.getDoctorProfile);
doctorRouter.get('/doctor/check/appointments/:doctorId',doctorAuth, doctorController.checkAppointments);
doctorRouter.patch('/doctor/update/appointment/:appointmentId',doctorAuth, doctorController.updateAppointmentStatus);
doctorRouter.get('/doctor/get/feedback/:doctorId', doctorAuth, doctorController.getFeedback);
module.exports = doctorRouter;
