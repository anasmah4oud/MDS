/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  useInView,
  useMotionValue,
  animate,
  useTransform,
} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, Youtube, Facebook, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroTextAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });
  const lessonsValue = useMotionValue(0);
  const studentsValue = useMotionValue(0);
  const experienceValue = useMotionValue(0);
  const [displayLessons, setDisplayLessons] = useState(0);
  const [displayStudents, setDisplayStudents] = useState(0);
  const [displayExperience, setDisplayExperience] = useState(0);

  useEffect(() => {
    if (!statsInView) return;

    const unsubscribeLessons = lessonsValue.onChange((value) => setDisplayLessons(Math.round(value)));
    const unsubscribeStudents = studentsValue.onChange((value) => setDisplayStudents(Math.round(value)));
    const unsubscribeExperience = experienceValue.onChange((value) => setDisplayExperience(Math.round(value)));

    const controlsLessons = animate(lessonsValue, 1200, { duration: 1.8, ease: 'easeOut' });
    const controlsStudents = animate(studentsValue, 5000, { duration: 1.8, ease: 'easeOut' });
    const controlsExperience = animate(experienceValue, 10, { duration: 1.8, ease: 'easeOut' });

    return () => {
      unsubscribeLessons();
      unsubscribeStudents();
      unsubscribeExperience();
      controlsLessons.stop();
      controlsStudents.stop();
      controlsExperience.stop();
    };
  }, [statsInView, lessonsValue, studentsValue, experienceValue]);

  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // للتحكم في شفافية النافبار عند التمرير (تحسين جمالي فقط)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تأثير parallax على صورة الهيرو
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], [0, 100]);

  // إعادة التوجيه بعد التأكد من الحساب (المنطق الأصلي كما هو)
  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) {
        navigate('/anas/md/200/9', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, isAdmin, navigate, loading]);

  // حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full animate-pulse" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir="rtl">
      {/* شريط التقدم المحسّن بتوهج */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 z-[100] origin-right progress-glow"
        style={{ scaleX }}
      />

      {/* شريط التنقل بتأثير زجاجي متغير */}
      <nav
        className={`fixed top-0 w-full z-50 border-b border-slate-200 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <motion.img
                src="/logo.png"
                alt="البارع"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">البارع</h1>
                <p className="text-xs md:text-sm font-medium text-blue-600">محمود الديب</p>
              </div>
            </div>

            {/* قائمة سطح المكتب */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
                <LogIn size={18} />
                تسجيل الدخول
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                <UserPlus size={18} />
                إنشاء حساب
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <Link to="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">تواصل معنا</Link>
              <Link to="/support" className="text-slate-600 hover:text-blue-600 transition-colors">الدعم الفني</Link>
            </div>

            {/* زر الجوال */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* قائمة الجوال */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <Link to="/login" className="block py-3 text-slate-700 font-medium border-b border-slate-50">تسجيل الدخول</Link>
                <Link to="/register" className="block py-3 text-blue-600 font-bold border-b border-slate-50">إنشاء حساب جديد</Link>
                <Link to="/contact" className="block py-3 text-slate-700">تواصل معنا</Link>
                <Link to="/support" className="block py-3 text-slate-700 font-medium">الدعم الفني</Link>
                <Link to="/scientific-support" className="block py-3 text-slate-700 font-medium">الدعم العلمي</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* قسم الهيرو */}
      <section
        ref={heroRef}
        className="relative pt-40 md:pt-48 pb-12 md:pb-20 px-4 overflow-hidden"
      >
        {/* جزيئات متحركة (تأثير جمالي) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 3,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-24 top-16 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
          <div className="absolute -left-24 top-1/4 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_25%),repeating-linear-gradient(135deg,rgba(15,23,42,0.02)_0_1px,transparent_1px_52px)] opacity-80" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 text-center md:text-right"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.1]"
            >
              البارع <span className="text-blue-600">محمود الديب</span>
            </motion.h1>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="text-xl md:text-3xl font-bold text-slate-600 mb-6 md:mb-8"
            >
              أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
            </motion.h2>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, delay: 0.24 }}
            >
              <Link
                to="/login"
                className="hero-cta-btn inline-flex items-center gap-2 md:gap-3 bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105"
              >
                ابدأ رحلتك الآن
                <ChevronRight size={24} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ y: heroImageY, willChange: 'transform' }}
            className="flex-1 relative"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
              <div className="w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-white/20 blur-2xl" />
              <img
                src="/master.png"
                alt="أ / محمود الديب"
                className="relative w-full rounded-[2rem] shadow-[0_30px_80px_rgba(37,99,235,0.18)] border border-white/20 bg-slate-50"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://placehold.co/600x800?text=محمود+الديب'; }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* شريط التلاوة (مع تأثير نصي لامع) */}
      <div className="bg-blue-600 py-6 overflow-hidden my-10 border-y-4 border-white/20">
        <div className="flex min-w-[200%] gap-12 animate-[marquee_1s_linear_infinite]" style={{ willChange: 'transform' }}>
          {[...Array(2)].map((_, j) =>
            Array(12).fill(' 🔰 وما توفيقي إلا بالله 🔰').map((text, i) => (
              <span
                key={`${j}-${i}`}
                className="text-white text-3xl md:text-4xl font-black tracking-[0.45em] whitespace-nowrap shimmer-text"
              >
                {text}
              </span>
            ))
          )}
        </div>
      </div>

      {/* قسم الميزات (Spotlight + أيقونات دوارة) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-20 relative z-10">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">لماذا منصة البارع؟</h3>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative z-10">
            <div className="space-y-8 md:order-1">
              <FeatureItem
                icon={<BookOpen />}
                title="شرح مفصل"
                desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط"
                fromLeft
              />
              <FeatureItem
                icon={<Users />}
                title="متابعة مستمرة"
                desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب"
                fromLeft
              />
            </div>

            <div className="hidden md:flex justify-center items-center relative order-2">
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                className="relative w-64 h-64 rounded-full flex items-center justify-center border border-white/20 bg-white/80 shadow-[0_30px_100px_rgba(59,130,246,0.12)]"
              >
                <div className="absolute inset-0 rounded-full border border-blue-200/40 blur-sm" />
                <img src="/logo.png" alt="Logo" className="relative w-32 h-32 rounded-full object-cover shadow-lg" />
              </motion.div>
            </div>

            <div className="space-y-8 md:order-3">
              <FeatureItem
                icon={<CheckCircle />}
                title="امتحانات دورية"
                desc="امتحانات على كل حصة لتقييم استيعاب الطالب"
                fromLeft={false}
              />
              <FeatureItem
                icon={<GraduationCap />}
                title="امتحان شامل"
                desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين"
                fromLeft={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* المراحل الدراسية (بطاقات بحدود دوّارة) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4 font-black">المراحل الدراسية</h3>
            <p className="text-slate-600 font-medium">اختر صفك الدراسي وابدأ الآن</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradeCard grade={1} title="الصف الأول الثانوي" img="/grade1.png" />
            <GradeCard grade={2} title="الصف الثاني الثانوي" img="/grade2.png" />
            <GradeCard grade={3} title="الصف الثالث الثانوي" img="/grade3.png" />
          </div>
        </div>
      </section>

      {/* قسم التحفيز (شبكة متحركة + نصوص لامعة) */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 moving-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.12),transparent_45%)]" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <motion.div
              className="relative inline-flex items-center justify-center w-28 h-28 mx-auto rounded-full bg-white/10 border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.18)]"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-violet-400/10 to-transparent blur-2xl" />
              <img src="/logo.png" alt="Logo" className="relative w-20 h-20 rounded-full object-cover" />
            </motion.div>
            <h3 className="text-5xl font-black mb-4 tracking-tight">البارع محمود الديب</h3>
            <p className="mx-auto max-w-2xl text-slate-300 text-lg font-medium">نحوّل العبارات التحفيزية إلى تجربة بصرية حية وتصميم عربي عصري.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <MotivationCard text="ابني أساسك صح في اللغة العربية" />
            <MotivationCard text="احلم بـ 80/80 واحنا هنساعدك" />
            <MotivationCard text="التفوق مش مستحيل مع البارع" />
            <MotivationCard text="اللغة العربية متعة مش بس مادة" />
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-white text-slate-950 px-12 py-5 rounded-full text-2xl font-black hover:bg-slate-100 transition-all shadow-2xl"
            >
              ابدأ رحلتك نحو التفوق الآن
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* الإحصائيات (مع نبض بعد اكتمال العد) */}
      <section ref={statsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.8fr_1.2fr] items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">البارع محمود الديب</h3>
              <p className="text-2xl font-bold text-blue-600 mb-10 leading-relaxed">دي مش مجرد أرقام دي أدلة أنك في المكان الصح</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard value={displayLessons} label="حصة تعليمية" accent="from-blue-500 to-cyan-500" suffix="+" />
                <StatCard value={displayStudents} label="طالب فخور" accent="from-violet-500 to-blue-500" suffix="+" />
                <StatCard value={displayExperience} label="سنوات خبرة" accent="from-emerald-500 to-lime-500" suffix="+" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-[50px] blur-3xl" />
              <img
                src="/master_full.png"
                alt="Statistics"
                className="relative w-full h-auto rounded-[50px] shadow-2xl border border-white/10"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://placehold.co/600x600?text=محمود+الديب'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* تذييل الصفحة (بخطوط متحركة وأيقونات متوهجة) */}
      <footer className="relative bg-slate-950 text-white pt-20 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-1 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 opacity-80" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">
            <div className="text-center md:text-right">
              <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                <img src="/logo.png" alt="البارع" className="w-16 h-16 rounded-full" />
                <h4 className="text-3xl font-black">البارع</h4>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            <div className="text-center">
              <h5 className="text-xl font-bold mb-8">روابط سريعة</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <Link to="/support" className="relative inline-block group hover:text-blue-400 transition-colors">
                  الدعم الفني
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/contact" className="relative inline-block group hover:text-blue-400 transition-colors">
                  تواصل معنا
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/login" className="relative inline-block group hover:text-blue-400 transition-colors">
                  تسجيل الدخول
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-xl font-bold mb-8">تواصل مباشر</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <p>واتساب: 01006984012</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end gap-4 mb-8">
            <motion.a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(59,130,246,0.6)' }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
            >
              <Youtube size={20} className="relative z-10" />
            </motion.a>
            <motion.a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(59,130,246,0.6)' }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
            >
              <Facebook size={20} className="relative z-10" />
            </motion.a>
            <motion.a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(59,130,246,0.6)' }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
            >
              <Send size={20} className="relative z-10" />
            </motion.a>
          </div>

          <div className="border-t border-white/10 pt-10 text-center text-slate-500 font-medium space-y-4">
            <p>جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}</p>
            <p className="text-blue-400 italic">تم الإنشاء بكل الحب لطلاب الثانوية العامة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========== المكونات المساعدة (بنفس المنطق، مع تحسينات التصميم) ==========

function FeatureItem({ icon, title, desc, fromLeft }: { icon: React.ReactNode; title: string; desc: string; fromLeft: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ hidden: { opacity: 0, x: fromLeft ? -40 : 40, y: 20 }, visible: { opacity: 1, x: 0, y: 0 } }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(59,130,246,0.16)' }}
      className="glass-effect p-8 rounded-[2rem] flex flex-col items-center text-center transition-all relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* تأثير spotlight يتبع الماوس */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br from-blue-500 to-violet-500 text-2xl"
          whileInView={{ rotate: 360 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {icon}
        </motion.div>
        <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function GradeCard({ grade, title, img }: { grade: number; title: string; img: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Link to="/login" className="group block">
      <div className="relative rounded-[2.25rem] p-[2px] overflow-hidden">
        {/* حدود دوّارة ديناميكية */}
        <motion.div
          className="absolute inset-0 rounded-[2.25rem]"
          style={{
            background: 'conic-gradient(from 0deg, #f97316, #d946ef, #06b6d4, #f97316)',
            filter: 'blur(4px)',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        />
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-[2.15rem] bg-white overflow-hidden shadow-2xl border border-white/10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            willChange: 'transform',
          }}
        >
          <div className="relative aspect-video overflow-hidden bg-slate-200">
            <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 text-white">
              <h4 className="text-2xl font-black">{title}</h4>
            </div>
          </div>
          <div className="p-6 flex justify-between items-center transition-colors bg-white">
            <span className="text-slate-900 font-bold group-hover:text-blue-600">استكشف الآن</span>
            <ChevronRight className="text-blue-600 group-hover:-translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>
    </Link>
  );
}

function MotivationCard({ text }: { text: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.35)]"
    >
      <div className="absolute inset-0 rounded-3xl bg-white/5 blur-xl" />
      <div className="relative flex items-start gap-4">
        <motion.svg
          viewBox="0 0 24 24"
          className="w-12 h-12 text-cyan-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </motion.svg>
        <span className="relative text-lg font-semibold text-white shimmer-text">{text}</span>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, accent, suffix }: { value: number; label: string; accent: string; suffix?: string }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (value > 0 && !pulse) {
      setPulse(true);
    }
  }, [value, pulse]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="rounded-[2rem] border border-slate-200/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-all"
    >
      <div className={`inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${accent} text-white text-sm font-semibold mb-4`}>
        {label}
      </div>
      <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2">
        {value}{suffix ?? ''}
      </div>
      <div className="text-slate-600 font-semibold">{label}</div>
    </motion.div>
  );
}