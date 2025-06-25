import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Message from '@/models/Messages';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to send replies' },
        { status: 401 }
      );
    }

    const { originalMessageId, message, name, email, phone } =
      await request.json();

    // Validation
    if (!originalMessageId || !message || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find original message
    const originalMessage = await Message.findById(originalMessageId);
    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Original message not found' },
        { status: 404 }
      );
    }

    // Determine recipient (reply to sender of original message)
    const recipientId =
      originalMessage.sender.toString() === sessionUser.userId
        ? originalMessage.recipient
        : originalMessage.sender;

    // Create reply message
    const replyMessage = new Message({
      sender: sessionUser.userId,
      recipient: recipientId,
      meal: originalMessage.meal,
      name,
      email,
      phone: phone || '',
      message,
      read: false,
      originalMessage: originalMessageId,
      isReply: true,
    });

    await replyMessage.save();

    // Populate the saved message for response
    const populatedReply = await Message.findById(replyMessage._id)
      .populate('sender', 'username email image')
      .populate('recipient', 'username email image')
      .populate('meal', 'title images');

    return NextResponse.json(
      {
        message: 'Reply sent successfully',
        reply: populatedReply,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
