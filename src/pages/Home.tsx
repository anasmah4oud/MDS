/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, ArrowUp, Phone,
  Award, Target, Sparkles, TrendingUp, Layers, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css'; // استيراد الحركات الإضافية

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // إظهار زر العودة للأعلى عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="relative">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full animate-pulse shadow-xl" />
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) navigate('/anas/md/200/9', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, profile, isAdmin, navigate, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 overflow-x-hidden" dir="rtl">
      {/* شريط التقدم */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 z-[100] origin-right"
        style={{ scaleX }}
      />

      {/* خلفية متحركة (Blobs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => scrollToTop()}>
              <motion.img
                src="/logo.png"
                alt="البارع"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md"
                whileHover={{ rotate: 10, scale: 1.05 }}
              />
              <div>
                <h1 className="text-lg md:text-xl font-black bg-gradient-to-l from-slate-900 to-indigo-800 bg-clip-text text-transparent">البارع</h1>
                <p className="text-xs md:text-sm font-bold text-indigo-600">محمود الديب</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all hover:scale-105">
                <LogIn size={18} /> تسجيل الدخول
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:shadow-lg transition-all hover:scale-105 shadow-md">
                <UserPlus size={18} /> إنشاء حساب
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <Link to="/contact" className="text-slate-600 hover:text-indigo-600">تواصل معنا</Link>
              <Link to="/support" className="text-slate-600 hover:text-indigo-600">الدعم الفني</Link>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white/90 backdrop-blur-lg border-b border-slate-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <Link to="/login" className="block py-3 text-slate-700 font-bold border-b border-slate-50">تسجيل الدخول</Link>
                <Link to="/register" className="block py-3 text-indigo-600 font-black border-b border-slate-50">إنشاء حساب جديد</Link>
                <Link to="/contact" className="block py-3 text-slate-700">تواصل معنا</Link>
                <Link to="/support" className="block py-3 text-slate-700 font-medium">الدعم الفني</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-12 md:pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex-1 text-center md:text-right"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-bold text-sm mb-6"
            >
              🌟 منصة الثانوية العامة الأولى في مصر
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.2]">
              البارع <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-blue-600">محمود الديب</span>
            </h1>
            <div className="h-2 w-24 bg-gradient-to-l from-indigo-600 to-blue-600 rounded-full mx-auto md:mx-0 mb-6"></div>
            <h2 className="text-xl md:text-3xl font-bold text-slate-600 mb-6 md:mb-8 typewriter">
              أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:shadow-2xl transition-all shadow-xl"
              >
                ابدأ رحلتك الآن <ChevronRight size={24} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 to-blue-300 rounded-full blur-[80px] opacity-40 animate-pulse" />
            <motion.img
              src="/master.png"
              alt="أ / محمود الديب"
              className="relative w-full max-w-md mx-auto drop-shadow-2xl z-10 rounded-3xl"
              whileHover={{ scale: 1.02 }}
              onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Marquee المتحرك */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 py-5 overflow-hidden rotate-[-1deg] scale-[1.02] my-8 shadow-lg">
        <div className="flex whitespace-nowrap gap-12 animate-marquee">
          {[...Array(2)].map((_, j) =>
            Array(8).fill("( وما توفيقي إلا بالله )").map((text, i) => (
              <span key={j + "-" + i} className="text-white text-2xl md:text-3xl font-black tracking-widest drop-shadow">
                {text} ✨
              </span>
            ))
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">لماذا منصة البارع؟</h3>
            <div className="h-1.5 w-28 bg-gradient-to-l from-indigo-600 to-blue-600 mx-auto rounded-full" />
            <p className="text-slate-500 mt-4 text-lg">رحلة تفوق تبدأ بخطوة موفقة</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative items-center">
            <div className="hidden md:flex justify-center items-center relative z-10 order-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-72 h-72 border-4 border-dashed border-indigo-200 rounded-full flex items-center justify-center p-6 bg-white/40 backdrop-blur-sm shadow-xl"
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full drop-shadow-2xl" />
              </motion.div>
            </div>
            <div className="space-y-12 md:order-1">
              <FeatureItem icon={<BookOpen className="text-indigo-600" />} title="شرح مفصل" desc="شرح كل جزء من المنهج بأسلوب مبسط ومشوق" />
              <FeatureItem icon={<Users className="text-indigo-600" />} title="متابعة مستمرة" desc="متابعة مع ولي الأمر لضمان تقدم الطالب" />
            </div>
            <div className="space-y-12 md:order-3">
              <FeatureItem icon={<CheckCircle className="text-indigo-600" />} title="امتحانات دورية" desc="امتحانات على كل حصة لتقييم الاستيعاب" />
              <FeatureItem icon={<GraduationCap className="text-indigo-600" />} title="امتحان شامل" desc="امتحان شهري مع هدايا قيمة للمتفوقين" />
            </div>
          </div>
        </div>
      </section>

      {/* Grades Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">المراحل الدراسية</h3>
            <p className="text-slate-600 text-lg">اختر صفك الدراسي وابدأ التفوق الآن</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradeCard grade={1} title="الصف الأول الثانوي" img="/grade1.png" />
            <GradeCard grade={2} title="الصف الثاني الثانوي" img="/grade2.png" />
            <GradeCard grade={3} title="الصف الثالث الثانوي" img="/grade3.png" />
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 rounded-full mx-auto mb-8 border-4 border-white/20 shadow-2xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <h3 className="text-5xl md:text-6xl font-black mb-12 italic tracking-tight">البارع محمود الديب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <MotivationCard text="ابني أساسك صح في اللغة العربية" />
            <MotivationCard text="احلم بـ 80/80 واحنا هنساعدك" />
            <MotivationCard text="التفوق مش مستحيل مع البارع" />
            <MotivationCard text="اللغة العربية متعة مش بس مادة" />
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/login" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-full text-xl md:text-2xl font-black hover:shadow-2xl transition-all hover:bg-indigo-50">
              ابدأ رحلتك نحو التفوق الآن 🚀
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex-1 text-center md:text-right"
            >
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">البارع محمود الديب</h3>
              <p className="text-2xl font-bold text-indigo-600 mb-10 leading-relaxed">👑 دي مش مجرد أرقام دي أدلة أنك في المكان الصح</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-3xl border-b-4 border-indigo-600 shadow-lg">
                  <div className="text-4xl font-black text-slate-900 mb-2">+ 1200</div>
                  <div className="text-slate-600 font-bold">حصة تعليمية</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-3xl border-b-4 border-indigo-600 shadow-lg">
                  <div className="text-4xl font-black text-slate-900 mb-2">+ 5000</div>
                  <div className="text-slate-600 font-bold">طالب فخور</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex-1 relative"
            >
              <div className="w-full aspect-square bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-[60px] rotate-6 absolute inset-0 -z-10 shadow-2xl" />
              <img src="/master_full.png" alt="" className="w-full h-auto rounded-[60px] shadow-2xl" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب" }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="text-center md:text-right">
              <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                <img src="/logo.png" alt="البارع" className="w-16 h-16 rounded-full" />
                <h4 className="text-3xl font-black">البارع</h4>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر.</p>
            </div>
            <div className="text-center">
              <h5 className="text-xl font-bold mb-8">روابط سريعة</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <Link to="/support" className="hover:text-indigo-400 transition">الدعم الفني</Link>
                <Link to="/contact" className="hover:text-indigo-400 transition">تواصل معنا</Link>
                <Link to="/login" className="hover:text-indigo-400 transition">تسجيل الدخول</Link>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h5 className="text-xl font-bold mb-8">تواصل مباشر</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <p>واتساب: 01006984012</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 text-center text-slate-500 font-medium">
            <p>جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}</p>
            <p className="text-indigo-400 italic mt-2">تم الإنشاء بكل الحب لطلاب الثانوية العامة 💙</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 bg-indigo-600 text-white p-3 rounded-full shadow-xl z-50 hover:bg-indigo-700 transition-all"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp for mobile */}
      <a
        href="https://wa.me/201006984012"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:hidden bg-green-500 text-white p-3 rounded-full shadow-xl z-50 hover:bg-green-600 transition-all"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}

// -------------------- Subcomponents --------------------

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl flex flex-col items-center text-center group transition-all hover:bg-white hover:shadow-indigo-100"
    >
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 font-medium">{desc}</p>
    </motion.div>
  );
}

function GradeCard({ grade, title, img }: { grade: number; title: string; img: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <Link to="/login" className="group">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        whileHover={{ y: -12 }}
        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-200">
          <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 right-6 text-white">
            <h4 className="text-2xl font-black">{title}</h4>
          </div>
        </div>
        <div className="p-6 flex justify-between items-center group-hover:bg-indigo-600 transition-colors">
          <span className="text-slate-900 font-bold group-hover:text-white">استكشف الآن</span>
          <ChevronRight className="text-indigo-600 group-hover:text-white group-hover:translate-x-[-4px] transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}

function MotivationCard({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      whileHover={{ scale: 1.02, x: -5 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-xl font-bold flex items-center gap-4 transition-all hover:bg-white/20"
    >
      <CheckCircle className="text-indigo-300 shrink-0" />
      <span>{text}</span>
    </motion.div>
  );
}