import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';

interface SessionUser {
  role: string;
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
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return null;
    }

    return {
      user: session.user,
      userId: session.user.id,
      role: session.user.role || '',
    };
  } catch (error) {
    console.error('Error in getSessionUser:', error);
    return null;
  }
};
