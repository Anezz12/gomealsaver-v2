import AddMealForm from '@/components/Settings/AddMealsForm';
import { getSessionUser } from '@/utils/getSessionUser';
import { redirect } from 'next/navigation';

export default async function AddMealPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect('/login');
  }

  return <AddMealForm />;
}
