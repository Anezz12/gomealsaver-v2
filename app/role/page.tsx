'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'seller' | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleRoleSelection = (role: 'user' | 'seller') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole || !session) return;

    setLoading(true);

    try {
      const response = await fetch('/api/change-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change role');
      }
      // Update session dengan role baru
      await update({
        ...session,
        user: {
          ...session.user,
          role: selectedRole,
        },
      });

      toast.success(
        `Peran berhasil diubah menjadi ${
          selectedRole === 'user' ? 'Pengguna' : 'Penjual'
        }`
      );

      // Redirect ke halaman yang sesuai
      setTimeout(() => {
        if (selectedRole === 'user') {
          router.push('/dashboard');
        } else if (selectedRole === 'seller') {
          router.push('/seller/onboarding');
        }
      }, 1000);
    } catch (error: any) {
      toast.error('Terjadi kesalahan, silakan coba lagi.' + error);
    } finally {
      setLoading(false);
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
            type="submit"
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              selectedRole
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-700 cursor-not-allowed text-gray-400'
            }`}
          >
            {loading ? (
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
              'Lanjutkan'
            )}
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
