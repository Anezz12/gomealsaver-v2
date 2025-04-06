'use client';

import ProfileDefault from '@/public/profile.png';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Camera, User, Mail, Phone, Save, X } from 'lucide-react';

// Dynamic rendering configuration
export const dynamic = 'force-dynamic';

interface UpdateResponse {
  success: boolean;
  message: string;
  user?: {
    name: string;
    username: string;
    phone?: string;
    image?: string;
  };
}

export default function ProfileSettingProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const profileImage = session?.user?.image || ProfileDefault;

  // Implementation remains the same
  async function updateUser(formData: FormData): Promise<UpdateResponse> {
    // Same implementation
    try {
      const response = await fetch('/api/updateprofile', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        // 1MB limit
        setError('Image size should be less than 1MB');
        toast.error('Image size should be less than 1MB', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            padding: '16px',
            borderRadius: '10px',
          },
          icon: '⚠️',
        });
        return;
      }
      setSelectedImage(file);
      setError('');
    } else {
      setError('Please select a valid image file.');
      toast.error('Please select a valid image file.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Same implementation
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const formElement = e.target as HTMLFormElement;
      const nameInput = formElement.elements.namedItem(
        'name'
      ) as HTMLInputElement;
      const usernameInput = formElement.elements.namedItem(
        'username'
      ) as HTMLInputElement;
      const phoneInput = formElement.elements.namedItem(
        'phone'
      ) as HTMLInputElement;

      formData.append('name', nameInput.value);
      formData.append('username', usernameInput.value);
      formData.append('phone', phoneInput.value || '');

      const result = await updateUser(formData);

      if (result.success) {
        toast.success('Profile updated successfully! 🎉', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            padding: '16px',
            borderRadius: '10px',
          },
          icon: '👍',
        });

        await update({
          ...session,
          user: {
            ...session?.user,
            name: result.user?.name || session?.user?.name,
            image: result.user?.image || session?.user?.image,
            username: result.user?.username || session?.user?.username,
            phone: result.user?.phone || '',
          },
        });

        setTimeout(() => {
          router.push('/profile/setting');
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';

      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-6 sm:p-8 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Header with larger text and better spacing */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Edit Your Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Customize your profile information to help others recognize you
            better.
          </p>
        </div>

        {/* Main content area with improved card design */}
        <div className="bg-white dark:bg-zinc-800/60 rounded-2xl shadow-xl dark:shadow-zinc-800/30 border border-gray-100 dark:border-zinc-700/50 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="divide-y divide-gray-100 dark:divide-zinc-700/70"
          >
            {/* Avatar section with larger image and clearer action */}
            <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-gray-200 dark:border-zinc-700">
                  <Image
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : profileImage
                    }
                    alt="Profile"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-full flex items-center justify-center">
                    <label
                      htmlFor="avatar"
                      className="opacity-0 group-hover:opacity-100 cursor-pointer p-3 bg-blue-600 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg"
                    >
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        id="avatar"
                        name="image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>
                {error && (
                  <div className="mt-3 px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-center">
                    {error}
                  </div>
                )}
              </div>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                Hover and click to change your profile picture
              </p>
            </div>

            {/* Form fields with better spacing and icons */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Name field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="flex items-center text-base font-medium text-gray-700 dark:text-gray-200"
                  >
                    <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={50}
                    defaultValue={session?.user?.name}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter your full name"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    Maximum 50 characters
                  </p>
                </div>

                {/* Username field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="flex items-center text-base font-medium text-gray-700 dark:text-gray-200"
                  >
                    <span className="inline-block w-5 h-5 mr-2 text-center text-gray-500 dark:text-gray-400">
                      @
                    </span>
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    maxLength={20}
                    defaultValue={session?.user?.username}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="Choose a username"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    Maximum 20 characters
                  </p>
                </div>
              </div>

              {/* Email field - non-editable with distinctive styling */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center text-base font-medium text-gray-700 dark:text-gray-200"
                >
                  <Mail className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={session?.user?.email}
                    disabled
                    className="w-full px-4 py-3 text-lg bg-gray-100 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-200 dark:bg-zinc-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">
                    Locked
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  Contact support to change your email address
                </p>
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="flex items-center text-base font-medium text-gray-700 dark:text-gray-200"
                >
                  <Phone className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  disabled={isLoading}
                  defaultValue={''}
                  className="w-full px-4 py-3 text-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  placeholder="Enter your phone number (optional)"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  Used for account recovery and notifications
                </p>
              </div>
            </div>

            {/* Action buttons in a fixed section */}
            <div className="p-6 sm:p-8 md:p-10 bg-gray-50 dark:bg-zinc-800/30 flex flex-col sm:flex-row justify-end gap-4">
              <Link href="/profile/setting" className="order-2 sm:order-1">
                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-medium border-2 border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-medium bg-blue-600 border-2 border-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional guidance note */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4 flex items-start">
          <div className="text-blue-500 dark:text-blue-400 mr-3 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Your profile information helps others identify you. Make sure to use
            a clear profile picture and your real name for better recognition.
            All information is secured with industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
