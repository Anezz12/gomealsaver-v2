import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/config/database';
import User from '@/app/models/User';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  captchaToken: string;
}

interface CaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Ensure database connection
    await connectDB();

    if (request.method !== 'POST') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    const { username, email, password, captchaToken }: RegisterRequestBody =
      await request.json();

    // Verifikasi reCAPTCHA
    const captchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      { method: 'POST' }
    );

    const captchaResult: CaptchaResponse = await captchaResponse.json();

    // Cek validitas captcha
    if (!captchaResult.success) {
      return NextResponse.json(
        { message: 'Verifikasi captcha gagal' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.email === email
              ? 'Email already exists'
              : 'Username already exists',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      provider: 'credentials',
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { message: 'Registration failed', error: errorMessage },
      { status: 500 }
    );
  }
}
