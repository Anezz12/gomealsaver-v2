'use client';

import Image from 'next/image';
import TypedText from './Typing';
import ImageHero from '@/public/images/backgrounds/bg-hero.jpg';
import { motion } from 'framer-motion';
import { SlideUp } from '@/utility/animation';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#141414] py-24 md:py-32">
      {/* Background pattern/overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/backgrounds/bg.png"
          alt="Background Pattern"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center lg:flex-row gap-8 lg:gap-12">
          {/* Content Column */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-zinc-100">
              <TypedText
                strings={['Go Meal Saver']}
                typeSpeed={50}
                backSpeed={50}
                loop={true}
              />
            </h1>

            <motion.p
              variants={SlideUp(0.2)}
              whileInView="animate"
              initial="initial"
              className="text-base md:text-lg lg:text-xl text-zinc-100 max-w-xl mx-auto lg:mx-0"
            >
              "Transform yesterday's leftovers into delightful meals for today,
              turning what might have gone to waste into something truly
              enjoyable. Embrace the joy of saving money while savoring tasty
              dishes, all while making a positive impact through sustainable
              food choices."
            </motion.p>

            {/* Buttons Container */}
            <motion.div
              variants={SlideUp(0.2)}
              whileInView="animate"
              initial="initial"
              className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                href="/"
                className="px-4 py-3 text-sm font-semibold text-white bg-fern-green-500 rounded-lg shadow-md 
                           hover:bg-white hover:text-fern-green-500 hover:border-fern-green-500 
                           border-2 border-transparent transition-all duration-300 
                           inline-block text-center w-full sm:w-auto"
              >
                Explore More Go Meal Saver
              </Link>
              <a
                href="/register"
                className="px-4 py-3 text-sm font-semibold text-white bg-gray-500 rounded-lg shadow-md 
                           hover:bg-white hover:text-fern-green-500 hover:border-gray-500 
                           border-2 border-transparent transition-all duration-300 
                           inline-block text-center w-full sm:w-auto"
              >
                Create Account Now
              </a>
            </motion.div>
          </div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full lg:w-1/2 flex justify-center relative"
          >
            <Image
              src={ImageHero}
              alt="Go Meal Saver Illustration"
              width={800}
              height={100}
              className="relative z-10 lg:top-24 xl:top-0 overflow-x-visible max-w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
