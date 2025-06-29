import { getSessionUser } from '@/utils/getSessionUser';
import connectDB from '@/config/database';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import UnauthorizedAccess from '@/app/(with-navigation)/unauthorized/page';

async function getUserRole() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return { authorized: false, needsLogin: true };
    }

    await connectDB();
    const user = await User.findById(sessionUser.userId).select('role');

    if (!user || user.role !== 'seller') {
      return { authorized: false, needsLogin: false };
    }

    return { authorized: true, needsLogin: false };
  } catch (error) {
    console.error('Error checking user role:', error);
    return { authorized: false, needsLogin: false };
  }
}

export default async function DashboardSellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authorized, needsLogin } = await getUserRole();

  if (needsLogin) {
    redirect('/login?callbackUrl=/dashboard-seller');
  }

  if (!authorized) {
    return <UnauthorizedAccess />;
  }

  return <div>{children}</div>;
}
