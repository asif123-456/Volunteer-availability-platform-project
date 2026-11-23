import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import Application from '@/models/Application';
import { getAuthUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const opp = await Opportunity.findById(params.id)
      .populate('ngo', 'name email phone')
      .populate('ngoProfile');

    if (!opp) {
      return NextResponse.json(
        { success: false, message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: opp });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const opp = await Opportunity.findById(params.id);
    if (!opp) {
      return NextResponse.json(
        { success: false, message: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Only owner NGO or Super Admin can delete
    if (opp.ngo.toString() !== user.id && user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    await Opportunity.findByIdAndDelete(params.id);
    await Application.deleteMany({ opportunity: params.id });

    return NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
