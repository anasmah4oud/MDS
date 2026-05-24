/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, CheckCircle, 
  Lock, Calendar, BookOpen, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Star, Zap, ArrowUpRight, Layers, Trophy, Target,
  Gift, Crown, Flame, Heart, Coffee, Smile, Rocket,
  Bookmark, Share2, Download, Volume2, VolumeX,
  Maximize2, Minimize2, RotateCcw, FastForward,
  Rewind, Pause, SkipBack, SkipForward, Grid3X3,
  List, Filter, Search, SortAsc, SortDesc, MoreHorizontal,
  Bell, MessageCircle, ThumbsUp, Users, TrendingUp,
  Award, Medal, BadgeCheck, GraduationCap, Lightbulb,
  Compass, Map, Navigation, Globe, Wifi, WifiOff,
  Cloud, Sun, Moon, Sunrise, Sunset, Waves, Wind,
  Feather, Palette, Camera, Music, Mic, Video,
  Monitor, Smartphone, Tablet, Tv, Radio, Headphones,
  Disc, Circle, Square, Triangle, Hexagon, Octagon,
  Droplet, Umbrella, Thermometer, Scissors, Paperclip,
  AtSign, Hash, Percent, Plus, Minus, Divide, Equal,
  Infinity, Pi, Sigma, Delta, Alpha, Beta, Gamma
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ──────────────────────────────────────────────
// ✦ حركات Framer Motion الساحرة ✦
// ──────────────────────────────────────────────

const floatingAnimation = {
  y: [0, -12, 0],
  rotate: [0, 2, -2, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseGlow = {
  scale: [1, 1.03, 1],
  boxShadow: [
    "0 0 0 0 rgba(59, 130, 246, 0.4)",
    "0 0 0 20px rgba(59, 130, 246, 0)",
    "0 0 0 0 rgba(59, 130, 246, 0)"
  ],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const shimmer = {
  background: [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #667eea 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  ],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "linear"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.08, 
      delayChildren: 0.15,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 22,
      mass: 0.8
    } 
  }
};

const cardHover = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
  },
  hover: { 
    scale: 1.02, 
    y: -6,
    boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 20 
    }
  },
  tap: { 
    scale: 0.97,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 30 
    }
  }
};

const iconSpin = {
  rest: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -10, 10, -5, 0], 
    scale: 1.15,
    transition: { 
      duration: 0.6,
      ease: "easeInOut"
    } 
  }
};

const slideUpFade = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 25 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.2 
    } 
  }
};

const scaleInOut = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    } 
  },
  exit: { 
    scale: 0.9, 
    opacity: 0,
    transition: { 
      duration: 0.2 
    } 
  }
};

const bounceIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  })
};

// ──────────────────────────────────────────────
// ✦ مكوّن الجسيمات العائمة الساحر ✦
// ──────────────────────────────────────────────
const FloatingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 3,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.25 + 0.08,
      color: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'][Math.floor(Math.random() * 7)]
    })), 
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            opacity: p.opacity,
            filter: 'blur(1px)'
          }}
          animate={{
            y: [0, -60, 0, 40, 0],
            x: [0, 25, -15, 10, 0],
            scale: [1, 1.8, 1, 1.4, 1],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────
// ✦ مكوّن شريط التقدم الساحر ✦
// ──────────────────────────────────────────────
const MagicProgressBar = ({ progress }: { progress: number }) => (
  <motion.div 
    className="fixed top-0 left-0 right-0 h-[3px] z-[300] bg-transparent"
    initial={{ opacity: 0 }}
    animate={{ opacity: progress > 0 && progress < 100 ? 1 : 0 }}
  >
    <motion.div
      className="h-full rounded-full"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #3B82F6)',
        backgroundSize: '200% 100%'
      }}
      animate={{
        backgroundPosition: ['0% 50%', '200% 50%']
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </motion.div>
);

// ──────────────────────────────────────────────
// ✦ المكوّن الرئيسي ✦
// ──────────────────────────────────────────────
export default function PackageDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [pkg, setPkg] = useState<Package | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<number, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'overview'>('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const heroRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);

  // تتبع تقدم التمرير
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchPackageData();
  }, [id, profile]);

  const fetchPackageData = async () => {
    if (!id || !profile) return;
    try {
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', profile.id)
        .eq('package_id', id)
        .maybeSingle();

      if (subError || !subData) {
        navigate('/classes');
        return;
      }

      const { data: pkgData, error: pkgError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (pkgError) throw pkgError;
      setPkg(pkgData as Package);

      const { data: weeksList, error: weeksError } = await supabase
        .from('weeks')
        .select('*')
        .eq('package_id', id)
        .order('id', { ascending: true });
        
      if (weeksError) throw weeksError;
      setWeeks(weeksList as Week[]);

      const weekIds = weeksList.map(w => w.id);
      if (weekIds.length > 0) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .in('week_id', weekIds);
        
        if (lessonsError) throw lessonsError;

        const lMap: Record<number, Lesson[]> = {};
        lessonsData.forEach(l => {
          if (!lMap[l.week_id]) lMap[l.week_id] = [];
          lMap[l.week_id].push(l as Lesson);
        });
        setLessonsMap(lMap);
        
        if (weeksList.length > 0) {
          setExpandedWeek(weeksList[0].id);
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalLessons = useMemo(() => 
    Object.values(lessonsMap).reduce((acc, curr) => acc + (curr as Lesson[]).length, 0),
    [lessonsMap]
  );

  const getFilteredWeeks = useCallback(() => {
    if (!searchTerm && filterType === 'all') return weeks;
    return weeks.filter(week => {
      const weekLessons = lessonsMap[week.id] || [];
      const matchesSearch = !searchTerm || 
        week.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        week.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weekLessons.some(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || 
        weekLessons.some(l => l.type === filterType);
      
      return matchesSearch && (filterType === 'all' ? matchesSearch : matchesType);
    });
  }, [weeks, lessonsMap, searchTerm, filterType]);

  const lessonTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      'video_exp': { label: 'شرح تفصيلي', icon: <PlayCircle size={16} />, color: 'from-blue-500 to-cyan-500' },
      'video_hw': { label: 'حل وتطبيق', icon: <Flame size={16} />, color: 'from-orange-500 to-red-500' },
      'pdf': { label: 'ملزمة PDF', icon: <FileText size={16} />, color: 'from-emerald-500 to-teal-500' },
      'exam_mcq': { label: 'اختبار إلكتروني', icon: <Target size={16} />, color: 'from-purple-500 to-pink-500' },
      'exam_write': { label: 'واجب إلكتروني', icon: <Coffee size={16} />, color: 'from-amber-500 to-yellow-500' },
    };
    return labels[type] || { label: type, icon: <BookOpen size={16} />, color: 'from-slate-500 to-slate-600' };
  };

  // ─── شاشة التحميل الساحرة ───
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 gap-8 relative overflow-hidden">
      <FloatingParticles />
      
      {/* دوائر متحركة في الخلفية */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full border border-blue-200/20"
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full border border-indigo-200/20"
        animate={{ rotate: -360, scale: [1.1, 0.95, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full border border-purple-200/20"
        animate={{ rotate: 360, scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="relative z-10"
        animate={floatingAnimation}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[28px] blur-2xl opacity-30"
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/80">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.95, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap size={48} className="text-blue-600" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p 
          className="text-2xl md:text-3xl font-black text-slate-800 mb-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          جاري تحضير المحتوى الساحر
        </motion.p>
        <p className="text-slate-500 font-medium text-sm md:text-base flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          لحظات وتبدأ المتعة
          <Sparkles size={16} className="text-amber-500" />
        </p>
      </motion.div>
      
      {/* شريط تحميل متحرك */}
      <motion.div 
        className="relative z-10 w-64 h-2 bg-slate-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ width: '60%' }}
        />
      </motion.div>
    </div>
  );

  const filteredWeeks = getFilteredWeeks();
  const totalFilteredLessons = filteredWeeks.reduce((acc, w) => acc + (lessonsMap[w.id]?.length || 0), 0);

  // ─── المحتوى الرئيسي ───
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden relative" dir="rtl">
      <MagicProgressBar progress={scrollProgress} />
      
      {/* ═══════════════════════════════════════
          ✦ قسم الهيرو البطل الساحر ✦
          ═══════════════════════════════════════ */}
      <motion.div 
        ref={heroRef}
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-[50vh] md:min-h-[70vh] overflow-hidden"
      >
        {/* صورة الخلفية */}
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={pkg?.image_url || "https://placehold.co/1200x800/1e293b/ffffff?text=🎓"} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Package Background"
        />
        
        {/* طبقات التدرج */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-[#F8FAFC]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
        
        {/* جسيمات عائمة */}
        <FloatingParticles />
        
        {/* خطوط زخرفية */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M0,50 Q25,20 50,50 T100,50" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.3"
            animate={{ d: ["M0,50 Q25,20 50,50 T100,50", "M0,50 Q25,80 50,50 T100,50", "M0,50 Q25,20 50,50 T100,50"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path 
            d="M0,60 Q25,30 50,60 T100,60" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.2"
            animate={{ d: ["M0,60 Q25,30 50,60 T100,60", "M0,60 Q25,90 50,60 T100,60", "M0,60 Q25,30 50,60 T100,60"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>

        {/* المحتوى */}
        <div className="absolute inset-0 flex items-end p-4 md:p-12 lg:p-20 z-10">
          <div className="max-w-7xl mx-auto w-full">
            {/* زر العودة */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-xl px-5 py-2.5 rounded-full font-bold text-sm mb-6 md:mb-10 border border-white/40 shadow-lg shadow-slate-900/5 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight size={18} className="text-blue-600" />
                </motion.span>
                <span className="text-slate-700 group-hover:text-blue-700">العودة للوحة التحكم</span>
                <LayoutDashboard size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
              {/* العنوان والوصف */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 22 }}
                className="space-y-4 md:space-y-6"
              >
                {/* شارة النوع */}
                <motion.div 
                  className="flex flex-wrap items-center gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.span 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    {pkg?.type === 'offer' ? '🔥 عرض خاص' : '📚 باقة تعليمية'}
                  </motion.span>
                  {pkg?.type === 'offer' && (
                    <motion.span 
                      variants={itemVariants}
                      className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-black"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown size={12} /> لفترة محدودة
                    </motion.span>
                  )}
                </motion.div>
                
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] text-slate-900 drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                    {pkg?.name}
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed bg-white/50 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-white/60 shadow-sm inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  {pkg?.description}
                </motion.p>
              </motion.div>

              {/* بطاقة الإحصائيات */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 250, damping: 20 }}
                className="flex-shrink-0"
              >
                <div className="bg-white/75 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-slate-900/10 p-5 md:p-8 rounded-[28px] md:rounded-[36px] flex items-center gap-6 md:gap-10">
                  <motion.div 
                    className="text-center group cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-2xl md:rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Calendar size={26} />
                    </motion.div>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-1">الأسابيع</p>
                    <motion.p 
                      className="text-2xl md:text-3xl font-black text-slate-800"
                      key={weeks.length}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {weeks.length}
                    </motion.p>
                  </motion.div>
                  
                  <div className="w-px h-16 md:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  
                  <motion.div 
                    className="text-center group cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-600 rounded-2xl md:rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <PlayCircle size={26} />
                    </motion.div>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-1">المحاضرات</p>
                    <motion.p 
                      className="text-2xl md:text-3xl font-black text-slate-800"
                      key={totalLessons}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    >
                      {totalLessons}
                    </motion.p>
                  </motion.div>
                  
                  <div className="w-px h-16 md:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  
                  <motion.div 
                    className="text-center group cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-600 rounded-2xl md:rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy size={26} />
                    </motion.div>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-1">التقييم</p>
                    <div className="flex items-center gap-1 justify-center">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <motion.p 
                        className="text-2xl md:text-3xl font-black text-slate-800"
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                      >
                        4.9
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* زخرفة دائرية سفلية */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20" />
      </motion.div>

      {/* ═══════════════════════════════════════
          ✦ شريط التبويبات وأدوات البحث ✦
          ═══════════════════════════════════════ */}
      <main ref={contentRef} className="max-w-5xl mx-auto px-4 -mt-10 md:-mt-16 relative z-30">
        {/* شريط الأدوات الزجاجي */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-2 md:p-3 shadow-xl shadow-slate-200/50 border border-white/60 mb-6 md:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-3"
        >
          {/* تبويبات */}
          <div className="flex bg-slate-100/80 rounded-2xl p-1.5 flex-shrink-0">
            {[
              { id: 'content', icon: <Layers size={16} />, label: 'المحتوى التعليمي' },
              { id: 'overview', icon: <Compass size={16} />, label: 'نظرة عامة' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-700 shadow-md shadow-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
          
          {/* حقل البحث */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن درس أو أسبوع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/80 rounded-2xl py-2.5 pr-10 pl-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 border-2 border-transparent focus:border-blue-200 focus:bg-white transition-all duration-300 outline-none"
            />
            {searchTerm && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center hover:bg-red-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </motion.button>
            )}
          </div>
          
          {/* فلتر النوع */}
          <div className="flex gap-1.5 flex-shrink-0 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', icon: <Grid3X3 size={14} />, label: 'الكل' },
              { id: 'video_exp', icon: <PlayCircle size={14} />, label: 'شرح' },
              { id: 'video_hw', icon: <Flame size={14} />, label: 'تطبيق' },
              { id: 'pdf', icon: <FileText size={14} />, label: 'PDF' },
              { id: 'exam_mcq', icon: <Target size={14} />, label: 'اختبار' },
            ].map((f) => (
              <motion.button
                key={f.id}
                onClick={() => setFilterType(filterType === f.id ? 'all' : f.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  filterType === f.id 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                    : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {f.icon}
                <span className="hidden md:inline">{f.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ─── عرض المحتوى حسب التبويب النشط ─── */}
        <AnimatePresence mode="wait">
          {activeTab === 'content' ? (
            <motion.div
              key="content-tab"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-4 md:space-y-6"
            >
              {/* عنوان القسم */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-4 mb-6 md:mb-10"
              >
                <motion.div 
                  className="w-2 h-10 md:h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"
                  animate={{ height: [40, 56, 40] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900">
                    المحتوى التعليمي
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {totalFilteredLessons} درس • {filteredWeeks.length} أسبوع
                  </p>
                </div>
                {searchTerm && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold"
                  >
                    نتائج البحث عن "{searchTerm}"
                  </motion.span>
                )}
              </motion.div>

              {/* عرض رسالة إذا لم توجد نتائج */}
              {filteredWeeks.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16 md:py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300"
                >
                  <Search size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold text-lg">لا توجد نتائج تطابق بحثك</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    إعادة ضبط البحث
                  </button>
                </motion.div>
              )}

              {/* قائمة الأسابيع */}
              {filteredWeeks.map((week, index) => {
                const weekLessons = lessonsMap[week.id] || [];
                const isExpanded = expandedWeek === week.id;
                
                return (
                  <motion.div
                    key={week.id}
                    variants={itemVariants}
                    layout
                    className={`rounded-[24px] md:rounded-[32px] overflow-hidden border-2 transition-all duration-500 ${
                      isExpanded 
                        ? 'bg-white border-blue-200/60 shadow-2xl shadow-blue-500/8' 
                        : 'bg-white/70 border-slate-200/40 hover:border-blue-150 hover:bg-white hover:shadow-xl'
                    }`}
                  >
                    <motion.button
                      onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                      className="w-full flex items-center justify-between p-4 md:p-6 text-right focus:outline-none group"
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* رقم الأسبوع */}
                        <motion.div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[20px] flex items-center justify-center font-black text-lg md:text-2xl transition-all duration-500 flex-shrink-0 ${
                            isExpanded 
                              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/30' 
                              : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 group-hover:shadow-lg'
                          }`}
                          animate={isExpanded ? pulseGlow : {}}
                          layout
                        >
                          <motion.span
                            key={`num-${week.id}-${isExpanded}`}
                            initial={{ scale: 1.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {index + 1}
                          </motion.span>
                        </motion.div>
                        
                        <div className="min-w-0">
                          <h4 className={`text-base md:text-xl font-black transition-colors truncate ${
                            isExpanded ? 'text-blue-950' : 'text-slate-800'
                          }`}>
                            {week.name}
                          </h4>
                          {week.description && (
                            <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 line-clamp-1">
                              {week.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {weekLessons.length} درس
                            </span>
                            {weekLessons.some(l => l.type.startsWith('video')) && (
                              <span className="text-[10px] md:text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <PlayCircle size={10} /> فيديو
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* زر التوسيع */}
                      <motion.div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          isExpanded 
                            ? 'bg-blue-100 text-blue-600 shadow-inner' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </motion.button>

                    {/* محتوى الأسبوع المتوسع */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                            opacity: { duration: 0.25, delay: 0.05 }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 md:px-6 pb-4 md:pb-6 space-y-2 md:space-y-3 bg-gradient-to-b from-slate-50/80 to-white/40">
                            {/* خط فاصل مزخرف */}
                            <div className="flex items-center gap-3 py-2">
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-blue-200 to-transparent" />
                              <BookOpen size={14} className="text-blue-300" />
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                            </div>
                            
                            {weekLessons.length > 0 ? (
                              weekLessons.map((lesson, idx) => {
                                const typeInfo = lessonTypeLabel(lesson.type);
                                return (
                                  <motion.button
                                    key={lesson.id}
                                    custom={idx}
                                    variants={bounceIn}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={cardHover}
                                    onClick={() => {
                                      if (lesson.type.startsWith('video')) {
                                        navigate(`/video/${lesson.id}`);
                                      } else {
                                        setSelectedLesson(lesson);
                                      }
                                    }}
                                    className="w-full flex items-center justify-between p-3 md:p-5 bg-white rounded-[16px] md:rounded-2xl border border-slate-100 shadow-sm transition-all group/lesson"
                                  >
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                      {/* أيقونة النوع */}
                                      <motion.div
                                        variants={iconSpin}
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${typeInfo.color} text-white shadow-md group-hover/lesson:shadow-lg transition-shadow`}
                                      >
                                        {typeInfo.icon}
                                      </motion.div>
                                      
                                      <div className="text-right min-w-0">
                                        <p className="text-sm md:text-base font-black text-slate-800 group-hover/lesson:text-blue-700 transition-colors truncate">
                                          {lesson.name}
                                        </p>
                                        <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                                          <Clock size={11} />
                                          {typeInfo.label}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <motion.div
                                      className="w-9 h-9 md:w-10 md:h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 group-hover/lesson:bg-blue-50 group-hover/lesson:text-blue-600 transition-all duration-300"
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                      {lesson.type.startsWith('video') ? (
                                        <Play size={16} className="mr-0.5" />
                                      ) : lesson.type === 'pdf' ? (
                                        <Eye size={16} />
                                      ) : (
                                        <ArrowUpRight size={16} />
                                      )}
                                    </motion.div>
                                  </motion.button>
                                );
                              })
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-8 text-center bg-white/60 rounded-2xl border border-dashed border-slate-200"
                              >
                                <BookOpen className="mx-auto text-slate-300 mb-3" size={32} />
                                <p className="text-slate-500 font-bold text-sm">
                                  جاري تجهيز محتوى هذا الأسبوع
                                </p>
                                <p className="text-slate-400 text-xs mt-1">كن مستعداً يا بطل! 🚀</p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ─── تبويب النظرة العامة ─── */
            <motion.div
              key="overview-tab"
              variants={slideUpFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 md:space-y-8"
            >
              {/* بطاقة ترحيبية */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-6 md:p-10 border border-blue-100/50 shadow-xl relative overflow-hidden"
              >
                <FloatingParticles />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Rocket size={32} className="text-blue-600" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">
                      أهلاً بك في رحلتك التعليمية!
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">
                    هذه الباقة تحتوي على {weeks.length} أسابيع من المحتوى التعليمي المميز، 
                    مع {totalLessons} درساً تفاعلياً. استمتع بالتعلم وتقدم بالسرعة التي تناسبك.
                  </p>
                  
                  {/* شريط تقدم عام */}
                  <div className="mt-6 bg-slate-200/60 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '35%' }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ width: '30%' }}
                      />
                    </motion.div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-bold">35% مكتمل</p>
                </div>
              </motion.div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { icon: <Video size={20} />, label: 'فيديوهات', value: Object.values(lessonsMap).flat().filter(l => l.type.startsWith('video')).length, color: 'from-blue-500 to-cyan-500' },
                  { icon: <FileText size={20} />, label: 'ملازم PDF', value: Object.values(lessonsMap).flat().filter(l => l.type === 'pdf').length, color: 'from-emerald-500 to-teal-500' },
                  { icon: <Target size={20} />, label: 'اختبارات', value: Object.values(lessonsMap).flat().filter(l => l.type.includes('exam')).length, color: 'from-purple-500 to-pink-500' },
                  { icon: <Clock size={20} />, label: 'ساعات تعلم', value: '12+', color: 'from-amber-500 to-orange-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    custom={i}
                    className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-3 shadow-md`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-slate-800">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* مساحة سفلية */}
        <div className="h-16 md:h-24" />
      </main>

      {/* ═══════════════════════════════════════
          ✦ نافذة عرض الدرس المنبثقة الساحرة ✦
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6 lg:p-10">
            {/* الخلفية */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />
            
            {/* النافذة */}
            <motion.div
              variants={scaleInOut}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-full md:max-w-6xl md:h-[92vh] bg-white md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/20 border border-white/30"
            >
              {/* رأس النافذة */}
              <div className="px-4 py-3 md:px-8 md:py-5 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <motion.div 
                    className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-100 flex-shrink-0"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                  >
                    <GraduationCap size={28} className="text-blue-600" />
                  </motion.div>
                  <div className="min-w-0">
                    <h4 className="font-black text-base md:text-xl text-slate-900 truncate">
                      {selectedLesson.name}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <Sparkles size={12} /> البارع محمود الديب
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedLesson(null)}
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 md:w-10 md:h-10 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {/* جسم النافذة */}
              <div className="flex-1 overflow-hidden relative bg-[#0F172A] flex items-center justify-center">
                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                      className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[28px] flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-purple-500/30"
                    >
                      <Target size={40} className="text-white" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-2xl md:text-4xl font-black mb-3 text-white"
                    >
                      نافذة الاختبار التفاعلي
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="text-base md:text-lg text-slate-300 font-medium mb-8 max-w-md leading-relaxed"
                    >
                      حان وقت تقييم مستواك! اضغط على الزر بالأسفل لبدء الاختبار.
                    </motion.p>
                    <motion.a
                      href={selectedLesson.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-black hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-3 group"
                    >
                      بدء الاختبار الآن
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <ChevronRight size={22} />
                      </motion.span>
                    </motion.a>
                  </div>
                )}
              </div>

              {/* تذييل النافذة */}
              {selectedLesson.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 md:p-6 bg-white border-t border-slate-100 text-right"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                    <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                      {selectedLesson.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// ✦ مشغل الفيديو الساحر ✦
// ──────────────────────────────────────────────
function VideoPlayer({ url }: { url: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [videoId, setVideoId] = React.useState('');
  const [provider, setProvider] = React.useState<'youtube' | 'vimeo'>('youtube');
  const [isValid, setIsValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [player, setPlayer] = React.useState<Plyr | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);

  useEffect(() => {
    let vid = '';
    let prov: 'youtube' | 'vimeo' = 'youtube';
    let valid = false;
    
    try {
      if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
        const ytId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : 
                     url.includes('embed/') ? url.split('embed/')[1]?.split('?')[0] :
                     url.split('youtu.be/')[1]?.split('?')[0];
        vid = ytId || '';
        prov = 'youtube';
        valid = !!vid;
      } else if (url.includes('vimeo.com/')) {
        const parts = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/');
        vid = parts?.[parts.length - 1] || '';
        prov = 'vimeo';
        valid = !!vid;
      }
    } catch (e) {
      console.error("Video ID extraction error", e);
    }

    setVideoId(vid);
    setProvider(prov);
    setIsValid(valid);
    setIsLoading(true);
  }, [url]);

  useEffect(() => {
    let plyrInstance: Plyr | null = null;

    if (videoId && containerRef.current) {
      plyrInstance = new Plyr(containerRef.current, {
        settings: ['quality', 'speed', 'loop'],
        invertTime: true,
        autoplay: true,
        muted: false,
        ratio: '16:9',
        clickToPlay: true,
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          autoplay: 1,
        },
        vimeo: {
          byline: false,
          portrait: false,
          title: false,
          transparent: false,
          autoplay: true,
          muted: false
        }
      });

      setPlayer(plyrInstance);

      plyrInstance.on('ready', () => {
        setIsLoading(false);
        const playPromise = plyrInstance?.play();
        if (playPromise && playPromise instanceof Promise) {
          playPromise.catch(() => {
            console.log("Autoplay blocked, waiting for interaction");
          });
        }
      });

      plyrInstance.on('play', () => setIsLoading(false));
      plyrInstance.on('enterfullscreen', () => setIsFullscreen(true));
      plyrInstance.on('exitfullscreen', () => setIsFullscreen(false));

      const preventDefault = (e: Event) => e.preventDefault();
      document.body.addEventListener('contextmenu', preventDefault);

      return () => {
        if (plyrInstance) plyrInstance.destroy();
        document.body.removeEventListener('contextmenu', preventDefault);
      };
    }
  }, [videoId, provider]);

  // إخفاء التحكم تلقائياً
  useEffect(() => {
    if (!isLoading && player) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(timer);
        setTimeout(() => setShowControls(false), 3000);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isLoading, player]);

  const handleManualToggle = () => {
    if (player) {
      player.playing ? player.pause() : player.play();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative group overflow-hidden">
      {isValid ? (
        <div className="w-full h-full relative cursor-pointer" onClick={handleManualToggle}>
          <div
            key={`${provider}-${videoId}`}
            ref={containerRef}
            data-plyr-provider={provider}
            data-plyr-embed-id={videoId}
            className="w-full h-full pointer-events-none"
          />
          
          {/* شاشة التحميل */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-blue-500/30 border-t-blue-500"
                />
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white mt-5 font-bold tracking-widest text-sm"
                >
                  جاري التحميل...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* زر التشغيل المركزي */}
          <AnimatePresence>
            {!isLoading && !player?.playing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <motion.div
                  animate={pulseGlow}
                  className="w-20 h-20 md:w-28 md:h-28 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20"
                >
                  <Play size={36} className="text-white mr-1 drop-shadow-lg" fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* شارة الأمان */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
            <div className="bg-black/50 backdrop-blur-lg px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest text-white/70 uppercase border border-white/10">
              <Lock size={10} className="inline mr-1" /> منصة البارع
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center text-slate-400 gap-4 bg-slate-900 w-full h-full">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-3xl shadow-inner flex items-center justify-center border border-slate-700"
          >
            <PlayCircle size={40} className="text-slate-600" />
          </motion.div>
          <p className="font-bold text-base md:text-lg text-slate-300">عذراً، رابط الفيديو غير متاح حالياً</p>
          <p className="text-sm text-slate-500">يرجى التواصل مع الدعم الفني للمساعدة</p>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// ✦ عارض PDF الساحر ✦
// ──────────────────────────────────────────────
function PdfViewer({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);
  
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1]?.split('/')[0];
    if (id) embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-100 relative">
      {/* شاشة تحميل */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                borderRadius: ["20%", "50%", "20%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl"
            >
              <FileText size={28} className="text-white" />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-slate-500 font-bold mt-4"
            >
              جاري تحميل الملف...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <iframe
        src={embedUrl}
        className="relative z-10 w-full h-full border-none"
        title="PDF Viewer"
        allow="autoplay"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}