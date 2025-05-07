const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    age: { type: Number },
    specialization: { type: String },
    experience: { type: Number },
    qualification: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    about: { type: String },
    profilePicture: { type: String },
    hospitalName: { type: String },
}, { timestamps: true });


const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
