const Patient = require('../models/Patient'); 
const Doctor = require('../models/Doctor');
const Appointment = require('../models/appointment');

const updatePatientProfile = async (req, res) => {
  const patientId = req.params.patientId;
  const {
    age,
    gender,
    ContactNumber,
    bloodGroup,
    MedicalHistory,
    address,
    profilePicture // ✅ Include this
  } = req.body;

  try {
    // ✅ Check if patient profile exists
    let patient = await Patient.findOne({ userId: patientId });

    if (!patient) {
      res.status(404).json({ message: 'Patient profile not found' });
      return;
    }

    // ✅ Update fields
    patient.age = age;
    patient.gender = gender;
    patient.ContactNumber = ContactNumber;
    patient.bloodGroup = bloodGroup;
    patient.MedicalHistory = MedicalHistory;
    patient.address = address;
    patient.profilePicture = profilePicture || patient.profilePicture; // ✅ Conditionally update profilePicture

  
    await patient.save();

    res.status(200).json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientProfile=async(req,res)=>{
    try{
        const patientId=req.params.patientId;
        const patient=await Patient.findOne({userId:patientId}).populate('userId', 'firstName lastName email');;
        if(!patient){
            return res.status(404).json({message:'Patient profile not found'})
        }
        res.status(200).json({message:'Patient profile fetched successfully',patient})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
const getAllDoctors=async(req,res)=>{
  try{
      const doctors=await Doctor.find();
      if(!doctors){
          return res.status(404).json({message:'No doctors found'})
      }
      res.status(200).json({message:'Doctors fetched successfully',doctors})
  }catch(error){
      res.status(500).json({message:error.message})
  }
}

const bookAppointment=async(req,res)=>{
  try{
    const doctorId=req.params.doctorId;
    console.log(doctorId)
   console.log(req.body)

    const {patientId,appointmentDate,appointmentTime,description}=req.body;
    if(!doctorId || !patientId || !appointmentDate || !appointmentTime||!description){
      return res.status(404).json({message:'Please Provide all required fields'})
    }
    const doctor=await Doctor.findById(doctorId);
    if(!doctor){
      return res.status(404).json({message:'Doctor not found'})
    }
    const patient=await Patient.findById(patientId);
    if(!patient){
      return res.status(404).json({message:'Patient not found'})
    }
     const appointment=await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      appointmentTime,
      description
     })

     await appointment.save();
     res.status(200).json({message:'Appointment booked successfully',appointment})


  }catch(error){
    res.status(500).json({message:error.message})
  }
}

const bookedAppointments=async(req,res)=>{
  try{
    const patientId=req.params.patientId
    const appointments=await Appointment.find({patientId:patientId})
    if(!appointments){
      return res.status(404).json({message:'No appointments found'})
    }
    res.status(200).json({message:'Appointments fetched successfully',appointments})
  }catch(error){
    res.status(500).json({message:error.message})
  }
}


module.exports = { updatePatientProfile,getPatientProfile ,getAllDoctors ,bookAppointment,bookedAppointments};
