/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, User as UserIcon, Wallet, Star, BookOpen, 
  HelpCircle, MessageSquare, PhoneCall, ChevronRight,
  LayoutDashboard, PlayCircle, Gift, Menu, X, Bell, Users,
  Lightbulb, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/Dashboard.css';

// عداد تصاعدي بسيط
function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = motionValue;
    controls.set(0);
    const duration = 1000;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      controls.set(Math.min(controls.get() + step, value));
      if (controls.get() >= value) {
        controls.set(value);
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Dashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // إغلاق قائمة الملف الشخصي عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // حركات متداخلة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* شريط التنقل العلوي */}
        <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
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
            
            {/* قائمة الملف الشخصي بالضغط */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="focus:outline-none"
              >
                <img 
                  src={profile?.photo_url || `data:image/png;base64,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`} 
                  className="w-10 h-10 rounded-full border-2 border-blue-100 cursor-pointer"
                  alt="Profile"
                />
              </button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                  >
                    <Link 
                      to="/my" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl font-bold text-slate-700"
                    >
                      <UserIcon size={18} /> حسابي
                    </Link>
                    <Link 
                      to="/support" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl font-bold text-slate-700"
                    >
                      <HelpCircle size={18} /> الدعم الفني
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors"
                    >
                      <LogOut size={18} /> تسجيل الخروج
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* المحتوى الرئيسي */}
        <motion.main 
          className="p-4 md:p-8 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* بطاقة العنوان الرئيسية */}
          <motion.div 
            variants={itemVariants}
            className="hero-card bg-[#0f172a] rounded-[24px] md:rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="floating-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
              <div className="shape shape-4" />
              <div className="shape shape-5" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-0" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div>
                <motion.span 
                  className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-block border border-blue-400/20 shadow-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  Student Profile 2026
                </motion.span>
                <h3 className="text-3xl md:text-5xl font-black mb-4 font-display">
                  أهلاً يا <span className="text-blue-500">{profile?.first_name}</span> 👋
                </h3>
                <p className="text-lg md:text-xl font-medium text-slate-400 max-w-xl text-balance">
                  مستعد لنبدأ رحلة تفوق جديدة اليوم؟ نخبة من أفضل الكورسات في انتظارك.
                </p>
              </div>
              
              <motion.div 
                className="wallet-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center min-w-[280px] shadow-2xl relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute -top-4 -right-4 bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg">
                  رصيدك متاح
                </div>
                <p className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-xs">إجمالي رصيد المحفظة</p>
                <p className="text-4xl md:text-5xl font-black font-display mb-6">
                  <AnimatedNumber value={profile?.wallet_balance || 0} /> <span className="text-lg opacity-50">ج.م</span>
                </p>
                <Link 
                  to="/charge"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl text-center font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-glow group-hover:scale-105 transform"
                >
                  <Wallet size={20} />
                  إيداع رصيد
                </Link>
              </motion.div>
            </div>
            <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
               <Star size={300} />
            </div>
          </motion.div>

          {/* قسم البطاقة البنفسجية ونصائح البارع */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* البطاقة البنفسجية: ابدأ الآن */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-4 font-display">ابدأ الآن</h4>
                <p className="text-indigo-100 font-bold leading-relaxed mb-10 text-balance italic">
                  ابدأ حصصك الآن لضمان الدرجة النهائية.
                </p>
              </div>
              <Link 
                to="/classes"
                className="w-full bg-white text-indigo-700 py-5 rounded-3xl font-black text-center hover:bg-indigo-50 transition-all group relative z-10 font-display shadow-xl hover:shadow-2xl"
              >
                تصفح الكورسات الجديدة 
                <ChevronRight className="inline-block mr-2 group-hover:translate-x-[-4px] transition-transform rotate-180" />
              </Link>
              <Users className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 group-hover:scale-110 transition-transform" />
            </motion.div>

            {/* نصائح البارع */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-soft flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Lightbulb className="text-yellow-600" size={24} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 font-display">نصائح البارع</h4>
              </div>
              
              <ul className="space-y-6">
                <motion.li 
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="text-green-600" size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-lg">شاهد المحاضرات دون تأجيل</span>
                    <span className="text-slate-500 text-sm">الانتظام في المشاهدة يضمن لك فهمًا أعمق وتفوقًا مضمونًا.</span>
                  </div>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-lg">ذاكر أول بأول دون تسويف</span>
                    <span className="text-slate-500 text-sm">المراجعة المستمرة تمنع تراكم الدروس وتجعل الامتحانات أسهل.</span>
                  </div>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* بطاقات الإجراءات السريعة */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
            variants={containerVariants}
          >
            <QuickActionCard to="/classes" color="bg-blue-50 text-blue-600" icon={<BookOpen />} label="الكورسات" variants={itemVariants} />
            <QuickActionCard to="/my-classes" color="bg-green-50 text-green-600" icon={<PlayCircle />} label="كورساتي" variants={itemVariants} />
            <QuickActionCard to="/free" color="bg-purple-50 text-purple-600" icon={<Gift />} label="الحصص المجانية" variants={itemVariants} />
            <QuickActionCard to="/support" color="bg-orange-50 text-orange-600" icon={<MessageSquare />} label="الدعم الفني" variants={itemVariants} />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

// الشريط الجانبي (بدون تغيير تقريبًا)
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
        className="sidebar fixed lg:relative inset-y-0 right-0 w-72 bg-white border-l border-slate-200 z-[70] flex flex-col"
        animate={{ x: isOpen ? 0 : '100%' }}
        initial={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ display: isOpen ? 'flex' : 'none' }}
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

      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            display: flex !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}

function SidebarLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  const isActive = window.location.pathname === to;
  return (
    <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.98 }}>
      <Link 
        to={to} 
        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
      >
        {icon}
        {label}
      </Link>
    </motion.div>
  );
}

function QuickActionCard({ to, color, icon, label, variants }: { to: string, color: string, icon: React.ReactNode, label: string, variants: any }) {
  return (
    <motion.div variants={variants}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        className={`group p-8 rounded-[32px] ${color} border border-transparent hover:border-current transition-all flex flex-col items-center justify-center text-center gap-4 shadow-sm hover:shadow-xl`}
      >
        <Link to={to} className="flex flex-col items-center gap-4">
          <div className="text-4xl group-hover:scale-110 transition-transform">
            {React.cloneElement(icon as React.ReactElement, { size: 40 })}
          </div>
          <span className="text-lg font-black">{label}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}