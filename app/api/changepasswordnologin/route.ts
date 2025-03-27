import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import bcrypt from 'bcryptjs';
import PasswordReset from '@/models/passwordReset';
import User from '@/models/User';

interface PasswordChangeRequest {
  resetToken: string;
  newPassword: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { resetToken, newPassword }: PasswordChangeRequest =
      await request.json();

    // temukan record reset password dengan token yang diberikan

    const passwordReset = await PasswordReset.findOne({
      token: resetToken,
      expiresAt: { $gt: new Date() },
    }).populate('user');

    if (!passwordReset) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
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

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    // Gunakan model User langsung karena kita sudah punya userId
    await User.findByIdAndUpdate(
      passwordReset.user._id, // atau passwordReset.userId tergantung schema
      { password: hashedPassword }
    );

    // Hapus token reset setelah berhasil
    await PasswordReset.findByIdAndDelete(passwordReset._id);

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully changed',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}
