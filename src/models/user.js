const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    profilePicture:{
        type:String,
        default:'https://www.w3schools.com/howto/img_avatar.png'
    },
    role: {
        type: String,
        enum: ['admin', 'patient', 'doctor'],
    },
},{withTimeStamps:true});

userSchema.methods.validatePassword= async function(passwordInputByUser){
const user= this;
const passwordHashed= user.password;
const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHashed)
return isPasswordValid;
}
userSchema.methods.getJWT= async function(){
    const user= this;

    const token = await jwt.sign({_id: user._id,role:user.role},process.env.JWT_SECRET, {
        expiresIn:'1d'
    })
    return token;
}



const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports=User