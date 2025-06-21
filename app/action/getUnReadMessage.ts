'use server';

import connectDB from '@/config/database';
import Message from '@/models/Messages';
import { getSessionUser } from '@/utils/getSessionUser';

interface UnreadMessageResponse {
  count?: number;
  error?: string;
}

async function getUnreadMessageCount(): Promise<UnreadMessageResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return { error: 'User ID is required' };
    }

    const { userId } = sessionUser;

    const count: number = await Message.countDocuments({
      recipient: userId,
      read: false,
    });

    return { count };
  } catch (error: any) {
    console.error('Error getting unread message count:', error);
    return { error: 'Failed to get unread message count' };
  }
}

export default getUnreadMessageCount;
