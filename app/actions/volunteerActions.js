'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import VolunteerAvailability from '@/models/VolunteerAvailability';
import Application from '@/models/Application';
import { getAuthUser } from '@/lib/auth';
import { matchOpportunityWithSlots } from '@/lib/matching';

/**
 * [Next.js Server Action] Save Volunteer Availability
 */
export async function saveAvailabilityAction(slots) {
  const user = await getAuthUser();
  if (!user || user.role !== 'volunteer') {
    throw new Error('Unauthorized');
  }

  await connectDB();
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
  revalidatePath('/volunteer/availability');
  revalidatePath('/volunteer/dashboard');
  return { success: true, count: saved.length };
}

/**
 * [Next.js Server Action] Apply for Opportunity
 */
export async function applyOpportunityAction(opportunityId, message = '') {
  const user = await getAuthUser();
  if (!user || user.role !== 'volunteer') {
    throw new Error('Unauthorized');
  }

  await connectDB();
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) throw new Error('Opportunity not found');

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
    volunteerMessage: message,
  });

  revalidatePath('/volunteer/applications');
  revalidatePath('/volunteer/dashboard');
  return { success: true, applicationId: application._id.toString() };
}
