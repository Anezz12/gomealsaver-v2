'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordVisibility {
  new: boolean;
  confirm: boolean;
}
export default function ChangePasswordGmail() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState<PasswordVisibility>({
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Hanya validasi jika user sudah mengetik sesuatu di field password baru
    if (formData.newPassword.length > 0 && formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
    } else {
      setError('');
    }
  }, [formData.newPassword]);

  const togglePasswordVisibility = (field: keyof PasswordVisibility): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validasi form sebelum submit
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match', {
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
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/changepasswordgoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Password updated successfully!', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '🔒',
      });

      setFormData({
        newPassword: '',
        confirmPassword: '',
      });

      // Redirect after successful password change
      setTimeout(() => {
        router.push('/profile/setting');
      }, 2000);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update password', {
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
    <div>
      <div className="min-h-52 pt-16 pb-10 px-4 bg-[#0A0A0A]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-900/20 rounded-full">
              <Shield className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Change Password</h1>
          </div>
          <p className="max-w-lg text-lg font-medium text-gray-400 mb-8">
            Secure your account with a strong password combination
          </p>
          {error && (
            <div className="mb-6 p-3.5 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
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
              {error}
            </div>
          )}

          <div className="bg-[#141414] rounded-xl shadow-md shadow-amber-900/10 p-8 border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password Field */}
              {/* <div className="relative">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white pr-10"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                  >
                    {showPasswords.old ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div> */}

              {/* New Password Field */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link href="/profile/setting">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#1A1A1A] transition-all duration-200"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
