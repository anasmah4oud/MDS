/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  GraduationCap,
  Users,
  BookOpen,
  Headset,
  MessageSquare,
  PhoneCall,
  LogIn,
  UserPlus,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  ArrowLeft,
  PlayCircle,
  Hexagon,
  Circle,
  Triangle,
  Square,
  Zap,
  Target,
  BookMarked,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

/* ═══════════════════════════════════════════
   TYPES & INTERFACES
   ═══════════════════════════════════════════ */

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: FeatureColor;
  delay: number;
}

interface GradeCardProps {
  grade: number;
  title: string;
  desc: string;
  img: string;
  color: string;
}

interface MotivationCardProps {
  text: string;
  index: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: StatColor;
}

interface NavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
}

interface MobileNavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

type FeatureColor = 'blue' | 'amber' | 'emerald' | 'rose' | 'violet' | 'cyan';
type StatColor = 'blue' | 'amber' | 'emerald' | 'rose';

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -70 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easing },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 70 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easing },
  },
};

/* ═══════════════════════════════════════════
   DECORATIVE SVG SHAPES COMPONENT
   ═══════════════════════════════════════════ */

const DecorativeShapes: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="decorative-shapes" aria-hidden="true">
      {/* Floating hexagons */}
      <motion.div
        className="shape shape-hexagon shape-1"
        animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      >
        <Hexagon className="w-full h-full text-blue-200/40" strokeWidth={1} />
      </motion.div>

      <motion.div
        className="shape shape-hexagon shape-2"
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 1 }}
      >
        <Hexagon className="w-full h-full text-amber-200/30" strokeWidth={1} />
      </motion.div>

      {/* Floating circles */}
      <motion.div
        className="shape shape-circle shape-3"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 2 }}
      >
        <Circle className="w-full h-full text-blue-300/20" strokeWidth={1} />
      </motion.div>

      <motion.div
        className="shape shape-circle shape-4"
        animate={{ y: [0, 18, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 0.5 }}
      >
        <Circle className="w-full h-full text-emerald-200/25" strokeWidth={1} />
      </motion.div>

      {/* Floating squares */}
      <motion.div
        className="shape shape-square shape-5"
        animate={{ rotate: [0, 45, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      >
        <Square className="w-full h-full text-rose-200/20" strokeWidth={1} />
      </motion.div>

      {/* Dotted pattern */}
      <div className="shape-dots" />
      <div className="shape-dots-2" />

      {/* Gradient orbs */}
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />
    </div>
  );
};

/* ═══════════════════════════════════════════
   PARTICLES CANVAS
   ═══════════════════════════════════════════ */

const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 768 ? 12 : 25;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 0.25 + 0.08,
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.35 + 0.08,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
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
};

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════ */

const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({
  target,
  suffix = '',
}) => {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 2200;
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

  const displayValue = Number.isInteger(target)
    ? count.toLocaleString('ar-EG')
    : count.toFixed(1);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
};

/* ═══════════════════════════════════════════
   MARQUEE STRIP
   ═══════════════════════════════════════════ */

const MarqueeStrip: React.FC = () => {
  const items = Array(14).fill('وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ');
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="marquee-item">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
            {text}
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════ */

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) navigate('/anas/md/200/9', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, profile, isAdmin, navigate, loading]);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        setIsMenuOpen(false);
      }
    },
    [prefersReducedMotion]
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="loading-spinner"
        />
      </div>
    );
  }

  return (
    <div className="home-page" dir="rtl">
      {/* Progress Bar */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: easing }}
        className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
      >
        <div className="navbar-container">
          <div className="navbar-inner">
            {/* Logo */}
            <Link to="/" className="logo-link" onClick={() => window.scrollTo(0, 0)}>
              <div className="logo-icon-wrapper">
                <div className="logo-icon">
                  <GraduationCap className="logo-cap" />
                </div>
                <div className="logo-pulse" />
              </div>
              <div className="logo-text">
                <span className="logo-brand">البارع</span>
                <span className="logo-sub">محمود الديب</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="desktop-menu">
              <NavLink onClick={() => scrollToSection('features')}>المميزات</NavLink>
              <NavLink onClick={() => scrollToSection('grades')}>المراحل</NavLink>
              <NavLink onClick={() => scrollToSection('stats')}>إحصائيات</NavLink>
              <NavLink onClick={() => scrollToSection('contact')}>تواصل معنا</NavLink>

              <div className="menu-divider" />

              <Link to="/login" className="btn-login">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Link>
              <Link to="/register" className="btn-register">
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
              transition={{ duration: 0.4, ease: easing }}
              className="mobile-menu"
            >
              <div className="mobile-menu-inner">
                <MobileNavLink onClick={() => scrollToSection('features')}>
                  المميزات
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('grades')}>
                  المراحل الدراسية
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('stats')}>
                  إحصائيات
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('contact')}>
                  تواصل معنا
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('contact')}>
                  الدعم الفني
                </MobileNavLink>

                <div className="mobile-actions">
                  <Link
                    to="/login"
                    className="mobile-btn-login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-btn-register"
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

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-section">
        <FloatingParticles />
        <DecorativeShapes />

        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
          <div className="hero-radial" />
        </div>

        <div className="hero-content">
          <div className="hero-grid-layout">
            {/* Text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="hero-text"
            >
              <motion.div variants={fadeInUp} className="hero-badge">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                منصة البارع التعليمية
              </motion.div>

              <motion.h1 variants={fadeInUp} className="hero-title">
                <span className="hero-title-main">البارع</span>
                <br />
                <span className="hero-title-sub">محمود الديب</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="hero-desc">
                أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع. انضم لأكثر من
                ٥٠٠٠ طالب حققوا التفوق معنا.
              </motion.p>

              <motion.div variants={fadeInUp} className="hero-buttons">
                <Link to="/register" className="btn-primary-hero">
                  <span>ابدأ رحلتك الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => scrollToSection('features')}
                  className="btn-secondary-hero"
                >
                  <PlayCircle className="w-5 h-5" />
                  تعرف أكثر
                </button>
              </motion.div>

              <motion.div variants={fadeInUp} className="hero-trust">
                <div className="trust-item">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>شرح مبسط</span>
                </div>
                <div className="trust-item">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>متابعة مستمرة</span>
                </div>
                <div className="trust-item">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>امتحانات دورية</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: easing, delay: 0.3 }}
              className="hero-image-wrapper"
            >
              <div className="hero-image-glow" />

              <div className="hero-image-card">
                <div className="hero-image-inner">
                  <img
                    src="https://placehold.co/600x800/e2e8f0/1e40af?text=محمود+الديب"
                    alt="الأستاذ محمود الديب"
                    className="hero-img"
                    loading="eager"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://placehold.co/600x800?text=محمود+الديب';
                    }}
                  />

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="hero-float-badge hero-float-badge-1"
                  >
                    <div className="float-badge-icon">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="float-badge-label">خبرة أكثر من</p>
                      <p className="float-badge-value">١٥ عاماً</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4.5,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                    className="hero-float-badge hero-float-badge-2"
                  >
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">+٥٠٠٠ طالب</span>
                  </motion.div>
                </div>
              </div>

              <div className="hero-deco hero-deco-1" />
              <div className="hero-deco hero-deco-2" />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="scroll-indicator"
        >
          <span>اسحب للأسفل</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="scroll-mouse"
          >
            <div className="scroll-dot" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <MarqueeStrip />

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="features-section">
        <div className="features-bg" />

        <div className="section-container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="section-header"
          >
            <motion.div variants={fadeInUp} className="section-badge badge-amber">
              <Sparkles className="w-4 h-4" />
              لماذا نحن؟
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title">
              لماذا منصة <span className="text-blue-600">البارع</span>؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle">
              نقدم لك تجربة تعليمية فريدة تجمع بين الأصالة والحداثة
            </motion.p>
          </motion.div>

          <div className="features-grid">
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

      {/* ═══ GRADES SECTION ═══ */}
      <section id="grades" className="grades-section">
        <div className="section-container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="section-header"
          >
            <motion.div variants={fadeInUp} className="section-badge badge-blue">
              <GraduationCap className="w-4 h-4" />
              المراحل الدراسية
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title">
              اختر صفك الدراسي
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle">
              ابدأ رحلتك التعليمية الآن مع المحتوى المناسب لمرحلتك
            </motion.p>
          </motion.div>

          <div className="grades-grid">
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

      {/* ═══ MOTIVATION SECTION ═══ */}
      <section className="motivation-section">
        <div className="motivation-bg">
          <div className="motivation-orb motivation-orb-1" />
          <div className="motivation-orb motivation-orb-2" />
          <div className="motivation-orb motivation-orb-3" />
        </div>

        <div className="section-container motivation-content">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="section-badge badge-gold">
              <Crown className="w-4 h-4" />
              رسالة البارع
            </motion.div>

            <motion.h2 variants={fadeInUp} className="motivation-title">
              البارع <span className="text-amber-400">محمود الديب</span>
            </motion.h2>

            <motion.div variants={staggerContainer} className="motivation-grid">
              <MotivationCard
                text="التفوق ليس هدفاً بعيداً، بل هو طريق تسلكه خطوة بخطوة"
                index={0}
              />
              <MotivationCard
                text="كل طالب قادر على الإبداع، والمعلم الجيد هو من يكتشف هذه القدرة"
                index={1}
              />
              <MotivationCard
                text="اللغة العربية ليست مجرد مادة، بل هي هويتنا وتاريخنا"
                index={2}
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="motivation-cta">
              <Link to="/register" className="btn-gold">
                ابدأ رحلتك نحو التفوق الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section id="stats" className="stats-section">
        <div className="section-container">
          <div className="stats-grid-layout">
            {/* Stats Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div variants={fadeInUp} className="section-badge badge-emerald">
                <TrendingUp className="w-4 h-4" />
                إنجازاتنا
              </motion.div>

              <motion.h2 variants={fadeInUp} className="section-title">
                البارع <span className="text-blue-600">محمود الديب</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="stats-desc">
                دي مش مجرد أرقام، دي أدلة إنك في المكان الصح. انضم لآلاف الطلاب اللي
                حققوا حلمهم معانا.
              </motion.p>

              <motion.div variants={staggerContainer} className="stats-cards-grid">
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
                  icon={<Target className="w-6 h-6 text-emerald-600" />}
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
              transition={{ duration: 0.9, ease: easing }}
              className="stats-image-wrapper"
            >
              <div className="stats-image-glow" />
              <div className="stats-image-card">
                <div className="stats-image-inner">
                  <img
                    src="https://placehold.co/600x600/e2e8f0/1e40af?text=إنجازات+البارع"
                    alt="إنجازات البارع"
                    className="stats-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://placehold.co/600x600?text=إنجازات+البارع';
                    }}
                  />
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="stats-float-badge stats-float-1"
              >
                <div className="stats-float-icon bg-blue-100">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="stats-float-value">+٣٠٠٪</p>
                  <p className="stats-float-label">تحسن في الأداء</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="stats-float-badge stats-float-2"
              >
                <div className="stats-float-icon bg-amber-100">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="stats-float-value">١٥+</p>
                  <p className="stats-float-label">سنة خبرة</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-pattern" />

        <div className="section-container cta-content">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeInUp} className="cta-title">
              جاهز للتفوق في اللغة العربية؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="cta-desc">
              انضم لمنصة البارع الآن وابدأ رحلتك نحو التفوق مع الأستاذ محمود الديب
            </motion.p>
            <motion.div variants={fadeInUp} className="cta-buttons">
              <Link to="/register" className="btn-cta-primary">
                سجل الآن مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/201006984012"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-secondary"
              >
                <PhoneCall className="w-5 h-5" />
                تواصل معنا
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer id="contact" className="footer">
        <div className="footer-top-shape" />

        <div className="section-container footer-content">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo-link">
                <div className="footer-logo-icon">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="footer-logo-text">
                  <span className="footer-logo-brand">البارع</span>
                  <span className="footer-logo-sub">محمود الديب</span>
                </div>
              </Link>
              <p className="footer-desc">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في
                مصر. نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h3 className="footer-col-title">روابط سريعة</h3>
              <ul className="footer-links">
                <FooterLink href="#features" onClick={() => scrollToSection('features')}>
                  المميزات
                </FooterLink>
                <FooterLink href="#grades" onClick={() => scrollToSection('grades')}>
                  المراحل الدراسية
                </FooterLink>
                <FooterLink href="#stats" onClick={() => scrollToSection('stats')}>
                  إحصائيات
                </FooterLink>
                <FooterLink href="/login">تسجيل الدخول</FooterLink>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h3 className="footer-col-title">الدعم</h3>
              <ul className="footer-links">
                <FooterLink
                  href="#contact"
                  onClick={() => scrollToSection('contact')}
                >
                  الدعم الفني
                </FooterLink>
                <FooterLink
                  href="#contact"
                  onClick={() => scrollToSection('contact')}
                >
                  تواصل معنا
                </FooterLink>
                <FooterLink href="/register">إنشاء حساب</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h3 className="footer-col-title">تواصل مباشر</h3>
              <ul className="footer-contact">
                <li>
                  <a
                    href="https://wa.me/201006984012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-link"
                  >
                    <div className="footer-contact-icon">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <span>واتساب: 01006984012</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@albarea.com" className="footer-contact-link">
                    <div className="footer-contact-icon">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span>support@albarea.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}
            </p>
            <p className="footer-tagline">
              تم الإنشاء بكل الحب لطلاب الثانوية العامة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

const NavLink: React.FC<NavLinkProps> = ({ children, onClick }) => (
  <button onClick={onClick} className="nav-link">
    {children}
    <span className="nav-link-underline" />
  </button>
);

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ children, onClick }) => (
  <button onClick={onClick} className="mobile-nav-link">
    {children}
  </button>
);

const FeatureCard: React.FC<FeatureItemProps> = ({
  icon,
  title,
  desc,
  color,
  delay,
}) => {
  const colorMap: Record<FeatureColor, string> = {
    blue: 'feature-blue',
    amber: 'feature-amber',
    emerald: 'feature-emerald',
    rose: 'feature-rose',
    violet: 'feature-violet',
    cyan: 'feature-cyan',
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ y: -10, transition: { duration: 0.35 } }}
      className={`feature-card ${colorMap[color]}`}
    >
      <div className="feature-icon-wrapper">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
      <div className="feature-glow" />
    </motion.div>
  );
};

const GradeCard: React.FC<GradeCardProps> = ({
  grade,
  title,
  desc,
  img,
  color,
}) => (
  <motion.div
    variants={scaleIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    whileHover={{ y: -12, transition: { duration: 0.35 } }}
    className="grade-card"
  >
    <div className="grade-image-wrapper">
      <div className={`grade-image-overlay ${color}`} />
      <img src={img} alt={title} className="grade-img" loading="lazy" />
      <div className="grade-badge">
        <span className="grade-badge-text">{grade}</span>
      </div>
    </div>

    <div className="grade-body">
      <h3 className="grade-title">{title}</h3>
      <p className="grade-desc">{desc}</p>
      <Link to={`/grade/${grade}`} className="grade-link">
        استكشف الآن
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
);

const MotivationCard: React.FC<MotivationCardProps> = ({ text, index }) => (
  <motion.div
    variants={fadeInUp}
    className="motivation-card"
    style={{ animationDelay: `${index * 0.15}s` }}
  >
    <div className="motivation-card-accent" />
    <p className="motivation-card-text">{text}</p>
  </motion.div>
);

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  suffix,
  label,
  color,
}) => {
  const bgMap: Record<StatColor, string> = {
    blue: 'stat-blue',
    amber: 'stat-amber',
    emerald: 'stat-emerald',
    rose: 'stat-rose',
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`stat-card ${bgMap[color]}`}
    >
      <div className="stat-icon-box">{icon}</div>
      <p className="stat-value">
        <AnimatedCounter target={value} suffix={suffix} />
      </p>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li>
      <Link to={href} onClick={handleClick} className="footer-link-item">
        {children}
      </Link>
    </li>
  );
};

export default Home;