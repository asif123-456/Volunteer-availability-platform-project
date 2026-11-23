import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import NgoProfile from '@/models/NgoProfile';
import { signToken } from '@/lib/auth';

/**
 * [Step 4] Login API using JWT
 * [Step 3] Verifies password hash using bcrypt
 */
export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password via bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    let ngoProfile = null;
    if (user.role === 'ngo') {
      ngoProfile = await NgoProfile.findOne({ user: user._id });
    }

    // Generate JWT Token
    const token = signToken({ id: user._id, role: user.role });

    const response = NextResponse.json({
      success: true,
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
    });

    // Set HTTP-Only Cookie
    response.cookies.set('volunteer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
