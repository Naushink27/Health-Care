const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const getAllPatients=async(req,res)=>{
    try{
          const patients=await Patient.find();
          if(patients.length===0){
              return res.status(404).json({message:'No patients found'})
          }
            res.status(200).json({message:'Patients fetched successfully',patients})


    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const getAllDoctors=async(req,res)=>{
    try{
         const doctor=await Doctor.find()
         if(doctor.length==0){
            res.json({message:"No doctors found"})
         }
         res.status(200).json({message:"Fetched all doctors",doctor})

    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getAllAppointments=async(req,res)=>{
    try{
        const appointments=await Appointment.find()
        if(appointments.length==0){
            return res.json({message:"No Appointments found"})
        }
        res.status(200).json({message:"All appointments fetched",appointments})

    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
}
const deletePatient = async (req, res) => {
    try {
        const { patientId } = req.params; 
    
        const patient = await Patient.findByIdAndDelete(patientId);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findByIdAndDelete(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" }); 
        }

        return res.status(200).json({ message: "Doctor deleted successfully!" }); 

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"});
    }
};


module.exports={getAllPatients,getAllDoctors,getAllAppointments,deletePatient,deleteDoctor};