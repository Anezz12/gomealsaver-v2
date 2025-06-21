'use client';

import { Toaster } from 'react-hot-toast';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        <ContactInfo />
        <div className="md:w-1/2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
