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



module.exports={updateDoctorProfile,getDoctorProfile}