import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

interface MealData {
  owner: string;
  name: string;
  stockQuantity: number;
  cuisine: string;
  description: string;
  price: number;
  discountPercentage: number;
  originalPrice: number;
  portionSize: string;
  timeRemaining: string;
  features: string[];
  restaurant: Restaurant;
  available: boolean;
  image: string[];
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single meal for editing
export async function GET(
  request: NextRequest,
  props: RouteParams
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to access this resource' },
        { status: 401 }
      );
    }

    const meal = await Meal.findById(params.id);

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    // Check if user owns this meal
    if (meal.owner.toString() !== sessionUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to access this meal' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      meal: meal,
    });
  } catch (error: any) {
    console.error('Error fetching meal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch meal' },
      { status: 500 }
    );
  }
}

// PUT update meal
export async function PUT(
  request: NextRequest,
  props: RouteParams
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to edit a meal' },
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
        { error: 'Not authorized to edit this meal' },
        { status: 403 }
      );
    }

    console.log('🔄 [SERVER] Updating meal:', params.id);

    // Parse the request as multipart form data
    const formData = await request.formData();

    // Access all values from Features and handle image files
    const features = formData.getAll('features') as string[];
    const newImageFiles = formData
      .getAll('image')
      .filter(
        (image: any) => image instanceof File && image.name !== ''
      ) as File[];

    // Get existing images to keep
    const existingImages = formData.getAll('existingImages') as string[];

    console.log('📸 [SERVER] New images:', newImageFiles.length);
    console.log('📷 [SERVER] Existing images:', existingImages.length);

    const updateData: Partial<MealData> = {
      name: formData.get('name') as string,
      stockQuantity: Number(formData.get('stockQuantity')),
      cuisine: formData.get('cuisine') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      discountPercentage: Number(formData.get('discountPercentage')),
      originalPrice: Number(formData.get('originalPrice')),
      portionSize: formData.get('portionSize') as string,
      timeRemaining: formData.get('timeRemaining') as string,
      features,
      restaurant: {
        name: formData.get('restaurant.name') as string,
        address: formData.get('restaurant.address') as string,
        city: formData.get('restaurant.city') as string,
        state: formData.get('restaurant.state') as string,
        phone: formData.get('restaurant.phone') as string,
        email: formData.get('restaurant.email') as string,
      },
      available: Number(formData.get('stockQuantity')) > 0,
    };

    // Validation
    if (!updateData.name || !updateData.restaurant?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if ((updateData.originalPrice ?? 0) < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    // Handle images
    const finalImageUrls: string[] = [...existingImages];

    // Upload new images to cloudinary if any
    if (newImageFiles.length > 0) {
      console.log('⬆️ [SERVER] Uploading new images...');

      for (const imageFile of newImageFiles) {
        try {
          const imageBuffer = await imageFile.arrayBuffer();
          const imageArray = new Uint8Array(imageBuffer);
          const imageData = Buffer.from(imageArray);

          // Convert to base64
          const imageBase64 = imageData.toString('base64');

          // Make request to cloudinary
          const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            {
              folder: 'GoMealsSaver',
            }
          );
          finalImageUrls.push(result.secure_url);
          console.log('✅ [SERVER] Image uploaded:', result.secure_url);
        } catch (uploadError) {
          console.error('❌ [SERVER] Error uploading image:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload new image' },
            { status: 500 }
          );
        }
      }
    }

    // Ensure at least one image exists
    if (finalImageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Assign the final images
    updateData.image = finalImageUrls;

    console.log('💾 [SERVER] Final update data:', {
      ...updateData,
      image: `${finalImageUrls.length} images`,
    });

    // Update the meal
    const updatedMeal = await Meal.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedMeal) {
      return NextResponse.json(
        { error: 'Failed to update meal' },
        { status: 500 }
      );
    }

    console.log('✅ [SERVER] Meal updated successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Meal updated successfully',
        meal: updatedMeal,
        mealId: updatedMeal._id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [SERVER] Error in meal update:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update meal' },
      { status: 500 }
    );
  }
}
