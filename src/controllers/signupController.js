const signupValidation = require('../validations/signupValidation');
const User = require('../models/User'); 
const Patient = require('../models/Patient'); 
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');
const signupUser = async (req, res) => {
    if(!req.body){
        res.status(400).json({ message: "Request body is required" });
    }
    const { errors, isValid } = signupValidation(req.body);
    if (!isValid) {
        return res.status(400).json({ errors });
      
    }
    try {
        const {email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.userRole,
        })

        if (!user) {
            throw new Error("User not created")
        }
        if(user.role=='patient'){
            patient =await  new Patient({ userId: user._id });
            if (!patient) {
                throw new Error("Patient profile not created")
            }
            await patient.save();
        }
        if(user.role=='doctor'){
            doctor =await  new Doctor({ userId: user._id });
            if (!doctor) {
                throw new Error("Doctor profile not created")
            }
            await doctor.save();
        }

      await user.save()

        return res.status(201).json({ message: "User created successfully", user });


    } catch (err) {
       
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { signupUser };