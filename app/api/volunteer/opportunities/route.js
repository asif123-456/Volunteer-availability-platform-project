import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import VolunteerAvailability from '@/models/VolunteerAvailability';
import Application from '@/models/Application';
import { getAuthUser, checkRole } from '@/lib/auth';
import { matchOpportunityWithSlots } from '@/lib/matching';

/**
 * [Step 9] Smart Availability Matching Engine Route Handler
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || !checkRole(user, 'volunteer')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Volunteer access required' },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Volunteer slots
    const volunteerSlots = await VolunteerAvailability.find({ user: user.id });

    // 2. Open opportunities
    const opportunities = await Opportunity.find({
      status: 'open',
      isApproved: true,
    })
      .populate('ngo', 'name email phone')
      .populate('ngoProfile', 'organizationName verificationStatus cause website')
      .sort({ eventDate: 1 });

    // 3. Existing applications by volunteer
    const applications = await Application.find({ volunteer: user.id });
    const appliedMap = new Map();
    applications.forEach((app) => {
      appliedMap.set(app.opportunity.toString(), app);
    });

    // 4. Run matching algorithm
    const matchedList = opportunities.map((opp) => {
      const oppObj = opp.toObject();
      const { isMatched, matchScore, matchReason } = matchOpportunityWithSlots(
        oppObj,
        volunteerSlots
      );

      const existingApp = appliedMap.get(opp._id.toString());

      return {
        ...oppObj,
        isMatched,
        matchScore,
        matchReason,
        hasApplied: !!existingApp,
        applicationStatus: existingApp ? existingApp.status : null,
        applicationId: existingApp ? existingApp._id : null,
      };
    });

    // Sort opportunities: matched first!
    matchedList.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      count: matchedList.length,
      data: matchedList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
