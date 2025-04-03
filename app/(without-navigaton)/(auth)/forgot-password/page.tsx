'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Send, ArrowLeft, Key, Mail } from 'lucide-react';
import Link from 'next/link';

interface EmailForgetPasswordResponse {
  error?: string;
  message: string;
  success?: boolean;
}

interface VerifyCodeResponse {
  error?: string;
  resetToken: string;
  success?: boolean;
}

interface ResetPasswordResponse {
  error?: string;
  message: string;
  success?: boolean;
}
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/emailforgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: EmailForgetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Something went wrong, please check your email address and try again'
        );
      }

      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data: VerifyCodeResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setResetToken(data.resetToken);
      toast.success('Code verified successfully');
      setStep(3);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/changepasswordnologin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data: ResetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast.success('Password reset successfully');

      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 bg-[#0A0A0A] text-white py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-[#141414] border border-gray-800 px-8 py-14 rounded-xl shadow-md hover:shadow-amber-900/10 transition-all duration-300">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-amber-900/20">
              <Key className="text-amber-500 w-10 h-10" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 text-center">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'Reset Password'}
            </h1>

            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="w-full pl-10 rounded-lg border border-gray-700 bg-[#1A1A1A] px-4 py-2.5 text-gray-100 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 text-base placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </span>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed text-center">
                  {'We’ve sent a verification code to '}
                  <strong>{email}</strong>. Enter the code below to continue.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-lg border border-gray-700 bg-[#1A1A1A] px-4 py-2.5 text-gray-100 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 text-base placeholder:text-gray-500 text-center tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Verifying...
                      </span>
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-4">
                  {'Didn’t receive a code?'}
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="text-amber-500 hover:text-amber-400 font-medium"
                  >
                    Send again
                  </button>
                </p>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-gray-700 bg-[#1A1A1A] px-4 py-2.5 text-gray-100 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 text-base placeholder:text-gray-500"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-gray-700 bg-[#1A1A1A] px-4 py-2.5 text-gray-100 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 text-base placeholder:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Updating Password...
                    </span>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            )}

            <div className="pt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
