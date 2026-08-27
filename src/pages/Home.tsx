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
  useTransform,
} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, ChevronLeft, LogIn, UserPlus, Youtube, Facebook, Send
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

  const statsRef = useRef<HTMLDivElement>(null);

  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // للتحكم في شفافية النافبار عند التمرير
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

  // إعادة التوجيه بعد التأكد من الحساب
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
      {/* 1. شريط التقدم المحسّن (أزرق في أسود) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 z-[100] origin-right bg-gradient-to-r from-blue-600 to-black shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        style={{ scaleX }}
      />

      {/* شريط التنقل */}
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

      {/* 2. شريط التلاوة (تم تعديل الهوامش وارتفاع السطر لمنع قص الكلام) */}
      <div className="bg-blue-600 py-8 overflow-hidden my-10 border-y-4 border-white/20">
        <div className="flex min-w-[200%] gap-12 animate-[marquee_10s_linear_infinite]" style={{ willChange: 'transform' }}>
          {[...Array(2)].map((_, j) =>
            Array(12).fill('  وما توفيقي إلا باللَّه  ').map((text, i) => (
              <span
                key={`${j}-${i}`}
                className="text-white leading-normal text-3xl md:text-4xl font-black tracking-[0.45em] whitespace-nowrap shimmer-text pb-2"
              >
                {text}
              </span>
            ))
          )}
        </div>
      </div>

      {/* قسم الميزات */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">لماذا منصة البارع؟</h3>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
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

      {/* المراحل الدراسية */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4 font-black">المراحل الدراسية</h3>
            <p className="text-slate-600 font-medium">اختر صفك الدراسي وابدأ الآن</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradeCard grade={1} title="الصف الأول الثانوي" img="/grade1.png" />
            <GradeCard grade={2} title="الصف الثاني بكالوريا" img="/grade2.png" />
            <GradeCard grade={3} title="الصف الثالث الثانوي" img="/grade3.png" />
          </div>
        </div>
      </section>

      {/* 5. قسم التحفيز (تخفيف التأثيرات وتعديل اللوجو والاسم) */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        {/* تم إزالة moving-grid لتسريع الأداء */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)]" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
            
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="relative w-24 h-24 rounded-full object-cover mb-6 shadow-lg shadow-yellow-500/20 border-2 border-yellow-500/30" 
            />
            
            <h3 className="text-5xl font-black tracking-tight bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent pb-2">
              محمود الديب
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <MotivationCard text="احلم بـ 80/80 واحنا هنساعدك" />
            <MotivationCard text="التفوق مش مستحيل مع البارع" />
            <MotivationCard text="اللغة العربية متعة مش بس مادة" />
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-white text-slate-950 px-12 py-5 rounded-full text-2xl font-black hover:bg-slate-100 transition-all shadow-2xl hover:scale-105"
            >
              <ChevronLeft size={24} />
              ابدأ رحلتك نحو التفوق الآن
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. الإحصائيات (أرقام ثابتة بدون عداد) */}
      <section ref={statsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.8fr_1.2fr] items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">البارع محمود الديب</h3>
              <p className="text-2xl font-bold text-blue-600 mb-10 leading-relaxed">دي مش مجرد أرقام ده دليل إنك في المكان الصح</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* تم وضع الأرقام ثابتة مباشرة */}
                <StatCard value={1200} label="حصة " accent="from-blue-500 to-cyan-500" suffix="+" />
                <StatCard value={5000} label="طالب " accent="from-blue-500 to-cyan-500" suffix="+" />
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

      {/* 7. تذييل الصفحة (ألوان جديدة كحلي/أزرق غامق، خطوط ذهبية، عناصر متحركة) */}
      <footer className="relative bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white pt-16 pb-8 mt-20 border-t border-slate-800">
        
        {/* عناصر متحركة في الفوتر */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* خط علوي ذهبي */}
          <div className="flex justify-center mb-12">
            <div className="h-1 w-32 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* القسم الأول: الشعار والوصف (اللوجو بجوار الاسم) */}
            <div className="text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-5">
                <img src="/logo.png" alt="البارع" className="w-14 h-14 rounded-full shadow-lg shadow-yellow-500/10 border border-slate-700" />
                <h4 className="text-2xl font-black bg-gradient-to-l from-yellow-300 to-yellow-600 bg-clip-text text-transparent pb-1">
                  البارع محمود الديب
                </h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0">
                نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            {/* القسم الثاني: روابط سريعة */}
            <div className="text-center">
              <h5 className="text-lg font-bold mb-5 inline-block border-b-2 border-yellow-500 pb-1">روابط سريعة</h5>
              <ul className="space-y-3">
                <li>
                  <Link to="/support" className="text-slate-300 hover:text-yellow-400 transition duration-300 flex items-center justify-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-400 transition-all duration-300" />
                    الدعم الفني
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-300 hover:text-yellow-400 transition duration-300 flex items-center justify-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-400 transition-all duration-300" />
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* القسم الثالث: معلومات الاتصال */}
            <div className="text-center">
              <h5 className="text-lg font-bold mb-5 inline-block border-b-2 border-yellow-500 pb-1">تواصل مباشر</h5>
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm px-5 py-2.5 rounded-full cursor-pointer">
                  <span dir="ltr" className="font-bold tracking-wider text-yellow-100">01006984012</span>
                  <span className="text-sm">واتساب</span>
                </div>
              </div>
            </div>

            {/* القسم الرابع: وسائل التواصل الاجتماعي */}
            <div className="text-center">
              <h5 className="text-lg font-bold mb-5 inline-block border-b-2 border-yellow-500 pb-1">تابعنا</h5>
              <div className="flex justify-center gap-5">
                <motion.a
                  href="https://www.youtube.com/channel/UCIW308efj12Q86_hV8LgsNw"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="p-3 rounded-full bg-slate-800/50 hover:bg-red-500/80 shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Youtube size={20} />
                </motion.a>
                <motion.a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="p-3 rounded-full bg-slate-800/50 hover:bg-blue-600/80 shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="p-3 rounded-full bg-slate-800/50 hover:bg-cyan-500/80 shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Send size={20} />
                </motion.a>
              </div>
            </div>
          </div>

          {/* شريط حقوق الملكية */}
          <div className="border-t border-slate-800/80 pt-8 text-center space-y-3">
            <p className="text-slate-400 text-sm">
              جميع الحقوق محفوظة للأستاذ محمود الديب © {new Date().getFullYear()}
            </p>
            <p className="text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-sm italic font-medium">
              💛 تم الإنشاء بكل الحب لطلاب الثانوية العامة 💛
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========== المكونات المساعدة ==========

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
      whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(220,38,38,0.1)' }}
      className="glass-effect p-8 rounded-[2rem] flex flex-col items-center text-center transition-all relative overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform, box-shadow' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220,38,38,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        {/* 3. تعديل لون خلفية الأيقونات (أحمر في أسود) */}
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br from-red-600 to-red-900 text-2xl shadow-lg shadow-red-500/20"
          whileInView={{ rotate: 360 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
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
      <div className="relative rounded-[2.25rem] p-[3px] overflow-hidden">
        {/* 4. تعديل حدود البطاقات الدوارة (أحمر في أزرق) */}
        <motion.div
          className="absolute inset-0 rounded-[2.25rem]"
          style={{
            background: 'conic-gradient(from 0deg, #ff0000, #0800ff)',
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
            <span className="text-slate-900 font-bold group-hover:text-blue-600">ابدأ الآن</span>
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
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true, amount: 0.2 }}
      className="
        relative overflow-hidden rounded-3xl
        border border-white/5
        bg-slate-900/60 backdrop-blur-md
        p-6
        shadow-xl
        will-change-transform
      "
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="flex-shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-11 h-11 text-yellow-500"
          >
            <path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <span className="text-lg font-semibold text-white/90">
          {text}
        </span>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, accent, suffix }: { value: number; label: string; accent: string; suffix?: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="rounded-[2rem] border border-slate-200/50 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] transition-all"
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
