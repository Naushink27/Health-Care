const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Feedback = require('../models/feedback');
const User = require('../models/user');
const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { firstName, lastName, age, specialization, experience, qualification, contactNumber, address, about, profilePicture, hospitalName } = req.body;

    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request params doctorId:', doctorId);
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Validation for required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }
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
    if (profilePicture && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(profilePicture)) {
      return res.status(400).json({ message: 'Profile picture must be a valid image URL (jpg, jpeg, png, gif, or webp)' });
    }

    // Update User model
    const user = await User.findById(doctorId);
    if (!user) {
      console.log('User not found for ID:', doctorId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', { _id: user._id, email: user.email, profilePicture: user.profilePicture });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture;
    await user.save();
    console.log('User after save:', { _id: user._id, email: user.email, profilePicture: user.profilePicture });

    // Check for existing Doctor profile
    const doctor = await Doctor.findOne({ userId: doctorId });
    console.log('Existing doctor found:', doctor ? { _id: doctor._id, userId: doctor.userId } : 'None');

    if (!doctor) {
      console.log('No Doctor profile found for userId:', doctorId);
      return res.status(404).json({ message: 'Doctor profile not found for update' });
    }

    // Update Doctor profile
    doctor.age = age !== undefined ? age : doctor.age;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience !== undefined ? experience : doctor.experience;
    doctor.qualification = qualification || doctor.qualification;
    doctor.contactNumber = contactNumber !== undefined ? contactNumber : doctor.contactNumber;
    doctor.address = address !== undefined ? address : doctor.address;
    doctor.about = about !== undefined ? about : doctor.about;
    doctor.hospitalName = hospitalName !== undefined ? hospitalName : doctor.hospitalName;
    doctor.firstName = user.firstName;
    doctor.lastName = user.lastName;
    doctor.email = user.email;
    doctor.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture || doctor.profilePicture;
    doctor.updatedAt = Date.now();

    console.log('Doctor profile before save:', JSON.stringify(doctor, null, 2));
    await doctor.save();

    // Populate userId in response
    const updatedDoctor = await Doctor.findOne({ userId: doctorId }).populate('userId', 'firstName lastName email profilePicture');
    console.log('Response doctor:', JSON.stringify(updatedDoctor, null, 2));

    res.status(200).json({ message: 'Doctor profile updated successfully', doctor: updatedDoctor });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    console.log('Fetching doctor profile for userId:', doctorId);
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    
    let doctor=await Doctor.findById(doctorId).populate('userId', 'firstName lastName email profilePicture');
    if (!doctor) {
      doctor=await Doctor.findOne({ userId: doctorId }).populate('userId', 'firstName lastName email profilePicture');
    }
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    console.log('Doctor fetched:', JSON.stringify(doctor, null, 2));
    res.status(200).json({ message: 'Doctor profile fetched successfully', doctor });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
};
const checkAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    console.log('Doctor _id:', doctor._id);

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'firstName lastName profilePicture')
      .populate('doctorId', 'firstName lastName profilePicture');
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.status(200).json({ message: 'Appointments fetched successfully', appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
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
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: error.message || 'Failed to update appointment status' });
  }
};

const getFeedback = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    console.log('Doctor ID:', doctorId);
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    const doctor = await Doctor.findOne({ userId: doctorId });
    console.log('Doctor found:', doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const feedbacks = await Feedback.find({ doctorId: doctorId })
      .populate('patientId', 'firstName lastName profilePicture')
      .populate('doctorId', 'firstName lastName profilePicture');
    console.log('Feedbacks found:', feedbacks);
    res.status(200).json({ message: 'Feedback fetched successfully', feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch feedback' });
  }
};

module.exports = { updateDoctorProfile, getDoctorProfile, checkAppointments, updateAppointmentStatus, getFeedback };