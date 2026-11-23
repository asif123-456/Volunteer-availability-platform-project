const VolunteerAvailability = require('../models/VolunteerAvailability');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// Helper to check if a volunteer slot covers the opportunity time window
const checkTimeOverlap = (volStart, volEnd, oppStart, oppEnd) => {
  // Convert "HH:MM" to minutes from midnight
  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const vS = toMinutes(volStart);
  const vE = toMinutes(volEnd);
  const oS = toMinutes(oppStart);
  const oE = toMinutes(oppEnd);

  // Volunteer is available if their slot covers the opportunity or substantially overlaps
  // Complete coverage: vS <= oS && vE >= oE
  if (vS <= oS && vE >= oE) {
    return { match: true, perfect: true };
  }
  // Partial overlap: max(vS, oS) < min(vE, oE)
  const overlap = Math.max(0, Math.min(vE, oE) - Math.max(vS, oS));
  const oppDuration = oE - oS;
  if (oppDuration > 0 && overlap / oppDuration >= 0.5) {
    return { match: true, perfect: false };
  }

  return { match: false, perfect: false };
};

// @desc    Get volunteer's availability slots
// @route   GET /api/volunteer/availability
// @access  Private (Volunteer)
exports.getAvailability = async (req, res) => {
  try {
    const slots = await VolunteerAvailability.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set/Update volunteer's availability slots
// @route   POST /api/volunteer/availability
// @access  Private (Volunteer)
exports.saveAvailability = async (req, res) => {
  try {
    const { slots } = req.body; // Expecting array of { dayOfWeek, startTime, endTime, notes }

    if (!Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'Slots must be provided as an array',
      });
    }

    // Clear old slots and replace with new ones
    await VolunteerAvailability.deleteMany({ user: req.user.id });

    const newSlots = slots.map((s) => ({
      user: req.user.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime || '09:00',
      endTime: s.endTime || '13:00',
      isRecurring: s.isRecurring !== undefined ? s.isRecurring : true,
      notes: s.notes || '',
    }));

    const saved = await VolunteerAvailability.insertMany(newSlots);

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get opportunities matched with volunteer schedule
// @route   GET /api/volunteer/opportunities
// @access  Private (Volunteer)
exports.getMatchingOpportunities = async (req, res) => {
  try {
    // 1. Get volunteer's availability
    const volunteerSlots = await VolunteerAvailability.find({
      user: req.user.id,
    });

    // 2. Get active, approved opportunities
    const opportunities = await Opportunity.find({
      status: 'open',
      isApproved: true,
    })
      .populate('ngo', 'name email phone')
      .populate('ngoProfile', 'organizationName verificationStatus cause website')
      .sort({ eventDate: 1 });

    // 3. Get existing applications by this volunteer
    const myApplications = await Application.find({
      volunteer: req.user.id,
    });
    const appliedMap = new Map();
    myApplications.forEach((app) => {
      appliedMap.set(app.opportunity.toString(), app);
    });

    // 4. Calculate schedule match for each opportunity
    const daysName = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const matchedList = opportunities.map((opp) => {
      const oppObj = opp.toObject();
      const oppDay =
        opp.dayOfWeek || daysName[new Date(opp.eventDate).getDay()];

      let isMatched = false;
      let matchScore = 0;
      let matchReason = 'Schedule does not match your current availability';

      // Check against volunteer availability
      for (const slot of volunteerSlots) {
        if (slot.dayOfWeek.toLowerCase() === oppDay.toLowerCase()) {
          const overlap = checkTimeOverlap(
            slot.startTime,
            slot.endTime,
            opp.startTime,
            opp.endTime
          );

          if (overlap.perfect) {
            isMatched = true;
            matchScore = 100;
            matchReason = `Exact match! You are available on ${oppDay}s (${slot.startTime} - ${slot.endTime})`;
            break;
          } else if (overlap.match) {
            isMatched = true;
            matchScore = 75;
            matchReason = `Partial match on ${oppDay} (${slot.startTime} - ${slot.endTime})`;
          }
        }
      }

      const existingApp = appliedMap.get(opp._id.toString());

      return {
        ...oppObj,
        isMatched,
        matchScore,
        matchReason,
        dayOfWeek: oppDay,
        hasApplied: !!existingApp,
        applicationStatus: existingApp ? existingApp.status : null,
        applicationId: existingApp ? existingApp._id : null,
      };
    });

    // Sort: Opportunities that match volunteer schedule first!
    matchedList.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: matchedList.length,
      data: matchedList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to a volunteer opportunity
// @route   POST /api/volunteer/apply/:opportunityId
// @access  Private (Volunteer)
exports.applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { message } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res
        .status(404)
        .json({ success: false, message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer open for applications',
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      opportunity: opportunityId,
      volunteer: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity',
      });
    }

    // Check availability match score
    const daysName = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const oppDay =
      opportunity.dayOfWeek || daysName[new Date(opportunity.eventDate).getDay()];

    const slots = await VolunteerAvailability.find({ user: req.user.id });
    let isMatched = false;
    let score = 0;

    for (const slot of slots) {
      if (slot.dayOfWeek.toLowerCase() === oppDay.toLowerCase()) {
        const overlap = checkTimeOverlap(
          slot.startTime,
          slot.endTime,
          opportunity.startTime,
          opportunity.endTime
        );
        if (overlap.perfect) {
          isMatched = true;
          score = 100;
          break;
        } else if (overlap.match) {
          isMatched = true;
          score = 75;
        }
      }
    }

    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: req.user.id,
      ngo: opportunity.ngo,
      status: 'pending',
      availabilityMatch: isMatched,
      matchScore: score,
      volunteerMessage: message || '',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Waiting for NGO review.',
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications submitted by logged-in volunteer
// @route   GET /api/volunteer/my-applications
// @access  Private (Volunteer)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ volunteer: req.user.id })
      .populate({
        path: 'opportunity',
        populate: [
          { path: 'ngo', select: 'name email phone' },
          { path: 'ngoProfile', select: 'organizationName website cause' },
        ],
      })
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
