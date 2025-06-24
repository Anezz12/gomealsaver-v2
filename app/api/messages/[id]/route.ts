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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to view messages' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received';
    const { userId } = sessionUser;

    let query = {};
    if (type === 'received') {
      query = { recipient: userId };
    } else {
      query = { sender: userId };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username email image')
      .populate('recipient', 'username email image')
      .populate('meal', 'title images')
      .sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { read } = await request.json();
    const message = await Message.findByIdAndUpdate(
      params.id,
      { read },
      { new: true }
    );

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Message.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
