'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define meal data structure
interface MealItem {
  id: number;
  title: string;
  price: number;
  rating: number;
  calories: number;
  portions: number;
  timeLeft: string;
  imageUrl: string;
}

export default function MealsCard() {
  // Meal data array for mapping
  const meals: MealItem[] = [
    {
      id: 1,
      title: 'Nasi Padang',
      price: 25000,
      rating: 4.7,
      calories: 650,
      portions: 1,
      timeLeft: '3 jam',
      imageUrl: '/food/padang.jpg',
    },
    {
      id: 2,
      title: 'Ayam Bakar',
      price: 18000,
      rating: 4.5,
      calories: 520,
      portions: 1,
      timeLeft: '2 jam',
      imageUrl: '/food/ayam-bakar.jpg',
    },
    {
      id: 3,
      title: 'Salad Bowl',
      price: 32000,
      rating: 4.8,
      calories: 380,
      portions: 1,
      timeLeft: '4 jam',
      imageUrl: '/food/salad.jpg',
    },
    {
      id: 4,
      title: 'Bakso Special',
      price: 15000,
      rating: 4.6,
      calories: 450,
      portions: 1,
      timeLeft: '2 jam',
      imageUrl: '/food/bakso.jpg',
    },
    {
      id: 5,
      title: 'Sate Ayam',
      price: 25000,
      rating: 4.9,
      calories: 420,
      portions: 2,
      timeLeft: '3 jam',
      imageUrl: '/food/sate.jpg',
    },
    {
      id: 6,
      title: 'Gado-Gado',
      price: 20000,
      rating: 4.4,
      calories: 350,
      portions: 1,
      timeLeft: '5 jam',
      imageUrl: '/food/gado-gado.jpeg',
    },
    {
      id: 7,
      title: 'Soto Ayam',
      price: 22000,
      rating: 4.5,
      calories: 380,
      portions: 1,
      timeLeft: '4 jam',
      imageUrl: '/food/soto.jpg',
    },
  ];

  // Create a meal card component for reuse
  const MealCard = ({ meal }: { meal: MealItem }) => (
    <Link href={`/meals/${meal.id}`} className="block transition-transform">
      <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden rounded-3xl">
        <div className="absolute flex h-full w-full flex-col justify-end space-y-[14px] bg-gradient-to-b from-transparent from-[46%] to-black to-[96%] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                {meal.title}
              </h1>
              <p className="text-sm font-semibold text-white">
                Rp {meal.price.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="amber"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-amber-400"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm text-white">{meal.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M4.5 12.5l3-3a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 0 1.4 0l4.4-4.4" />
                <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" />
              </svg>
              <p className="text-xs text-white">{meal.calories} kcal</p>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-xs text-white">{meal.portions} porsi</p>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-xs text-white">Sisa {meal.timeLeft}</p>
            </div>
          </div>
        </div>
        <Image
          src={meal.imageUrl}
          alt={meal.title}
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );

  return (
    <section className="mx-auto mt-[100px] w-full max-w-[1280px] space-y-[30px] px-4 md:px-[75px] pt-16">
      <div className="text-center">
        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white">
          Makanan Tersedia Hari Ini
        </h1>
        <p className="text-lg text-gray-600 dark:text-[#A8A8AB]">
          Temukan makanan lezat dengan harga terjangkau
        </p>
      </div>

      {/* Swiper component */}
      <div className="relative px-5 sm:px-10">
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 3,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 4,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {meals.map((meal) => (
            <SwiperSlide key={meal.id} className="py-4">
              <MealCard meal={meal} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/meals"
          className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
        >
          Lihat Semua Makanan
        </Link>
      </div>
    </section>
  );
}
