/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, CheckCircle, GraduationCap, 
  Users, BookOpen, Headset, MessageSquare, PhoneCall,
  Globe, LayoutDashboard, LogIn, UserPlus
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

  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user && profile) {
      if (isAdmin) {
        navigate('/anas/md/200/9');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir="rtl">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[100] origin-right"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <img src="/logo.png" alt="البارع" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">البارع</h1>
                <p className="text-xs md:text-sm font-medium text-blue-600">محمود الديب</p>
              </div>
            </div>

            {/* Desktop Menu */}
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

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-right"
          >
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.2]">
              البارع <span className="text-blue-600">محمود الديب</span>
            </h1>
            <h2 className="text-xl md:text-3xl font-bold text-slate-600 mb-6 md:mb-8">
              أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
            </h2>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 md:gap-3 bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105"
            >
              ابدأ رحلتك الآن
              <ChevronRight size={24} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-blue-200 rounded-full blur-[100px] opacity-30 animate-pulse" />
            <img 
              src="/master.png" 
              alt="أ / محمود الديب" 
              className="relative w-full max-w-md mx-auto drop-shadow-2xl z-10" 
              onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Marquee Section - Fixed */}
      <div className="fixed top-16 md:top-20 left-0 right-0 bg-blue-600 py-3 overflow-hidden rotate-[-2deg] scale-[1.05] z-[90] border-y-2 border-white">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] gap-12">
          {Array(10).fill("( وما توفيقي إلا بالله )").map((text, i) => (
            <span key={i} className="text-white text-xl md:text-2xl font-bold tracking-widest">{text}</span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">لماذا منصة البارع؟</h3>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative items-center">
            {/* Center Logo */}
            <div className="hidden md:flex justify-center items-center relative z-10 order-2">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border-4 border-dashed border-blue-200 rounded-full flex items-center justify-center p-8 bg-slate-50"
              >
                <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full drop-shadow-lg" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-blue-100 text-9xl -z-10 opacity-20">©</div>
            </div>

            {/* Left Features */}
            <div className="space-y-12 md:order-1">
              <FeatureItem 
                icon={<BookOpen className="text-blue-600" />}
                title="شرح مفصل"
                desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط"
              />
              <FeatureItem 
                icon={<Users className="text-blue-600" />}
                title="متابعة مستمرة"
                desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب"
              />
            </div>

            {/* Right Features */}
            <div className="space-y-12 md:order-3">
              <FeatureItem 
                icon={<CheckCircle className="text-blue-600" />}
                title="امتحانات دورية"
                desc="امتحانات على كل حصة لتقييم استيعاب الطالب"
              />
              <FeatureItem 
                icon={<GraduationCap className="text-blue-600" />}
                title="امتحان شامل"
                desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grades Section */}
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

      {/* Motivation Section */}
      <section className="py-32 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 rounded-full mx-auto mb-8 border-4 border-white/20" />
          <h3 className="text-5xl font-black mb-12 italic tracking-tight">البارع محمود الديب</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <MotivationCard text="ابني أساسك صح في اللغة العربية" />
            <MotivationCard text="احلم بـ 80/80 واحنا هنساعدك" />
            <MotivationCard text="التفوق مش مستحيل مع البارع" />
            <MotivationCard text="اللغة العربية متعة مش بس مادة" />
          </div>

          <Link 
            to="/login"
            className="inline-block bg-white text-blue-900 px-12 py-5 rounded-full text-2xl font-black hover:bg-blue-50 transition-transform hover:scale-110 shadow-2xl"
          >
            ابدأ رحلتك نحو التفوق الآن
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">البارع محمود الديب</h3>
              <p className="text-2xl font-bold text-blue-600 mb-10 leading-relaxed">دي مش مجرد أرقام دي أدلة أنك في المكان الصح</p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-3xl border-b-4 border-blue-600">
                  <div className="text-4xl font-black text-slate-900 mb-2">+ 1200</div>
                  <div className="text-slate-600 font-bold">حصة تعليمية</div>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border-b-4 border-blue-600">
                  <div className="text-4xl font-black text-slate-900 mb-2">+ 5000</div>
                  <div className="text-slate-600 font-bold">طالب فخور</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="w-full aspect-square bg-blue-600 rounded-[60px] rotate-6 absolute inset-0 -z-10" />
              <img 
                src="/master_full.png" 
                alt="Statistics" 
                className="w-full h-auto rounded-[60px] shadow-2xl" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب" }}
              />
            </div>
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
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
              </p>
            </div>

            <div className="text-center">
              <h5 className="text-xl font-bold mb-8">روابط سريعة</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <Link to="/support" className="hover:text-blue-400 transition-colors">الدعم الفني</Link>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">تواصل معنا</Link>
                <Link to="/login" className="hover:text-blue-400 transition-colors">تسجيل الدخول</Link>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-xl font-bold mb-8">تواصل مباشر</h5>
              <div className="flex flex-col gap-4 text-slate-400">
                <p>واتساب: 01023958772</p>
                <p>البريد: support@mahmoud-eldeeb.com</p>
              </div>
            </div>
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

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center group transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-100"
    >
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function GradeCard({ grade, title, img }: { grade: number, title: string, img: string }) {
  return (
    <Link to="/login" className="group">
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/50"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-200">
          <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 right-6 text-white">
            <span className="bg-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-fit">المرحلة الثانوية</span>
            <h4 className="text-2xl font-black">{title}</h4>
          </div>
        </div>
        <div className="p-6 flex justify-between items-center group-hover:bg-blue-600 transition-colors">
          <span className="text-slate-900 font-bold group-hover:text-white">تفاصيل الصف</span>
          <ChevronRight className="text-blue-600 group-hover:text-white group-hover:translate-x-[-4px] transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}

function MotivationCard({ text }: { text: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: -5 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-xl font-bold flex items-center gap-4 transition-colors hover:bg-white/10"
    >
      <CheckCircle className="text-blue-400 shrink-0" />
      <span>{text}</span>
    </motion.div>
  );
}
