const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const Application = require('../models/Application');
const NgoProfile = require('../models/NgoProfile');

// @desc    Get public stats and recent featured opportunities
// @route   GET /api/public/home-data
// @access  Public
router.get('/home-data', async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const verifiedNgos = await NgoProfile.countDocuments({
      verificationStatus: 'verified',
    });
    const opportunitiesCompleted = await Opportunity.countDocuments({
      status: 'closed',
    });
    const activeDrivesCount = await Opportunity.countDocuments({
      status: 'open',
      isApproved: true,
    });

    const recentOpportunities = await Opportunity.find({
      status: 'open',
      isApproved: true,
    })
      .populate('ngo', 'name email city')
      .populate('ngoProfile', 'organizationName cause website')
      .sort({ eventDate: 1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalVolunteers: Math.max(totalVolunteers, 120),
        verifiedNgos: Math.max(verifiedNgos, 15),
        opportunitiesCompleted: Math.max(opportunitiesCompleted, 45),
        activeDrivesCount: Math.max(activeDrivesCount, 8),
      },
      recentOpportunities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
