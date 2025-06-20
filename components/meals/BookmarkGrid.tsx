'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Utensils, Filter, Grid3X3, List } from 'lucide-react';
import BookmarkButton from '@/components/meals/BookmarkButton';

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  cuisine: string;
  portionSize: string;
  timeRemaining: string;
  features: string[];
  image: string[];
  restaurant: {
    name: string;
    address: string;
    city: string;
  };
  createdAt: string;
}

interface SavedMealsGridProps {
  meals: Meal[];
}

export default function SavedMealsGrid({ meals }: SavedMealsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<
    'newest' | 'price' | 'discount' | 'name'
  >('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'expiring'>(
    'all'
  );

  // Sort meals
  const sortedMeals = [...meals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'price':
        return a.price - b.price;
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Filter meals
  const filteredMeals = sortedMeals.filter((meal) => {
    switch (filterBy) {
      case 'available':
        return meal.stockQuantity > 0;
      case 'expiring':
        return (
          meal.timeRemaining === '1 hour' || meal.timeRemaining === '2 hours'
        );
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          <p className="text-sm text-gray-400">
            {filteredMeals.length} of {meals.length} meals
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Meals</option>
            <option value="available">Available Now</option>
            <option value="expiring">Expiring Soon</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="newest">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="discount">Highest Discount</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Meals Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeals.map((meal) => (
            <MealListItem key={meal._id} meal={meal} />
          ))}
        </div>
      )}

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No meals found
          </h3>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

// Grid Card Component
const MealCard = ({ meal }: { meal: Meal }) => (
  <div className="bg-black/50 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
    <Link href={`/meals/${meal._id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={meal.image[0] || '/images/no-image.jpg'}
          alt={meal.name}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {meal.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{meal.discountPercentage}%
          </div>
        )}

        {/* Time Remaining */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Clock size={12} />
          {meal.timeRemaining}
        </div>

        {/* Stock Status */}
        {meal.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sold Out
            </span>
          </div>
        )}
      </div>
    </Link>

    <div className="p-4">
      <Link href={`/meals/${meal._id}`}>
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
          {meal.name}
        </h3>
      </Link>

      {/* Restaurant Info */}
      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
        <MapPin size={12} />
        <span className="truncate">{meal.restaurant.name}</span>
      </div>

      {/* Features */}
      {meal.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {meal.features.slice(0, 2).map((feature) => (
            <span
              key={feature}
              className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs"
            >
              {feature}
            </span>
          ))}
          {meal.features.length > 2 && (
            <span className="text-gray-500 text-xs">
              +{meal.features.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-amber-500">
            Rp {meal.price.toLocaleString()}
          </span>
          {meal.originalPrice > meal.price && (
            <span className="text-sm text-gray-500 line-through">
              Rp {meal.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Bookmark Button */}
      <BookmarkButton
        meal={meal._id}
        initialBookmarked={true}
        size="sm"
        className="w-full"
      />
    </div>
  </div>
);

// List Item Component
const MealListItem = ({ meal }: { meal: Meal }) => (
  <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-amber-500/50 transition-all duration-300">
    <div className="flex gap-4">
      <Link href={`/meals/${meal._id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
          <Image
            src={meal.image[0] || '/images/no-image.jpg'}
            alt={meal.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          {meal.discountPercentage > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
              -{meal.discountPercentage}%
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/meals/${meal._id}`}>
              <h3 className="font-semibold text-white mb-1 hover:text-amber-400 transition-colors">
                {meal.name}
              </h3>
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {meal.restaurant.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {meal.timeRemaining}
              </span>
              <span className="flex items-center gap-1">
                <Utensils size={12} />
                {meal.cuisine}
              </span>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {meal.description}
            </p>

            {/* Features */}
            {meal.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {meal.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Price */}
            <div className="text-right">
              <div className="text-xl font-bold text-amber-500">
                Rp {meal.price.toLocaleString()}
              </div>
              {meal.originalPrice > meal.price && (
                <div className="text-sm text-gray-500 line-through">
                  Rp {meal.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                meal.stockQuantity > 0
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-red-900/30 text-red-400'
              }`}
            >
              {meal.stockQuantity > 0
                ? `${meal.stockQuantity} left`
                : 'Sold out'}
            </div>

            {/* Bookmark Button */}
            <BookmarkButton
              meal={meal._id}
              initialBookmarked={true}
              size="sm"
              showText={false}
              className="w-auto px-3"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
