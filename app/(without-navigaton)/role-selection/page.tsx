/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Auth/RoleSelection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface RoleInfo {
  currentRole: string;
  canChangeRole: boolean;
  availableRoles: string[];
  user: {
    username: string;
    email: string;
    role: string;
  };
}

export default function RoleSelection() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'user' | 'seller' | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleInfo();
  }, []);

  const fetchRoleInfo = async () => {
    try {
      const response = await fetch('/api/role-selection');
      if (response.ok) {
        const data = await response.json();
        setRoleInfo(data);

        // If user is seller or admin, redirect to appropriate dashboard
        if (data.currentRole === 'seller') {
          toast.success('Welcome back! You are logged in as a seller');
          router.push('/seller/dashboard');
          return;
        } else if (data.currentRole === 'admin') {
          toast.success('Welcome back! You are logged in as an admin');
          router.push('/admin/dashboard');
          return;
        }

        // If user role but wants to upgrade, show options
        if (data.currentRole === 'user' && data.availableRoles.length === 0) {
          // User with no upgrade options, redirect to home page
          router.push('/');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching role info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/role-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully updated to ${selectedRole}!`);

        // Update session
        await update();

        // Redirect based on role
        if (selectedRole === 'seller') {
          router.push('/dashboard-seller');
        } else {
          router.push('/dashboard-seller');
        }
      } else {
        toast.error(data.error || 'Failed to select role');
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      toast.error('Failed to select role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Show role upgrade option for existing users
  const isUpgrade =
    roleInfo?.currentRole === 'user' &&
    roleInfo?.availableRoles.includes('seller');

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isUpgrade ? 'Upgrade Your Account' : 'Welcome to GoMealSaver'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isUpgrade
              ? 'Ready to start selling your surplus food?'
              : "Let's get you started with the right account type"}
          </p>
          {roleInfo && (
            <p className="text-amber-500 text-sm mt-2">
              Current role: {roleInfo.currentRole}
            </p>
          )}
        </div>

        {/* Role Options */}
        <div className="space-y-6 mb-8">
          {/* Only show user option for new users */}
          {!isUpgrade && (
            <div
              onClick={() => setSelectedRole('user')}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 hover:bg-gray-900/70 ${
                selectedRole === 'user'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Customer Account
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Browse and purchase discounted meals from local businesses
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seller option */}
          <div
            onClick={() => setSelectedRole('seller')}
            className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 hover:bg-gray-900/70 ${
              selectedRole === 'seller'
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700/50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isUpgrade ? 'Become a Seller' : 'Business Account'}
                </h3>
                <p className="text-gray-400 text-sm">
                  List your surplus food and reduce waste while earning extra
                  revenue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleRoleSubmit}
            disabled={!selectedRole || isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isUpgrade
                ? 'Upgrading...'
                : 'Setting up...'
              : isUpgrade
              ? 'Upgrade Account'
              : 'Continue'}
          </button>

          {/* Skip option for upgrades */}
          {isUpgrade && (
            <button
              onClick={() => router.push('/')}
              className="block mx-auto text-gray-400 hover:text-white transition-colors text-sm"
            >
              Maybe later, continue as customer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
