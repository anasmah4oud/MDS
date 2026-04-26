/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, User as UserIcon, Wallet, Star, BookOpen, 
  HelpCircle, MessageSquare, PhoneCall, ChevronRight,
  LayoutDashboard, PlayCircle, Gift, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ completed: 0, total: 10 }); // Mock stats for now

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar for Desktop */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Navbar */}
        <nav className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors lg:hidden"
            >
              <Menu />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <img src="/logo.png" className="w-8 h-8 md:w-10 md:h-10 rounded-full" alt="البارع" />
              <h2 className="text-lg md:text-xl font-black text-slate-900 hidden sm:block">منصة البارع</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex flex-col text-left">
               <span className="text-sm font-bold text-slate-900">أهلاً، {profile?.first_name}</span>
               <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">كود: #{profile?.student_code}</span>
            </div>
            
            <div className="relative group">
              <img 
                src={profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`} 
                className="w-10 h-10 rounded-full border-2 border-blue-100 cursor-pointer"
                alt="Profile"
              />
              <div className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all p-2 z-50">
                <Link to="/my" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl font-bold text-slate-700">
                  <UserIcon size={18} /> حسابي
                </Link>
                <Link to="/support" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl font-bold text-slate-700">
                  <HelpCircle size={18} /> الدعم الفني
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors"
                >
                  <LogOut size={18} /> تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="p-4 md:p-8 space-y-8">
          {/* Header Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-blue-600 rounded-[24px] md:rounded-[32px] p-6 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
              <div>
                <h3 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">أهلاً يا {profile?.first_name} 👋</h3>
                <p className="text-lg md:text-xl font-medium text-blue-100 italic opacity-90">مستعد لنبدأ رحلة تفوق جديدة اليوم؟</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] md:rounded-[28px] p-4 md:p-6 flex flex-wrap items-center gap-4 md:gap-6">
                <div>
                  <p className="text-xs md:text-sm font-bold text-blue-100 mb-1">رصيدك الحالي</p>
                  <p className="text-2xl md:text-4xl font-black">{profile?.wallet_balance || 0} <span className="text-sm md:text-lg">ج.م</span></p>
                </div>
                <Link 
                  to="/charge"
                  className="bg-white text-blue-600 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-black hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg ml-auto"
                >
                  <Wallet size={18} />
                  شحن المحفظة
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Star className="text-yellow-400 fill-yellow-400" />
                إحصائيات الإنجاز
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-12">
                 <ProgressCircle percent={(stats.completed / stats.total) * 100} label="الحصص المنجزة" value={`${stats.completed} من ${stats.total}`} />
                 <ProgressCircle percent={85} color="bg-green-500" label="معدل الحضور" value="85%" />
                 <ProgressCircle percent={92} color="bg-purple-500" label="متوسط الامتحانات" value="92%" />
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900 mb-4">سجل الآن!</h4>
                <p className="text-slate-500 font-bold leading-relaxed mb-6">
                  استغل عروض البارع الجديدة وابدأ مراجعة شاملة لضمان الـ 80/80
                </p>
              </div>
              <Link 
                to="/classes"
                className="w-full bg-slate-100 text-slate-900 py-5 rounded-2xl font-black text-center hover:bg-blue-600 hover:text-white transition-all group"
              >
                تصفح الكورسات الجديدة 
                <ChevronRight className="inline-block mr-2 group-hover:translate-x-[-4px] transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <QuickActionCard to="/classes" color="bg-blue-50 text-blue-600" icon={<BookOpen />} label="الكورسات" />
            <QuickActionCard to="/my-classes" color="bg-green-50 text-green-600" icon={<PlayCircle />} label="كورساتي" />
            <QuickActionCard to="/free" color="bg-purple-50 text-purple-600" icon={<Gift />} label="الحصص المجانية" />
            <QuickActionCard to="/support" color="bg-orange-50 text-orange-600" icon={<MessageSquare />} label="الدعم الفني" />
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const navigate = useNavigate();
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed lg:relative inset-y-0 right-0 w-72 bg-white border-l border-slate-200 z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
             <span className="text-2xl font-black text-slate-900 font-serif italic">البارع</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl">
             <X />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-2 py-8 overflow-y-auto">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="لوحة التحكم" />
          <SidebarLink to="/classes" icon={<BookOpen size={20} />} label="الكورسات المتاحة" />
          <SidebarLink to="/my-classes" icon={<PlayCircle size={20} />} label="كورساتي المشترك بها" />
          <SidebarLink to="/free" icon={<Gift size={20} />} label="المحتوى المجاني" />
          <div className="pt-8 pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">الدعم والمساعدة</div>
          <SidebarLink to="/support" icon={<HelpCircle size={20} />} label="الدعم الفني" />
          <SidebarLink to="/scientific-support" icon={<MessageSquare size={20} />} label="الدعم العلمي" />
          <SidebarLink to="/contact" icon={<PhoneCall size={20} />} label="اتصل بنا" />
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
            className="w-full flex items-center gap-4 p-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut size={20} />
            خروج من المنصة
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  const isActive = window.location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function ProgressCircle({ percent, label, value, color = 'bg-blue-600' }: { percent: number, label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
          <circle 
            cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="10" 
            className={`${color.replace('bg-', 'text-')}`}
            strokeDasharray={364.4}
            strokeDashoffset={364.4 - (364.4 * percent) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-slate-800">{value}</span>
        </div>
      </div>
      <span className="mt-4 font-bold text-slate-500">{label}</span>
    </div>
  );
}

function QuickActionCard({ to, color, icon, label }: { to: string, color: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      to={to}
      className={`group p-8 rounded-[32px] ${color} border border-transparent hover:border-current transition-all flex flex-col items-center justify-center text-center gap-4 hover:scale-105`}
    >
      <div className="text-4xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { size: 40 })}
      </div>
      <span className="text-lg font-black">{label}</span>
    </Link>
  );
}
