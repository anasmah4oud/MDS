/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, Sparkles,
  Star, TrendingUp, Award, ArrowLeft, PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

/* ─── Animation Variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

/* ─── Floating Particles (Canvas) ─── */
function FloatingParticles() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;
  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString('ar-EG')}{suffix}
    </span>
  );
}

/* ─── Marquee Text ─── */
function MarqueeStrip() {
  const items = Array(12).fill('وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ');
  return (
    <div className="marquee-wrapper overflow-hidden py-4 bg-gradient-to-r from-amber-50 via-white to-amber-50 border-y border-amber-100">
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="mx-8 text-amber-700/60 font-bold text-lg md:text-xl flex items-center gap-3 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {text}
            <Sparkles className="w-5 h-5 text-amber-500" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) navigate('/anas/md/200/9', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, profile, isAdmin, navigate, loading]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      setIsMenuOpen(false);
    }
  }, [prefersReducedMotion]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="home-page min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden" dir="rtl">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-l from-blue-600 to-amber-500 origin-right z-[60]"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b border-blue-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={() => window.scrollTo(0, 0)}>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all duration-500 group-hover:scale-105">
                  <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-l from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  البارع
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 -mt-1 font-medium">
                  محمود الديب
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink href="#features" onClick={() => scrollToSection('features')}>المميزات</NavLink>
              <NavLink href="#grades" onClick={() => scrollToSection('grades')}>المراحل</NavLink>
              <NavLink href="#stats" onClick={() => scrollToSection('stats')}>إحصائيات</NavLink>
              <NavLink href="#contact" onClick={() => scrollToSection('contact')}>تواصل معنا</NavLink>

              <div className="w-px h-6 bg-slate-200 mx-2" />

              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold text-sm"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 font-semibold text-sm hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2 max-w-7xl mx-auto">
                <MobileNavLink onClick={() => scrollToSection('features')}>المميزات</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('grades')}>المراحل الدراسية</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('stats')}>إحصائيات</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('contact')}>تواصل معنا</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('contact')}>الدعم الفني</MobileNavLink>

                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <FloatingParticles />

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-right order-2 lg:order-1"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-6">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                منصة البارع التعليمية
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
              >
                <span className="bg-gradient-to-l from-blue-700 via-blue-800 to-slate-900 bg-clip-text text-transparent">
                  البارع
                </span>
                <br />
                <span className="text-slate-700">محمود الديب</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع. انضم لأكثر من ٥٠٠٠ طالب حققوا التفوق معنا.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">ابدأ رحلتك الآن</span>
                  <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-700 to-blue-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>

                <button
                  onClick={() => scrollToSection('features')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-300"
                >
                  <PlayCircle className="w-5 h-5" />
                  تعرف أكثر
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>شرح مبسط</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>متابعة مستمرة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>امتحانات دورية</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-200/50 to-amber-200/30 rounded-[3rem] blur-2xl scale-95" />

                <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-[2.5rem] p-3 shadow-2xl shadow-blue-900/10 border border-white/50">
                  <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-100 to-blue-100 aspect-[4/5]">
                    <img
                      src="https://placehold.co/600x800/e2e8f0/1e40af?text=محمود+الديب"
                      alt="الأستاذ محمود الديب"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="eager"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب"; }}
                    />

                    {/* Floating badge */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">خبرة أكثر من</p>
                          <p className="text-sm font-bold text-slate-800">١٥ عاماً</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Top badge */}
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                      className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-bold">+٥٠٠٠ طالب</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl" />
                <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-400 font-medium">اسحب للأسفل</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Strip */}
      <MarqueeStrip />

      {/* Features Section */}
      <section id="features" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              لماذا نحن؟
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              لماذا منصة <span className="text-blue-700">البارع</span>؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 text-lg max-w-2xl mx-auto">
              نقدم لك تجربة تعليمية فريدة تجمع بين الأصالة والحداثة
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title="شرح مفصل"
              desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط يناسب جميع المستويات"
              color="blue"
              delay={0}
            />
            <FeatureCard
              icon={<Users className="w-7 h-7" />}
              title="متابعة مستمرة"
              desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب وتحقيق أهدافه"
              color="amber"
              delay={0.1}
            />
            <FeatureCard
              icon={<CheckCircle className="w-7 h-7" />}
              title="امتحانات دورية"
              desc="امتحانات على كل حصة لتقييم استيعاب الطالب بشكل فوري"
              color="emerald"
              delay={0.2}
            />
            <FeatureCard
              icon={<Award className="w-7 h-7" />}
              title="امتحان شامل"
              desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين وتحفيز مستمر"
              color="rose"
              delay={0.3}
            />
            <FeatureCard
              icon={<Headset className="w-7 h-7" />}
              title="دعم فني"
              desc="فريق دعم فني متخصص جاهز لمساعدتك على مدار الساعة"
              color="violet"
              delay={0.4}
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="تتبع التقدم"
              desc="لوحة تحكم ذكية لتتبع تقدمك الدراسي وتحديد نقاط القوة والضعف"
              color="cyan"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Grades Section */}
      <section id="grades" className="relative py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-4">
              <GraduationCap className="w-4 h-4" />
              المراحل الدراسية
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              اختر صفك الدراسي
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 text-lg">
              ابدأ رحلتك التعليمية الآن مع المحتوى المناسب لمرحلتك
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <GradeCard
              grade={1}
              title="الصف الأول الثانوي"
              desc="البداية القوية نحو التفوق"
              img="https://placehold.co/400x300/f1f5f9/1e40af?text=أولى+ثانوي"
              color="from-blue-500 to-blue-700"
            />
            <GradeCard
              grade={2}
              title="الصف الثاني الثانوي"
              desc="الاستمرار في البناء والتقوية"
              img="https://placehold.co/400x300/fef3c7/b45309?text=ثانية+ثانوي"
              color="from-amber-500 to-amber-700"
            />
            <GradeCard
              grade={3}
              title="الصف الثالث الثانوي"
              desc="المرحلة الأخيرة نحو النجاح"
              img="https://placehold.co/400x300/f0fdf4/15803d?text=ثالثة+ثانوي"
              color="from-emerald-500 to-emerald-700"
            />
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-white/5 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
            className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] border border-white/5 rounded-full"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-amber-300 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              رسالة البارع
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              البارع <span className="text-amber-400">محمود الديب</span>
            </motion.h2>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-3 gap-6 mb-12">
              <MotivationCard text="التفوق ليس هدفاً بعيداً، بل هو طريق تسلكه خطوة بخطوة" />
              <MotivationCard text="كل طالب قادر على الإبداع، والمعلم الجيد هو من يكتشف هذه القدرة" />
              <MotivationCard text="اللغة العربية ليست مجرد مادة، بل هي هويتنا وتاريخنا" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-500 hover:-translate-y-1"
              >
                ابدأ رحلتك نحو التفوق الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-24 md:py-32 bg-gradient-to-b from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Stats Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-semibold mb-4">
                <TrendingUp className="w-4 h-4" />
                إنجازاتنا
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                البارع <span className="text-blue-700">محمود الديب</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-slate-600 text-lg mb-10 leading-relaxed">
                دي مش مجرد أرقام، دي أدلة إنك في المكان الصح. انضم لآلاف الطلاب اللي حققوا حلمهم معانا.
              </motion.p>

              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-6">
                <StatCard
                  icon={<BookOpen className="w-6 h-6 text-blue-600" />}
                  value={1200}
                  suffix="+"
                  label="حصة تعليمية"
                  color="blue"
                />
                <StatCard
                  icon={<Users className="w-6 h-6 text-amber-600" />}
                  value={5000}
                  suffix="+"
                  label="طالب فخور"
                  color="amber"
                />
                <StatCard
                  icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
                  value={98}
                  suffix="%"
                  label="نسبة النجاح"
                  color="emerald"
                />
                <StatCard
                  icon={<Star className="w-6 h-6 text-rose-600" />}
                  value={4.9}
                  suffix=""
                  label="تقييم الطلاب"
                  color="rose"
                />
              </motion.div>
            </motion.div>

            {/* Stats Image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 to-amber-200/30 rounded-[2.5rem] blur-2xl scale-95" />
                <div className="relative bg-white rounded-[2rem] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100">
                  <div className="overflow-hidden rounded-[1.5rem] aspect-square bg-gradient-to-br from-slate-100 to-blue-50">
                    <img
                      src="https://placehold.co/600x600/e2e8f0/1e40af?text=إنجازات+البارع"
                      alt="إنجازات البارع"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=إنجازات+البارع"; }}
                    />
                  </div>
                </div>

                {/* Floating stat cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -top-4 -left-4 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">+٣٠٠٪</p>
                      <p className="text-xs text-slate-500">تحسن في الأداء</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -right-4 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">١٥+</p>
                      <p className="text-xs text-slate-500">سنة خبرة</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-6">
              جاهز للتفوق في اللغة العربية؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              انضم لمنصة البارع الآن وابدأ رحلتك نحو التفوق مع الأستاذ محمود الديب
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                سجل الآن مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/201006984012"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
              >
                <PhoneCall className="w-5 h-5" />
                تواصل معنا
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">البارع</span>
                  <span className="text-xs text-slate-400">محمود الديب</span>
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed text-sm">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
              <ul className="space-y-3">
                <FooterLink href="#features" onClick={() => scrollToSection('features')}>المميزات</FooterLink>
                <FooterLink href="#grades" onClick={() => scrollToSection('grades')}>المراحل الدراسية</FooterLink>
                <FooterLink href="#stats" onClick={() => scrollToSection('stats')}>إحصائيات</FooterLink>
                <FooterLink href="/login">تسجيل الدخول</FooterLink>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">الدعم</h3>
              <ul className="space-y-3">
                <FooterLink href="#contact" onClick={() => scrollToSection('contact')}>الدعم الفني</FooterLink>
                <FooterLink href="#contact" onClick={() => scrollToSection('contact')}>تواصل معنا</FooterLink>
                <FooterLink href="/register">إنشاء حساب</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">تواصل مباشر</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://wa.me/201006984012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <span className="text-sm">واتساب: 01006984012</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@albarea.com"
                    className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-sm">support@albarea.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm mb-2">
              جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}
            </p>
            <p className="text-slate-600 text-xs">
              تم الإنشاء بكل الحب لطلاب الثانوية العامة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function NavLink({ href, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300 group"
    >
      {children}
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
    </button>
  );
}

function MobileNavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-right px-4 py-3 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-medium transition-all"
    >
      {children}
    </button>
  );
}

function FeatureCard({ icon, title, desc, color, delay }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20 hover:shadow-blue-500/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20 hover:shadow-amber-500/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/30',
    rose: 'from-rose-500 to-rose-600 shadow-rose-500/20 hover:shadow-rose-500/30',
    violet: 'from-violet-500 to-violet-600 shadow-violet-500/20 hover:shadow-violet-500/30',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20 hover:shadow-cyan-500/30',
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-blue-100 transition-all duration-500"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}

function GradeCard({ grade, title, desc, img, color }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-blue-100 transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-20 group-hover:opacity-30 transition-opacity`} />
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold bg-gradient-to-l from-blue-700 to-blue-900 bg-clip-text text-transparent">
            {grade}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6">{desc}</p>
        <Link
          to={`/grade/${grade}`}
          className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:gap-3 transition-all group/link"
        >
          استكشف الآن
          <ChevronRight className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

function MotivationCard({ text }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500"
    >
      <p className="text-white/90 leading-relaxed text-sm md:text-base">{text}</p>
    </motion.div>
  );
}

function StatCard({ icon, value, suffix, label, color }) {
  const bgColors = {
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    rose: 'bg-rose-50 border-rose-100',
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`${bgColors[color]} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        <AnimatedCounter target={value} suffix={suffix} />
      </p>
      <p className="text-slate-600 text-sm font-medium">{label}</p>
    </motion.div>
  );
}

function FooterLink({ href, children, onClick }) {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li>
      <Link
        to={href}
        onClick={handleClick}
        className="text-slate-400 hover:text-white hover:pr-2 transition-all duration-300 text-sm inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
