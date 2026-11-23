const User = require('../models/User');
const NgoProfile = require('../models/NgoProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// @desc    Get all NGOs (with verification status)
// @route   GET /api/admin/ngos
// @access  Private (Super Admin)
exports.getAllNgos = async (req, res) => {
  try {
    const ngos = await NgoProfile.find()
      .populate('user', 'name email phone city createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ngos.length,
      data: ngos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify or Reject an NGO
// @route   PUT /api/admin/ngos/:id/verify
// @access  Private (Super Admin)
exports.verifyNgo = async (req, res) => {
  try {
    const { status, note } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be verified or rejected',
      });
    }

    const ngoProfile = await NgoProfile.findById(req.params.id);
    if (!ngoProfile) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found',
      });
    }

    ngoProfile.verificationStatus = status;
    ngoProfile.verificationNote = note || '';
    if (status === 'verified') {
      ngoProfile.verifiedAt = new Date();
    }
    await ngoProfile.save();

    // If verified, ensure its opportunities are approved
    if (status === 'verified') {
      await Opportunity.updateMany(
        { ngo: ngoProfile.user },
        { isApproved: true }
      );
    } else if (status === 'rejected') {
      await Opportunity.updateMany(
        { ngo: ngoProfile.user },
        { isApproved: false }
      );
    }

    res.json({
      success: true,
      message: `NGO successfully marked as ${status}`,
      data: ngoProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all opportunities for moderation
// @route   GET /api/admin/opportunities
// @access  Private (Super Admin)
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('ngo', 'name email phone')
      .populate('ngoProfile', 'organizationName verificationStatus')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate / delete / update an opportunity (remove fake drives)
// @route   DELETE /api/admin/opportunities/:id
// @access  Private (Super Admin)
exports.deleteOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ opportunity: req.params.id });

    res.json({
      success: true,
      message: 'Opportunity removed successfully by Admin',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform users list
// @route   GET /api/admin/users
// @access  Private (Super Admin)
exports.getPlatformUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system-wide metrics & reports
// @route   GET /api/admin/reports
// @access  Private (Super Admin)
exports.getPlatformReports = async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalNgos = await User.countDocuments({ role: 'ngo' });
    const verifiedNgos = await NgoProfile.countDocuments({
      verificationStatus: 'verified',
    });
    const pendingNgos = await NgoProfile.countDocuments({
      verificationStatus: 'pending',
    });

    const totalOpportunities = await Opportunity.countDocuments();
    const activeOpportunities = await Opportunity.countDocuments({
      status: 'open',
    });

    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({
      status: 'accepted',
    });

    res.json({
      success: true,
      data: {
        totalVolunteers,
        totalNgos,
        verifiedNgos,
        pendingNgos,
        totalOpportunities,
        activeOpportunities,
        totalApplications,
        acceptedApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
