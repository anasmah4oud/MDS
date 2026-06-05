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
  
  // لتعقب آخر مستخدم جلبنا بياناته ومنع التكرار اللانهائي
  const lastFetchedUserId = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    // إذا كنا جلبنا هذا البروفايل بالفعل في نفس الجلسة، لا داعي لتكرار الطلب
    if (lastFetchedUserId.current === userId && profile) {
      setLoading(false);
      return;
    }

    try {
      lastFetchedUserId.current = userId;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // 🟢 استخدام maybeSingle بدلاً من single يمنع كسر الكود والـ 406

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. الفحص الأولي للجلسة الحالية عند فتح الموقع
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

    // 2. الاستماع لأي تغيرات في حالة الحساب (تسجيل دخول، خروج، تجديد الـ Token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      const currentUser = session?.user ?? null;
      
      // منع التكرار إذا كان المستمع يطلق أحداثاً متتالية لنفس المستخدم
      if (event === 'SIGNED_OUT' || !currentUser) {
        lastFetchedUserId.current = null;
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      fetchProfile(currentUser.id);
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