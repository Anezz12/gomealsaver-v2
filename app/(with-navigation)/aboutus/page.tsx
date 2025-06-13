'use client';

import HeroSection from '@/components/AboutUs/Herosection';
import Features from '@/components/AboutUs/Features';
import Asked from '@/components/AboutUs/Asked';
import Logowa from '@/components/AboutUs/WA';
import Image from 'next/image';
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative bg-[#141414] py-24 md:py-32">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/backgrounds/bg.png"
            alt="Background Pattern"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20">
          <HeroSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Features />
        </div>

        {/* FAQ section with vertical padding */}
        <div className="py-2">
          <Asked />
        </div>
      </section>

      {/* WhatsApp Logo */}
      <Logowa />
    </div>
  );
};

export default AboutPage;
