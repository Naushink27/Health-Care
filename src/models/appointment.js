const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({

  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'rejected'] },
  isVideoCall: { type: Boolean, default: false },
  description: { type: String, required: true },
}, { timestamps: true });


const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;