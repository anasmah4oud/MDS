/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, CheckCircle, 
  Lock, Calendar, BookOpen, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, TrendingUp,
  Award, Sparkles, Star, ArrowLeft, ArrowRight,
  Download, Maximize2, Minimize2, Volume2, VolumeX
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ------------------------------
// Helper: Local Storage for completed lessons
// ------------------------------
const getCompletedLessons = (userId: string, packageId: string): Set<number> => {
  const key = `completed_${userId}_${packageId}`;
  const stored = localStorage.getItem(key);
  if (stored) return new Set(JSON.parse(stored));
  return new Set();
};

const saveCompletedLesson = (userId: string, packageId: string, lessonId: number) => {
  const key = `completed_${userId}_${packageId}`;
  const current = getCompletedLessons(userId, packageId);
  current.add(lessonId);
  localStorage.setItem(key, JSON.stringify(Array.from(current)));
};

// ------------------------------
// Animated Number Counter
// ------------------------------
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
};

// ------------------------------
// Main Component
// ------------------------------
export default function PackageDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<number, Lesson[]>>({});
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Load completed lessons from localStorage
  useEffect(() => {
    if (profile && id) {
      setCompletedLessons(getCompletedLessons(profile.id, id));
    }
  }, [profile, id]);

  const fetchPackageData = async () => {
    if (!id || !profile) return;
    try {
      // 1. Verify subscription
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
      setSubscription(subData);

      // 2. Load Package
      const { data: pkgData, error: pkgError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (pkgError) throw pkgError;
      setPkg(pkgData as Package);

      // 3. Load Weeks
      const { data: weeksList, error: weeksError } = await supabase
        .from('weeks')
        .select('*')
        .eq('package_id', id)
        .order('id', { ascending: true });
        
      if (weeksError) throw weeksError;
      setWeeks(weeksList as Week[]);

      // 4. Load Lessons for all weeks
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
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, [id, profile]);

  // Calculate stats
  const totalLessons = useMemo(() => {
    return Object.values(lessonsMap).reduce((acc, arr) => acc + arr.length, 0);
  }, [lessonsMap]);

  const completedCount = useMemo(() => {
    let count = 0;
    Object.values(lessonsMap).forEach(lessons => {
      lessons.forEach(lesson => {
        if (completedLessons.has(lesson.id)) count++;
      });
    });
    return count;
  }, [lessonsMap, completedLessons]);

  const completionPercentage = totalLessons === 0 ? 0 : (completedCount / totalLessons) * 100;

  const handleLessonOpen = (lesson: Lesson) => {
    if (profile && id) {
      saveCompletedLesson(profile.id, id, lesson.id);
      setCompletedLessons(prev => new Set(prev.add(lesson.id)));
    }
    setSelectedLesson(lesson);
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900" dir="rtl">
      {/* Animated Hero Section */}
      <motion.div 
        style={{ scale: heroScale, opacity: headerOpacity }}
        className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-700"
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          src={pkg?.image_url || "https://placehold.co/1200x800"} 
          className="w-full h-full object-cover opacity-40" 
          alt="Package Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-20" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-30">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <Link to="/dashboard" className="inline-flex items-center gap-1 text-white/80 hover:text-white font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all hover:bg-white/20">
                <ChevronRight size={16} /> لوحة التحكم
              </Link>
              <span className="bg-amber-400 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                {pkg?.type === 'offer' ? 'عرض خاص 🔥' : 'باقة تعليمية ⭐'}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter leading-tight text-white drop-shadow-2xl"
            >
              {pkg?.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl font-medium drop-shadow"
            >
              {pkg?.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-20 -mt-8 md:-mt-12">
        {/* Stats & Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mb-12 md:mb-16 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-6 md:gap-12">
              <div className="text-center">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-1">
                  <Calendar size={16} /> تاريخ البدء
                </div>
                <p className="text-xl font-black text-slate-800">
                  {subscription?.created_at ? new Date(subscription.created_at).toLocaleDateString('ar-EG') : '---'}
                </p>
              </div>
              <div className="w-px h-12 bg-slate-100 hidden md:block" />
              <div className="text-center">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-1">
                  <Clock size={16} /> المدة المتبقية
                </div>
                <p className="text-xl font-black text-slate-800">
                  {subscription?.expires_at ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 'غير محدود'} يوم
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-500">تقدمك</span>
                <span className="text-blue-600">{Math.round(completionPercentage)}% مكتمل</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span><AnimatedCounter value={completedCount} /> درس مكتمل</span>
                <span><AnimatedCounter value={totalLessons} /> إجمالي الدروس</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
            <Sparkles className="text-amber-400" size={28} />
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              محتوى الباقة
            </span>
          </h2>
          <div className="flex items-center gap-2 text-sm bg-slate-100 px-4 py-2 rounded-full">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="font-bold">{weeks.length} أسابيع</span>
          </div>
        </div>

        {/* Weeks Accordion */}
        <div className="space-y-4">
          {weeks.map((week, index) => {
            const weekLessons = lessonsMap[week.id] || [];
            const weekCompleted = weekLessons.filter(l => completedLessons.has(l.id)).length;
            const weekProgress = weekLessons.length === 0 ? 0 : (weekCompleted / weekLessons.length) * 100;
            
            return (
              <motion.div 
                key={week.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <button 
                  onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                  className="w-full flex items-center justify-between p-5 md:p-7 hover:bg-slate-50/80 transition-all text-right group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center font-black text-xl text-blue-600 shadow-inner">
                        {index + 1}
                      </div>
                      {weekProgress === 100 && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{week.name}</h4>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">{week.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${weekProgress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">{weekCompleted}/{weekLessons.length} درس</span>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ rotate: expandedWeek === week.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-50 p-2 rounded-full"
                  >
                    <ChevronDown className="text-slate-400" size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedWeek === week.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 md:p-6 space-y-2 bg-slate-50/20">
                        {weekLessons.map((lesson, idx) => (
                          <LessonCard 
                            key={lesson.id}
                            lesson={lesson}
                            isCompleted={completedLessons.has(lesson.id)}
                            onClick={() => handleLessonOpen(lesson)}
                            index={idx}
                          />
                        ))}
                        {weekLessons.length === 0 && (
                          <div className="p-10 text-center text-slate-400 font-bold text-sm italic bg-white rounded-xl">
                            📭 لا يوجد محتوى متاح لهذا الأسبوع بعد.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <LessonViewerModal 
            lesson={selectedLesson} 
            onClose={() => setSelectedLesson(null)}
            allLessons={Object.values(lessonsMap).flat()}
            onNavigate={(lesson) => handleLessonOpen(lesson)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------
// Lesson Card Component
// ------------------------------
const LessonCard = ({ lesson, isCompleted, onClick, index }: { lesson: Lesson; isCompleted: boolean; onClick: () => void; index: number }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.01, x: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 md:p-5 bg-white rounded-xl md:rounded-2xl transition-all group border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2.5 md:p-3 rounded-xl transition-all ${
          lesson.type.startsWith('video') ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
          lesson.type === 'pdf' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' :
          'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
        }`}>
          {lesson.type.startsWith('video') ? <PlayCircle size={22} /> :
           lesson.type === 'pdf' ? <FileText size={22} /> :
           <BookOpen size={22} />}
        </div>
        <div className="text-right">
          <p className="text-sm md:text-base font-black group-hover:text-blue-600 transition-colors flex items-center gap-2">
            {lesson.name}
            {isCompleted && <CheckCircle size={16} className="text-emerald-500" />}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
            {lesson.type === 'video_exp' ? '🎬 فيديو شرح' :
             lesson.type === 'video_hw' ? '📝 فيديو حل واجب' :
             lesson.type === 'pdf' ? '📄 ملف PDF' :
             lesson.type === 'exam_mcq' ? '📋 اختبار MCQ' : '✍️ واجب MCQ'}
          </p>
        </div>
      </div>
      <div className="bg-slate-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Eye className="text-blue-600" size={18} />
      </div>
    </motion.button>
  );
};

// ------------------------------
// Lesson Viewer Modal with Navigation
// ------------------------------
const LessonViewerModal = ({ lesson, onClose, allLessons, onNavigate }: { 
  lesson: Lesson; 
  onClose: () => void; 
  allLessons: Lesson[];
  onNavigate: (lesson: Lesson) => void;
}) => {
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-5 md:p-6 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full shadow-md">
              <img src="/logo.png" className="w-8 h-8 rounded-full" alt="Master" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
            <div>
              <h4 className="font-black text-lg md:text-xl line-clamp-1 max-w-[180px] md:max-w-md text-slate-800">{lesson.name}</h4>
              <p className="text-[10px] font-black text-blue-600 tracking-wider uppercase">محمود الديب - اللغة العربية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prevLesson && (
              <button 
                onClick={() => onNavigate(prevLesson)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
              >
                <ArrowRight size={20} />
              </button>
            )}
            {nextLesson && (
              <button 
                onClick={() => onNavigate(nextLesson)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-900 flex items-center justify-center">
          {lesson.type.startsWith('video') ? (
            <EnhancedVideoPlayer url={lesson.url} />
          ) : lesson.type === 'pdf' ? (
            <EnhancedPdfViewer url={lesson.url} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gradient-to-br from-slate-50 to-white">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl"
              >
                <BookOpen className="text-white" size={40} />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-800">نافذة الاختبارات</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-md">اضغط على الزر لبدء الاختبار في نافذة جديدة</p>
              <a 
                href={lesson.url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-black hover:shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                بدء الاختبار <ChevronRight size={20} />
              </a>
            </div>
          )}
        </div>

        {/* Footer Description */}
        {lesson.description && (
          <div className="p-5 bg-white border-t border-slate-100 text-right">
            <p className="text-slate-500 font-medium text-sm italic">{lesson.description}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ------------------------------
// Enhanced Video Player with Plyr & Fallback
// ------------------------------
const EnhancedVideoPlayer = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
      console.error(e);
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
        invertTime: true,
        autoplay: true,
        muted: false,
        ratio: '16:9',
        clickToPlay: true,
        youtube: { noCookie: true, rel: 0, modestbranding: 1, autoplay: 1 },
        vimeo: { byline: false, portrait: false, title: false, autoplay: true }
      });

      setPlayer(plyrInstance);

      plyrInstance.on('ready', () => {
        setIsLoading(false);
        const playPromise = plyrInstance?.play();
        if (playPromise?.catch) playPromise.catch(() => console.log("Autoplay blocked"));
      });

      return () => { plyrInstance?.destroy(); };
    }
  }, [videoId, provider]);

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-white/70 bg-slate-800 rounded-xl">
        <PlayCircle size={48} className="mb-4 opacity-50" />
        <p className="font-bold">رابط الفيديو غير صالح</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div 
        ref={containerRef} 
        data-plyr-provider={provider} 
        data-plyr-embed-id={videoId} 
        className="w-full h-full"
      />
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
          >
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ------------------------------
// Enhanced PDF Viewer
// ------------------------------
const EnhancedPdfViewer = ({ url }: { url: string }) => {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }
  return (
    <div className="w-full h-full bg-slate-100">
      <iframe 
        src={embedUrl} 
        className="w-full h-full border-0"
        title="PDF Viewer"
        allow="autoplay"
      />
    </div>
  );
};

// ------------------------------
// Skeleton Loader Component
// ------------------------------
const SkeletonLoader = () => (
  <div className="min-h-screen bg-slate-50 animate-pulse">
    <div className="h-[50vh] bg-gradient-to-br from-slate-300 to-slate-400" />
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 mb-12">
        <div className="flex gap-6">
          <div className="h-12 w-24 bg-slate-200 rounded" />
          <div className="h-12 w-24 bg-slate-200 rounded" />
        </div>
        <div className="h-3 bg-slate-200 rounded-full mt-6" />
      </div>
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);