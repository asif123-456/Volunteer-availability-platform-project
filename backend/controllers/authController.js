const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NgoProfile = require('../models/NgoProfile');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'volunteer_platform_secret_jwt_key_2026',
    {
      expiresIn: '30d',
    }
  );
};

// @desc    Register a new user (Volunteer or NGO)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      city,
      // NGO specific fields:
      organizationName,
      registrationNumber,
      cause,
      website,
      description,
      address,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'volunteer',
      phone: phone || '',
      city: city || '',
    });

    let ngoProfile = null;
    // If registering as NGO, create the initial NgoProfile
    if (user.role === 'ngo') {
      ngoProfile = await NgoProfile.create({
        user: user._id,
        organizationName: organizationName || name,
        registrationNumber: registrationNumber || 'PENDING-REG',
        cause: cause || 'General Social Welfare',
        website: website || '',
        description: description || '',
        address: address || city || '',
        verificationStatus: 'pending',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        ngoProfile: ngoProfile || null,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    let ngoProfile = null;
    if (user.role === 'ngo') {
      ngoProfile = await NgoProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        ngoProfile: ngoProfile || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let ngoProfile = null;

    if (user.role === 'ngo') {
      ngoProfile = await NgoProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        ngoProfile: ngoProfile || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user',
    });
  }
};
