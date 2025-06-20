'use server';

import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { Types } from 'mongoose';

interface BookmarkStatusResponse {
  isBookmarked: boolean;
  error?: string;
}

export default async function checkBookmarkStatus(
  mealId: string
): Promise<BookmarkStatusResponse> {
  console.log('🔍 [SERVER] Checking bookmark status for meal:', mealId);

  try {
    // Validate input
    if (!mealId) {
      console.log('❌ [SERVER] Missing meal ID');
      return { isBookmarked: false, error: 'Meal ID is required' };
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(mealId)) {
      console.log('❌ [SERVER] Invalid meal ID format:', mealId);
      return { isBookmarked: false, error: 'Invalid meal ID format' };
    }

    await connectDB();
    console.log('✅ [SERVER] Database connected');

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      console.log('❌ [SERVER] No authenticated user');
      return { isBookmarked: false, error: 'Authentication required' };
    }

    const { userId } = sessionUser;
    console.log('👤 [SERVER] Checking bookmarks for user:', userId);

    // Find user in the database
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ [SERVER] User not found');
      return { isBookmarked: false, error: 'User not found' };
    }

    // Ensure bookmarks array exists
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // Check if meal is bookmarked using ObjectId comparison
    const mealObjectId = new Types.ObjectId(mealId);
    const isBookmarked = user.bookmarks.some((bookmark: Types.ObjectId) =>
      bookmark.equals(mealObjectId)
    );

    console.log('✅ [SERVER] Bookmark status checked:', isBookmarked);
    return { isBookmarked };
  } catch (error: any) {
    console.error('❌ [SERVER] Error checking bookmark status:', error);
    return {
      isBookmarked: false,
      error: 'Failed to check bookmark status',
    };
  }
}
