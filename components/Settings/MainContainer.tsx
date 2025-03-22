import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
export default async function ProfileLayout() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <div>{/* Profile layout content goes here */}</div>;
}
