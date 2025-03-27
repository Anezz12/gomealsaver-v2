import { NextResponse } from 'next/server';
import PasswordReset from '@/models/passwordReset';
import connectDB from '@/config/database';
import crypto from 'crypto';
import User from '@/models/User';
export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, code } = await request.json();

    // Cari user dengan email yang diberikan
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      );
    }

    // Cari token reset untuk user tersebut
    const passwordReset = await PasswordReset.findOne({
      user: user._id,
      token: code,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Buat token reset password sekali pakai untuk langkah berikutnya
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Update token di database
    passwordReset.token = resetToken;
    passwordReset.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
    await passwordReset.save();

    return NextResponse.json({
      success: true,
      resetToken,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
