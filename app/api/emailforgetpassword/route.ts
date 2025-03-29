import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import User from '@/models/User';
import connectDB from '@/config/database';
import crypto from 'crypto';
import PasswordReset from '@/models/passwordReset';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const { email } = await request.json();

    // Cek apakah email ada di database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'No user found with this email' },
        { status: 404 }
      );
    }

    // Buat kode verifikasi 6 digti
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    //  Simpan kode dan waktu kedaluwarsa  (15 menit dari sekaang)

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Cari jika ada reset token yang sudah ada untuk user ini
    const existingReset = await PasswordReset.findOne({ user: user._id });

    if (existingReset) {
      // Update jika sudah ada
      existingReset.token = verificationCode;
      existingReset.expiresAt = expiresAt;
      await existingReset.save();
    } else {
      // Buat baru jika belum ada
      await PasswordReset.create({
        user: user._id,
        token: verificationCode,
        expiresAt,
      });
    }

    // Konfigurasi transporter email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Kirim email
    await transporter.sendMail({
      from: `"GoMealSaver" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Reset Your Password',
      text: `Your password reset code is: ${verificationCode}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #d97706; text-align: center;">GoMealSaver Password Reset</h2>
          <p>You requested to reset your password. Use the verification code below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 24px; letter-spacing: 3px; font-weight: bold;">
              ${verificationCode}
            </div>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} GoMealSaver. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // console.log(
    //   `Email sent to ${email} with verification code: ${verificationCode}`
    // );

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
    });
  } catch (error: unknown) {
    console.error('Password update error', error);
    return NextResponse.json({ message: 'Error occurred' }, { status: 500 });
  }
}
