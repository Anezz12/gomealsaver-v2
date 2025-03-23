import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';

interface SessionUser {
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    username: string;
    image: string;
    provider: string;
    password: string;
  };
}

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  return {
    userId: session.user.id,
    user: session.user,
  };
};
