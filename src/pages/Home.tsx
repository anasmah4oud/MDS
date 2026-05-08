/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, Star, Award, Zap, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

// ─────────────────────────────────────────────────────────────────
// Shared animation variants
// ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
};

// ─────────────────────────────────────────────────────────────────
// Loading Screen
// ─────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <motion.div
        className="loading-logo-wrap"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <img src="/logo.png" alt="Logo" className="loading-logo" />
        <div className="loading-ring" />
      </motion.div>
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        البارع محمود الديب
      </motion.p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────────────────────────
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="progress-bar" style={{ scaleX }} />;
}

// ─────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="navbar__logo-img-wrap">
            <img src="/logo.png" alt="البارع" className="navbar__logo-img" />
            <div className="navbar__logo-glow" />
          </div>
          <div>
            <h1 className="navbar__logo-title">البارع</h1>
            <p className="navbar__logo-sub">محمود الديب</p>
          </div>
        </div>

        {/* Desktop links */}
        <div className="navbar__links">
          <Link to="/contact" className="navbar__link">تواصل معنا</Link>
          <Link to="/support" className="navbar__link">الدعم الفني</Link>
          <div className="navbar__divider" />
          <Link to="/login" className="navbar__btn navbar__btn--ghost">
            <LogIn size={16} />
            تسجيل الدخول
          </Link>
          <Link to="/register" className="navbar__btn navbar__btn--primary">
            <UserPlus size={16} />
            إنشاء حساب
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="navbar__toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <AnimatePresence mode="wait">
            {isMenuOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={26} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={26} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="navbar__drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/login" className="drawer__link" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
            <Link to="/register" className="drawer__link drawer__link--accent" onClick={() => setIsMenuOpen(false)}>إنشاء حساب جديد</Link>
            <Link to="/contact" className="drawer__link" onClick={() => setIsMenuOpen(false)}>تواصل معنا</Link>
            <Link to="/support" className="drawer__link" onClick={() => setIsMenuOpen(false)}>الدعم الفني</Link>
            <Link to="/scientific-support" className="drawer__link" onClick={() => setIsMenuOpen(false)}>الدعم العلمي</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero">
      {/* Decorative blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />
      {/* Grid lines */}
      <div className="hero__grid" />

      <div className="hero__inner">
        {/* Text side */}
        <motion.div
          className="hero__text"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <motion.div className="hero__badge" variants={fadeUp} custom={0.0}>
            <Star size={14} className="hero__badge-icon" />
            المنصة التعليمية الأولى لمادة اللغة العربية
          </motion.div>

          <motion.h1 className="hero__title" variants={fadeUp} custom={0.2}>
            البارع <br />
            <span className="hero__title-accent">محمود الديب</span>
          </motion.h1>

          <motion.h2 className="hero__subtitle" variants={fadeUp} custom={0.35}>
            أستاذ اللغة العربية للثانوية العامة
            <br />ومؤلف سلسلة البارع
          </motion.h2>

          <motion.div className="hero__cta-row" variants={fadeUp} custom={0.5}>
            <Link to="/login" className="hero__cta-btn hero__cta-btn--primary">
              ابدأ رحلتك الآن
              <ChevronRight size={20} className="hero__cta-icon" />
            </Link>
            <Link to="/register" className="hero__cta-btn hero__cta-btn--ghost">
              إنشاء حساب مجاني
            </Link>
          </motion.div>

          {/* Quick stats */}
          <motion.div className="hero__quick-stats" variants={fadeUp} custom={0.65}>
            <div className="hero__stat">
              <span className="hero__stat-num">+5000</span>
              <span className="hero__stat-label">طالب</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">+1200</span>
              <span className="hero__stat-label">حصة</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">3</span>
              <span className="hero__stat-label">مراحل</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Image side */}
        <motion.div
          className="hero__image-wrap"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__image-glow" />
          <div className="hero__image-ring hero__image-ring--1" />
          <div className="hero__image-ring hero__image-ring--2" />
          <img
            src="/master.png"
            alt="أ / محمود الديب"
            className="hero__image"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب"; }}
          />
          {/* floating card */}
          <motion.div
            className="hero__float-card hero__float-card--top"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Award size={18} className="hero__float-icon" />
            <span>أفضل أستاذ لغة عربية</span>
          </motion.div>
          <motion.div
            className="hero__float-card hero__float-card--bottom"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TrendingUp size={18} className="hero__float-icon" />
            <span>نتائج مضمونة</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Marquee / Ticker
// ─────────────────────────────────────────────────────────────────
function MarqueeSection() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...Array(3)].map((_, j) =>
          Array(8).fill("( وما توفيقي إلا بالله )").map((text, i) => (
            <span key={`${j}-${i}`} className="marquee-item">{text}</span>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Features Section
// ─────────────────────────────────────────────────────────────────
const FEATURES_LEFT = [
  { icon: <BookOpen />, title: "شرح مفصل", desc: "شرح مفصل لكل جزء من المنهج بأسلوب مبسط وممتع يجعل الفهم سهلاً" },
  { icon: <Users />, title: "متابعة مستمرة", desc: "متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب وتحسين أدائه" },
];
const FEATURES_RIGHT = [
  { icon: <CheckCircle />, title: "امتحانات دورية", desc: "امتحانات على كل حصة لتقييم استيعاب الطالب وتعزيز المعلومات" },
  { icon: <GraduationCap />, title: "امتحان شامل", desc: "امتحان شامل كل شهر مع هدايا قيمة للمتفوقين والمتميزين" },
];

function FeatureItem({ icon, title, desc, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; delay?: number }) {
  return (
    <motion.div
      className="feature-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="feature-item__icon-wrap">
        {icon}
      </div>
      <div>
        <h4 className="feature-item__title">{title}</h4>
        <p className="feature-item__desc">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <section className="features">
      <div className="section-header">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          مميزات المنصة
        </motion.span>
        <motion.h3
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          لماذا منصة البارع؟
        </motion.h3>
        <motion.div
          className="section-line"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>

      <div className="features__grid">
        {/* Left column */}
        <div className="features__col features__col--left">
          {FEATURES_LEFT.map((f, i) => (
            <FeatureItem key={f.title} {...f} delay={i * 0.15} />
          ))}
        </div>

        {/* Center logo */}
        <div className="features__center">
          <motion.div
            className="features__orbit"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="features__orbit features__orbit--2"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <div className="features__logo-wrap">
            <img src="/logo.png" alt="Logo" className="features__logo" />
            <div className="features__logo-glow" />
          </div>
        </div>

        {/* Right column */}
        <div className="features__col features__col--right">
          {FEATURES_RIGHT.map((f, i) => (
            <FeatureItem key={f.title} {...f} delay={i * 0.15 + 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Grades Section
// ─────────────────────────────────────────────────────────────────
function GradeCard({ grade, title, img, delay = 0 }: { grade: number; title: string; img: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/login" className="grade-card">
        <div className="grade-card__image-wrap">
          <img
            src={img}
            alt={title}
            className="grade-card__image"
            onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400?text=الصف+${grade}`; }}
          />
          <div className="grade-card__overlay" />
          <div className="grade-card__number">0{grade}</div>
        </div>
        <div className="grade-card__body">
          <h4 className="grade-card__title">{title}</h4>
          <div className="grade-card__action">
            <span>استكشف الآن</span>
            <ChevronRight size={18} className="grade-card__arrow" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function GradesSection() {
  return (
    <section className="grades">
      <div className="section-header">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          اختر صفك
        </motion.span>
        <motion.h3
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          المراحل الدراسية
        </motion.h3>
        <motion.p
          className="section-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1}
        >
          اختر صفك الدراسي وابدأ رحلة التفوق الآن
        </motion.p>
      </div>

      <div className="grades__grid">
        <GradeCard grade={1} title="الصف الأول الثانوي" img="/grade1.png" delay={0} />
        <GradeCard grade={2} title="الصف الثاني الثانوي" img="/grade2.png" delay={0.1} />
        <GradeCard grade={3} title="الصف الثالث الثانوي" img="/grade3.png" delay={0.2} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Motivation / CTA Section
// ─────────────────────────────────────────────────────────────────
function MotivationCard({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      className="motivation-card"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: -6, transition: { duration: 0.2 } }}
    >
      <div className="motivation-card__dot" />
      <span>{text}</span>
    </motion.div>
  );
}

const MOTIVATION_ITEMS = [
  "ابني أساسك صح في اللغة العربية",
  "احلم بـ 80/80 واحنا هنساعدك",
  "التفوق مش مستحيل مع البارع",
  "اللغة العربية متعة مش بس مادة",
];

function MotivationSection() {
  return (
    <section className="motivation">
      {/* Decorative */}
      <div className="motivation__bg-pattern" />
      <div className="motivation__blob motivation__blob--1" />
      <div className="motivation__blob motivation__blob--2" />

      <div className="motivation__inner">
        <motion.div
          className="motivation__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="motivation__logo-wrap">
            <img src="/logo.png" alt="Logo" className="motivation__logo" />
            <div className="motivation__logo-ring" />
          </div>
          <h3 className="motivation__title">البارع محمود الديب</h3>
          <p className="motivation__subtitle">رحلتك للتفوق تبدأ هنا</p>
        </motion.div>

        <div className="motivation__cards">
          {MOTIVATION_ITEMS.map((text, i) => (
            <MotivationCard key={i} text={text} delay={i * 0.1} />
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          <Link to="/login" className="motivation__cta">
            ابدأ رحلتك نحو التفوق الآن
            <Zap size={20} className="motivation__cta-icon" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Stats Section
// ─────────────────────────────────────────────────────────────────
function StatCard({ num, label, icon, delay = 0 }: { num: string; label: string; icon: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__num">{num}</div>
      <div className="stat-card__label">{label}</div>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="stats">
      <div className="stats__inner">
        {/* Text */}
        <motion.div
          className="stats__text"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-badge">إنجازاتنا</span>
          <h3 className="stats__title">البارع محمود الديب</h3>
          <p className="stats__desc">دي مش مجرد أرقام .. دي أدلة إنك في المكان الصح</p>

          <div className="stats__cards-grid">
            <StatCard num="+1200" label="حصة تعليمية" icon={<BookOpen size={22} />} delay={0.1} />
            <StatCard num="+5000" label="طالب فخور" icon={<Users size={22} />} delay={0.2} />
            <StatCard num="3" label="مراحل دراسية" icon={<GraduationCap size={22} />} delay={0.3} />
            <StatCard num="100%" label="التزام بالجودة" icon={<Award size={22} />} delay={0.4} />
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="stats__image-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="stats__image-bg" />
          <img
            src="/master_full.png"
            alt="محمود الديب"
            className="stats__image"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب"; }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo-row">
              <img src="/logo.png" alt="البارع" className="footer__logo" />
              <h4 className="footer__logo-name">البارع</h4>
            </div>
            <p className="footer__brand-desc">
              المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
            </p>
          </div>

          {/* Links */}
          <div className="footer__col">
            <h5 className="footer__col-title">روابط سريعة</h5>
            <div className="footer__links">
              <Link to="/support" className="footer__link">الدعم الفني</Link>
              <Link to="/contact" className="footer__link">تواصل معنا</Link>
              <Link to="/login" className="footer__link">تسجيل الدخول</Link>
              <Link to="/register" className="footer__link">إنشاء حساب</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h5 className="footer__col-title">تواصل مباشر</h5>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <PhoneCall size={16} />
                <span>01006984012</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}</p>
          <p className="footer__tagline">تم الإنشاء بكل الحب لطلاب الثانوية العامة 💙</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      if (isAdmin) {
        navigate('/anas/md/200/9', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, isAdmin, navigate, loading]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="home" dir="rtl">
      <ProgressBar />
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <GradesSection />
      <MotivationSection />
      <StatsSection />
      <Footer />
    </div>
  );
}