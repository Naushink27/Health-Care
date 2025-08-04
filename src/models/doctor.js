const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  profilePicture: String,
  age: Number,
  contactNumber: String,
  specialization: String,
  experience: Number,
  qualification: String,
  hospitalName: String,
  address: String,
  about: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });


const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
