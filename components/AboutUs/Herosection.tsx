'use client';

import Image from 'next/image';
import TypedText from './Typing';
import ImageHero from '@/public/images/backgrounds/bg-hero.jpg';
import { motion } from 'framer-motion';
import { SlideUp } from '@/utility/animation';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12">
          {/* Content Column */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-500">
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
                className="px-4 py-3 text-sm font-semibold text-amber-500 rounded-lg shadow-md 
                           hover:bg-white hover:text-amber-500
                           border-2 border-transparent transition-all duration-300 
                           inline-block text-center w-full sm:w-auto"
              >
                Explore More Go Meal Saver
              </Link>
              <a
                href="/register"
                className="px-4 py-3 text-sm font-semibold text-white bg-amber-500 rounded-lg shadow-md 
                           hover:bg-amber-500 hover:text-fern-green-500 hover:border-gray-500 
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
