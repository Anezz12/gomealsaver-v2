import connectDB from '@/config/database';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { NextResponse, NextRequest } from 'next/server';

// define interface for POST request body

interface PasswordChangeRequest {
  newPassword: string;
}

interface SessionUser {
  user: {
    email: string;
    provider?: string;
    [key: string]: any;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectDB();
  try {
    const session = ((await getSessionUser()) as SessionUser) || null;
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { newPassword }: PasswordChangeRequest = await req.json();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verifikasi bahwa pengguna menggunakan provider Google
    if (user.provider !== 'google') {
      return NextResponse.json(
        { message: 'This endpoint is only for Google accounts' },
        { status: 400 }
      );
    }

    // Validate new password
    const passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return NextResponse.json(
        {
          message:
            'New password must be at least 8 characters long and contain letters and numbers.',
        },
        { status: 400 }
      );
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 12);

    // Update using Mongoose
    user.password = hashedPassword;
    user.provider = 'credentials';
    await user.save();

    return NextResponse.json(
      {
        message:
          'Password updated successfully. You can now login with email and password.',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Error updating password' },
      { status: 500 }
    );
  }
}
