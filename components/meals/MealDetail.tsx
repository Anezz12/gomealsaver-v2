'use client';
import Image from 'next/image';
import { useState } from 'react';
import {
  FaClock,
  FaUtensils,
  FaStore,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import MealMap from './MealMap';
import NotFoundImage from '@/public/food/not-found.png';

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode?: string;
}

interface Meal {
  _id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string[];
  price: number;
  originalPrice: number;
  discountPercentage: number;
  timeRemaining: string;
  portionSize: string;
  available: boolean;
  stockQuantity: number;
  totalOrders: number;
  features: string[];
  restaurant: Restaurant;
}

interface MealDetailProps {
  meal: Meal;
}

export default function MealDetail({ meal }: MealDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === meal.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? meal.image.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div>
      {/* Product Image Gallery (NEW) */}
      <div className="mb-8 bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800">
        {/* Main Image */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-black">
          <Image
            src={meal.image[currentImageIndex] || NotFoundImage}
            alt={meal.name}
            fill
            className="object-cover"
          />

          {/* Navigation Arrows */}
          {meal.image.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1 px-3 rounded-full">
            {currentImageIndex + 1} / {meal.image.length}
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 rounded-md font-bold text-sm">
            {meal.discountPercentage}% OFF
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {meal.image.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-[#141414] border-t border-gray-800">
            {meal.image.map((img, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`relative min-w-[70px] h-[70px] rounded-lg overflow-hidden transition-all ${
                  currentImageIndex === index
                    ? 'border-2 border-amber-500 opacity-100'
                    : 'border border-gray-700 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${meal.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Details Section */}
      <div className="space-y-6">
        {/* Cuisine and Name */}
        <div>
          <p className="text-amber-500 uppercase tracking-wide text-sm font-medium">
            {meal.cuisine}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
            {meal.name}
          </h1>
        </div>

        {/* Pricing with Discount */}
        <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-xl text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-black px-3 py-1 rounded-bl-xl font-bold text-sm">
            {meal.discountPercentage}% OFF
          </div>

          <div className="space-y-1">
            <div className="flex justify-center items-baseline space-x-3">
              <span className="text-3xl font-bold text-amber-500">
                Rp{meal.price.toLocaleString('id-ID')}
              </span>
              <span className="text-gray-400 line-through text-lg opacity-70">
                Rp{meal.originalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Hemat Rp
              {(meal.originalPrice - meal.price).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Checkout Button */}
          {meal.available && (
            <div className="mt-4">
              <a
                href={`/meals/checkout/${meal._id}`}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
              >
                <FaShoppingCart className="text-lg" />
                Pesan Sekarang
              </a>
            </div>
          )}
        </div>

        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[#1A1A1A] text-amber-500 px-4 py-2 rounded-full">
            <FaClock className="text-lg" />
            <span className="font-medium">{meal.timeRemaining} tersisa</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1A1A] text-amber-500 px-4 py-2 rounded-full">
            <FaUtensils className="text-lg" />
            <span className="font-medium">{meal.portionSize} Porsi</span>
          </div>
        </div>

        {/* Stock and Orders Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stock Card */}
          <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">
                  Stok Tersedia
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {meal.stockQuantity}
                </p>
              </div>
              <div className="bg-amber-500/20 p-3 rounded-full">
                <FaBoxOpen className="text-xl text-amber-500" />
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium">
                  Total Pesanan
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {meal.totalOrders}
                </p>
              </div>
              <div className="bg-amber-500/20 p-3 rounded-full">
                <FaShoppingCart className="text-xl text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div>
          {meal.available ? (
            <div className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Tersedia untuk Dipesan
            </div>
          ) : (
            <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Saat Ini Tidak Tersedia
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">Deskripsi</h2>
          <p className="text-gray-300 leading-relaxed">
            {meal.description ||
              'Makanan ini merupakan pilihan yang lezat dan bergizi, sangat cocok untuk dinikmati pada berbagai kesempatan. Dengan bahan-bahan berkualitas tinggi yang dimasak dengan sempurna, makanan ini menawarkan pengalaman kuliner yang memuaskan.'}
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">
            Karakteristik
          </h2>
          <div className="flex flex-wrap gap-2">
            {meal.features.map((feature, index) => (
              <span
                key={index}
                className="bg-[#1A1A1A] text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="pt-6 border-t border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Informasi Restoran
          </h2>
          <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-gray-800">
            <div className="bg-amber-500/20 p-3 rounded-full">
              <FaStore className="text-amber-500 text-2xl" />
            </div>
            <div>
              <p className="font-bold text-white">{meal.restaurant.name}</p>
              <p className="text-gray-400 text-sm">
                {meal.restaurant.address}, {meal.restaurant.city},{' '}
                {meal.restaurant.state} {meal.restaurant.zipcode || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8 bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <div className="p-4 bg-[#202020] border-b border-gray-800 flex items-center gap-3">
          <FaMapMarkerAlt className="text-amber-500 text-xl" />
          <h3 className="text-lg font-semibold text-white">Lokasi Restoran</h3>
        </div>
        <div className="h-64 md:h-80 border-b border-gray-800">
          <MealMap meal={meal} />
        </div>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-medium text-gray-300">
              {meal.restaurant.address}
            </p>
            <p className="text-gray-400 text-sm">
              {meal.restaurant.city}, {meal.restaurant.state}{' '}
              {meal.restaurant.zipcode || ''}
            </p>
          </div>
          <button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <FaMapMarkerAlt />
            Petunjuk Arah
          </button>
        </div>
      </div>
    </div>
  );
}
