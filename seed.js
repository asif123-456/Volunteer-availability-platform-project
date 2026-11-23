const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/volunteer_availability';

// Inline Schemas for stand-alone seed runner
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: true },
    role: { type: String, enum: ['volunteer', 'ngo', 'superadmin'] },
    phone: String,
    city: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const ngoProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizationName: String,
    registrationNumber: String,
    cause: String,
    website: String,
    description: String,
    address: String,
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'] },
    verifiedAt: Date,
  },
  { timestamps: true }
);

const volunteerAvailabilitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dayOfWeek: String,
    startTime: String,
    endTime: String,
    isRecurring: Boolean,
    notes: String,
  },
  { timestamps: true }
);

const opportunitySchema = new mongoose.Schema(
  {
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ngoProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'NgoProfile' },
    title: String,
    description: String,
    category: String,
    location: String,
    city: String,
    eventDate: Date,
    dayOfWeek: String,
    startTime: String,
    endTime: String,
    requiredVolunteers: Number,
    filledVolunteers: { type: Number, default: 0 },
    skillsRequired: [String],
    status: { type: String, default: 'open' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' },
    availabilityMatch: Boolean,
    matchScore: Number,
    volunteerMessage: String,
    ngoRemarks: String,
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const NgoProfile = mongoose.models.NgoProfile || mongoose.model('NgoProfile', ngoProfileSchema);
const VolunteerAvailability =
  mongoose.models.VolunteerAvailability ||
  mongoose.model('VolunteerAvailability', volunteerAvailabilitySchema);
const Opportunity = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema);
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB for Next.js app seeding...');

    await User.deleteMany();
    await NgoProfile.deleteMany();
    await VolunteerAvailability.deleteMany();
    await Opportunity.deleteMany();
    await Application.deleteMany();

    // 1. Super Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@volunteer.org',
      password: 'admin12345',
      role: 'superadmin',
      phone: '+91 9876543210',
      city: 'New Delhi',
    });

    // 2. Verified NGO
    const greenEarthUser = await User.create({
      name: 'Green Earth Foundation',
      email: 'ngo@greenearth.org',
      password: 'ngo12345',
      role: 'ngo',
      phone: '+91 9811223344',
      city: 'Mumbai',
    });

    const greenEarthProfile = await NgoProfile.create({
      user: greenEarthUser._id,
      organizationName: 'Green Earth Foundation',
      registrationNumber: 'NGO-MH-2021-998',
      cause: 'Environmental Conservation & Tree Plantation',
      website: 'https://greenearth.org',
      description: 'Dedicated to urban cleanliness drives, waste segregation and tree plantation.',
      address: 'Bandra West, Mumbai',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
    });

    // 3. Pending NGO (For Step 6 verification test)
    const helpingHandsUser = await User.create({
      name: 'Helping Hands Trust',
      email: 'ngo2@helpinghands.org',
      password: 'ngo12345',
      role: 'ngo',
      phone: '+91 9933445566',
      city: 'Bangalore',
    });

    await NgoProfile.create({
      user: helpingHandsUser._id,
      organizationName: 'Helping Hands Community Trust',
      registrationNumber: 'NGO-KA-PENDING-452',
      cause: 'Child Care & Slum Education',
      website: 'https://helpinghandstrust.org',
      description: 'Weekend education and nutrition drives for children.',
      address: 'Koramangala, Bangalore',
      verificationStatus: 'pending',
    });

    // 4. Volunteer (Rahul Sharma)
    const volunteerRahul = await User.create({
      name: 'Rahul Sharma',
      email: 'volunteer@gmail.com',
      password: 'volunteer123',
      role: 'volunteer',
      phone: '+91 9871122334',
      city: 'Mumbai',
    });

    // Availability slots for Rahul
    await VolunteerAvailability.create([
      {
        user: volunteerRahul._id,
        dayOfWeek: 'Sunday',
        startTime: '09:00',
        endTime: '14:00',
        isRecurring: true,
        notes: 'Available for physical drives & cleanliness',
      },
      {
        user: volunteerRahul._id,
        dayOfWeek: 'Saturday',
        startTime: '14:00',
        endTime: '18:00',
        isRecurring: true,
        notes: 'Available for teaching and tutoring',
      },
    ]);

    // Opportunities
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));

    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));

    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + ((3 - today.getDay() + 7) % 7 || 7));

    const opp1 = await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Sunday Mega Beach & Park Cleanliness Drive',
      description: 'Join our flagship Sunday cleanliness initiative! We will clear plastic waste and set up segregated bins.',
      category: 'Cleanliness Drive',
      location: 'Juhu Beach Promenade',
      city: 'Mumbai',
      eventDate: nextSunday,
      dayOfWeek: 'Sunday',
      startTime: '09:30',
      endTime: '13:00',
      requiredVolunteers: 15,
      filledVolunteers: 1,
      skillsRequired: ['Waste Segregation', 'Physical Work', 'Teamwork'],
      status: 'open',
      isApproved: true,
    });

    await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Weekend Youth Education & Storytelling Camp',
      description: 'Teach English and interactive storytelling to children in our community center.',
      category: 'Education & Teaching',
      location: 'Community Center 4, Bandra',
      city: 'Mumbai',
      eventDate: nextSaturday,
      dayOfWeek: 'Saturday',
      startTime: '14:30',
      endTime: '17:30',
      requiredVolunteers: 6,
      filledVolunteers: 0,
      skillsRequired: ['Teaching', 'Patience'],
      status: 'open',
      isApproved: true,
    });

    await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Midweek Community Health & Blood Donation Camp',
      description: 'Assist doctors and registration desk for an urgent community blood donation camp.',
      category: 'Health & Medical',
      location: 'Civic Hospital Hall',
      city: 'Mumbai',
      eventDate: nextWednesday,
      dayOfWeek: 'Wednesday',
      startTime: '10:00',
      endTime: '15:00',
      requiredVolunteers: 8,
      filledVolunteers: 0,
      skillsRequired: ['Patient Assistance'],
      status: 'open',
      isApproved: true,
    });

    // Sample Application
    await Application.create({
      opportunity: opp1._id,
      volunteer: volunteerRahul._id,
      ngo: greenEarthUser._id,
      status: 'pending',
      availabilityMatch: true,
      matchScore: 100,
      volunteerMessage: 'I am free on Sunday mornings and passionate about environmental causes!',
    });

    console.log(' Database seeded successfully for Next.js App!');
    console.log(' Demo Accounts:');
    console.log(' - Volunteer:    volunteer@gmail.com / volunteer123');
    console.log(' - Verified NGO: ngo@greenearth.org / ngo12345');
    console.log(' - Pending NGO:  ngo2@helpinghands.org / ngo12345');
    console.log(' - Super Admin:  admin@volunteer.org / admin12345');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
