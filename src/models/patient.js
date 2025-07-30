const mongoose = require('mongoose');

const patientSchema=new mongoose.Schema({
    firstName:{
        type:String,},
    lastName:{
        type:String,},
    email:{
        type:String,},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    age:{
        type:Number,
        
    },
    gender:{
        type:String,
        enum:['Male','Female','Other'],
        required:false

    },
    ContactNumber:{
        type:String,
    },
    bloodGroup:{
        type:String,
        enum:['A+','A-','B+','B-','AB+','AB-','O+','O-'],
    },
    MedicalHistory:{
        type:String,
    },
    address:{
        type:String,
    },
    reports:{
        type:[String],
    },
  


},{timestamps:true});

const Patient=mongoose.models.Patient||mongoose.model('Patient',patientSchema);
module.exports=Patient;