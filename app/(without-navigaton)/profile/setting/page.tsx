import Link from 'next/link';
import MainContainer from '@/components/Settings/MainContainer';
import { KeyRound, UserRound } from 'lucide-react';

export default function Page() {
  return (
    <>
      <MainContainer>
        <div className="min-h-52 pt-8 px-6 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-white">Settings</h1>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Password Change Card */}
              <div className="bg-[#141414] rounded-xl shadow-md shadow-amber-900/10 p-6 hover:shadow-lg hover:shadow-amber-900/15 transition duration-300 border border-gray-800">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="relative z-10 p-3 bg-[#1A1A1A] rounded-full border border-gray-800">
                      <KeyRound
                        className="h-10 w-10 text-amber-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-2">
                    Change Password
                  </h2>
                  <p className="text-gray-400 text-center mb-6">
                    Update your password to keep your account secure
                  </p>
                  <Link
                    href="/profile/setting/changepassword"
                    className="w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2.5 px-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition duration-300">
                      Change Password
                    </button>
                  </Link>
                </div>
              </div>

              {/* Profile Update Card */}
              <div className="bg-[#141414] rounded-xl shadow-md shadow-amber-900/10 p-6 hover:shadow-lg hover:shadow-amber-900/15 transition duration-300 border border-gray-800">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="relative z-10 p-3 bg-[#1A1A1A] rounded-full border border-gray-800">
                      <UserRound
                        className="h-10 w-10 text-amber-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-2">
                    Edit Profile
                  </h2>
                  <p className="text-gray-400 text-center mb-6">
                    Update your personal information and preferences
                  </p>
                  <Link href="/profile/setting/profile" className="w-full">
                    <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2.5 px-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition duration-300">
                      Edit Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Account Deletion Card */}
              <div className="md:col-span-2 bg-[#141414] rounded-xl shadow-md shadow-amber-900/10 p-6 border border-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className="text-xl font-semibold text-red-500 mb-2">
                      Delete Account
                    </h2>
                    <p className="text-gray-400">
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </p>
                  </div>

                  <Link href="/profile/setting/delete-account">
                    <button className="mt-4 md:mt-0 bg-[#1A1A1A] text-red-500 border border-red-900/20 py-2.5 px-6 rounded-lg hover:bg-red-500/10 transition duration-300">
                      Delete Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
}
