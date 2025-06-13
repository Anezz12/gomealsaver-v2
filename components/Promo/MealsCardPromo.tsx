import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUtensils } from 'react-icons/fa';
import { FaLocationArrow, FaMapLocation } from 'react-icons/fa6';
import NotFoundImage from '@/public/food/not-found.png';

interface Restaurant {
  name: string;
  address: string;
}

interface Meal {
  _id: string;
  name: string;
  cuisine: string;
  image: string[];
  price: number;
  originalPrice: number;
  timeRemaining: string;
  discountPercentage: number;
  portionSize: string;
  features: string[];
  restaurant: Restaurant;
}

interface MealCardProps {
  meal: Meal;
  isLoading?: boolean;
}
export default function MealsCardPromo({ meal }: MealCardProps) {
  return (
    <div className="bg-[#141414] rounded-xl shadow-md relative border border-gray-800 hover:shadow-amber-900/20 hover:shadow-lg transition-all duration-300">
      <Image
        src={meal.image[0] || NotFoundImage}
        alt={meal.name}
        width={500}
        height={300}
        className="w-full h-[200px] object-cover rounded-t-xl"
      />
      <div className="p-4">
        <header className="text-left mb-4">
          <div className="text-amber-500">{meal.cuisine}</div>
          <h3 className="text-xl font-bold text-white">{meal.name}</h3>
        </header>

        {/* Price Section */}
        <div className="absolute top-[10px] right-[10px] bg-[#141414]/80 backdrop-blur px-3 py-2 rounded-xl shadow-sm border border-gray-800/50">
          <div className="flex flex-col items-end">
            <div className="text-amber-500 font-semibold text-lg">
              Rp{meal.price.toLocaleString('id-ID')}
            </div>
            <div className="text-gray-500 text-xs line-through mb-0.5">
              Rp{meal.originalPrice.toLocaleString('id-ID')}
            </div>
            <div className="text-xs font-medium bg-red-500/20 text-red-400 rounded-full px-2 py-0.5">
              {meal.discountPercentage}% OFF
            </div>
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1 bg-[#202020] text-amber-500 px-3 py-1 rounded-full text-sm">
            <FaClock className="text-sm" />
            <span>{meal.timeRemaining}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#202020] text-amber-500 px-3 py-1 rounded-full text-sm">
            <FaUtensils className="text-sm" />
            <span>{meal.portionSize}</span>
          </div>
        </div>

        <div className="border-t border-gray-800 my-4"></div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {meal.features.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="bg-[#202020] text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Restaurant Info */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col gap-1 mb-3 lg:mb-0">
            <div className="flex align-middle gap-2">
              <FaLocationArrow className="text-lg text-amber-500" />
              <span className="text-amber-500">{meal.restaurant.name}</span>
            </div>
            <div className="flex align-middle gap-2 text-gray-400 text-sm">
              <FaMapLocation className="text-gray-400" />
              <span>{meal.restaurant.address}</span>
            </div>
          </div>
          <Link
            href={`/meals/${meal._id}`}
            className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-center text-sm font-medium transition duration-300"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
