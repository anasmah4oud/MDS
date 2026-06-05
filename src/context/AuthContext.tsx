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

  // لمنع التكرار نهائياً: نتذكر آخر ID تم إرساله لطلب البروفايل، ونتذكر إذا كان الطلب قيد التنفيذ حالياً
  const lastFetchedUserId = useRef<string | null>(null);
  const isFetching = useRef<boolean>(false);

  const fetchProfile = async (userId: string) => {
    // 🛑 حظر مطلق: إذا كان الطلب يجري الآن، أو كنا قد حاولنا جلب هذا الـ ID مسبقاً، اخرج فوراً لمنع الـ Loop
    if (isFetching.current || lastFetchedUserId.current === userId) {
      return;
    }

    try {
      isFetching.current = true;
      lastFetchedUserId.current = userId;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // 🟢 maybeSingle تمنع كسر الكود عند وجود 0 صفوف

      if (error) {
        console.error('Error fetching profile from DB:', error);
        setProfile(null);
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
      setProfile(null);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. فحص الجلسة لمرة واحدة عند تحميل الصفحة أول مرة
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

    // 2. الاستماع للأحداث الحقيقية فقط (تسجيل الدخول الفعلي أو الخروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;

      // إذا خرج المستخدم أو انتهت الجلسة تماماً
      if (event === 'SIGNED_OUT' || !currentUser) {
        lastFetchedUserId.current = null;
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // إذا حدث دخول جديد أو تغير المستخدم الفعلي المسجل
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || lastFetchedUserId.current !== currentUser.id) {
        setUser(currentUser);
        fetchProfile(currentUser.id);
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