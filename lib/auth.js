import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from './mongodb';
import User from '../models/User';
import NgoProfile from '../models/NgoProfile';

const JWT_SECRET =
  process.env.JWT_SECRET || 'volunteer_platform_secret_jwt_key_2026';

// [Step 4] Generate JWT Token
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

// [Step 4] Verify JWT Token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// [Step 5] Extract & Authenticate User from Route Handler Request
export async function getAuthUser(req) {
  await connectDB();

  let token = null;

  // 1. Check Authorization Header: Bearer <token>
  if (req && req.headers) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // 2. Check HTTP Cookies
  if (!token) {
    try {
      const cookieStore = cookies();
      const cookieToken = cookieStore.get('volunteer_token');
      if (cookieToken) {
        token = cookieToken.value;
      }
    } catch (e) {
      // Cookies not accessible in some contexts
    }
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await User.findById(decoded.id).select('-password');
  if (!user) return null;

  let ngoProfile = null;
  if (user.role === 'ngo') {
    ngoProfile = await NgoProfile.findOne({ user: user._id });
  }

  return {
    id: user._id.toString(),
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    city: user.city,
    ngoProfile: ngoProfile || null,
  };
}

// [Step 5] Role-based Authorization Guard
export function checkRole(user, ...allowedRoles) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
