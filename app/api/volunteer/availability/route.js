import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VolunteerAvailability from '@/models/VolunteerAvailability';
import { getAuthUser, checkRole } from '@/lib/auth';

/**
 * [Step 8] Volunteer Availability Management API
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
    const slots = await VolunteerAvailability.find({ user: user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || !checkRole(user, 'volunteer')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Volunteer access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { slots } = await req.json();

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { success: false, message: 'Slots must be an array' },
        { status: 400 }
      );
    }

    // Replace old slots with updated slots
    await VolunteerAvailability.deleteMany({ user: user.id });

    const newSlots = slots.map((s) => ({
      user: user.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime || '09:00',
      endTime: s.endTime || '13:00',
      isRecurring: s.isRecurring !== undefined ? s.isRecurring : true,
      notes: s.notes || '',
    }));

    const saved = await VolunteerAvailability.insertMany(newSlots);

    return NextResponse.json({
      success: true,
      message: 'Availability schedule saved successfully',
      data: saved,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
