import { getSessionUser } from '@/utils/getSessionUser';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { convertToObject } from '@/utils/convertToObject';
import UpdateMealForm from '@/components/meals/UpdateMeals';
import NotFound from '@/app/not-found';

interface UpdateMealPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateMealPage({ params }: UpdateMealPageProps) {
  const resolvedParams = await params;

  console.log(
    '🔍 [SERVER] Loading update page for meal ID:',
    resolvedParams.id
  );

  // ✅ Check authentication
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    console.log('❌ [SERVER] No session user, redirecting to login');
    redirect('/login');
  }

  try {
    await connectDB();

    // ✅ Fetch meal data with owner information
    const mealData = await Meal.findById(resolvedParams.id)
      .populate('owner', 'name email')
      .lean();

    if (!mealData || Array.isArray(mealData)) {
      console.log('❌ [SERVER] Meal not found:', resolvedParams.id);
      notFound();
    }

    // ✅ Authorization check - Only owner or admin can edit
    const isOwner =
      mealData.owner?._id?.toString() === sessionUser.userId ||
      mealData.owner?.toString() === sessionUser.userId;

    if (!isOwner) {
      return <NotFound />;
    }

    // Convert to plain object
    const meal = convertToObject(mealData);

    // ✅ Format meal data for the form
    const formattedMeal = {
      id: meal._id.toString(),
      name: meal.name || '',
      description: meal.description || '',
      price: meal.price || 0,
      originalPrice: meal.originalPrice || meal.price || 0,
      discountPercentage: meal.discountPercentage || 0,
      stockQuantity: meal.stockQuantity || 1,
      cuisine: meal.cuisine || '',
      portionSize: meal.portionSize || 'Medium',
      timeRemaining: meal.timeRemaining || '2 hours',
      features: meal.features || [],
      image: meal.image || [],
      restaurant: {
        name: meal.restaurant?.name || '',
        address: meal.restaurant?.address || '',
        city: meal.restaurant?.city || '',
        state: meal.restaurant?.state || '',
        phone: meal.restaurant?.phone || '',
        email: meal.restaurant?.email || '',
      },
      // ✅ Add owner info for additional checks
      owner: {
        id: meal.owner?._id?.toString() || meal.owner?.toString(),
        name: meal.owner?.name || 'Restaurant Owner',
      },
    };

    console.log('✅ [SERVER] Access granted - rendering edit form');
    return <UpdateMealForm meal={formattedMeal} />;
  } catch (error) {
    console.error('❌ [SERVER] Error loading meal:', error);
    return <NotFound />;
  }
}
