'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiSearch } from 'react-icons/fi';
// import { FaLocationDot } from 'react-icons/fa6';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[850px] w-full  bg-[#0A0A0A]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bg.png"
          alt="Background Pattern"
          fill
          className="object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-black/90 to-[#0A0A0A]"></div>

        {/* Animated Circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-48">
        {/* Text Content Section */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          {/* Campaign Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mx-auto px-6 py-1.5 mb-8 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30"
          >
            <p className="text-amber-400 font-semibold text-sm md:text-base tracking-wider">
              #SELAMATKAN MAKANAN, SELAMATKAN BUMI
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
          >
            <span className="relative inline-block">
              <span className="relative z-10">GoMeal</span>
              <span className="relative z-10 text-amber-500">saver</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-500/30 rounded-md -z-0 transform -rotate-1"></span>
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl mt-2 block">
              <span className="text-white">Solusi </span>
              <span className="text-amber-500">Cerdas</span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-gray-300 leading-relaxed"
          >
            Nikmati makanan berkualitas dengan harga terjangkau sambil membantu
            mengurangi
            <span className="text-amber-400"> 30% </span>
            pemborosan makanan di Indonesia setiap tahunnya.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative flex flex-col sm:flex-row gap-4 w-full max-w-xl mx-auto"
          >
            <div className="flex-1 relative z-10">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiMapPin className="text-amber-500" />
              </div>
              <input
                className="w-full h-14 rounded-full bg-white/5  py-4 pl-12 pr-6 text-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-white/10 transition-all duration-300 shadow-lg"
                placeholder="Cari berdasarkan lokasi..."
                aria-label="Search by location"
              />
            </div>
            <button
              type="submit"
              className="h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 text-lg font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 shadow-lg hover:shadow-amber-500/30"
            >
              <div className="flex items-center justify-center gap-2">
                <FiSearch className="h-5 w-5" />
                <span>Jelajahi</span>
              </div>
            </button>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/meals"
              className="text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
            >
              Menu Populer
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
            <Link
              href="/aboutus"
              className="text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 group"
            >
              Tentang Kami
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Food Images */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute top-[25%] left-[8%] z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-full blur-md"></div>

              {/* Container ukuran tetap untuk memastikan bentuk lingkaran sempurna */}
              <div className="w-[180px] h-[180px] relative overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <Image
                  src="/food/gado-gado.jpeg"
                  alt="Delicious Food"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              <div className="absolute -right-2 -top-2 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
                -50%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="absolute top-[55%] left-[12%] z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-full blur-md"></div>

              {/* Container ukuran tetap untuk memastikan bentuk lingkaran sempurna */}
              <div className="w-[180px] h-[180px] relative overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <Image
                  src="/food/salad.jpg"
                  alt="Delicious Food"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              <div className="absolute -right-2 -top-2 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
                -50%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute top-[20%] right-[8%] z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-full blur-md"></div>
              {/* Container ukuran tetap untuk memastikan bentuk lingkaran sempurna */}
              <div className="w-[180px] h-[180px] relative overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <Image
                  src="/food/gado-gado.jpeg"
                  alt="Delicious Food"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              <div className="absolute -right-2 -top-2 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
                -30%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="absolute top-[50%] right-[12%] z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-full blur-md"></div>

              {/* Container ukuran tetap untuk memastikan bentuk lingkaran sempurna */}
              <div className="w-[180px] h-[180px] relative overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <Image
                  src="/food/soto.jpg"
                  alt="Delicious Food"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-2 -top-2 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
                -50%
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute -bottom-20 left-0 right-0 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-[#141414]  p-6 md:p-8 text-white shadow-2xl border border-white/5 backdrop-blur-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stats Items */}
            {[
              {
                icon: 'dish-svgrepo.svg',
                value: '382M+',
                label: 'Makanan Tersedia',
                color: 'bg-amber-500',
              },
              {
                icon: 'stars.svg',
                value: '9/10',
                label: 'Pelanggan Puas',
                color: 'bg-green-500',
              },
              {
                icon: 'security-user.svg',
                value: '100%',
                label: 'Keamanan Tinggi',
                color: 'bg-blue-500',
              },
              {
                icon: 'global.svg',
                value: '183+',
                label: 'Kota Terjangkau',
                color: 'bg-purple-500',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full md:w-14 md:h-14 md:rounded-full ${stat.color}`}
                >
                  <Image
                    src={`/images/icons/${stat.icon}`}
                    alt={stat.label}
                    width={28}
                    height={28}
                    className="w-5 h-5 md:w-8 md:h-8"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
