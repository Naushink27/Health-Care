const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const User = require('../models/User');
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { age, gender, ContactNumber, bloodGroup, MedicalHistory, address, profilePicture } = req.body;

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    // Validation for required fields
    if (!gender || !bloodGroup || !MedicalHistory) {
      return res.status(400).json({ message: 'Gender, blood group, and medical history are required' });
    }
    if (age && (isNaN(age) || age < 18 || age > 100)) {
      return res.status(400).json({ message: 'Age must be between 18 and 100' });
    }
    if (ContactNumber && !/^\d{10}$/.test(ContactNumber)) {
      return res.status(400).json({ message: 'Contact number must be 10 digits' });
    }
    if (profilePicture && !/^https?:\/\/.+/.test(profilePicture)) {
      return res.status(400).json({ message: 'Profile picture must be a valid URL' });
    }

    let patient = await Patient.findOne({ userId: patientId });

    const user = await User.findById(patientId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();

    // If no patient profile exists, create one
    if (!patient) {
      patient = new Patient({
        userId: patientId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age,
        gender,
        ContactNumber,
        bloodGroup,
        MedicalHistory,
        address,
        profilePicture,
      });
    } else {
      // Update existing patient profile
      patient.age = age !== undefined ? age : patient.age;
      patient.gender = gender || patient.gender;
      patient.ContactNumber = ContactNumber !== undefined ? ContactNumber : patient.ContactNumber;
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      patient.MedicalHistory = MedicalHistory || patient.MedicalHistory;
      patient.address = address !== undefined ? address : patient.address;
      patient.profilePicture = profilePicture !== undefined ? profilePicture : patient.profilePicture;
      patient.firstName = user.firstName;
      patient.lastName = user.lastName;
      patient.email = user.email;
    }

    await patient.save();
    res.status(200).json({ message: 'Patient profile updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    // Populate userId to get firstName, lastName, and email from User
    let patient = await Patient.findById(patientId).populate('userId', 'firstName lastName email');
    if (!patient) {
      const user = await User.findById(patientId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create a default patient profile if none exists
      patient = new Patient({
        userId: patientId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      await patient.save();
      patient = await Patient.findOne({ userId: patientId }).populate('userId', 'firstName lastName email');
    }

    res.status(200).json({ message: 'Patient profile fetched successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }
    res.status(200).json({ message: 'Doctors fetched successfully', doctors });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch doctors' });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { patientId: userId, appointmentDate, appointmentTime, description } = req.body; // Renamed to userId

    if (!isValidObjectId(doctorId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid doctor or patient ID' });
    }
    if (!appointmentDate || !appointmentTime || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const doctor = await Doctor.findOne({userId:doctorId});
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
      console.log(doctor);
    // Find the patient document using userId and get its _id
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointment = new Appointment({
      doctorId:doctor._id, // _id from Doctor model
      patientId: patient._id, // _id from Patient model
      appointmentDate,
      appointmentTime,
      description,
      status: 'pending', // Default status
    });

    await appointment.save();
    res.status(200).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to book appointment' });
  }
};

const bookedAppointments = async (req, res) => {
  try {
    console.log("🔥 bookedAppointments API HIT 🔥");

    const patientId = req.params.patientId;
    console.log("🧾 Param patientId:", patientId);

    if (!isValidObjectId(patientId)) {
      console.log("❌ Invalid patientId");
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findOne({ userId: patientId });
    console.log("👤 Found patient:", patient);

    if (!patient) {
      console.log("❌ No patient found with this userId");
      return res.status(404).json({ message: 'Patient not found' });
    }

    const actualId = patient._id;
    console.log("🔍 Patient's _id to search appointment:", actualId);

    const appointments = await Appointment.find({ patientId: actualId})
      .populate('doctorId', 'firstName lastName profilePicture')
      .populate('patientId', 'firstName lastName');
    
    console.log("📅 Found appointments:", appointments);

    if (!appointments || appointments.length === 0) {
      console.log("⚠️ No appointments found in DB");
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json({ message: 'Appointments fetched successfully', appointments });

  } catch (error) {
    console.log("🔥 Error occurred:", error);
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to cancel appointment' });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { doctorId, patientId, rating, comments } = req.body;

    // Validate input
    if (!doctorId || !patientId || !rating || !comments) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!mongoose.isValidObjectId(doctorId) || !mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid doctor or patient ID' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Optional: Verify authenticated user is the patient
    // if (req.user._id.toString() !== patientId) {
    //   return res.status(403).json({ message: 'Unauthorized to submit feedback' });
    // }

    // Save feedback
    const feedback = new Feedback({
      doctorId,
      patientId,
      rating,
      comments,
    });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: error.message || 'Failed to submit feedback' });
  }
}
module.exports = { updatePatientProfile, getPatientProfile, getAllDoctors, bookAppointment, bookedAppointments ,submitFeedback};