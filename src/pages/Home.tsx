/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, ArrowUp,
  Star, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect if logged in (after loading)
  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) {
        navigate('/anas/md/200/9', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, isAdmin, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.img
            src="/logo.png"
            alt="البارع"
            className="w-24 h-24 rounded-full mb-6 border-4 border-white/20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
          <div className="flex items-center gap-2 justify-center">
            <motion.div
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
            />
            <motion.div
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir="rtl">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 z-[100] origin-right"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <motion.div
              className="flex items-center gap-2 md:gap-4 cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src="/logo.png"
                alt="البارع"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-100"
                whileHover={{ rotate: 10 }}
              />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">البارع</h1>
                <p className="text-xs md:text-sm font-medium text-blue-600">محمود الديب</p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-5">
              <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-all hover:translate-x-1">
                <LogIn size={18} />
                تسجيل الدخول
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105">
                <UserPlus size={18} />
                إنشاء حساب
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <Link to="/contact" className="text-slate-600 hover:text-blue-600 transition-all hover:translate-x-1">تواصل معنا</Link>
              <Link to="/support" className="text-slate-600 hover:text-blue-600 transition-all hover:translate-x-1">الدعم الفني</Link>
            </div>

            {/* Mobile Toggle */}
            <motion.button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <Link to="/login" className="block py-3 px-4 text-slate-700 font-medium rounded-xl hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                <Link to="/register" className="block py-3 px-4 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>إنشاء حساب جديد</Link>
                <Link to="/contact" className="block py-3 px-4 text-slate-700 rounded-xl hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>تواصل معنا</Link>
                <Link to="/support" className="block py-3 px-4 text-slate-700 font-medium rounded-xl hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>الدعم الفني</Link>
                <Link to="/scientific-support" className="block py-3 px-4 text-slate-700 font-medium rounded-xl hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>الدعم العلمي</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-24 px-4 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 text-center md:text-right"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.2]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              البارع <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">محمود الديب</span>
            </motion.h1>
            <motion.h2
              className="text-xl md:text-3xl font-bold text-slate-600 mb-8 md:mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
            </motion.h2>
            <Link to="/login">
              <motion.button
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg md:text-xl font-bold shadow-xl shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ابدأ رحلتك الآن
                <ChevronRight size={24} className="animate-pulse" />
              </motion.button>
            </Link>

            {/* Trust badges */}
            <motion.div
              className="flex gap-4 mt-8 justify-center md:justify-start flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {['معلم خبير', 'مناهج متكاملة', 'نتائج مضمونة'].map((badge) => (
                <span key={badge} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-100 flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" /> {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-blue-200/60 to-transparent rounded-full blur-[80px]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.img
              src="/master.png"
              alt="أ / محمود الديب"
              className="relative w-full max-w-md mx-auto drop-shadow-2xl z-10"
              whileHover={{ scale: 1.02 }}
              onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب" }}
            />
            {/* Floating elements */}
            <motion.div
              className="absolute top-10 right-0 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <GraduationCap size={28} />
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-0 w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
              <BookOpen size={28} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Marquee */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 overflow-hidden -rotate-1 scale-[1.02] my-8 border-y-4 border-white/20">
        <motion.div
          className="flex whitespace-nowrap gap-16"
          animate={{ x: [0, -1500] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-white text-3xl md:text-4xl font-black tracking-widest">
              ( وما توفيقي إلا بالله )
            </span>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              لماذا منصة البارع؟
            </motion.h3>
            <motion.div variants={fadeUp} className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative items-center">
            {/* Center Logo */}
            <div className="hidden md:flex justify-center items-center relative z-10 order-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-72 h-72 border-4 border-dashed border-blue-200 rounded-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50"
              >
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full rounded-full drop-shadow-xl"
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-blue-100 text-9xl -z-10 opacity-30 select-none">©</div>
            </div>

            {/* Left Features */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-10 md:order-1"
            >
              <FeatureItem icon={<BookOpen className="text-blue-600" />} title="شرح مفصل" desc="شرح تفصيلي لكل جزء من المنهج بأسلوب مبسط وممتع" />
              <FeatureItem icon={<Users className="text-blue-600" />} title="متابعة مستمرة" desc="متابعة دائمة مع ولي الأمر لضمان تقدم الطالب" />
            </motion.div>

            {/* Right Features */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-10 md:order-3"
            >
              <FeatureItem icon={<CheckCircle className="text-blue-600" />} title="امتحانات دورية" desc="امتحانات على كل حصة لتقييم استيعاب الطالب" />
              <FeatureItem icon={<GraduationCap className="text-blue-600" />} title="امتحان شامل" desc="امتحان شهري شامل مع هدايا قيمة للمتفوقين" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grades Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-black">المراحل الدراسية</motion.h3>
            <motion.p variants={fadeUp} className="text-slate-600 font-medium">اختر صفك الدراسي وابدأ الآن</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            <GradeCard grade={1} title="الصف الأول الثانوي" img="/grade1.png" />
            <GradeCard grade={2} title="الصف الثاني الثانوي" img="/grade2.png" />
            <GradeCard grade={3} title="الصف الثالث الثانوي" img="/grade3.png" />
          </motion.div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-24 rounded-full mx-auto mb-8 border-4 border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          />
          <motion.h3
            className="text-4xl md:text-6xl font-black mb-12 italic tracking-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            البارع محمود الديب
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <MotivationCard text="ابني أساسك صح في اللغة العربية" />
            <MotivationCard text="احلم بـ 80/80 واحنا هنساعدك" />
            <MotivationCard text="التفوق مش مستحيل مع البارع" />
            <MotivationCard text="اللغة العربية متعة مش بس مادة" />
          </motion.div>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-4 rounded-full text-xl md:text-2xl font-black hover:bg-blue-50 transition-all shadow-2xl shadow-blue-500/20"
            >
              ابدأ رحلتك نحو التفوق الآن
              <Sparkles className="text-yellow-500" size={24} />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex-1 text-center md:text-right"
            >
              <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 mb-6">البارع محمود الديب</motion.h3>
              <motion.p variants={fadeUp} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-10 leading-relaxed">
                دي مش مجرد أرقام دي أدلة أنك في المكان الصح
              </motion.p>

              <div className="grid grid-cols-2 gap-8">
                <StatCounter end={1200} suffix="+" label="حصة تعليمية" />
                <StatCounter end={5000} suffix="+" label="طالب فخور" />
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="w-full aspect-square bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[60px] rotate-6 absolute inset-0 -z-10"
                animate={{ rotate: [6, 8, 6] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              <motion.img
                src="/master_full.png"
                alt="Statistics"
                className="w-full h-auto rounded-[60px] shadow-2xl"
                whileHover={{ scale: 1.02 }}
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="text-center md:text-right">
              <motion.div
                className="flex items-center gap-4 mb-6 justify-center md:justify-start"
                whileHover={{ scale: 1.05 }}
              >
                <img src="/logo.png" alt="البارع" className="w-16 h-16 rounded-full border-2 border-white/20" />
                <h4 className="text-3xl font-black">البارع</h4>
              </motion.div>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <motion.a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors" whileHover={{ scale: 1.1 }}>
                  <MessageSquare size={18} />
                </motion.a>
                <motion.a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors" whileHover={{ scale: 1.1 }}>
                  <PhoneCall size={18} />
                </motion.a>
              </div>
            </div>

            <div className="text-center">
              <h5 className="text-xl font-bold mb-8 relative inline-block">
                روابط سريعة
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded"></span>
              </h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <Link to="/support" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">الدعم الفني</Link>
                <Link to="/contact" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">تواصل معنا</Link>
                <Link to="/login" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">تسجيل الدخول</Link>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-xl font-bold mb-8 relative inline-block">
                تواصل مباشر
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded"></span>
              </h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <PhoneCall size={16} className="text-blue-400" />
                  واتساب: 01006984012
                </p>
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <Globe size={16} className="text-blue-400" />
                  info@albarea.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 text-center text-slate-500 font-medium space-y-4">
            <p>جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}</p>
            <p className="text-blue-400 italic">تم الإنشاء بكل الحب لطلاب الثانوية العامة</p>
          </div>
        </div>
      </footer>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-blue-300/30"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-100 border border-slate-50 flex flex-col items-center text-center group transition-all hover:shadow-xl hover:shadow-blue-100/50"
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300"
        whileHover={{ rotate: 15 }}
      >
        {icon}
      </motion.div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// Grade Card Component
function GradeCard({ grade, title, img }: { grade: number, title: string, img: string }) {
  return (
    <motion.div variants={scaleIn}>
      <Link to="/login" className="group block">
        <motion.div
          className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100"
          whileHover={{ y: -10 }}
        >
          <div className="relative aspect-video overflow-hidden bg-slate-100">
            <motion.img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-6">
              <h4 className="text-2xl font-black text-white drop-shadow-md">{title}</h4>
            </div>
          </div>
          <div className="p-6 flex justify-between items-center bg-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
            <span className="text-slate-900 font-bold group-hover:text-white">استكشف الآن</span>
            <ChevronRight className="text-blue-600 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Motivation Card Component
function MotivationCard({ text }: { text: string }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, x: -5 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-xl font-bold flex items-center gap-4 transition-colors hover:bg-white/10 group"
    >
      <motion.div
        animate={{ rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
      >
        <CheckCircle className="text-green-400 shrink-0 group-hover:text-white transition-colors" size={28} />
      </motion.div>
      <span className="text-white/90 group-hover:text-white transition-colors">{text}</span>
    </motion.div>
  );
}

// Animated Counter Component
function StatCounter({ end, suffix, label }: { end: number, suffix: string, label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl border-b-4 border-blue-600 shadow-sm text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
        {count}{suffix}
      </div>
      <div className="text-slate-600 font-bold text-lg">{label}</div>
    </motion.div>
  );
}