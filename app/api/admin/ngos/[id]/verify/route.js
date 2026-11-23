import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NgoProfile from '@/models/NgoProfile';
import Opportunity from '@/models/Opportunity';
import { getAuthUser, checkRole } from '@/lib/auth';

/**
 * [Step 6] Super Admin NGO Verification & Approval
 */
export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || !checkRole(user, 'superadmin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Super Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status, note } = await req.json();

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be verified or rejected' },
        { status: 400 }
      );
    }

    await connectDB();
    const ngoProfile = await NgoProfile.findById(id);
    if (!ngoProfile) {
      return NextResponse.json(
        { success: false, message: 'NGO profile not found' },
        { status: 404 }
      );
    }

    ngoProfile.verificationStatus = status;
    ngoProfile.verificationNote = note || '';
    if (status === 'verified') {
      ngoProfile.verifiedAt = new Date();
    }
    await ngoProfile.save();

    // Update opportunities approval state
    await Opportunity.updateMany(
      { ngo: ngoProfile.user },
      { isApproved: status === 'verified' }
    );

    return NextResponse.json({
      success: true,
      message: `NGO successfully marked as ${status}`,
      data: ngoProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
