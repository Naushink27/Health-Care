const signupValidation = require('../validations/signupValidation');
const User = require('../models/user');
const Patient = require('../models/patient');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');

const signupUser = async (req, res) => {
    // Check if request body is provided
    if (!req.body) {
        return res.status(400).json({ status: 'error', message: 'Request body is required' });
    }

    // Validate request body
    const { errors, isValid } = signupValidation(req.body);
    if (!isValid) {
        return res.status(400).json({ status: 'error', errors });
    }

    try {
        const { email, password, firstName, lastName, userRole } = req.body;

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email is already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);

        // Start MongoDB transaction
        const session = await User.startSession();
        session.startTransaction();

        try {
            // Create and save User
            const user = new User({
                firstName,
                lastName,
                email:email.toLowerCase(),
                password: hashedPassword,
                role: userRole,
            });
            await user.save({ session });

            // Create Patient or Doctor based on role
            if (userRole === 'patient') {
                const patient = new Patient({
                    userId: user._id,
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                });
                await patient.save({ session });
            } else if (userRole === 'doctor') {
                const doctor = new Doctor({
                    userId: user._id,
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                });
                await doctor.save({ session });
            } else {
                throw new Error('Invalid user role');
            }

            // Commit transaction
            await session.commitTransaction();
            return res.status(201).json({ status: 'success', message: 'User created successfully', user });
        } catch (err) {
            // Abort transaction on error
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    } catch (err) {
        console.error('Error during signup:', err.message);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { signupUser };