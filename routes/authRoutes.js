const express = require('express');
const { register, login, getUserDetails } = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getUserDetails); // Add this protected route

module.exports = router;
