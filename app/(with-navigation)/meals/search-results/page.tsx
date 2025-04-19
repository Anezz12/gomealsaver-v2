import Link from 'next/link';
import MealsCard from '@/components/meals/MealsCard';
import SearchMeals from '@/components/meals/SearchMeals';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { convertToObject } from '@/utils/convertToObject';
import { FaArrowAltCircleLeft, FaSearchMinus } from 'react-icons/fa';

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

// interface MealCardProps {
//   meal: Meal;
// }

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

  return (
    <>
      <section className="bg-green-800 py-28">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <SearchMeals />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/meals"
            className="flex items-center text-green-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2" />
            Back to all meals
          </Link>
          <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">
            Search Results
            <span className="text-gray-600 text-base ml-2">
              ({meals.length} {meals.length === 1 ? 'meal' : 'meals'} found)
            </span>
          </h2>

          {meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-gray-100 rounded-lg">
              <FaSearchMinus className="text-6xl text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">
                No meals found matching your search criteria
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or exploring all meals
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <MealsCard key={meal._id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
