const mongoose = require('mongoose');

const volunteerAvailabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      required: [true, 'Please select a day of the week'],
    },
    startTime: {
      type: String,
      required: [true, 'Please specify start time (e.g. 09:00)'],
    },
    endTime: {
      type: String,
      required: [true, 'Please specify end time (e.g. 13:00)'],
    },
    isRecurring: {
      type: Boolean,
      default: true,
    },
    specificDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'VolunteerAvailability',
  volunteerAvailabilitySchema
);
