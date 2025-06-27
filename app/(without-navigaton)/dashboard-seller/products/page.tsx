import ProductsPage from '@/components/Dashboard/ProductDashboard';
import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';
import { convertToObject } from '@/utils/convertToObject';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function ProductPage() {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect('/login');
  }

  const { userId } = sessionUser;

  if (!userId) {
    throw new Error('You need to sign in to view this page');
  }

  try {
    const mealsDocs = await Meal.find({ owner: userId }).lean();
    const meals = mealsDocs.map((Meal) => convertToObject(Meal));
    return (
      <>
        <MainContainerDashboard>
          <ProductsPage meals={meals} />
        </MainContainerDashboard>
      </>
    );
  } catch (error) {
    console.error('Error fetching meals:', error);
    redirect('/dashboard-seller/products');
  }
}
