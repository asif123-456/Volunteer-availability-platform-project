import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NgoProfile from '@/models/NgoProfile';
import { getAuthUser, checkRole } from '@/lib/auth';

/**
 * [Step 6] Get all NGOs for Super Admin Verification Queue
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
    const ngos = await NgoProfile.find()
      .populate('user', 'name email phone city createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: ngos.length,
      data: ngos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
