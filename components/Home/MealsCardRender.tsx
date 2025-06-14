import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import Image from 'next/image';
import { convertToObject } from '@/utils/convertToObject';

export default async function MealsCardRender() {
  await connectDB();
  const meals = await Meal.find({}).lean();
  const serializedMeals = convertToObject(meals);
  return (
    <>
      <section></section>
    </>
  );
}
