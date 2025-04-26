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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You need to be logged in to add a meal' },
        { status: 401 }
      );
    }
    const { userId } = sessionUser;

    // Parse the request as multipart form data
    const formData = await request.formData();

    // Access all values from Features and handle image files
    const features = formData.getAll('features') as string[];
    const imageFiles = formData
      .getAll('image')
      .filter(
        (image: any) => image instanceof File && image.name !== ''
      ) as File[];

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    const mealData: Partial<MealData> = {
      owner: userId,
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
      available: true,
    };

    // Validation
    if (!mealData.name || !mealData.price || !mealData.restaurant?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if ((mealData.price ?? 0) < 0 || (mealData.originalPrice ?? 0) < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    // Upload images to cloudinary
    const imageUrls: string[] = [];
    for (const imageFile of imageFiles) {
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
        imageUrls.push(result.secure_url);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Assign the images
    mealData.image = imageUrls;

    const newMeal = new Meal(mealData);
    await newMeal.save();

    return NextResponse.json(
      {
        message: 'Meal added successfully',
        meal: newMeal,
        mealId: newMeal._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in meal creation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add meal' },
      { status: 500 }
    );
  }
}
