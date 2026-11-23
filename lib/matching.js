/**
 * [Step 9] Smart Availability Matching Engine
 * Compares an NGO opportunity's required time slot with a volunteer's declared free hours.
 */

export function toMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function checkTimeOverlap(volStart, volEnd, oppStart, oppEnd) {
  const vS = toMinutes(volStart);
  const vE = toMinutes(volEnd);
  const oS = toMinutes(oppStart);
  const oE = toMinutes(oppEnd);

  // Exact complete window coverage: Volunteer is free during the entire drive
  if (vS <= oS && vE >= oE) {
    return { match: true, perfect: true };
  }

  // Partial overlap
  const overlap = Math.max(0, Math.min(vE, oE) - Math.max(vS, oS));
  const oppDuration = oE - oS;
  if (oppDuration > 0 && overlap / oppDuration >= 0.5) {
    return { match: true, perfect: false };
  }

  return { match: false, perfect: false };
}

export function matchOpportunityWithSlots(opportunity, volunteerSlots = []) {
  const oppDay = opportunity.dayOfWeek;
  let isMatched = false;
  let matchScore = 0;
  let matchReason = 'Schedule does not match your declared free hours';

  for (const slot of volunteerSlots) {
    if (slot.dayOfWeek.toLowerCase() === oppDay.toLowerCase()) {
      const overlap = checkTimeOverlap(
        slot.startTime,
        slot.endTime,
        opportunity.startTime,
        opportunity.endTime
      );

      if (overlap.perfect) {
        isMatched = true;
        matchScore = 100;
        matchReason = `Exact match! You are available on ${oppDay}s (${slot.startTime} - ${slot.endTime})`;
        break;
      } else if (overlap.match) {
        isMatched = true;
        matchScore = 75;
        matchReason = `Partial match on ${oppDay} (${slot.startTime} - ${slot.endTime})`;
      }
    }
  }

  return { isMatched, matchScore, matchReason };
}
