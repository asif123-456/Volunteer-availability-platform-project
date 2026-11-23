const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Please provide the registered NGO/Organization name'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide NGO Registration or 12A/80G Number'],
      trim: true,
    },
    cause: {
      type: String,
      default: 'Community Service',
    },
    website: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationNote: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NgoProfile', ngoProfileSchema);
