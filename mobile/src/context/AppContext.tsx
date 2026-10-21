import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { cacheMembers, getCachedMembers } from '../services/offline';
import { fetchMembers } from '../services/api';
import { MemberSummary } from '../types';

type Ctx = {
  isOnline: boolean;
  members: MemberSummary[];
  refreshMembers: () => Promise<void>;
};

const AppContext = createContext<Ctx>({} as any);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [members, setMembers] = useState<MemberSummary[]>([]);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) =>
      setIsOnline(Boolean(s.isConnected && s.isInternetReachable))
    );
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await getCachedMembers();
      if (cached.length) setMembers(cached);
      if (isOnline) {
        try {
          const fresh = await fetchMembers();
          setMembers(fresh);
          await cacheMembers(fresh);
        } catch {}
      }
    })();
  }, [isOnline]);

  const refreshMembers = async () => {
    try {
      const fresh = await fetchMembers();
      setMembers(fresh);
      await cacheMembers(fresh);
    } catch {}
  };

  return (
    <AppContext.Provider value={{ isOnline, members, refreshMembers }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);