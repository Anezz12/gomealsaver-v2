import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import NavbarDashboard from '@/components/Dashboard/NavbarDashboard';

export default async function MainContainerDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return (
    <div>
      <NavbarDashboard user={session.user}>{children}</NavbarDashboard>
    </div>
  );
}
