/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronLeft, CheckCircle, GraduationCap,
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus, PlayCircle, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

// --- إعدادات الحركات (Framer Motion Variants) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
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
  const [scrolled, setScrolled] = useState(false);

  // تأثير تغيير لون الهيدر عند النزول
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-arabic overflow-hidden" dir="rtl">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 origin-right z-50"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                ب
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">البارع</h1>
                <p className="text-xs text-blue-600 font-semibold">محمود الديب</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 text-slate-600 font-medium">
                <a href="#features" className="hover:text-blue-600 transition-colors">المميزات</a>
                <a href="#grades" className="hover:text-blue-600 transition-colors">المراحل</a>
                <a href="#contact" className="hover:text-blue-600 transition-colors">تواصل معنا</a>
              </div>

              <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
                <Link to="/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold transition-colors px-4 py-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5">
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب
                </Link>
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[72px] w-full bg-white border-b border-slate-100 shadow-xl z-30 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              <Link to="/login" className="flex items-center justify-center gap-2 w-full p-3 text-blue-600 bg-blue-50 rounded-xl font-semibold">
                <LogIn className="w-5 h-5" /> تسجيل الدخول
              </Link>
              <Link to="/register" className="flex items-center justify-center gap-2 w-full p-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md">
                <UserPlus className="w-5 h-5" /> حساب جديد
              </Link>
              <div className="h-px bg-slate-100 my-2"></div>
              <a href="#features" className="p-3 text-slate-700 text-center font-medium" onClick={() => setIsMenuOpen(false)}>المميزات</a>
              <a href="#grades" className="p-3 text-slate-700 text-center font-medium" onClick={() => setIsMenuOpen(false)}>المراحل الدراسية</a>
              <a href="#contact" className="p-3 text-slate-700 text-center font-medium" onClick={() => setIsMenuOpen(false)}>الدعم الفني</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-right"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold mb-6 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                المنصة الأولى لتعلم اللغة العربية
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                البارع <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">محمود الديب</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع. نقدم لك تجربة تعليمية فريدة تجمع بين الشرح المبسط والتكنولوجيا الحديثة لضمان تفوقك.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-1">
                  ابدأ رحلتك الآن
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-sm">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  تعرف علينا
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
                <img 
                  src="https://placehold.co/800x1000/1e3a8a/ffffff?text=محمود+الديب" 
                  alt="الأستاذ محمود الديب"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">خبرة سنوات</p>
                  <p className="text-sm text-slate-500">في صناعة الأوائل</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Marquee Section (Pure CSS) */}
      <div className="bg-blue-600 py-4 overflow-hidden shadow-inner flex relative" dir="ltr">
        <div className="marquee-content flex gap-8 whitespace-nowrap text-white/90 text-lg font-medium">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              ( وما توفيقي إلا بالله )
              <Star className="w-3 h-3 text-blue-300" />
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-blue-600 font-bold tracking-wider text-sm mb-2">مميزاتنا</h2>
            <h3 className="text-4xl font-extrabold text-slate-900">لماذا منصة البارع؟</h3>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-blue-600" />}
              title="شرح مفصل"
              desc="شرح وافي لكل أجزاء المنهج بأسلوب علمي مبسط يراعي كافة المستويات."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-cyan-500" />}
              title="متابعة مستمرة"
              desc="تواصل دائم ومتابعة دقيقة مع ولي الأمر لضمان تقدم مستوى الطالب."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="w-8 h-8 text-indigo-500" />}
              title="امتحانات دورية"
              desc="اختبارات إلكترونية بعد كل حصة لتقييم مدى الاستيعاب ومعالجة نقاط الضعف."
            />
            <FeatureCard 
              icon={<GraduationCap className="w-8 h-8 text-amber-500" />}
              title="امتحان شامل"
              desc="تقييم شهري شامل مع تكريم وهدايا قيمة لأوائل الطلبة والمتفوقين."
            />
          </motion.div>
        </div>
      </section>

      {/* Grades Section */}
      <section id="grades" className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">المراحل الدراسية</h2>
            <p className="text-slate-600 text-lg">اختر صفك الدراسي وابدأ رحلة التفوق معنا الآن</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((grade) => (
              <GradeCard 
                key={grade} 
                grade={grade} 
                title={`الصف ${grade === 1 ? 'الأول' : grade === 2 ? 'الثاني' : 'الثالث'} الثانوي`} 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="py-20 relative overflow-hidden bg-blue-600 text-white">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1e3a8a/1e3a8a')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold mb-10 leading-tight"
          >
            " لا تدع حلمك ينتظر.. ابدأ من اليوم "<br/>
            <span className="text-blue-200 text-2xl mt-4 block font-medium">البارع محمود الديب</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          >
             <Link to="/register" className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-slate-50 px-10 py-4 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                ابدأ رحلتك نحو التفوق
                <ChevronLeft className="w-6 h-6" />
             </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold text-slate-900 mb-6">
                  البارع بالأرقام
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-10">
                  هذه ليست مجرد أرقام، بل هي ثقة مستمرة ورحلة طويلة من النجاح والتفوق.
                </motion.p>
                
                <div className="grid grid-cols-2 gap-6">
                  <motion.div variants={scaleIn} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="text-4xl font-extrabold text-blue-600 mb-2">+1200</div>
                    <div className="text-slate-600 font-medium">حصة تعليمية</div>
                  </motion.div>
                  <motion.div variants={scaleIn} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="text-4xl font-extrabold text-cyan-500 mb-2">+5000</div>
                    <div className="text-slate-600 font-medium">طالب متفوق</div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                className="relative hidden lg:block"
              >
                <div className="w-full aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl shadow-blue-100 max-w-md mx-auto">
                  <img 
                    src="https://placehold.co/600x600/f8fafc/1e3a8a?text=ثقة+ونجاح" 
                    alt="نجاح"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 pt-20 pb-10 text-slate-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">ب</div>
                <h3 className="text-2xl font-bold text-white">البارع</h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 inline-block">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> تسجيل الدخول</Link></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> المميزات</a></li>
                <li><a href="#grades" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> المراحل الدراسية</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 inline-block">تواصل مباشر</h4>
              <div className="space-y-4">
                <a href="https://wa.me/201006984012" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-green-400 transition-colors bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <PhoneCall className="w-5 h-5" />
                  <span dir="ltr">01006984012</span>
                </a>
                <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>الدعم الفني متاح 24/7</span>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p className="mb-2">جميع الحقوق محفوظة للأستاذ محمود الديب &copy; {new Date().getFullYear()}</p>
            <p>تم الإنشاء بكل الحب لطلاب الثانوية العامة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- المكونات الفرعية (Sub-components) ---

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function GradeCard({ grade, title }: { grade: number, title: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors z-10"></div>
        <h2 className="text-8xl font-black text-slate-200/50 absolute -left-4 -bottom-4 group-hover:scale-110 transition-transform duration-500">
          0{grade}
        </h2>
        <GraduationCap className="w-24 h-24 text-blue-200 relative z-20 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-8 text-center relative z-20 bg-white">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center w-full gap-2 bg-slate-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 py-3 rounded-xl font-bold transition-all duration-300 group-hover:shadow-md"
        >
          استكشف الآن
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}