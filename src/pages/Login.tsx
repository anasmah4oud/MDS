/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, LogIn, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/anas/md/200/9', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full animate-pulse" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Find user by phone to get their email (from profiles table)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, role, is_blocked')
        .eq('phone', formData.phone)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profile) {
        throw new Error('رقم الهاتف غير مسجل');
      }

      if (profile.is_blocked) {
        throw new Error('هذا الحساب محظور. يرجى التواصل مع الدعم.');
      }

      // 2. Sign in with email and password
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: formData.password
      });

      if (loginError) {
        throw loginError;
      }

      // 3. Redirect based on role
      if (profile.role === 'admin') {
        navigate('/anas/md/200/9');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'خطأ في تسجيل الدخول. يرجى التأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Login Sidebar */}
      <div className="hidden lg:flex flex-1 bg-blue-900 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-12"
          >
            <img src="/logo.png" alt="Logo" className="w-40 h-40 mx-auto rounded-full border-8 border-white/10 shadow-2xl" />
          </motion.div>
          <h1 className="text-5xl font-black mb-6 tracking-tighter italic">أهلاً بك مرة تانية في منصتك</h1>
          <p className="text-2xl font-bold text-blue-200">البارع محمود الديب.. طريقك المضمون للتفوق</p>
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="mb-12 text-center md:text-right">
             <Link to="/" className="text-blue-600 font-bold flex items-center gap-2 mb-4 hover:underline">
              <ChevronRight size={20} />
              العودة للرئيسية
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">تسجيل الدخول</h2>
            <p className="text-slate-500 font-bold mt-2 italic">استكمل رحلة نجاحك في اللغة العربية</p>
          </div>

          {error && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-50 border-r-4 border-red-500 p-4 mb-8 flex items-center gap-3 text-red-700 font-bold"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">رقم الهاتف المسجل</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required
                  type="tel"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-right"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required
                  type="password"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">تذكرني للمرات القادمة</span>
              </label>
              <Link to="/support" className="text-sm font-bold text-blue-600 hover:underline">نسيت كلمة المرور؟</Link>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50 group transition-all"
            >
              {loading ? 'جاري التحقق...' : 'دخول المنصة'}
              <LogIn className="group-hover:translate-x-[-4px] transition-transform" />
            </button>
          </form>

          <div className="mt-12 space-y-4">
             <Link 
              to="/register" 
              className="w-full border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              ليس لديك حساب؟
              <span className="text-blue-600 underline">قم بإنشاء حساب </span>
            </Link>
            <Link 
              to="/support"
              className="w-full border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle size={20} className="text-slate-400" />
              هل تواجه مشكلة؟ تواصل مع الدعم
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
