require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const NgoProfile = require('./models/NgoProfile');
const VolunteerAvailability = require('./models/VolunteerAvailability');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');

const seedData = async () => {
  const mongoURI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/volunteer_availability';

  try {
    await mongoose.connect(mongoURI);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await NgoProfile.deleteMany();
    await VolunteerAvailability.deleteMany();
    await Opportunity.deleteMany();
    await Application.deleteMany();
    console.log(' Cleared old database records.');

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@volunteer.org',
      password: 'admin12345',
      role: 'superadmin',
      phone: '+91 9876543210',
      city: 'New Delhi',
    });

    // 2. Create Verified NGO
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
      description:
        'Dedicated to urban cleanliness drives, waste management, and tree plantation drives across major metropolitan areas.',
      address: 'Bandra West, Mumbai',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
    });

    // 3. Create Pending NGO (for Super Admin verification test)
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
      description:
        'Working with underprivileged children to provide weekend tutoring and nutrition kits.',
      address: 'Koramangala, Bangalore',
      verificationStatus: 'pending',
    });

    // 4. Create Volunteer
    const volunteerRahul = await User.create({
      name: 'Rahul Sharma',
      email: 'volunteer@gmail.com',
      password: 'volunteer123',
      role: 'volunteer',
      phone: '+91 9871122334',
      city: 'Mumbai',
    });

    // Set Rahul's availability: Sunday Morning & Saturday Afternoon
    await VolunteerAvailability.create([
      {
        user: volunteerRahul._id,
        dayOfWeek: 'Sunday',
        startTime: '09:00',
        endTime: '14:00',
        isRecurring: true,
        notes: 'Available for physical outdoor drives and cleanliness',
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

    // Calculate dates for next Sunday and next Saturday
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));

    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));

    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + ((3 - today.getDay() + 7) % 7 || 7));

    // 5. Create Opportunities
    const opp1 = await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Sunday Mega Beach & Park Cleanliness Drive',
      description:
        'Join our flagship Sunday cleanliness initiative! We will remove plastic waste, clear walking pathways, and set up segregated recycling bins.',
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

    const opp2 = await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Weekend Youth Education & Storytelling Camp',
      description:
        'Teach English, basic math, and interactive storytelling to children in our community center.',
      category: 'Education & Teaching',
      location: 'Community Center 4, Bandra',
      city: 'Mumbai',
      eventDate: nextSaturday,
      dayOfWeek: 'Saturday',
      startTime: '14:30',
      endTime: '17:30',
      requiredVolunteers: 6,
      filledVolunteers: 0,
      skillsRequired: ['Teaching', 'English', 'Patience'],
      status: 'open',
      isApproved: true,
    });

    await Opportunity.create({
      ngo: greenEarthUser._id,
      ngoProfile: greenEarthProfile._id,
      title: 'Midweek Community Health & Blood Donation Camp',
      description:
        'Assist doctors and registration desk for an urgent community blood donation camp.',
      category: 'Health & Medical',
      location: 'Civic Hospital Hall',
      city: 'Mumbai',
      eventDate: nextWednesday,
      dayOfWeek: 'Wednesday',
      startTime: '10:00',
      endTime: '15:00',
      requiredVolunteers: 8,
      filledVolunteers: 0,
      skillsRequired: ['Patient Assistance', 'Registration Desk'],
      status: 'open',
      isApproved: true,
    });

    // 6. Create Application for Rahul to Opp 1
    await Application.create({
      opportunity: opp1._id,
      volunteer: volunteerRahul._id,
      ngo: greenEarthUser._id,
      status: 'pending',
      availabilityMatch: true,
      matchScore: 100,
      volunteerMessage:
        'I am free on Sunday mornings and passionate about environmental causes! Looking forward to helping.',
    });

    console.log(' Database seeded successfully!');
    console.log(' Demo Accounts Created:');
    console.log(' 1. Super Admin: admin@volunteer.org / admin12345');
    console.log(' 2. Verified NGO: ngo@greenearth.org / ngo12345');
    console.log(' 3. Pending NGO:  ngo2@helpinghands.org / ngo12345');
    console.log(' 4. Volunteer:    volunteer@gmail.com / volunteer123');

    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
