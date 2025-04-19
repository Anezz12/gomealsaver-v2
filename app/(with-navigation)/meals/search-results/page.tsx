import Link from 'next/link';
import Image from 'next/image';
import MealsCard from '@/components/meals/MealsCard';
import SearchMeals from '@/components/meals/SearchMeals';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { convertToObject } from '@/utils/convertToObject';
import { ArrowLeft, Search, MapPin, Filter } from 'lucide-react';

// Dynamic rendering configuration
export const dynamic = 'force-dynamic';

// Gunakan interface generik untuk searchParams
interface PageProps {
  searchParams: Promise<{
    location?: string;
    mealType?: string;
  }>;
}

interface MealQuery {
  $or: Array<Record<string, RegExp>>;
  cuisine?: RegExp;
  [key: string]: any;
}

interface Restaurant {
  name: string;
  address: string;
}

export interface Meal {
  _id: string;
  name: string;
  cuisine: string;
  image: string[];
  price: number;
  originalPrice: number;
  discountPercentage: number;
  timeRemaining: string;
  portionSize: string;
  features: string[];
  restaurant: Restaurant;
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  // Resolve promise
  const params = await searchParams;

  // Akses properti dengan nilai default
  const location = params.location || '';
  const mealType = params.mealType || 'All';

  await connectDB();
  const locationPattern = new RegExp(location, 'i');
  const query: MealQuery = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { 'restaurant.name': locationPattern },
      { 'restaurant.address': locationPattern },
      { 'restaurant.city': locationPattern },
      { 'restaurant.state': locationPattern },
    ],
  };

  if (mealType !== 'All') {
    const typePattern = new RegExp(mealType, 'i');
    query.cuisine = typePattern;
  }

  const mealQueryResult = await Meal.find(query).lean();
  const meals = convertToObject(mealQueryResult) as Meal[];

  // Calculate stats
  const restaurantCount = new Set(meals.map((meal) => meal.restaurant.name))
    .size;
  //   const cuisineTypes = new Set(meals.map((meal) => meal.cuisine)).size;

  return (
    <>
      {/* Hero banner dengan search component */}
      <section className="relative bg-[#141414] py-24">
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

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SearchMeals />

            <div className="mt-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-3">
                {location ? `Mencari "${location}"` : 'Semua Makanan'}
                {mealType !== 'All' && <span> dalam kategori {mealType}</span>}
              </h1>
              <p className="text-gray-300">
                Hemat hingga 50% untuk makanan yang Anda cari
              </p>

              {meals.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                    <Search className="h-4 w-4 mr-2 opacity-70" />
                    <span>{meals.length} hasil ditemukan</span>
                  </div>

                  {restaurantCount > 0 && (
                    <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                      <MapPin className="h-4 w-4 mr-2 opacity-70" />
                      <span>{restaurantCount} restoran</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#0c0c0c] px-4 py-12 md:py-16">
        <div className="container-xl lg:container m-auto px-4">
          {/* Header dengan navigasi */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div className="flex items-center">
              <Link
                href="/meals"
                className="flex items-center text-amber-500 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                <span className="font-medium">Kembali ke semua makanan</span>
              </Link>
            </div>

            {location && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-400 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter aktif:
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-200">
                  {location}
                </span>
                {mealType !== 'All' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-200">
                    {mealType}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results title */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              Hasil Pencarian
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              {meals.length > 0
                ? `Menampilkan ${meals.length} hasil pencarian untuk makanan yang Anda cari`
                : 'Tidak ditemukan makanan yang sesuai dengan pencarian Anda'}
            </p>
          </div>

          {/* No results state */}
          {meals.length === 0 ? (
            <div className="bg-[#141414] p-8 rounded-lg text-center max-w-2xl mx-auto">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-amber-500/20 mb-4">
                <Search className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Tidak ditemukan makanan yang sesuai
              </h3>
              <p className="text-gray-400 mb-6">
                Coba sesuaikan pencarian Anda atau jelajahi semua makanan yang
                tersedia
              </p>
              <Link
                href="/meals"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#0c0c0c] bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Jelajahi Semua Makanan
              </Link>
            </div>
          ) : (
            <>
              {/* Results grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {meals.map((meal) => (
                  <MealsCard key={meal._id} meal={meal} />
                ))}
              </div>

              {/* Result summary */}
              <div className="mt-12 text-center text-gray-500">
                <Link
                  href="/meals"
                  className="inline-flex items-center text-amber-500 hover:text-amber-400"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Lihat semua makanan
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
