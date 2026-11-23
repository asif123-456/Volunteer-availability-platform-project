const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NgoProfile',
    },
    title: {
      type: String,
      required: [true, 'Please provide an opportunity title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide opportunity details'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      default: 'Cleanliness Drive',
    },
    location: {
      type: String,
      required: [true, 'Please specify location/venue'],
    },
    city: {
      type: String,
      default: '',
    },
    eventDate: {
      type: Date,
      required: [true, 'Please select event date'],
    },
    dayOfWeek: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      required: [true, 'Please specify start time (e.g. 09:00)'],
    },
    endTime: {
      type: String,
      required: [true, 'Please specify end time (e.g. 13:00)'],
    },
    requiredVolunteers: {
      type: Number,
      required: [true, 'Please specify required number of volunteers'],
      min: [1, 'At least 1 volunteer required'],
      default: 5,
    },
    filledVolunteers: {
      type: Number,
      default: 0,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'cancelled'],
      default: 'open',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
