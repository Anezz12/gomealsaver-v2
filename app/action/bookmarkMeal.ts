'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { Types } from 'mongoose';

interface BookmarkResponse {
  isBookmarked?: boolean;
  message?: string;
  error?: string;
}

async function bookmarkMeal(mealId: string): Promise<BookmarkResponse> {
  console.log('🔖 [SERVER] Bookmark action started for meal:', mealId);

  try {
    // Validate input
    if (!mealId) {
      console.log('❌ [SERVER] Missing meal ID');
      return { error: 'Meal ID is required' };
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(mealId)) {
      console.log('❌ [SERVER] Invalid meal ID format:', mealId);
      return { error: 'Invalid meal ID format' };
    }

    await connectDB();
    console.log('✅ [SERVER] Database connected');

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      console.log('❌ [SERVER] No authenticated user');
      return { error: 'Authentication required' };
    }

    const { userId } = sessionUser;
    console.log('👤 [SERVER] Processing bookmark for user:', userId);

    // Find user in the database
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ [SERVER] User not found');
      return { error: 'User not found' };
    }

    // Ensure bookmarks array exists
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // Check if the meal is already bookmarked using ObjectId comparison
    const mealObjectId = new Types.ObjectId(mealId);
    const bookmarkIndex = user.bookmarks.findIndex((bookmark: Types.ObjectId) =>
      bookmark.equals(mealObjectId)
    );

    let isBookmarked: boolean = bookmarkIndex !== -1;
    let message: string;

    if (isBookmarked) {
      // Remove the bookmark
      user.bookmarks.pull(mealObjectId);
      message = 'Meal removed from bookmarks';
      isBookmarked = false;
      console.log('🗑️ [SERVER] Bookmark removed');
    } else {
      // Add the bookmark
      user.bookmarks.push(mealObjectId);
      message = 'Meal added to bookmarks';
      isBookmarked = true;
      console.log('✅ [SERVER] Bookmark added');
    }

    // Save user with updated bookmarks
    await user.save();
    console.log('💾 [SERVER] User bookmarks saved');

    // Revalidate relevant paths
    revalidatePath('/meals/saved', 'page');
    revalidatePath('/meals', 'page');
    revalidatePath('/', 'page');

    console.log('🔄 [SERVER] Pages revalidated');
    console.log('✅ [SERVER] Bookmark action completed successfully');

    return { isBookmarked, message };
  } catch (error: any) {
    console.error('❌ [SERVER] Error in bookmark action:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return { error: 'Invalid data provided' };
    }

    if (error.name === 'CastError') {
      return { error: 'Invalid ID format' };
    }

    return { error: 'Failed to update bookmark. Please try again.' };
  }
}

export default bookmarkMeal;
