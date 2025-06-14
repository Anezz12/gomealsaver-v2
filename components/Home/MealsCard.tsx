import Link from 'next/link';
import Image from 'next/image';
import { convertToObject } from '@/utils/convertToObject';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import NotFoundImage from '@/public/food/not-found.png';

interface Restaurant {
  name: string;
  address: string;
}

interface MealType {
  _id: string;
  name: string;
  cuisine?: string;
  image: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  timeRemaining?: string;
  portionSize?: string;
  features?: string[];
  restaurant?: Restaurant;
}

export default async function MealsCard() {
  await connectDB();
  const meals = await Meal.find({}).limit(10).lean(); // Limit to 10 meals
  const serializedMeals = convertToObject(meals);

  // Create a meal card component for reuse
  const MealCard = ({ meal }: { meal: MealType }) => (
    <Link
      href={`/meals/${meal._id}`}
      className="block transition-transform hover:scale-105"
    >
      <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden rounded-3xl">
        <div className="absolute flex h-full w-full flex-col justify-end space-y-[14px] bg-gradient-to-b from-transparent from-[46%] to-black to-[96%] p-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
                {meal.name}
              </h1>
              {meal.cuisine && (
                <p className="text-xs text-gray-300 mb-1">{meal.cuisine}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-white">
                  Rp {meal.price.toLocaleString('id-ID')}
                </p>
                {meal.originalPrice && (
                  <p className="text-xs text-gray-300 line-through">
                    Rp {meal.originalPrice.toLocaleString('id-ID')}
                  </p>
                )}
                {meal.originalPrice && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {meal.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {meal.portionSize && (
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
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
                </svg>
                <p className="text-xs text-white">{meal.portionSize}</p>
              </div>
            )}

            {meal.timeRemaining && (
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
                <p className="text-xs text-white">Sisa {meal.timeRemaining}</p>
              </div>
            )}
          </div>

          {meal.features && meal.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {meal.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  {feature}
                </span>
              ))}
              {meal.features.length > 2 && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  +{meal.features.length - 2}
                </span>
              )}
            </div>
          )}

          {meal.restaurant && (
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-xs text-white line-clamp-1">
                {meal.restaurant.name}
              </p>
              {meal.restaurant.address && (
                <p className="text-xs text-gray-300 line-clamp-1 ml-1">
                  • {meal.restaurant.address}
                </p>
              )}
            </div>
          )}
        </div>
        <Image
          src={meal.image?.[0] || NotFoundImage}
          alt={meal.name}
          width={400}
          height={400}
          className="h-full w-full object-cover"
          priority={false}
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

      {/* Horizontal Carousel - SSR Friendly */}
      <div className="relative">
        {/* Horizontal scroll container */}
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-4 pb-4">
            {serializedMeals.map((meal: MealType) => (
              <div
                key={meal._id}
                className="w-[280px] sm:w-[320px] flex-shrink-0"
              >
                <MealCard meal={meal} />
              </div>
            ))}
          </div>
        </div>

        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none z-10"></div>

        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
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
