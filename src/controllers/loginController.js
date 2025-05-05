const User = require('../models/User')
const bcrypt = require('bcrypt')
const loginUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = await user.getJWT();  
        if (!token) {
            return res.status(400).json({ message: 'Token generation failed' });
        }

        res.cookie('jwt', token);
        res.status(200).json({ message: 'Login successful', user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { loginUser }