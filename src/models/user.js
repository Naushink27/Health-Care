const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
   
    gender: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'doctor'],
    },
});




const User=mongoose.model('User',userSchema)
module.exports=User