'use client';

import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (!recaptchaValue) {
      toast.error('Tolong verifikasi bahwa Anda bukan robot.');
      return;
    }

    const loadingToast = toast.loading('Mengirim pesan...');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptcha: recaptchaValue }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal mengirim pesan');

      toast.success('Pesan berhasil dikirim!', { id: loadingToast });
      reset();
      setRecaptchaValue(null);
    } catch (error) {
      toast.error('Gagal mengirim. Coba lagi nanti.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-1 text-amber-500 font-semibold">Name</label>
        <input
          id="name"
          className={`w-full bg-black text-white border px-4 py-3 rounded-md ${
            errors.name ? 'border-red-500' : 'border-amber-500'
          } focus:outline-none focus:ring-2 focus:ring-amber-500`}
          {...register('name', { required: true })}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 text-amber-500 font-semibold">Email</label>
        <input
          id="email"
          type="email"
          className={`w-full bg-black text-white border px-4 py-3 rounded-md ${
            errors.email ? 'border-red-500' : 'border-amber-500'
          } focus:outline-none focus:ring-2 focus:ring-amber-500`}
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.type === 'pattern' ? 'Masukkan email yang valid.' : 'This field is required.'}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1 text-amber-500 font-semibold">Phone Number</label>
        <input
          id="phone"
          type="tel"
          className="w-full bg-black text-white border border-amber-500 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          {...register('phone')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-1 text-amber-500 font-semibold">Message</label>
        <textarea
          id="message"
          rows={6}
          className={`w-full bg-black text-white border px-4 py-3 rounded-md ${
            errors.message ? 'border-red-500' : 'border-amber-500'
          } focus:outline-none focus:ring-2 focus:ring-amber-500`}
          {...register('message', { required: true })}
          disabled={isSubmitting}
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
      </div>

      <div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          onChange={setRecaptchaValue}
        />
        {!recaptchaValue && isSubmitting && (
          <p className="text-red-500 text-sm mt-1">
            Tantangan verifikasi belum dipilih. Centang kotak di atas.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-500 text-black font-bold py-3 rounded-md hover:bg-amber-600 transition-colors"
      >
        {isSubmitting ? 'SENDING...' : 'SEND'}
      </button>
    </form>
  );
}