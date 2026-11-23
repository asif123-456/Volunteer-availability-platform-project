import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import NgoProfile from '@/models/NgoProfile';
import { signToken } from '@/lib/auth';

/**
 * [Step 2] User Registration API
 * [Step 3] Password Hashing using bcrypt (triggered in User pre-save hook)
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      email,
      password,
      role = 'volunteer',
      phone = '',
      city = '',
      organizationName,
      registrationNumber,
      cause,
      website,
      description,
      address,
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user (bcrypt hashes password in User model)
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      city,
    });

    let ngoProfile = null;
    // If registering as NGO, create NgoProfile
    if (user.role === 'ngo') {
      ngoProfile = await NgoProfile.create({
        user: user._id,
        organizationName: organizationName || name,
        registrationNumber: registrationNumber || 'PENDING-REG',
        cause: cause || 'Community Service',
        website: website || '',
        description: description || '',
        address: address || city || '',
        verificationStatus: 'pending',
      });
    }

    // Generate JWT Token
    const token = signToken({ id: user._id, role: user.role });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          city: user.city,
          ngoProfile: ngoProfile || null,
        },
      },
      { status: 201 }
    );

    // Set HTTP-Only Cookie for seamless Next.js SSR session
    response.cookies.set('volunteer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}
