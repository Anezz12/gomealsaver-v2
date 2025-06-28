import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Message from '@/models/Messages';
import { getSessionUser } from '@/utils/getSessionUser';

interface MessageData {
  sender: string;
  recipient: string;
  meal: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to send a message' },
        { status: 401 }
      );
    }

    const { userId } = sessionUser;

    // Parse the request body
    const body = await request.json();
    const { recipient, meal, name, email, phone, message } = body;

    // Validation
    if (!recipient || !meal || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (userId === recipient) {
      return NextResponse.json(
        { error: 'You cannot send a message to yourself' },
        { status: 400 }
      );
    }

    const messageData: MessageData = {
      sender: userId,
      recipient,
      meal,
      name,
      email,
      phone: phone || '',
      message: message,
    };

    const newMessage = new Message(messageData);
    await newMessage.save();

    return NextResponse.json(
      {
        submitted: true,
        message: 'Message sent successfully',
        messageId: newMessage._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
