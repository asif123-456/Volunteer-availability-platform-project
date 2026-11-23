import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import NgoProfile from '@/models/NgoProfile';
import { getAuthUser, checkRole } from '@/lib/auth';

const DAYS_NAME = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * [Step 7] Create & Manage Opportunities
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get('mine') === 'true';

    if (mine) {
      const user = await getAuthUser(req);
      if (!user || !checkRole(user, 'ngo')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      const myOpportunities = await Opportunity.find({ ngo: user.id }).sort({
        createdAt: -1,
      });
      return NextResponse.json({
        success: true,
        count: myOpportunities.length,
        data: myOpportunities,
      });
    }

    // Public active opportunities
    const opportunities = await Opportunity.find({
      status: 'open',
      isApproved: true,
    })
      .populate('ngo', 'name email city')
      .populate('ngoProfile', 'organizationName verificationStatus cause website')
      .sort({ eventDate: 1 });

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      data: opportunities,
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
    if (!user || !checkRole(user, 'ngo')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. NGO login required' },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();
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
    } = body;

    const eventObj = new Date(eventDate);
    const dayOfWeek = DAYS_NAME[eventObj.getDay()];

    const opportunity = await Opportunity.create({
      ngo: user.id,
      ngoProfile: user.ngoProfile ? user.ngoProfile._id : null,
      title,
      description,
      category: category || 'Cleanliness Drive',
      location,
      city: city || user.city || '',
      eventDate: eventObj,
      dayOfWeek,
      startTime: startTime || '09:00',
      endTime: endTime || '13:00',
      requiredVolunteers: Number(requiredVolunteers) || 5,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : (skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean),
      status: 'open',
      isApproved: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Opportunity posted successfully!',
        data: opportunity,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
