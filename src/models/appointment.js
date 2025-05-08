const mongoose = require('mongoose');
const appointmentSchema=new mongoose.Schema({
   
    doctorId:{
        type:String,
        required:true,
    },
    patientId:{
        type:String,
        required:true,
    },
    appointmentDate:{
        type:Date,
        required:true,
    },
    appointmentTime:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','confirmed','cancelled'],
        default:'pending',
    },
    description:{
        type:String,
        required:true,
    },
},{timestamps:true});

const Appointment=mongoose.models.Appointment||mongoose.model('Appointment',appointmentSchema);
module.exports=Appointment;