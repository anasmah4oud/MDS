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
  Layers, ArrowLeft, MonitorPlay, FileCheck, HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// --- حركات Framer Motion السينمائية المحسنة للأداء ---
const pageFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 } 
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20, 
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

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

  // تأثير التمرير للمؤثرات البصرية في الهيدر
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 200], ["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.95)"]);
  const headerBlur = useTransform(scrollY, [0, 200], ["blur(0px)", "blur(16px)"]);

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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-blue-600 p-6">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl w-24 h-24 rounded-full animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-20 h-20 border-4 border-slate-200 border-t-blue-600 rounded-full"
        />
        <BookOpen size={28} className="absolute text-blue-600 animate-pulse" />
      </div>
      <h2 className="font-black text-2xl text-slate-800 tracking-tight mb-2">جاري تحضير المحتوى الساحر</h2>
      <p className="text-slate-500 text-sm font-medium animate-pulse">ثوانٍ معدودة وتفتح لك بوابة الإبداع...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden antialiased" dir="rtl">
      
      {/* Floating Action Header for Mobile & Desktop */}
      <motion.div 
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        className="fixed top-0 inset-x-0 h-20 z-50 flex items-center px-4 md:px-12 border-b border-transparent transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 bg-white shadow-sm hover:shadow-md border border-slate-100 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-300 group">
             <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /> العودة للوحة التحكم
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">مشترك بالفعل</span>
          </div>
        </div>
      </motion.div>

      {/* Cinematic Hero Section */}
      <div className="relative min-h-[50vh] md:min-h-[65vh] w-full flex items-center pt-24 pb-12 overflow-hidden bg-slate-950">
        {/* Background Visual Artifacts */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 blur-[130px] rounded-full" />
        </div>
        
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={pkg?.image_url || "https://placehold.co/1200x800"} 
          className="absolute inset-0 w-full h-full object-cover filter saturate-[1.1] brightness-[0.8]" 
          alt="Package Background"
        />
        {/* Soft dynamic white gradient to bleed into light mode content smoothly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/50 to-slate-950/40" />

        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Meta Info */}
          <div className="lg:col-span-7 text-right space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-lg shadow-blue-600/20">
                <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                {pkg?.type === 'offer' ? 'عرض خاص وحصري' : 'باقة تعليمية متكاملة'}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-3xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight md:leading-none"
            >
              {pkg?.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-sm"
            >
              {pkg?.description}
            </motion.p>
          </div>

          {/* Quick Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="lg:col-span-5 w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl p-6 md:p-8 rounded-[36px] flex justify-around items-center relative"
          >
            <div className="text-center space-y-2 group flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                <Calendar size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">عدد الأسابيع</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{weeks.length}</p>
            </div>

            <div className="w-px h-16 bg-slate-200/80" />

            <div className="text-center space-y-2 group flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
                <Layers size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">المحاضرات والملفات</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight">
                {Object.values(lessonsMap).reduce((acc: number, curr) => acc + (curr as Lesson[]).length, 0)}
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Main Content Sections */}
      <main className="max-w-4xl mx-auto px-4 py-12 relative z-20">
        
        {/* Title Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full shadow-md" />
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            المحتوى التعليمي والجدول الزمني
          </h3>
        </div>

        {/* Dynamic Accordion Wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 md:space-y-5"
        >
          {weeks.map((week, index) => {
            const isExpanded = expandedWeek === week.id;
            const weekLessons = lessonsMap[week.id] || [];

            return (
              <motion.div 
                key={week.id} 
                variants={itemVariants}
                layout
                className={`rounded-[28px] md:rounded-[32px] overflow-hidden border transition-all duration-500 ${
                  isExpanded 
                    ? 'bg-white border-blue-200/70 shadow-2xl shadow-blue-900/5' 
                    : 'bg-white/70 border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button 
                  onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-right focus:outline-none group relative"
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${
                      isExpanded 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-105 rotate-3' 
                        : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className={`text-lg md:text-xl font-black transition-colors duration-300 ${isExpanded ? 'text-blue-600' : 'text-slate-800'}`}>
                        {week.name}
                      </h4>
                      <p className="text-slate-400 font-medium text-xs mt-0.5">{week.description || 'لا يوجد وصف متاح لهذا الأسبوع'}</p>
                    </div>
                  </div>
                  
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                    isExpanded 
                      ? 'bg-blue-50 border-blue-200 text-blue-600 rotate-180' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:bg-slate-100'
                  }`}>
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </button>

                {/* Accordion Content Panels */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden bg-slate-50/50 border-t border-slate-100/70"
                    >
                      <div className="p-4 md:p-6 space-y-3">
                        {weekLessons.map((lesson, idx) => {
                          const isVideo = lesson.type.startsWith('video');
                          const isPdf = lesson.type === 'pdf';
                          
                          return (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              whileHover={{ scale: 1.005, y: -2 }}
                              onClick={() => {
                                if (isVideo) {
                                  navigate(`/video/${lesson.id}`);
                                } else {
                                  setSelectedLesson(lesson);
                                }
                              }}
                              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-300 group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                 {/* Dynamic Badges with Soft Colors */}
                                 <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                                   isVideo ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md' :
                                   isPdf ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-md' :
                                   'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-md'
                                 }`}>
                                    {isVideo ? <MonitorPlay size={20} /> : isPdf ? <FileCheck size={20} /> : <HelpCircle size={20} />}
                                 </div>
                                 <div className="text-right min-w-0">
                                    <p className="text-sm md:text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                      {lesson.name}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold text-slate-400 mt-1">
                                      <Clock size={11} />
                                      {lesson.type === 'video_exp' && 'فيديو شرح وتفصيل'}
                                      {lesson.type === 'video_hw' && 'فيديو حل وتطبيقات واجب'}
                                      {lesson.type === 'pdf' && 'ملخص وملزمة بصيغة PDF'}
                                      {lesson.type === 'exam_mcq' && 'إختبار إلكتروني تفاعلي'}
                                      {(!['video_exp', 'video_hw', 'pdf', 'exam_mcq'].includes(lesson.type)) && 'واجب منزلي محدد'}
                                    </span>
                                 </div>
                              </div>

                              <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100 opacity-70 group-hover:opacity-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all flex-shrink-0">
                                 <Eye size={16} />
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Empty State within Week */}
                        {weekLessons.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                            <BookOpen className="mx-auto text-slate-300 mb-2 animate-bounce" size={28} />
                            <p className="text-slate-500 font-bold text-sm">محتوى هذا الأسبوع قيد المراجعة الفنية</p>
                            <p className="text-slate-400 text-xs mt-1">ترقب رفعه قريباً جداً يا بطل!</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Modern High-End Lesson Viewer Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12">
            
            {/* Backdrop Blur Overlays */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />
            
            {/* Modal Body Container */}
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-full md:max-w-5xl md:h-[85vh] bg-white md:rounded-[36px] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Modal Dynamic Header */}
              <div className="px-5 py-4 md:px-8 md:py-5 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 hidden sm:block">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                        بارع
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-base md:text-xl text-slate-900 truncate max-w-[220px] sm:max-w-md">
                        {selectedLesson.name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 mt-0.5">الأستاذ محمود الديب</p>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => setSelectedLesson(null)}
                  className="w-10 h-10 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:rotate-90"
                 >
                   <X size={20} strokeWidth={2.5} />
                 </button>
              </div>

              {/* Viewer Content Render Routing */}
              <div className="flex-1 overflow-hidden relative bg-[#F8FAFC] flex items-center justify-center">
                 {selectedLesson.type.startsWith('video') ? (
                    <VideoPlayer url={selectedLesson.url} />
                 ) : selectedLesson.type === 'pdf' ? (
                    <PdfViewer url={selectedLesson.url} />
                 ) : (
                    /* Interactive Exam Portal UI Screen */
                    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center max-w-lg mx-auto">
                       <motion.div 
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.15 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10"
                       >
                          <HelpCircle size={36} className="animate-pulse" />
                       </motion.div>
                       <h3 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 tracking-tight">منصة الاختبارات الذكية</h3>
                       <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed">
                         مستعد للتمكين؟ تم تجهيز هذا الاختبار لقياس فهمك بدقة وإظهار نقاط قوتك على الفور.
                       </p>
                       <motion.a 
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={selectedLesson.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-black text-base md:text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                       >
                         ابدأ ماراثون الحل الآن 
                         <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                       </motion.a>
                    </div>
                 )}
              </div>

              {/* Optional Footer/Notes description block */}
              {selectedLesson.description && (
                <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-100 text-right">
                   <div className="flex items-start gap-2.5 max-w-3xl">
                     <Sparkles className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                     <p className="text-slate-600 font-semibold text-xs md:text-sm leading-relaxed">{selectedLesson.description}</p>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 2. مكوّن مشغل الفيديو الاحترافي المطور (VideoPlayer)
// ==========================================
function VideoPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoId, setVideoId] = useState('');
  const [provider, setProvider] = useState<'youtube' | 'vimeo'>('youtube');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState<Plyr | null>(null);

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
      console.error("Video URL parsing breakdown: ", e);
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
        settings: ['quality', 'speed'],
        invertTime: false,
        autoplay: true,
        ratio: '16:9',
        clickToPlay: true,
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
        vimeo: { byline: false, portrait: false, title: false, transparent: false }
      });

      setPlayer(plyrInstance);

      plyrInstance.on('ready', () => {
        setIsLoading(false);
        plyrInstance?.play()?.catch(() => console.log("Autoplay context initialization deferral."));
      });

      plyrInstance.on('play', () => setIsLoading(false));

      // تأمين ضد الضغط على الزر الأيمن للفأرة لحماية الملكية
      const preventContextMenu = (e: Event) => e.preventDefault();
      document.body.addEventListener('contextmenu', preventContextMenu);

      return () => {
        if (plyrInstance) plyrInstance.destroy();
        document.body.removeEventListener('contextmenu', preventContextMenu);
      };
    }
  }, [videoId, provider]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 relative group overflow-hidden">
      {isValid ? (
        <div className="w-full h-full relative" onClick={() => player?.playing ? player.pause() : player?.play()}>
          <div 
            key={`${provider}-${videoId}`} 
            ref={containerRef} 
            data-plyr-provider={provider} 
            data-plyr-embed-id={videoId} 
            className="w-full h-full pointer-events-none"
          />
          
          {/* Skeletons Loading Layer */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md"
              >
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 mt-4 text-xs font-bold tracking-widest animate-pulse">جاري تأمين البث المباشر الموفر للطاقة...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Centralized Smart Play Overlay Controller Toggle */}
          {!isLoading && !player?.playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/10 transition-all duration-300">
               <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/95 backdrop-blur shadow-2xl rounded-full flex items-center justify-center text-blue-600 border border-white"
               >
                  <Play size={28} className="ml-1 fill-current" />
               </motion.div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3 bg-slate-50 w-full h-full">
          <PlayCircle size={40} className="text-slate-300" />
          <p className="font-bold text-sm">عذراً، مسار ملف البث هذا غير متوفر حالياً.</p>
        </div>
      )}

      {/* Embedded Dynamic Security Overlay Watermark */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black tracking-widest text-white/70 border border-white/10">
          منصة البارع التعليمية • محمى بموجب حقوق النشر
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. مكوّن مستعرض المستندات والملخصات (PdfViewer)
// ==========================================
function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-100 relative">
      {/* Background Animated Loading Backing Placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 gap-3">
         <FileText size={40} className="text-slate-300 animate-bounce" />
         <p className="text-slate-400 text-xs font-bold animate-pulse">جاري سحب الملزمة ومزامنتها...</p>
      </div>
      <iframe 
        src={embedUrl} 
        className="relative z-10 w-full h-full border-none"
        title="PDF Document Secure Viewer Container"
        allow="autoplay"
        loading="lazy"
      />
    </div>
  );
}