import Image from 'next/image';
import Link from 'next/link';
import NotFoundImage from '@/public/food/not-found.png';

interface Restaurant {
  name: string;
  address: string;
}

interface Meal {
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

export default function MealsCardHome({ meal }: { meal: Meal }) {
  // Calculate discount percentage if not provided

  return (
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
              {meal.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  {feature}
                </span>
              ))}
              {meal.features.length > 3 && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  +{meal.features.length - 3}
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
}
