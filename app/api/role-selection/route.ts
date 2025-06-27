// app/api/role-selection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to select a role' },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    // Validate role sesuai enum di model User
    if (!role || !['user', 'admin', 'seller'].includes(role)) {
      return NextResponse.json(
        {
          error: 'Invalid role selected',
          validRoles: ['user', 'seller'], // admin tidak bisa dipilih user
        },
        { status: 400 }
      );
    }

    // Admin role tidak bisa dipilih oleh user biasa
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Admin role cannot be selected by users' },
        { status: 403 }
      );
    }

    // Find user and update role
    const user = await User.findById(sessionUser.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is trying to change from existing role
    if (user.role && user.role !== 'user' && user.role !== role) {
      return NextResponse.json(
        {
          error: 'Role change not allowed',
          currentRole: user.role,
          message: 'Contact support to change your existing role.',
        },
        { status: 409 }
      );
    }

    // Update user role dan timestamp
    user.role = role;
    user.updatedAt = new Date();

    await user.save();

    return NextResponse.json(
      {
        message: `Role updated successfully to ${role}`,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      {
        error: 'Failed to update role',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to view role information' },
        { status: 401 }
      );
    }

    const user = await User.findById(sessionUser.userId).select(
      'role updatedAt username email'
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        currentRole: user.role,
        updatedAt: user.updatedAt,
        canChangeRole: user.role === 'user', // Hanya user yang bisa upgrade ke seller
        availableRoles: user.role === 'user' ? ['seller'] : [],
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch role information',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
