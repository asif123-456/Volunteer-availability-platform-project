const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const NgoProfile = require('../models/NgoProfile');

// Helper to determine day of week from date
const getDayName = (dateString) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

// @desc    Create a new volunteer opportunity
// @route   POST /api/ngo/opportunities
// @access  Private (NGO)
exports.createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      city,
      eventDate,
      startTime,
      endTime,
      requiredVolunteers,
      skillsRequired,
    } = req.body;

    const profile = await NgoProfile.findOne({ user: req.user.id });

    const calculatedDay = getDayName(eventDate);

    const opportunity = await Opportunity.create({
      ngo: req.user.id,
      ngoProfile: profile ? profile._id : null,
      title,
      description,
      category: category || 'Community Service',
      location,
      city: city || req.user.city || '',
      eventDate,
      dayOfWeek: calculatedDay,
      startTime: startTime || '09:00',
      endTime: endTime || '13:00',
      requiredVolunteers: Number(requiredVolunteers) || 5,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : (skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean),
      status: 'open',
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully!',
      data: opportunity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all opportunities created by logged in NGO
// @route   GET /api/ngo/my-opportunities
// @access  Private (NGO)
exports.getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo: req.user.id }).sort({
      createdAt: -1,
    });

    // Attach application counts for each opportunity
    const oppIds = opportunities.map((o) => o._id);
    const applications = await Application.find({
      opportunity: { $in: oppIds },
    });

    const enriched = opportunities.map((opp) => {
      const oppObj = opp.toObject();
      const oppApps = applications.filter(
        (a) => a.opportunity.toString() === opp._id.toString()
      );
      return {
        ...oppObj,
        totalApplicants: oppApps.length,
        pendingApplicants: oppApps.filter((a) => a.status === 'pending').length,
        acceptedApplicants: oppApps.filter((a) => a.status === 'accepted')
          .length,
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a specific opportunity
// @route   GET /api/ngo/opportunities/:id/applicants
// @access  Private (NGO)
exports.getOpportunityApplicants = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      ngo: req.user.id,
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found or not owned by you',
      });
    }

    const applicants = await Application.find({ opportunity: req.params.id })
      .populate('volunteer', 'name email phone city')
      .sort({ matchScore: -1, appliedAt: -1 });

    res.json({
      success: true,
      opportunity,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept or Reject a volunteer application
// @route   PUT /api/ngo/applications/:id/status
// @access  Private (NGO)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either accepted or rejected',
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      ngo: req.user.id,
    }).populate('opportunity');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized',
      });
    }

    const prevStatus = application.status;
    application.status = status;
    application.ngoRemarks = remarks || '';
    application.decidedAt = new Date();
    await application.save();

    // Update filled volunteer count on opportunity
    const opp = await Opportunity.findById(application.opportunity._id);
    if (opp) {
      if (status === 'accepted' && prevStatus !== 'accepted') {
        opp.filledVolunteers += 1;
        if (opp.filledVolunteers >= opp.requiredVolunteers) {
          opp.status = 'closed';
        }
        await opp.save();
      } else if (prevStatus === 'accepted' && status === 'rejected') {
        opp.filledVolunteers = Math.max(0, opp.filledVolunteers - 1);
        if (opp.status === 'closed' && opp.filledVolunteers < opp.requiredVolunteers) {
          opp.status = 'open';
        }
        await opp.save();
      }
    }

    res.json({
      success: true,
      message: `Application marked as ${status}`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get NGO dashboard summary stats
// @route   GET /api/ngo/dashboard-stats
// @access  Private (NGO)
exports.getNgoDashboardStats = async (req, res) => {
  try {
    const totalDrives = await Opportunity.countDocuments({ ngo: req.user.id });
    const openDrives = await Opportunity.countDocuments({
      ngo: req.user.id,
      status: 'open',
    });

    const applications = await Application.find({ ngo: req.user.id });
    const totalApplicants = applications.length;
    const acceptedVolunteers = applications.filter(
      (a) => a.status === 'accepted'
    ).length;
    const pendingReview = applications.filter(
      (a) => a.status === 'pending'
    ).length;

    const profile = await NgoProfile.findOne({ user: req.user.id });

    res.json({
      success: true,
      data: {
        totalDrives,
        openDrives,
        totalApplicants,
        acceptedVolunteers,
        pendingReview,
        verificationStatus: profile ? profile.verificationStatus : 'pending',
        organizationName: profile ? profile.organizationName : req.user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
