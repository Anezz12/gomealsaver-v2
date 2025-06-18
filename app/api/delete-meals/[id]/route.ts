import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  props: RouteParams
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to delete a meal' },
        { status: 401 }
      );
    }
    const { userId } = sessionUser;

    // Check if meal exists and user owns it
    const existingMeal = await Meal.findById(params.id);
    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    if (existingMeal.owner.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this meal' },
        { status: 403 }
      );
    }

    console.log('🗑️ [SERVER] Deleting meal:', params.id);

    // Optional: Delete images from cloudinary
    if (existingMeal.image && existingMeal.image.length > 0) {
      try {
        for (const imageUrl of existingMeal.image) {
          // Extract public_id from cloudinary URL
          const publicId = imageUrl
            .split('/')
            .slice(-2)
            .join('/')
            .split('.')[0];
          await cloudinary.uploader.destroy(`GoMealsSaver/${publicId}`);
        }
        console.log('🖼️ [SERVER] Images deleted from cloudinary');
      } catch (imageError) {
        console.warn(
          '⚠️ [SERVER] Failed to delete some images from cloudinary:',
          imageError
        );
        // Continue with meal deletion even if image deletion fails
      }
    }

    // Delete the meal
    const deletedMeal = await Meal.findByIdAndDelete(params.id);

    if (!deletedMeal) {
      return NextResponse.json(
        { error: 'Failed to delete meal' },
        { status: 500 }
      );
    }

    console.log('✅ [SERVER] Meal deleted successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Meal deleted successfully',
        deletedMealId: params.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [SERVER] Error in meal deletion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete meal' },
      { status: 500 }
    );
  }
}
