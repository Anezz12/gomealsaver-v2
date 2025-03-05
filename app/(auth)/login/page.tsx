'use client';

import { FormEvent, useState } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const result = (await signIn('credentials', {
        redirect: false,
        email,
        password,
      })) as SignInResponse;

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Redirect to home page
      router.push('/');
    } catch {
      setError('An error occurred, please try again');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('An error occurred, please try again');
    }
  };

  return (
    <div className="flex items-center justify-center pt-32 pb-36 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md dark:shadow-zinc-800/50 px-6 py-8 border border-gray-100 dark:border-zinc-700">
          <h1 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@exemple.com"
                required
                className="mt-1 w-full rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 w-full rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    fill="#4285F4"
                  />
                  <path
                    d="M6.306 14.691l6.571 4.819C13.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    fill="#EA4335"
                  />
                  <path
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    fill="#34A853"
                  />
                  <path
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    fill="#FBBC05"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {"Don't have an account?"}
              <Link
                href="/register"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Register
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This site is protected by reCAPTCHA and the Google{' '}
              <Link
                href="https://policies.google.com/privacy"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="https://policies.google.com/terms"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </Link>{' '}
              apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
