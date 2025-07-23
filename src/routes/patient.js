const express = require('express');

const {userAuth}=require('../middlewares/userAuth')
const patientController = require('../controllers/patientController');

const patientRouter = express.Router();

patientRouter.patch('/patient/update/profile/:patientId',userAuth,patientController.updatePatientProfile)
patientRouter.get('/patient/get/profile/:patientId',patientController.getPatientProfile)
patientRouter.get('/alldoctors',userAuth,patientController.getAllDoctors)
patientRouter.post('/book/appointment/:doctorId',userAuth,patientController.bookAppointment)
patientRouter.get('/get/appointments/:patientId',userAuth,patientController.bookedAppointments)
patientRouter.post('/feedback/submit',userAuth,patientController.submitFeedback);


module.exports = patientRouter;