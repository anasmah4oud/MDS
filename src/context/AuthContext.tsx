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
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchProfile = async (
    userId: string
  ) => {
    try {
      const { data, error } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

      if (error) {
        console.error(error);

        setProfile(null);

        return;
      }

      setProfile(data as UserProfile);
    } catch (err) {
      console.error(err);

      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        await fetchProfile(
          session.user.id
        );
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (
          event === 'SIGNED_OUT'
        ) {
          setUser(null);
          setProfile(null);
          return;
        }

        if (
          event === 'SIGNED_IN' &&
          session?.user
        ) {
          setUser(session.user);

          await fetchProfile(
            session.user.id
          );
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
      user?.email ===
        'anasmd2026@gmail.com' ||
      user?.email ===
        'anasmah4oud@gmail.com',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);