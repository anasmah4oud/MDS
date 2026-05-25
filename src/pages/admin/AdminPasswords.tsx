/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Phone, ChevronRight, 
  AlertCircle, ShieldCheck, Key, Mail
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';

export default function AdminPasswords() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // 1. دالة البحث عن الطالب برقم الهاتف
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFoundUser(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', searchTerm)
        .single();
      
      if (error || !data) {
        alert('لم يتم العثور على طالب بهذا الرقم');
      } else {
        setFoundUser(data as UserProfile);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء البحث عن الطالب');
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة تغيير كلمة المرور الحقيقية والمباشرة
  const handleReset = async () => {
    if (!foundUser || !newPassword) return;
    
    setLoading(true);
    try {
      // استدعاء الدالة الأمنية (RPC) من قاعدة البيانات لتغيير كلمة المرور في الـ Auth
      const { data, error } = await supabase.rpc('admin_change_user_password', {
        target_user_id: foundUser.id,
        new_password: newPassword
      });
      
      if (error) throw error;

      if (data && data.success) {
        // تم التغيير بنجاح، نقوم بإظهار رسالة تأكيد للمسؤول
        const studentName = foundUser.firstName || foundUser.first_name || 'الطالب';
        alert(`✅ تم تغيير كلمة مرور المستخدِم (${studentName}) بنجاح وبشكل فوري!`);
        
        // تصفير الحقول بعد النجاح
        setFoundUser(null);
        setSearchTerm('');
        setNewPassword('');
      } else {
        alert(`❌ فشل التعديل: ${data?.message || 'حدث خطأ غير متوقع'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`❌ خطأ في الاتصال بقاعدة البيانات: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
          <h1 className="text-xl font-black text-slate-900">إدارة كلمات المرور</h1>
        </div>
        <button 
          onClick={() => navigate('/anas/md/200/9')}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة للمسؤول
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-blue-100/50 space-y-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Key size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">تغيير كلمة مرور طالب</h2>
            <p className="text-slate-500 font-bold mt-4 max-w-md mx-auto leading-relaxed">
              ابحث عن الطالب برقم هاتفه المسجل لتعديل بيانات الدخول الخاصة به بشكل مباشر.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                required
                type="tel"
                placeholder="رقم هاتف الطالب..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-6 pr-12 pl-4 font-black outline-none focus:border-blue-600 transition-all text-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="bg-blue-600 text-white px-10 py-6 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
            >
              {loading && !foundUser ? 'جاري البحث...' : 'بحث عن الطالب'}
            </button>
          </form>

          {foundUser && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 p-8 rounded-[32px] border-2 border-slate-100 space-y-8"
            >
              <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                <img 
                  src={foundUser.photoUrl || foundUser.photo_url || "https://via.placeholder.com/150"} 
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md" 
                  alt="Avatar" 
                />
                <div>
                  <h4 className="text-2xl font-black text-slate-900">
                    {foundUser.firstName || foundUser.first_name} {foundUser.lastName || foundUser.last_name}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 font-bold mt-1">
                    <Mail size={16} /> <span>{foundUser.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 underline decoration-red-600">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    required
                    type="text"
                    placeholder="أدخل كلمة المرور الجديدة هنا..."
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pr-12 pl-4 font-black text-slate-900 outline-none focus:border-red-600 transition-all text-2xl tracking-widest"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm font-bold leading-relaxed">
                <AlertCircle className="shrink-0" />
                <p>تنبيه: التغيير يتم فورياً في نظام الحماية التابع لـ Supabase، تأكد من تزويد الطالب بكلمة المرور الجديدة فور حفظها ليتمكن من تسجيل الدخول.</p>
              </div>

              <button 
                onClick={handleReset}
                disabled={loading || !newPassword}
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <ShieldCheck /> {loading ? 'جاري الحفظ والتشفير...' : 'تحديث كلمة المرور فوراً'}
              </button>
            </motion.div>
          )}
        </div>

        <p className="mt-12 text-center text-slate-400 font-bold italic text-sm">منصة البارع محمود الديب - نظام الإدارة المركزي v1.0</p>
      </main>
    </div>
  );
}