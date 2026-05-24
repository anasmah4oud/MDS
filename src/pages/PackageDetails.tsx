/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, CheckCircle, 
  Lock, Calendar, BookOpen, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Zap, Star, ArrowUpRight, GraduationCap, Trophy,
  Layers, Infinity, MousePointerClick
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ==================== حركات Framer Motion الساحرة ====================
const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const shimmerEffect = {
  background: [
    "linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    "linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)",
    "linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)"
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
};

const pulseGlow = {
  boxShadow: [
    "0 0 20px rgba(59, 130, 246, 0.3)",
    "0 0 40px rgba(59, 130, 246, 0.5)",
    "0 0 20px rgba(59, 130, 246, 0.3)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.08, 
      delayChildren: 0.3,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      mass: 0.8
    } 
  }
};

const lessonItemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      type: "spring",
      stiffness: 500,
      damping: 20
    }
  })
};

// ==================== المكون الرئيسي ====================
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
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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

  const totalLessons = Object.values(lessonsMap).reduce(
    (acc: number, curr) => acc + (curr as Lesson[]).length, 
    0
  );

  // ==================== شاشة التحميل الساحرة ====================
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 gap-8">
      <motion.div 
        animate={floatingAnimation}
        className="relative"
      >
        <motion.div 
          animate={pulseGlow}
          className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-2xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <GraduationCap size={64} className="text-blue-600" />
          </motion.div>
        </div>
      </motion.div>
      <div className="text-center space-y-3">
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-black text-2xl md:text-3xl text-slate-800"
        >
          جاري تحضير المحتوى الساحر
        </motion.p>
        <motion.div 
          className="flex gap-2 justify-center"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ 
                scaleY: [1, 2, 1],
                backgroundColor: ['#93c5fd', '#3b82f6', '#1d4ed8', '#3b82f6', '#93c5fd']
              }}
              transition={{ 
                delay: i * 0.2,
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1.5 h-6 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );

  // ==================== الواجهة الرئيسية ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20 text-slate-900 overflow-x-hidden" dir="rtl">
      
      {/* ========== قسم الهيرو الساحر ========== */}
      <motion.div 
        ref={heroRef}
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-slate-900"
      >
        {/* صورة الخلفية مع تأثير البارالاكس */}
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={pkg?.image_url || "https://placehold.co/1200x800"} 
          className="absolute inset-0 w-full h-full object-cover blur-[1px]" 
          alt="Package Background"
        />
        
        {/* تدرجات ضوئية متحركة */}
        <motion.div 
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
        />
        
        {/* تدرج الحواف */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent" />
        
        {/* المحتوى العلوي */}
        <div className="absolute inset-0 flex items-end p-4 md:p-12 lg:p-20 z-10">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* زر العودة */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-blue-600 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-full font-bold text-sm md:text-base mb-6 md:mb-10 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/80"
              >
                <ChevronRight size={18} /> 
                <span>العودة للوحة التحكم</span>
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
              
              {/* عنوان الباقة */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 20 }}
                className="space-y-3 md:space-y-5"
              >
                <motion.div 
                  animate={{ 
                    background: [
                      "linear-gradient(135deg, #3b82f6, #6366f1)",
                      "linear-gradient(135deg, #6366f1, #3b82f6)",
                      "linear-gradient(135deg, #3b82f6, #6366f1)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs md:text-sm font-black uppercase tracking-widest shadow-lg"
                >
                  <Sparkles size={16} className="animate-pulse" />
                  {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight text-slate-900 drop-shadow-sm">
                  {pkg?.name}
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed bg-white/40 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/50 shadow-lg">
                  {pkg?.description}
                </p>
              </motion.div>
              
              {/* بطاقة الإحصائيات */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", damping: 15 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 md:gap-8 bg-white/70 backdrop-blur-2xl border border-white shadow-2xl p-4 md:p-6 lg:p-8 rounded-3xl md:rounded-4xl w-fit"
              >
                <div className="text-center group cursor-default">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-inner"
                  >
                    <Calendar size={22} className="md:w-6 md:h-6" />
                  </motion.div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1">الأسابيع</p>
                  <motion.p 
                    key={weeks.length}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl md:text-3xl font-black text-slate-800"
                  >
                    {weeks.length}
                  </motion.p>
                </div>
                
                <div className="w-px h-16 md:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                
                <div className="text-center group cursor-default">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-inner"
                  >
                    <PlayCircle size={22} className="md:w-6 md:h-6" />
                  </motion.div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1">المحاضرات</p>
                  <motion.p 
                    key={totalLessons}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl md:text-3xl font-black text-slate-800"
                  >
                    {totalLessons}
                  </motion.p>
                </div>
                
                <div className="w-px h-16 md:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                
                <div className="text-center group cursor-default">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-inner"
                  >
                    <Trophy size={22} className="md:w-6 md:h-6" />
                  </motion.div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1">مكتمل</p>
                  <p className="text-xl md:text-3xl font-black text-slate-800">0%</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* خط زخرفي سفلي متحرك */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />
      </motion.div>

      {/* ========== شريط التقدم العلوي ========== */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-blue-600" />
            <span className="font-black text-sm md:text-base text-slate-800">المحتوى التعليمي</span>
          </div>
          <motion.div 
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs md:text-sm font-bold text-blue-600 flex items-center gap-1"
          >
            <Infinity size={14} />
            {weeks.length} أسابيع • {totalLessons} محاضرة
          </motion.div>
        </div>
      </motion.div>

      {/* ========== المحتوى الرئيسي ========== */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-16 lg:py-24 relative z-20">
        
        {/* عنوان القسم */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex items-center gap-4 mb-8 md:mb-14"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-1.5 md:w-2 h-8 md:h-10 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"
          />
          <h3 className="text-2xl md:text-4xl font-black text-slate-900">
            المحتوى التعليمي
          </h3>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Zap size={22} className="text-amber-400 hidden md:block" />
          </motion.div>
        </motion.div>

        {/* قائمة الأسابيع */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 md:space-y-6"
        >
          {weeks.map((week, index) => {
            const weekLessons = lessonsMap[week.id] || [];
            const isExpanded = expandedWeek === week.id;
            
            return (
              <motion.div 
                key={week.id} 
                variants={itemVariants}
                layout
                whileHover={{ y: -2 }}
                className={`rounded-2xl md:rounded-[28px] overflow-hidden border transition-all duration-500 ${
                  isExpanded 
                    ? 'bg-white border-blue-200 shadow-2xl shadow-blue-100/50' 
                    : 'bg-white/70 border-slate-200/60 hover:bg-white hover:shadow-lg hover:border-blue-100'
                }`}
              >
                <motion.button 
                  onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                  className="w-full flex items-center justify-between p-4 md:p-6 lg:p-8 text-right focus:outline-none group"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 md:gap-5 lg:gap-6">
                    {/* رقم الأسبوع */}
                    <motion.div 
                      animate={isExpanded ? {
                        background: [
                          "linear-gradient(135deg, #3b82f6, #6366f1)",
                          "linear-gradient(135deg, #6366f1, #3b82f6)",
                          "linear-gradient(135deg, #3b82f6, #6366f1)"
                        ],
                        scale: [1, 1.05, 1]
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl lg:text-2xl transition-all duration-500 ${
                        isExpanded 
                          ? 'text-white shadow-lg shadow-blue-500/30' 
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:from-blue-100 group-hover:to-indigo-100'
                      }`}
                    >
                      {index + 1}
                    </motion.div>
                    
                    <div>
                      <h4 className={`text-base md:text-xl lg:text-2xl font-black transition-colors duration-300 ${
                        isExpanded ? 'text-blue-950' : 'text-slate-800'
                      }`}>
                        {week.name}
                      </h4>
                      {week.description && (
                        <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 line-clamp-1">
                          {week.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* عداد الدروس */}
                    <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                      <BookOpen size={12} />
                      {weekLessons.length} محاضرات
                    </span>
                    
                    {/* زر التوسيع */}
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isExpanded 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                      }`}
                    >
                      <ChevronDown size={18} className="md:w-5 md:h-5" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* محتوى الأسبوع المفتوح */}
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 space-y-2 md:space-y-3">
                        {/* خط فاصل متحرك */}
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-4 md:mb-6"
                        />
                        
                        {weekLessons.length > 0 ? (
                          weekLessons.map((lesson, idx) => (
                            <motion.button 
                              key={lesson.id}
                              custom={idx}
                              variants={lessonItemVariants}
                              initial="hidden"
                              animate="show"
                              whileHover={{ 
                                scale: 1.02, 
                                y: -3,
                                backgroundColor: "#ffffff",
                                borderColor: "#bfdbfe"
                              }}
                              whileTap={{ scale: 0.97 }}
                              onHoverStart={() => setHoveredLesson(lesson.id)}
                              onHoverEnd={() => setHoveredLesson(null)}
                              onClick={() => {
                                if (lesson.type.startsWith('video')) {
                                  navigate(`/video/${lesson.id}`);
                                } else {
                                  setSelectedLesson(lesson);
                                }
                              }}
                              className="w-full flex items-center justify-between p-3 md:p-5 bg-slate-50/80 rounded-xl md:rounded-2xl border border-slate-100/80 hover:shadow-xl transition-all duration-300 group/lesson relative overflow-hidden"
                            >
                              {/* تأثير خلفي متحرك عند التحويم */}
                              <motion.div 
                                animate={{
                                  opacity: hoveredLesson === lesson.id ? 1 : 0,
                                  scale: hoveredLesson === lesson.id ? 1 : 0.8
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-transparent rounded-xl md:rounded-2xl pointer-events-none"
                              />
                              
                              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                                {/* أيقونة الدرس */}
                                <motion.div 
                                  whileHover={{ rotate: [0, -10, 10, 0] }}
                                  transition={{ duration: 0.5 }}
                                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    lesson.type.startsWith('video') 
                                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover/lesson:from-blue-500 group-hover/lesson:to-blue-600 group-hover/lesson:text-white'
                                      : lesson.type === 'pdf'
                                      ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover/lesson:from-emerald-500 group-hover/lesson:to-emerald-600 group-hover/lesson:text-white'
                                      : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 group-hover/lesson:from-orange-500 group-hover/lesson:to-orange-600 group-hover/lesson:text-white'
                                  }`}
                                >
                                  {lesson.type.startsWith('video') ? (
                                    <PlayCircle size={20} className="md:w-6 md:h-6" />
                                  ) : lesson.type === 'pdf' ? (
                                    <FileText size={20} className="md:w-6 md:h-6" />
                                  ) : (
                                    <BookOpen size={20} className="md:w-6 md:h-6" />
                                  )}
                                </motion.div>
                                
                                <div className="text-right">
                                  <p className="text-sm md:text-base lg:text-lg font-black text-slate-800 group-hover/lesson:text-blue-700 transition-colors line-clamp-1">
                                    {lesson.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Clock size={11} className="text-slate-400 md:w-3 md:h-3" />
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                                      {lesson.type === 'video_exp' ? 'شرح تفصيلي' :
                                       lesson.type === 'video_hw' ? 'حل وتطبيق' :
                                       lesson.type === 'pdf' ? 'ملزمة PDF' :
                                       lesson.type === 'exam_mcq' ? 'اختبار إلكتروني' : 'واجب إلكتروني'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* زر المشاهدة */}
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="relative z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover/lesson:bg-blue-50 group-hover/lesson:text-blue-600 transition-colors"
                              >
                                <Eye size={16} className="md:w-5 md:h-5" />
                              </motion.div>
                            </motion.button>
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 md:p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200"
                          >
                            <motion.div
                              animate={floatingAnimation}
                            >
                              <BookOpen className="mx-auto text-slate-300 mb-4" size={40} />
                            </motion.div>
                            <p className="text-slate-500 font-bold text-sm md:text-base italic">
                              جاري تجهيز محتوى هذا الأسبوع، كن مستعداً يا بطل!
                            </p>
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
        
        {/* إشعار تحفيزي سفلي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-16 p-5 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl md:rounded-3xl border border-blue-100 text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Star className="mx-auto text-amber-400 mb-3" size={28} fill="currentColor" />
          </motion.div>
          <p className="font-black text-base md:text-xl text-slate-800 mb-2">
            استمر في التعلم، كل خطوة تقربك من هدفك!
          </p>
          <p className="text-slate-500 font-medium text-xs md:text-sm">
            أكمل مشاهدة جميع المحاضرات لتحصل على شهادة الإتمام
          </p>
        </motion.div>
      </main>

      {/* ========== نافذة عرض الدرس ========== */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xl"
              onClick={() => setSelectedLesson(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.85, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/30 border border-white/50"
            >
              {/* رأس النافذة */}
              <div className="px-4 py-3 md:px-8 md:py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-3 md:gap-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                  >
                    <img src="/logo.png" className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-contain" alt="Master" />
                  </motion.div>
                  <div>
                    <h4 className="font-black text-base md:text-xl lg:text-2xl text-slate-900 truncate max-w-[180px] sm:max-w-sm md:max-w-md">
                      {selectedLesson.name}
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold text-blue-600 mt-0.5">البارع محمود الديب</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedLesson(null)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <X size={22} strokeWidth={2.5} className="md:w-6 md:h-6" />
                </motion.button>
              </div>

              {/* محتوى العارض */}
              <div className="flex-1 overflow-hidden relative bg-[#0f172a] flex items-center justify-center">
                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center bg-gradient-to-b from-slate-50 to-white">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                      className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-inner"
                    >
                      <BookOpen className="text-blue-600 w-10 h-10 md:w-14 md:h-14" />
                    </motion.div>
                    <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 text-slate-900">
                      نافذة الاختبار التفاعلي
                    </h3>
                    <p className="text-base md:text-lg text-slate-500 font-medium mb-8 md:mb-10 max-w-lg leading-relaxed">
                      حان وقت تقييم مستواك! اضغط على الزر بالأسفل لبدء الاختبار في بيئة مخصصة.
                    </p>
                    <motion.a 
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedLesson.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-3"
                    >
                      بدء الاختبار الآن 
                      <ArrowUpRight size={22} className="md:w-6 md:h-6" />
                    </motion.a>
                  </div>
                )}
              </div>

              {/* وصف الدرس */}
              {selectedLesson.description && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 md:p-6 lg:p-8 bg-white border-t border-slate-100 text-right"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-amber-400 mt-1 flex-shrink-0" size={20} />
                    <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base lg:text-lg">
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

// ==================== مشغل الفيديو المتطور ====================
function VideoPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoId, setVideoId] = useState('');
  const [provider, setProvider] = useState<'youtube' | 'vimeo'>('youtube');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState<Plyr | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let vid = '';
    let prov: 'youtube' | 'vimeo' = 'youtube';
    let valid = false;
    
    try {
      if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
        const ytId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : 
                     url.includes('embed/') ? url.split('embed/')[1].split('?')[0] :
                     url.split('youtu.be/')[1].split('?')[0];
        vid = ytId;
        prov = 'youtube';
        valid = !!vid;
      } else if (url.includes('vimeo.com/')) {
        const parts = url.split('vimeo.com/')[1].split('?')[0].split('/');
        vid = parts[parts.length - 1];
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
    setIsPlaying(false);
  }, [url]);

  useEffect(() => {
    let plyrInstance: Plyr | null = null;

    if (videoId && containerRef.current) {
      plyrInstance = new Plyr(containerRef.current, {
        settings: ['quality', 'speed'],
        invertTime: true,
        autoplay: true,
        muted: false,
        ratio: '16:9',
        clickToPlay: true,
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

      plyrInstance.on('play', () => {
        setIsLoading(false);
        setIsPlaying(true);
      });

      plyrInstance.on('pause', () => {
        setIsPlaying(false);
      });

      const preventDefault = (e: Event) => e.preventDefault();
      document.body.addEventListener('contextmenu', preventDefault);

      return () => {
        if (plyrInstance) plyrInstance.destroy();
        document.body.removeEventListener('contextmenu', preventDefault);
      };
    }
  }, [videoId, provider]);

  const handleManualToggle = () => {
    if (player) {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
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
                  animate={{ 
                    rotate: 360,
                    borderRadius: ["25%", "50%", "25%"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                />
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white mt-6 font-bold tracking-widest text-sm"
                >
                  جاري التحميل...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* زر التشغيل المركزي */}
          <AnimatePresence>
            {!isPlaying && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      "0 0 30px rgba(59, 130, 246, 0.5)",
                      "0 0 60px rgba(59, 130, 246, 0.8)",
                      "0 0 30px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30"
                >
                  <Play size={32} className="ml-1 drop-shadow-md" fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4 bg-gradient-to-b from-slate-50 to-slate-100 w-full h-full"
        >
          <motion.div 
            animate={floatingAnimation}
            className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100"
          >
            <PlayCircle size={48} className="text-slate-300" />
          </motion.div>
          <p className="font-bold text-lg">عذراً، رابط الفيديو غير متاح حالياً.</p>
          <p className="text-sm text-slate-400">يرجى التواصل مع الدعم الفني</p>
        </motion.div>
      )}

      {/* علامة حقوق النشر */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-20 pointer-events-none select-none"
      >
        <div className="bg-black/50 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest text-white/80 uppercase border border-white/10 shadow-xl">
          منصة البارع • حقوق النشر محفوظة
        </div>
      </motion.div>
    </div>
  );
}

// ==================== عارض PDF ====================
function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-100 relative">
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <div className="flex flex-col items-center gap-4">
          <FileText size={48} className="text-slate-300" />
          <p className="text-slate-400 font-bold">جاري تحميل الملف...</p>
        </div>
      </motion.div>
      <iframe 
        src={embedUrl} 
        className="relative z-10 w-full h-full border-none shadow-inner"
        title="PDF Viewer"
        allow="autoplay"
        loading="lazy"
      />
    </div>
  );
}