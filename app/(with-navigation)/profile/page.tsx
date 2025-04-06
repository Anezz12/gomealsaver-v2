import MainContainer from '@/components/Settings/MainContainer';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import connectDB from '@/config/database';
import { convertToObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  Mail,
  Shield,
  Clock,
  User as UserIcon,
  MapPin,
  Award,
  Settings,
} from 'lucide-react';
import ProfileDefault from '@/public/profile.png';
import Link from 'next/link';

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
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#141414] border-2 border-gray-800 rounded-2xl shadow-xl shadow-amber-900/10 overflow-hidden">
            {/* Header/Banner Section dengan gradien yang lebih menarik */}
            <div className="relative h-48 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-800 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[url('/abstract-pattern.png')] bg-repeat opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/30 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"></div>
              <div className="absolute bottom-0 left-40 w-48 h-48 bg-amber-400/20 rounded-full translate-y-1/3 blur-2xl"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

              {/* Edit profile button */}
              <div className="absolute top-4 right-4">
                <Link
                  href="/profile/setting"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-300 border border-white/30 hover:border-white/40 shadow-lg"
                >
                  <Settings size={18} />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Profile Image - Positioned with better overlap */}
            <div className="relative px-8 sm:px-12">
              <div className="absolute -top-16 sm:-top-20">
                <div className="relative">
                  {/* Dark ring around image */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#0A0A0A]/80 scale-[1.03]"></div>

                  {/* Actual profile image */}
                  <div className="relative z-10 rounded-full p-1.5 bg-gradient-to-br from-amber-500 to-amber-700 shadow-2xl">
                    <div className="bg-[#141414] p-1 rounded-full">
                      <Image
                        src={serializedUser.image || ProfileDefault}
                        alt={serializedUser.name || 'Profile'}
                        width={128}
                        height={128}
                        className="rounded-full h-32 w-32 sm:h-36 sm:w-36 object-cover border-2 border-[#141414]/50"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-24 sm:pt-28 px-8 sm:px-12 pb-10">
              {/* Basic Info with better typography */}
              <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {serializedUser.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-xl text-amber-400 font-medium">
                    @{serializedUser.username}
                  </p>
                  <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        serializedUser.deletedAt
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-emerald-500 animate-pulse'
                      } mr-2`}
                    ></div>
                    <span className="text-base text-gray-300">
                      {serializedUser.deletedAt
                        ? 'Account Deactivated'
                        : 'Account Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-[#1E1E1E] rounded-xl px-5 py-4 text-center border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    0
                  </div>
                  <div className="text-sm text-amber-500/90">Saved Meals</div>
                </div>
                <div className="bg-[#1E1E1E] rounded-xl px-5 py-4 text-center border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    0
                  </div>
                  <div className="text-sm text-amber-500/90">Recipes</div>
                </div>
                <div className="bg-[#1E1E1E] rounded-xl px-5 py-4 text-center border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    0
                  </div>
                  <div className="text-sm text-amber-500/90">Followers</div>
                </div>
                <div className="bg-[#1E1E1E] rounded-xl px-5 py-4 text-center border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    0
                  </div>
                  <div className="text-sm text-amber-500/90">Following</div>
                </div>
              </div>

              {/* Section Title */}
              <h2 className="text-2xl font-bold text-white mb-5">
                Profile Information
              </h2>

              {/* Detailed Info Grid with larger cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Email
                    </p>
                    <p className="text-lg text-gray-300">
                      {serializedUser.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Role
                    </p>
                    <p className="capitalize text-lg text-gray-300">
                      {serializedUser.role}
                    </p>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <UserIcon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Sign in Method
                    </p>
                    <p className="capitalize text-lg text-gray-300">
                      {serializedUser.provider}
                    </p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <Calendar className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Joined
                    </p>
                    <p className="text-lg text-gray-300">
                      {formatDate(serializedUser.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Last Updated
                    </p>
                    <p className="text-lg text-gray-300">
                      {formatDate(serializedUser.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Location (placeholder) */}
                <div className="flex items-center space-x-4 bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 hover:border-amber-900/50 transition-colors">
                  <div className="p-3 bg-amber-900/20 rounded-full">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-amber-500/90 mb-1">
                      Location
                    </p>
                    <p className="text-lg text-gray-300">Not specified</p>
                  </div>
                </div>
              </div>

              {/* Account Status dengan styling lebih jelas */}
              {serializedUser.deletedAt && (
                <div className="mt-10 p-5 bg-red-900/20 border border-red-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-900/30 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-red-400">
                          Account Deactivated
                        </p>
                        <p className="text-base text-red-300/80">
                          Deactivated on {formatDate(serializedUser.deletedAt)}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium">
                      Reactivate
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/profile/setting"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all"
                >
                  <Settings size={18} />
                  <span>Edit Profile</span>
                </Link>
                <Link
                  href="/profile/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-amber-600/70 hover:border-amber-600 bg-transparent hover:bg-amber-950/30 text-amber-500 rounded-xl font-medium transition-all"
                >
                  <Award size={18} />
                  <span>View Dashboard</span>
                </Link>
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
