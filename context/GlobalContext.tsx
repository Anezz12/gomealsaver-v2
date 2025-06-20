'use client';

import getUnreadMessageCount from '@/app/action/getUnReadMessage';
import { useSession } from 'next-auth/react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// ✅ Define context value type
interface GlobalContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

// ✅ Create context with proper typing
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// ✅ Define provider props type
interface GlobalProviderProps {
  children: ReactNode;
}

// ✅ Create provider with proper typing
export function GlobalProvider({ children }: GlobalProviderProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (session?.user) {
        try {
          console.log('🔔 [CONTEXT] Fetching unread message count...');
          const res = await getUnreadMessageCount();

          if (res && typeof res.count === 'number') {
            setUnreadCount(res.count);
            console.log('✅ [CONTEXT] Unread count updated:', res.count);
          } else {
            console.log('⚠️ [CONTEXT] Invalid response format:', res);
            setUnreadCount(0);
          }
        } catch (error) {
          console.error('❌ [CONTEXT] Error fetching unread count:', error);
          setUnreadCount(0);
        }
      } else {
        // Reset count when no session
        setUnreadCount(0);
        console.log('👤 [CONTEXT] No session, resetting unread count');
      }
    };

    fetchUnreadCount();
  }, [session]); // ✅ Only depend on session

  const contextValue: GlobalContextType = {
    unreadCount,
    setUnreadCount,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

// ✅ Create custom hook with proper error handling
export function useGlobalContext(): GlobalContextType {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }

  return context;
}

// ✅ Export context for testing purposes
export { GlobalContext };
