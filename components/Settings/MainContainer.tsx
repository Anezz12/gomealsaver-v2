import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import SideBarNavbar from './SideBarNavbar';
export default async function MainContainer({
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
      <SideBarNavbar user={session.user}>{children}</SideBarNavbar>
    </div>
  );
}
