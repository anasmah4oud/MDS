/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, CheckCircle, GraduationCap, 
  Users, BookOpen, Sparkles, ArrowLeft, Star, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

// أنيميشن مخصص للعناصر عند التمرير
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && profile) {
      navigate(isAdmin ? '/anas/md/200/9' : '/dashboard', { replace: true });
    }
  }, [user, profile, isAdmin, navigate, loading]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      {/* ProgressBar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-blue-600 to-indigo-600 z-[100] origin-right" style={{ scaleX }} />

      {/* Navbar المطور */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              <div className="relative">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-2xl shadow-lg group-hover:rotate-6 transition-transform" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">البارع</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Mahmoud El-Deeb</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLinks />
              <div className="flex items-center gap-4 border-r pr-8 border-slate-200">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors">تسجيل الدخول</Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all">
                  إنشاء حساب
                </Link>
              </div>
            </div>

            <button className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <MobileMenu close={() => setIsMenuOpen(false)} />}
      </AnimatePresence>

      {/* Hero Section المطور */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* العناصر الخلفية المتحركة */}
        <div className="absolute top-20 left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-[-10%] w-[30%] h-[30%] bg-indigo-100/50 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center lg:text-right">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Sparkles size={16} /> ثورة في تعلم اللغة العربية
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-8xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              اتقن لغتك مع <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-500">البارع محمود الديب</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              تجربة تعليمية ذكية تجمع بين عمق المادة العلمية وأحدث أساليب التكنولوجيا لضمان الدرجة النهائية.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-600 shadow-2xl transition-all group">
                ابدأ مجاناً الآن
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </Link>
              <div className="flex -space-x-3 rtl:space-x-reverse items-center pr-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <p className="mr-4 text-sm font-bold text-slate-500">+5000 طالب مشترك</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-b from-blue-600/10 to-transparent p-4 rounded-[3rem]">
              <img src="/master.png" alt="Teacher" className="w-full max-w-lg mx-auto drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)]" />
            </div>
            {/* بطاقات طائرة Floating Cards */}
            <FloatingCard icon={<Star className="text-yellow-500" />} text="محتوى حصري" className="top-10 right-0 md:-right-10" />
            <FloatingCard icon={<ShieldCheck className="text-green-500" />} text="أوائل الجمهورية" className="bottom-20 left-0 md:-left-10" />
          </motion.div>
        </div>
      </section>

      {/* Marquee المطور */}
      <div className="py-12 bg-slate-900 rotate-[-1deg] scale-[1.02] shadow-2xl z-20 relative border-y-4 border-blue-500">
        <div className="flex whitespace-nowrap gap-12 animate-marquee">
          {Array(20).fill(" ( وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ) ").map((t, i) => (
            <span key={i} className="text-white text-2xl lg:text-4xl font-black opacity-90">{t}</span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 italic">لماذا يختار المتفوقون "البارع"؟</h2>
            <p className="text-slate-500 text-lg">صممنا المنصة لتكون رفيقك الدائم من أول يوم في الدراسة حتى ليلة الامتحان.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Zap className="text-yellow-500" />} 
              title="نظام ذكي" 
              desc="تحليل آلي لنقاط قوتك وضعفك بعد كل اختبار." 
            />
            <FeatureCard 
              icon={<BookOpen className="text-blue-500" />} 
              title="ملازم البارع" 
              desc="أقوى سلسلة كتب تعليمية متاحة بصيغة رقمية وتفاعلية." 
            />
            <FeatureCard 
              icon={<Users className="text-purple-500" />} 
              title="مجتمع تعليمي" 
              desc="تواصل مباشر مع المستر وفريق الدعم العلمي على مدار الساعة." 
            />
            <FeatureCard 
              icon={<GraduationCap className="text-red-500" />} 
              title="رحلة التفوق" 
              desc="جوائز نقدية وعينية لأوائل الاختبارات الشهرية." 
            />
          </div>
        </div>
      </section>

      {/* Grades Section المطور */}
      <section className="py-32 bg-[#F1F5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">المراحل الدراسية</h3>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradeCard step="01" title="الصف الأول الثانوي" color="blue" />
            <GradeCard step="02" title="الصف الثاني الثانوي" color="indigo" />
            <GradeCard step="03" title="الصف الثالث الثانوي" color="slate" />
          </div>
        </div>
      </section>

      {/* Footer المطور */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl" />
                <h4 className="text-4xl font-black tracking-tighter">البارع <span className="text-blue-500">.</span></h4>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                نهدف لبناء جيل يعشق اللغة العربية ويتقن فنونها، ليس فقط من أجل الامتحان، بل من أجل الهوية والفكر.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-8 text-white">روابط هامة</h5>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link to="/support" className="hover:text-blue-400 transition-colors">مركز المساعدة</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400 transition-colors">الشروط والأحكام</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-8 text-white">تواصل معنا</h5>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-slate-400 mb-2">الدعم الفني (واتساب)</p>
                <a href="tel:01006984012" className="text-2xl font-black text-blue-400 hover:text-blue-300">01006984012</a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-bold">
            <p>© {new Date().getFullYear()} البارع - جميع الحقوق محفوظة</p>
            <p className="flex items-center gap-2">صنع بشغف <span className="text-red-500 text-xl">♥</span> لطلاب مصر</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// مكونات فرعية صغيرة لتحسين الأداء والمظهر
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <motion.img 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        src="/logo.png" className="w-24 h-24 rounded-full mb-8 shadow-2xl shadow-blue-500/20"
      />
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-full h-full bg-blue-500"
        />
      </div>
    </div>
  );
}

function NavLinks() {
  return (
    <div className="flex gap-6 text-sm font-bold text-slate-600">
      {['الرئيسية', 'من نحن', 'المكتبة', 'تواصل معنا'].map((link) => (
        <a key={link} href="#" className="hover:text-blue-600 transition-colors relative group">
          {link}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all" />
        </a>
      ))}
    </div>
  );
}

function MobileMenu({ close }: { close: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 top-20 bg-white z-40 p-6 md:hidden"
    >
      <div className="flex flex-col gap-6 pt-10">
        <Link to="/login" onClick={close} className="text-2xl font-black text-slate-900 border-b pb-4">تسجيل الدخول</Link>
        <Link to="/register" onClick={close} className="text-2xl font-black text-blue-600 border-b pb-4">إنشاء حساب جديد</Link>
        <Link to="/support" onClick={close} className="text-xl font-bold text-slate-600">الدعم الفني</Link>
        <div className="mt-auto bg-slate-50 p-6 rounded-3xl">
          <p className="font-bold text-slate-900 mb-2">تحتاج مساعدة؟</p>
          <p className="text-slate-500 text-sm">فريقنا متاح دائماً للرد على استفساراتكم.</p>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all group"
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

function GradeCard({ step, title, color }: { step: string, title: string, color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative group cursor-pointer">
      <div className="absolute top-0 left-0 text-9xl font-black text-slate-200/50 -translate-y-12 select-none group-hover:text-blue-100 transition-colors">
        {step}
      </div>
      <div className="relative bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white z-10 overflow-hidden">
        <div className={`w-12 h-1.5 bg-${color}-500 mb-8 rounded-full`} />
        <h4 className="text-2xl font-black text-slate-900 mb-6">{title}</h4>
        <Link to="/login" className="flex items-center gap-2 text-blue-600 font-black group-hover:gap-4 transition-all">
          ابدأ الدراسة الآن <ChevronRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
}

function FloatingCard({ icon, text, className }: { icon: any, text: string, className: string }) {
  return (
    <motion.div 
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className={`absolute hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20 ${className}`}
    >
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="font-black text-slate-800 whitespace-nowrap">{text}</span>
    </motion.div>
  );
}