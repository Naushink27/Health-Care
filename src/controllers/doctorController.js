const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const User = require('../models/User');
const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { age, specialization, experience, qualification, contactNumber, address, about, profilePicture, hospitalName } = req.body;
    
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Validation for required fields
    if (!specialization || !qualification) {
      return res.status(400).json({ message: 'Specialization and qualification are required' });
    }
    if (age && (isNaN(age) || age < 22 || age > 100)) {
      return res.status(400).json({ message: 'Age must be between 22 and 100' });
    }
    if (experience && (isNaN(experience) || experience < 0)) {
      return res.status(400).json({ message: 'Experience must be a positive number' });
    }
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Contact number must be 10 digits' });
    }
    if (profilePicture && !/^https?:\/\/.+/.test(profilePicture)) {
      return res.status(400).json({ message: 'Profile picture must be a valid URL' });
    }

    let doctor = await Doctor.findOne({ userId: doctorId });

    const user = await User.findById(doctorId);
  user.profilePicture=profilePicture
  await user.save()
     console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no doctor profile exists, create one
    if (!doctor) {
      doctor = new Doctor({
        userId: doctorId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age,
        specialization,
        experience,
        qualification,
        contactNumber,
        address,
        about,
        profilePicture,
        hospitalName,
      });
    } else {
      // Update existing doctor profile
      doctor.age = age !== undefined ? age : doctor.age;
      doctor.specialization = specialization || doctor.specialization;
      doctor.experience = experience !== undefined ? experience : doctor.experience;
      doctor.qualification = qualification || doctor.qualification;
      doctor.contactNumber = contactNumber !== undefined ? contactNumber : doctor.contactNumber;
      doctor.address = address !== undefined ? address : doctor.address;
      doctor.about = about !== undefined ? about : doctor.about;
      doctor.profilePicture = profilePicture !== undefined ? profilePicture : doctor.profilePicture;
      doctor.hospitalName = hospitalName !== undefined ? hospitalName : doctor.hospitalName;
      doctor.firstName = user.firstName;
      doctor.lastName = user.lastName;
      doctor.email = user.email;
    }

    await doctor.save();
    res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Populate userId to get firstName, lastName, and email from User
    let doctor = await Doctor.findOne({ userId: doctorId }).populate('userId', 'firstName lastName email');
    if (!doctor) {
      const user = await User.findById(doctorId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Create a default doctor profile if none exists
      doctor = new Doctor({
        userId: doctorId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      await doctor.save();
      doctor = await Doctor.findOne({ userId: doctorId }).populate('userId', 'firstName lastName email');
    }

    res.status(200).json({ message: 'Doctor profile fetched successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
};

const checkAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Find doctor to get _id for appointments
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
console.log(doctor._id);
    const appointments = await Appointment.find({ doctorId: doctor._id });
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.status(200).json({ message: 'Appointments fetched successfully', appointments });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { status } = req.body;
    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }
    if (status !== 'confirmed' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.status(200).json({ message: 'Appointment status updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update appointment status' });
  }
};

module.exports = { updateDoctorProfile, getDoctorProfile, checkAppointments, updateAppointmentStatus };