import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import NgoProfile from '@/models/NgoProfile';
import Opportunity from '@/models/Opportunity';
import Application from '@/models/Application';
import { getAuthUser, checkRole } from '@/lib/auth';

/**
 * Super Admin Analytics & Reports API
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || !checkRole(user, 'superadmin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const [
      totalVolunteers,
      totalNgos,
      verifiedNgos,
      pendingNgos,
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      acceptedApplications,
    ] = await Promise.all([
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ role: 'ngo' }),
      NgoProfile.countDocuments({ verificationStatus: 'verified' }),
      NgoProfile.countDocuments({ verificationStatus: 'pending' }),
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'accepted' }),
    ]);

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
