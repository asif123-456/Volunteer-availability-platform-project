'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import Application from '@/models/Application';
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
 * [Next.js Server Action] Create Opportunity by NGO
 */
export async function createOpportunityAction(formData) {
  const user = await getAuthUser();
  if (!user || !checkRole(user, 'ngo')) {
    throw new Error('Unauthorized');
  }

  await connectDB();
  const eventObj = new Date(formData.eventDate);
  const dayOfWeek = DAYS_NAME[eventObj.getDay()];

  const opp = await Opportunity.create({
    ngo: user.id,
    ngoProfile: user.ngoProfile ? user.ngoProfile._id : null,
    title: formData.title,
    description: formData.description,
    category: formData.category || 'Cleanliness Drive',
    location: formData.location,
    city: formData.city || user.city || '',
    eventDate: eventObj,
    dayOfWeek,
    startTime: formData.startTime || '09:00',
    endTime: formData.endTime || '13:00',
    requiredVolunteers: Number(formData.requiredVolunteers) || 5,
    skillsRequired: Array.isArray(formData.skillsRequired)
      ? formData.skillsRequired
      : (formData.skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean),
    status: 'open',
    isApproved: true,
  });

  revalidatePath('/ngo/dashboard');
  revalidatePath('/volunteer/dashboard');
  return { success: true, id: opp._id.toString() };
}

/**
 * [Next.js Server Action] Approve or Reject Application
 */
export async function updateApplicationStatusAction(applicationId, status, remarks = '') {
  const user = await getAuthUser();
  if (!user || !checkRole(user, 'ngo')) {
    throw new Error('Unauthorized');
  }

  await connectDB();
  const app = await Application.findOne({
    _id: applicationId,
    ngo: user.id,
  }).populate('opportunity');

  if (!app) throw new Error('Application not found');

  const prevStatus = app.status;
  app.status = status;
  app.ngoRemarks = remarks;
  app.decidedAt = new Date();
  await app.save();

  const opp = await Opportunity.findById(app.opportunity._id);
  if (opp) {
    if (status === 'accepted' && prevStatus !== 'accepted') {
      opp.filledVolunteers += 1;
      if (opp.filledVolunteers >= opp.requiredVolunteers) opp.status = 'closed';
      await opp.save();
    } else if (prevStatus === 'accepted' && status === 'rejected') {
      opp.filledVolunteers = Math.max(0, opp.filledVolunteers - 1);
      if (opp.status === 'closed' && opp.filledVolunteers < opp.requiredVolunteers) {
        opp.status = 'open';
      }
      await opp.save();
    }
  }

  revalidatePath('/ngo/dashboard');
  revalidatePath('/volunteer/applications');
  return { success: true };
}
