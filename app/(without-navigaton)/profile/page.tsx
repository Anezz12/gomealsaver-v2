import MainContainer from '@/components/Settings/MainContainer';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import connectDB from '@/config/database';
import { convertToObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Mail, Shield, Clock, User as UserIcon } from 'lucide-react';
import ProfileDefault from '@/public/profile.png';

// Tambahkan export konfigurasi untuk set dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      redirect('/login');
    }

    const user = await User.findOne({ email: sessionUser.user.email }).lean();
    if (!user) {
      throw new Error('User not found');
    }

    // Convert user data to serializable object
    const serializedUser = convertToObject(user);

    const formatDate = (date: string | number) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <MainContainer>
        <div className="bg-[#141414] border border-gray-800 rounded-xl shadow-lg shadow-amber-900/10">
          {/* Header/Banner Section */}
          <div className="relative h-32 bg-gradient-to-r from-amber-600 to-amber-800 rounded-t-xl overflow-hidden">
            {/* Decorative elements for the banner */}
            {/* <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div> */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-20 w-24 h-24 bg-amber-500/20 rounded-full translate-y-1/2 blur-xl"></div>
          </div>

          {/* Profile Image - Positioned outside but overlapping banner */}
          <div className="relative px-8">
            <div className="absolute -top-12">
              <div className="relative">
                {/* Dark ring around image */}
                <div className="absolute inset-0 rounded-full border-2 border-[#0A0A0A]/80 scale-[1.03]"></div>

                {/* Actual profile image */}
                <div className="relative z-10 rounded-full p-1 bg-gradient-to-br from-amber-500 to-amber-700">
                  <div className="bg-[#141414] p-0.5 rounded-full">
                    <Image
                      src={serializedUser.image || ProfileDefault}
                      alt={serializedUser.name || 'Profile'}
                      width={96}
                      height={96}
                      className="rounded-full h-24 w-24 object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 px-8 pb-8">
            {/* Basic Info */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">
                {serializedUser.name}
              </h1>
              <p className="text-gray-400">@{serializedUser.username}</p>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center space-x-3 text-gray-300 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-900/20 rounded-full">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-500/90">Email</p>
                  <p className="text-gray-300">{serializedUser.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3 text-gray-300 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-900/20 rounded-full">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-500/90">Role</p>
                  <p className="capitalize text-gray-300">
                    {serializedUser.role}
                  </p>
                </div>
              </div>

              {/* Provider */}
              <div className="flex items-center space-x-3 text-gray-300 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-900/20 rounded-full">
                  <UserIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-500/90">
                    Sign in Method
                  </p>
                  <p className="capitalize text-gray-300">
                    {serializedUser.provider}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center space-x-3 text-gray-300 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-900/20 rounded-full">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-500/90">
                    Joined
                  </p>
                  <p className="text-gray-300">
                    {formatDate(serializedUser.createdAt)}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center space-x-3 text-gray-300 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                <div className="p-2 bg-amber-900/20 rounded-full">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-500/90">
                    Last Updated
                  </p>
                  <p className="text-gray-300">
                    {formatDate(serializedUser.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between bg-[#1A1A1A] p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      serializedUser.deletedAt
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-emerald-500 animate-pulse'
                    }`}
                  />
                  <span className="text-sm text-gray-300">
                    {serializedUser.deletedAt
                      ? 'Account Deactivated'
                      : 'Account Active'}
                  </span>
                </div>
                {serializedUser.deletedAt && (
                  <span className="text-sm text-gray-500">
                    Deactivated on {formatDate(serializedUser.deletedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    );
  } catch (error) {
    console.error('Profile Page Error:', error);
    throw error;
  }
}
