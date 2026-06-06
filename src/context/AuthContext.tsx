import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch with a timeout to prevent hanging forever on slow networks
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 6000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfile(data as UserProfile);
    } catch (err) {
      console.error('Exception in fetchProfile:', err);
      setProfile(null);
    }
  };

  // 1. Initial session check & event subscription
  useEffect(() => {
    let mounted = true;

    // Safety timeout: force auth initialization to finish after 8 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && !authInitialized) {
        console.warn('Auth initialization safety timeout triggered.');
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 8000);

    const initialize = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null } }), 4000)
        );

        const {
          data: { session },
        } = await Promise.race([sessionPromise, timeoutPromise]);

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Error in initialize auth:', err);
      } finally {
        if (mounted) {
          setAuthInitialized(true);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed event:', event);

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }

        setAuthInitialized(true);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch profile when user or authInitialized changes
  useEffect(() => {
    if (!authInitialized) return;

    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const load = async () => {
      await fetchProfile(user.id);
      if (active) {
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user, authInitialized]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    logout,
    isAdmin:
      profile?.role === 'admin' ||
      user?.email === 'anasmd2026@gmail.com' ||
      user?.email === 'anasmah4oud@gmail.com',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);