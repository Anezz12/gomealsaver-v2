import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';

interface SessionUser {
  user: {
    email: string;
    provider?: string;
    [key: string]: any;
  };
}

interface RoleChangeRequest {
  role: string;
}

interface User {
  id: string;
  role: string;
  username: string;
  provider: string;
  phone?: string;
  save(): Promise<void>;
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectDB();
  try {
    const sessionUser = ((await getSessionUser()) as SessionUser) || null;
    if (!sessionUser) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Ambil role yang ingin diubah dari request
    const { role }: RoleChangeRequest = await req.json();

    // Validasi role
    if (!role || !['user', 'seller'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Cari user di database
    const userId: string = sessionUser.user.id;
    const user: User | null = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `Role successfully changed to ${role}`,
        user: {
          role: user.role,
          id: user.id,
          username: user.username,
          provider: user.provider,
          phone: user.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
