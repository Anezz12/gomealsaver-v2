'use client';
import { useState, useEffect } from 'react';

import MelasCardSkeleton from '../Skeleton/MelasCardSkeleton';
import MealsCard from './MealsCard';

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
  discountPercentage: number;
  timeRemaining: string;
  portionSize: string;
  features: string[];
  restaurant: Restaurant;
}

interface MealCardProps {
  meal: Meal;
  isLoading?: boolean;
}

// Main MealCard component
export default function MealsPageRender({ meal }: MealCardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout((): void => {
      setIsLoading(false);
    }, 1000); // Simulate loading for 1 second

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // If loading, show skeleton
  if (isLoading) {
    return <MelasCardSkeleton />;
  }

  return <MealsCard meal={meal} />;
}
