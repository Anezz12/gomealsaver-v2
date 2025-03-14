'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'seller' | null>(
    null
  );
  const router = useRouter();

  const handleRoleSelection = (role: 'user' | 'seller') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'user') {
      router.push('/dashboard');
    } else if (selectedRole === 'seller') {
      router.push('/seller/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-4 sm:px-6 md:pt-24 pt-24">
      <div className="max-w-3xl w-full bg-[#141414] rounded-3xl p-6 sm:p-10 space-y-8">
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/images/logos/logo.svg"
            alt="GoMealSaver Logo"
            width={180}
            height={40}
            className="mb-2"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Pilih Peran Anda di GoMealSaver
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-lg">
            Pilih peran yang sesuai dengan kebutuhan Anda. Anda dapat mengubah
            peran ini nanti di pengaturan akun.
          </p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* User Role Card */}
          <div
            className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedRole === 'user'
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-500'
            }`}
            onClick={() => handleRoleSelection('user')}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20">
              <Image
                src="/images/icons/user-profile.svg"
                alt="User icon"
                width={28}
                height={28}
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Pengguna</h2>
            <p className="text-gray-400">
              Temukan dan pesan makanan surplus berkualitas dengan harga
              terjangkau dari restoran dan toko di sekitar Anda.
            </p>
            {selectedRole === 'user' && (
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>

          {/* Seller Role Card */}
          <div
            className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedRole === 'seller'
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-500'
            }`}
            onClick={() => handleRoleSelection('seller')}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20">
              <Image
                src="/images/icons/shop.svg"
                alt="Shop icon"
                width={28}
                height={28}
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Penjual</h2>
            <p className="text-gray-400">
              Kurangi limbah makanan dan tambah penghasilan dengan menjual
              makanan surplus dari restoran atau toko Anda.
            </p>
            {selectedRole === 'seller' && (
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Continue button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-medium transition-all ${
              selectedRole
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-700 cursor-not-allowed text-gray-400'
            }`}
          >
            Lanjutkan
          </button>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
