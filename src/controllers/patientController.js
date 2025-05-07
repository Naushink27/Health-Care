const Patient = require('../models/Patient'); 
const Doctor = require('../models/Doctor');

const updatePatientProfile = async (req, res) => {
  const patientId = req.params.patientId;
  const { age, gender, ContactNumber, bloodGroup, MedicalHistory, address } = req.body;


  try {
    // ✅ Check if patient profile exists
    let patient = await Patient.findOne({ userId: patientId });

    if (!patient) {
      // 🔧 Create profile if not exists
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

    await patient.save();

    res.status(200).json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPatientProfile=async(req,res)=>{
    try{
        const patientId=req.params.patientId;
        const patient=await Patient.findOne({userId:patientId});
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

module.exports = { updatePatientProfile,getPatientProfile ,getAllDoctors };
