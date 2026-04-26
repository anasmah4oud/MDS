/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, ShieldOff, Wallet, Lock, 
  GraduationCap, ChevronLeft, LogOut,
  LayoutDashboard, Settings, FileText,
  BarChart3, UserCheck, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const adminMenu = [
    { title: 'طلاب الصف الأول الثانوى', path: '/anas/md/200/9/1', icon: <GraduationCap />, color: 'bg-blue-50 text-blue-600', badge: '1' },
    { title: 'طلاب الصف الثانى الثانوى', path: '/anas/md/200/9/2', icon: <GraduationCap />, color: 'bg-green-50 text-green-600', badge: '2' },
    { title: 'طلاب الصف الثالث الثانوى', path: '/anas/md/200/9/3', icon: <GraduationCap />, color: 'bg-purple-50 text-purple-600', badge: '3' },
    { title: 'حظر المستخدمين (Blacklist)', path: '/anas/md/200/9/BL', icon: <ShieldOff />, color: 'bg-red-50 text-red-600' },
    { title: 'إدارة المحفظة والماليات', path: '/anas/md/200/9/w', icon: <Wallet />, color: 'bg-amber-50 text-amber-600' },
    { title: 'تغيير كلمات المرور', path: '/anas/md/200/9/p', icon: <Lock />, color: 'bg-slate-50 text-slate-600' },
    { title: 'إدارة الأكواد والاشتراكات', path: '/anas/md/200/9/cl', icon: <Database />, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-blue-600 rounded-xl text-white">
             <BarChart3 size={24} />
           </div>
           <div>
             <h1 className="text-xl font-black text-slate-900">لوحة تحكم الأدمن</h1>
             <p className="text-[10px] font-bold text-slate-400">منصة البارع محمود الديب</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden sm:flex flex-col text-left">
             <span className="text-sm font-bold text-slate-900">أهلاً يا أدمن</span>
             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">المسؤول الرئيسي</span>
           </div>
           <button 
             onClick={handleLogout}
             className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
           >
             <LogOut size={20} />
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12">
        <div className="mb-12">
           <h2 className="text-3xl font-black text-slate-900 mb-2">مرحباً بك مرة أخرى!</h2>
           <p className="text-slate-500 font-bold">لديك التحكم الكامل في جميع أجزاء المنصة والطلاب.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenu.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className="group block bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all hover:-translate-y-2 relative overflow-hidden h-full"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 font-bold text-sm">إدارة وضبط كامل لهذا القسم ومراجعة جميع البيانات المرتبطة به.</p>

                {item.badge && (
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 w-8 h-8 md:w-10 md:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs md:text-base">
                    {item.badge}
                  </div>
                )}

                <div className="mt-6 md:mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-4 transition-all">
                  دخول الآن <ChevronLeft size={16} />
                </div>

                <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 100 })}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           <StatCard label="إجمالي الطلاب" value="5,240" icon={<Users className="text-blue-500" />} />
           <StatCard label="إجمالي الإيرادات" value="120,500 ج.م" icon={<Wallet className="text-green-500" />} />
           <StatCard label="الطلاب النشطين اليوم" value="284" icon={<UserCheck className="text-purple-500" />} />
           <StatCard label="الاشتراكات الجديدة" value="48" icon={<FileText className="text-orange-500" />} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
    </div>
  );
}
