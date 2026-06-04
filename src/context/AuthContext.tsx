/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // استخدام Ref لحماية الفانكشن من الاستدعاء المتتالي السريع (منع الـ Loop)
  const isFetchingRef = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    // لو بنجيب نفس الـ Profile حالياً، متجيبوش تاني في نفس الوقت
    if (isFetchingRef.current === userId) return;
    isFetchingRef.current = userId;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        
        // إذا كان الخطأ بسبب الصلاحيات أو التوكن (مثل 406) نعمل تسجيل خروج لكسر الـ Loop
        if (error.code === 'PGRST116' || error.status === 406 || error.status === 401) {
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setProfile(null);
    } finally {
      isFetchingRef.current = null;
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      const currentUser = session?.user ?? null;
      
      // نحدث الـ User فقط لو اتغير فعلياً لمنع تكرار الـ Render والـ Loop
      setUser((prevUser) => {
        if (prevUser?.id !== currentUser?.id) {
          return currentUser;
        }
        return prevUser;
      });

      if (currentUser) {
        // لو حدث تسجيل دخول جديد أو تغيير حقيقي، نجيب البروفايل
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchProfile(currentUser.id);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' || 
             user?.email === 'anasmd2026@gmail.com' || 
             user?.email === 'anasmah4oud@gmail.com',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);