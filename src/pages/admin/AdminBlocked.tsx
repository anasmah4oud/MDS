/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldOff, ShieldCheck, Search, 
  Trash2, ChevronRight, UserMinus, 
  UserCheck, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';

export default function AdminBlocked() {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlocked();
  }, []);

  const fetchBlocked = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_blocked', true);
      
      if (error) throw error;
      setBlockedUsers(data as UserProfile[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm('هل أنت متأكد من تغيير حالة الحظر لهذا المستخدم؟')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      fetchBlocked();
    } catch (err) {
      console.error(err);
    }
  };

  const searchAndBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', searchTerm)
        .single();
      
      if (error || !data) {
        alert('المستخدم غير موجود');
        return;
      }
      await handleToggleBlock(data.id, data.is_blocked);
      setSearchTerm('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">إدارة حظر المستخدمين (Blacklist)</h1>
        </div>
        <button 
          onClick={() => navigate('/anas/md/200/9')}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة للمسؤول
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-12 space-y-12">
        {/* Quick Block Bar */}
        <section className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center">
                 <UserMinus size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black">حظر مستخدم جديد</h3>
                <p className="text-slate-400 font-bold text-sm">أدخل رقم الهاتف لتغيير حالة حظر الطالب فوراً.</p>
              </div>
           </div>
           
           <form onSubmit={searchAndBlock} className="w-full md:w-auto flex gap-3">
              <input 
                required
                type="tel"
                placeholder="رقم الهاتف..."
                className="w-full md:w-72 bg-white/10 border border-white/20 rounded-2xl py-4 px-6 font-bold outline-none focus:bg-white/20 transition-all text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black transition-all">تفعيل الإجراء</button>
           </form>
        </section>

        {/* Blocked List */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                <AlertTriangle className="text-red-500" />
                قائمة المستخدمين المحظورين
              </h3>
              <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-black">{blockedUsers.length} طلاب</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blockedUsers.map(user => (
                <motion.div 
                  key={user.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group"
                >
                   <div className="flex items-center gap-4">
                      <img src={user.photoUrl} className="w-16 h-16 rounded-full border-4 border-red-50 shadow-sm" alt="User" />
                      <div>
                        <h4 className="font-black text-slate-900">{user.firstName} {user.lastName}</h4>
                        <p className="text-xs font-bold text-slate-400">{user.phone}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleToggleBlock(user.id, true)}
                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    title="فك الحظر"
                   >
                     <UserCheck size={20} />
                   </button>
                </motion.div>
              ))}
              
              {blockedUsers.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center text-slate-300 font-black italic border-2 border-dashed border-slate-200 rounded-[40px]">
                   لا يوجد مستخدمون في القائمة السوداء حالياً.
                </div>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
