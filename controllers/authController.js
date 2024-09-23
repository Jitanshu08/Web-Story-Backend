const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user (password will be hashed automatically in the user model pre-save middleware)
        const user = await User.create({ username, password });

        // Generate a JWT token after successful registration
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token and success message back to the client
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Use the comparePassword method from the user model to check the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token if the credentials are valid
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token to the client
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        // Assuming that req.user is already set by the authentication middleware (auth.js)
        const user = await User.findById(req.user._id).select('-password'); // Exclude the password from the returned user data
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
