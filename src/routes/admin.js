const express = require('express');
const {adminAuth}=require('../middlewares/adminAuth')
const adminController = require('../controllers/adminController');
const adminRouter = express.Router();

adminRouter.get('/get/allpatients',adminAuth,adminController.getAllPatients)
adminRouter.get('/get/alldoctors',adminAuth,adminController.getAllDoctors)
adminRouter.get('/get/allappointments',adminAuth,adminController.getAllAppointments)
adminRouter.delete('/delete/patient/:patientId',adminAuth,adminController.deletePatient)
adminRouter.delete('/delete/doctor/:doctorId',adminAuth,adminController.deleteDoctor)
module.exports = adminRouter;