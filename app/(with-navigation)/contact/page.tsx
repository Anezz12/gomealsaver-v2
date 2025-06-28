'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    // Validate reCAPTCHA
    if (!recaptchaValue) {
      toast.error("Please verify that you're not a robot");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Sending your message...');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptcha: recaptchaValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      // Success
      toast.success('Your message has been sent successfully!', {
        id: loadingToast,
      });
      reset();
      setRecaptchaValue(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send your message. Please try again.', {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#FFFFFF',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: '#FFFFFF',
            },
          },
        }}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In <span className="text-amber-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {
              " We'd love to hear from you. Send us a message and we'll respond as soon as possible."
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 md:px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Response */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Quick Response
                  </h3>
                  <p className="text-gray-400">We respond within hours</p>
                </div>
              </div>
              <p className="text-gray-200 font-medium">
                Average response time:{' '}
                <span className="text-amber-500">2-4 hours</span>
              </p>
            </div>

            {/* Support Hours */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Support Hours
                  </h3>
                  <p className="text-gray-400">We&apos;re here to help</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-200 font-medium">
                <p>
                  Monday - Friday:{' '}
                  <span className="text-amber-500">9AM - 6PM</span>
                </p>
                <p>
                  Weekend: <span className="text-amber-500">10AM - 4PM</span>
                </p>
              </div>
            </div>

            {/* Expert Team */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Expert Team
                  </h3>
                  <p className="text-gray-400">Professional support</p>
                </div>
              </div>
              <p className="text-gray-200 font-medium">
                Our dedicated team of experts is ready to assist you with any
                questions or concerns.
              </p>
            </div>

            {/* Social Media */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h6a2 2 0 002-2V7M9 7h6M9 11h6m-6 4h6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Follow Us
                  </h3>
                  <p className="text-gray-400">Stay connected</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700/50">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Send us a <span className="text-amber-500">Message</span>
                </h2>
                <p className="text-gray-400">
                  {
                    " Fill out the form below and we'll get back to you as soon as possible."
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-4 bg-gray-900/50 border-2 ${
                        errors.name
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-600 focus:border-amber-500'
                      } rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 placeholder-gray-500 text-white`}
                      {...register('name', { required: true })}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm font-medium">
                        Name is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-4 bg-gray-900/50 border-2 ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-600 focus:border-amber-500'
                      } rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 placeholder-gray-500 text-white`}
                      {...register('email', {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm font-medium">
                        {errors.email.type === 'pattern'
                          ? 'Please enter a valid email address'
                          : 'Email is required'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-600 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 placeholder-gray-500 text-white"
                    {...register('phone')}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-300"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className={`w-full px-4 py-4 bg-gray-900/50 border-2 ${
                      errors.message
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-600 focus:border-amber-500'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 placeholder-gray-500 resize-none text-white`}
                    {...register('message', { required: true })}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm font-medium">
                      Message is required
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={setRecaptchaValue}
                    theme="dark"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
