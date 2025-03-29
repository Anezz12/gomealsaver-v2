import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

// Define interface for response
interface UpdateResponse {
  success: boolean;
  message: string;
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<UpdateResponse>> {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const phone = formData.get('phone') as string | null;
    const image = formData.get('image') as File | null;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required',
        },
        { status: 400 }
      );
    }

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      name: string;
      username: string;
      phone?: string;
      image?: string;
    } = {
      name,
      username,
    };

    if (phone) {
      updateData.phone = phone;
    }

    // Find current user to get existing image
    const currentUser = await User.findById(sessionUser.userId);
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    let imageUrl: string | undefined;

    // Process image if provided
    if (image && image.size > 0) {
      // Upload new image to Cloudinary
      const imageBuffer = await image.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:${image.type};base64,${imageBase64}`,
        {
          folder: 'user_profiles',
          width: 500,
          height: 500,
          crop: 'fill',
        }
      );

      imageUrl = result.secure_url;
      updateData.image = imageUrl;

      // Delete old image if it exists and is from Cloudinary
      if (currentUser.image && currentUser.image.includes('cloudinary')) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = currentUser.image.split('/');
          const filenameWithExtension = urlParts[urlParts.length - 1];
          const publicId = `user_profiles/${
            filenameWithExtension.split('.')[0]
          }`;

          // Delete the image from Cloudinary
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted old profile image: ${publicId}`);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Continue even if image deletion fails
        }
      }
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update user',
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        username: updatedUser.username,
        phone: updatedUser.phone,
        image: updatedUser.image,
      },
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error updating profile',
      },
      { status: 500 }
    );
  }
}
