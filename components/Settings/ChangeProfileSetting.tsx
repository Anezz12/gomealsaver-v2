'use client';

import ProfileDefault from '@/public/profile.png';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Tambahkan export konfigurasi untuk set dynamic rendering
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

  // Implementasi fungsi untuk update user via API
  async function updateUser(formData: FormData): Promise<UpdateResponse> {
    try {
      const response = await fetch('/api/updateprofile', {
        method: 'PUT',
        body: formData,
        // Tidak perlu Content-Type untuk FormData
        // Browser akan otomatis menambahkan boundary yang tepat
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
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Ambil nilai dari form menggunakan type assertion
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

        // Update session
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

        // Optional: Redirect after success
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
    <div className="min-h-52 pt-24 pb-10 px-2 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Edit Profile
        </h1>
        <p className="max-w-lg text-xl font-semibold text-gray-600 dark:text-gray-400 mb-8">
          Masukkan informasi yang valid <br /> agar proses lebih mudah
        </p>
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-zinc-800/50 p-8 border border-gray-100 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : profileImage
                  }
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-zinc-700"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-blue-500 dark:bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <input
                    type="file"
                    id="avatar"
                    name="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </label>
                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                    {error}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to change profile picture
              </p>
            </div>

            {/* Form Fields */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Name{' '}
                <span className="text-gray-400 dark:text-gray-500">
                  (max 50 characters)
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                maxLength={50}
                defaultValue={session?.user?.name}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Username{' '}
                <span className="text-gray-400 dark:text-gray-500">
                  (max 20 characters)
                </span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                maxLength={20}
                defaultValue={session?.user?.username}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={session?.user?.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link href="/profile/setting">
                <button
                  type="button"
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                    <span>Updating...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
