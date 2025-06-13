'use client';
import { useState, useEffect } from 'react';

import MealsPromoSkeleton from './MealsPromoSkeleton';
import MealsCardPromo from './MealsCardPromo';

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

export default function MealsPromoPageRender({ meal }: MealCardProps) {
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
    return <MealsPromoSkeleton />;
  }

  return <MealsCardPromo meal={meal} />;
}
