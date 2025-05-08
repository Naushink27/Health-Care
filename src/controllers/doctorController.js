const Appointment = require('../models/appointment');
const Doctor=require('../models/doctor')
const User=require('../models/User')


const updateDoctorProfile= async(req ,res)=>{
    try{
        const doctorId=req.params.doctorId;
        const{age,specialization,experience,qualification,contactNumber,address,about,profilePicture,hospitalName}=req.body;
        const doctor=await Doctor.findOne({userId:doctorId})
        const user=await User.findById(doctorId);
        if(!doctor){
            return res.status(404).json({message:'Doctor profile not found'})
        }
        doctor.age=age;
        doctor.specialization=specialization;
        doctor.experience=experience;
        doctor.qualification=qualification;
        doctor.contactNumber=contactNumber;
        doctor.address=address;
        doctor.about=about;
        doctor.profilePicture=profilePicture;
        doctor.hospitalName=hospitalName;
        doctor.firstName=user.firstName;
        doctor.lastName=user.lastName;
        doctor.email=user.email;

        await doctor.save();
        res.status(200).json({message:'Doctor profile updated successfully',doctor})

    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const getDoctorProfile=async(req,res)=>{
    try{
        const doctorId=req.params.doctorId;
        const doctor=await Doctor.findOne({userId:doctorId});
        if(!doctor){
            return res.status(404).json({message:'Doctor profile not found'})
        }
        res.status(200).json({message:'Doctor profile fetched successfully',doctor})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const checkAppointments=async(req,res)=>{
    try{
       const doctorId=req.params.doctorId;
       
        const appointments=await Appointment.find({doctorId:doctorId});
        if(appointments.length===0){
            return res.status(404).json({message:'No appointments found'})
        }
        res.status(200).json({message:'Appointments fetched successfully',appointments})


    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const updateAppointmentStatus=async(req,res)=>{
    const appointmentId=req.params.appointmentId;
    const {status}=req.body;
    if(!status){
        return res.status(400).json({message:'Please provide status'})
    }
    if(status!=='confirmed' && status!=='cancelled'){
        return res.status(400).json({message:'Invalid status'})
    }
    try{
        const appointment=await Appointment.findById(appointmentId)
        if(!appointment){
            return res.status(404).json({message:'Appointment not found'})
        }
        appointment.status=status;
        await appointment.save();
        res.status(200).json({message:'Appointment status updated successfully',appointment})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}



module.exports={updateDoctorProfile,getDoctorProfile,checkAppointments,updateAppointmentStatus}