import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Opportunity from '@/models/Opportunity';
import VolunteerAvailability from '@/models/VolunteerAvailability';
import { getAuthUser } from '@/lib/auth';
import { matchOpportunityWithSlots } from '@/lib/matching';

/**
 * [Step 10] Apply & View Applications Route Handler
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunityId');

    // If Super Admin requests all applications
    if (user.role === 'superadmin') {
      const allApplications = await Application.find()
        .populate('volunteer', 'name email phone city')
        .populate({
          path: 'opportunity',
          populate: [
            { path: 'ngo', select: 'name email phone' },
            { path: 'ngoProfile', select: 'organizationName website cause' },
          ],
        })
        .sort({ appliedAt: -1 });

      return NextResponse.json({
        success: true,
        count: allApplications.length,
        data: allApplications,
      });
    }

    // If NGO requests applicants for an opportunity
    if (user.role === 'ngo') {
      const filter = { ngo: user.id };
      if (opportunityId) filter.opportunity = opportunityId;

      const applicants = await Application.find(filter)
        .populate('volunteer', 'name email phone city')
        .populate('opportunity', 'title eventDate dayOfWeek startTime endTime location requiredVolunteers filledVolunteers')
        .sort({ matchScore: -1, appliedAt: -1 });

      return NextResponse.json({
        success: true,
        count: applicants.length,
        data: applicants,
      });
    }

    // If volunteer requests their applications
    const applications = await Application.find({ volunteer: user.id })
      .populate({
        path: 'opportunity',
        populate: [
          { path: 'ngo', select: 'name email phone' },
          { path: 'ngoProfile', select: 'organizationName website cause' },
        ],
      })
      .sort({ appliedAt: -1 });

    return NextResponse.json({
      success: true,
      count: applications.length,
      data: applications,
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
    if (!user || user.role !== 'volunteer') {
      return NextResponse.json(
        { success: false, message: 'Only volunteers can submit applications' },
        { status: 403 }
      );
    }

    await connectDB();
    const { opportunityId, message } = await req.json();

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return NextResponse.json(
        { success: false, message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (opportunity.status !== 'open') {
      return NextResponse.json(
        { success: false, message: 'Opportunity is closed for applications' },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await Application.findOne({
      opportunity: opportunityId,
      volunteer: user.id,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'You have already applied for this opportunity' },
        { status: 400 }
      );
    }

    // Calculate match score
    const slots = await VolunteerAvailability.find({ user: user.id });
    const { isMatched, matchScore } = matchOpportunityWithSlots(
      opportunity.toObject(),
      slots
    );

    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: user.id,
      ngo: opportunity.ngo,
      status: 'pending',
      availabilityMatch: isMatched,
      matchScore,
      volunteerMessage: message || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted! Waiting for NGO confirmation.',
        data: application,
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
