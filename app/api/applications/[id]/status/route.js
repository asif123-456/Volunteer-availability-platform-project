import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Opportunity from '@/models/Opportunity';
import { getAuthUser, checkRole } from '@/lib/auth';

/**
 * [Step 10] NGO Approve / Reject Application Route Handler
 */
export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || (!checkRole(user, 'ngo') && !checkRole(user, 'superadmin'))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. NGO or Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status, remarks } = await req.json();

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be accepted, rejected, or pending' },
        { status: 400 }
      );
    }

    await connectDB();
    const query = user.role === 'superadmin' ? { _id: id } : { _id: id, ngo: user.id };
    const application = await Application.findOne(query).populate('opportunity');

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found or unauthorized' },
        { status: 404 }
      );
    }

    const prevStatus = application.status;
    application.status = status;
    application.ngoRemarks = remarks || '';
    application.decidedAt = new Date();
    await application.save();

    // Update filled volunteers count
    const opp = await Opportunity.findById(application.opportunity._id);
    if (opp) {
      if (status === 'accepted' && prevStatus !== 'accepted') {
        opp.filledVolunteers += 1;
        if (opp.filledVolunteers >= opp.requiredVolunteers) {
          opp.status = 'closed';
        }
        await opp.save();
      } else if (prevStatus === 'accepted' && status !== 'accepted') {
        opp.filledVolunteers = Math.max(0, opp.filledVolunteers - 1);
        if (opp.status === 'closed' && opp.filledVolunteers < opp.requiredVolunteers) {
          opp.status = 'open';
        }
        await opp.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Volunteer application has been ${status}!`,
      data: application,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
