import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Log email configuration (hide sensitive info)
    console.log('Email configuration:', {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: process.env.EMAIL_SERVER_SECURE,
      user: process.env.EMAIL_SERVER_USER ? '****' : 'not set',
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || 'not set (will use fallback)',
    });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      // Tambahan konfigurasi untuk mengatasi beberapa masalah SSL
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verifikasi koneksi ke server email
    try {
      await transporter.verify();
      console.log('SMTP server connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error('Failed to connect to email server');
    }

    // Alamat penerima (email Anda)
    const recipientEmail = process.env.EMAIL_TO || 'harsenaargrtya1@gmail.com'; // Default ke email Anda jika EMAIL_TO tidak ada

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: recipientEmail,
      subject: `Contact Form: Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1e3c63;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <h3 style="margin-top: 20px;">Message:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">${message.replace(
            /\n/g,
            '<br>'
          )}</p>
          <p>Sent from: ${email}</p>
        </div>
      `,
      text: `
        New Contact Form Submission
        --------------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Message:
        ${message}
      `,
      replyTo: email,
    };

    console.log(`Sending email to: ${recipientEmail}`);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        details: {
          messageId: info.messageId,
          recipient: recipientEmail.replace(/^(.{3})(.*)(@.*)$/, '$1***$3'), // Mask email for privacy
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
