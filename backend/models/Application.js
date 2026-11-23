const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'attended'],
      default: 'pending',
    },
    availabilityMatch: {
      type: Boolean,
      default: false,
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    volunteerMessage: {
      type: String,
      default: '',
    },
    ngoRemarks: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    decidedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same volunteer to same opportunity
applicationSchema.index({ opportunity: 1, volunteer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
