/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Zap, Star, ArrowUpRight, GraduationCap, Trophy,
  Layers, Infinity, BookOpen, Calendar, CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ==================== حركات ساحرة ====================
const floatingAnimation = {
  y: [0, -12, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
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
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

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
        
        // تحديد الأسبوع الأول تلقائياً
        if (weeksList.length > 0) {
          setSelectedWeekId(weeksList[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalLessons = Object.values(lessonsMap).reduce(
    (acc, curr) => acc + (curr as Lesson[]).length, 0
  );

  const currentWeek = weeks.find(w => w.id === selectedWeekId);
  const currentLessons = selectedWeekId ? (lessonsMap[selectedWeekId] || []) : [];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-white gap-8">
      <motion.div 
        animate={floatingAnimation}
        className="relative"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 blur-xl"
        />
        <GraduationCap size={48} className="absolute inset-0 m-auto text-blue-600" />
      </motion.div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-black text-2xl text-slate-800"
      >
        جاري تجهيز رحلتك التعليمية
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden" dir="rtl">
      
      {/* ========== هيكل الصفحة الرئيسي ========== */}
      <div className="flex flex-col lg:flex-row h-screen">
        
        {/* ---------- الشريط الجانبي (الجدول الزمني) ---------- */}
        <aside className="lg:w-72 xl:w-80 bg-white/80 backdrop-blur-xl border-l border-slate-200/60 flex flex-col overflow-hidden lg:overflow-y-auto shadow-xl shadow-slate-200/50 z-20">
          {/* رأس الباقة في الشريط الجانبي */}
          <div className="p-6 md:p-8 border-b border-slate-100">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-bold text-sm mb-6 hover:bg-blue-100 transition-all"
            >
              <ChevronRight size={16} /> لوحة التحكم
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={20} className="text-white" />
              </motion.div>
              <h2 className="font-black text-xl md:text-2xl text-slate-900 truncate">
                {pkg?.name}
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
              {pkg?.description}
            </p>
            
            {/* إحصائيات مصغرة */}
            <div className="flex items-center gap-6 mt-6 text-slate-600">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Calendar size={16} className="text-blue-500" />
                {weeks.length} أسابيع
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <PlayCircle size={16} className="text-indigo-500" />
                {totalLessons} محاضرة
              </div>
            </div>
          </div>

          {/* قائمة الأسابيع العمودية */}
          <nav className="flex-1 p-4 md:p-6 space-y-2 overflow-y-auto">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">المحتوى</p>
            {weeks.map((week, idx) => {
              const isActive = selectedWeekId === week.id;
              const weekLessonCount = (lessonsMap[week.id] || []).length;
              return (
                <motion.button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl text-right transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {/* شريط جانبي نشط */}
                  {isActive && (
                    <motion.div
                      layoutId="activeWeekIndicator"
                      className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {idx + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate text-sm ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                      {week.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <BookOpen size={10} />
                      <span>{weekLessonCount} دروس</span>
                    </div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <ChevronRight size={16} className="text-blue-500" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>
          
          {/* شريط التقدم السفلي في الجدول الزمني */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Trophy size={18} className="text-amber-500" />
              <span className="font-bold">0% مكتمل</span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '0%' }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>
        </aside>

        {/* ---------- منطقة المحتوى الرئيسية ---------- */}
        <main ref={mainRef} className="flex-1 flex flex-col overflow-hidden">
          {/* شريط علوي للهواتف (أسابيع أفقية) */}
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-2 overflow-x-auto flex gap-2 shadow-sm">
            {weeks.map((week, idx) => {
              const isActive = selectedWeekId === week.id;
              return (
                <motion.button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  {week.name}
                </motion.button>
              );
            })}
          </div>

          {/* رأس الأسبوع المحدد */}
          <div className="p-6 md:p-10 border-b border-slate-100 bg-white/60 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {currentWeek ? (
                <motion.div
                  key={currentWeek.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg"
                    >
                      {weeks.findIndex(w => w.id === currentWeek.id) + 1}
                    </motion.div>
                    <div>
                      <h1 className="text-2xl md:text-4xl font-black text-slate-900">
                        {currentWeek.name}
                      </h1>
                      {currentWeek.description && (
                        <p className="text-slate-500 mt-1 text-sm md:text-base">{currentWeek.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-slate-400 text-center py-8">اختر أسبوعاً من القائمة</div>
              )}
            </AnimatePresence>
          </div>

          {/* شبكة الدروس */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-gradient-to-b from-slate-50 to-white">
            {currentLessons.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
              >
                {currentLessons.map((lesson, idx) => (
                  <motion.button
                    key={lesson.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (lesson.type.startsWith('video')) {
                        navigate(`/video/${lesson.id}`);
                      } else {
                        setSelectedLesson(lesson);
                      }
                    }}
                    className="group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 text-right shadow-md hover:shadow-2xl transition-shadow border border-slate-100 overflow-hidden"
                  >
                    {/* تأثير زجاجي متحرك */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 space-y-4">
                      {/* الأيقونة والنوع */}
                      <div className="flex items-center justify-between">
                        <motion.span 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl ${
                            lesson.type.startsWith('video') 
                              ? 'bg-blue-100 text-blue-600' 
                              : lesson.type === 'pdf'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-orange-100 text-orange-600'
                          }`}
                        >
                          {lesson.type.startsWith('video') ? <PlayCircle size={24} /> :
                           lesson.type === 'pdf' ? <FileText size={24} /> :
                           <BookOpen size={24} />}
                        </motion.span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                          {lesson.type === 'video_exp' ? 'شرح' :
                           lesson.type === 'video_hw' ? 'تطبيق' :
                           lesson.type === 'pdf' ? 'PDF' : 'اختبار'}
                        </span>
                      </div>
                      
                      <h3 className="font-black text-lg md:text-xl text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {lesson.name}
                      </h3>
                      
                      {lesson.description && (
                        <p className="text-slate-500 text-sm line-clamp-2">{lesson.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={14} /> متاح الآن
                        </span>
                        <motion.span 
                          whileHover={{ x: -3 }}
                          className="text-blue-500 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          شاهد <Eye size={16} />
                        </motion.span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">لا توجد دروس في هذا الأسبوع بعد</p>
                <p className="text-sm">ترقب التحديثات قريباً</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* ========== نافذة عرض الدرس ========== */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[90vh] bg-white md:rounded-4xl overflow-hidden flex flex-col shadow-2xl shadow-blue-900/30 border border-white/50"
            >
              <div className="p-4 md:p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <GraduationCap size={24} className="text-blue-600" />
                  <h4 className="font-black text-lg md:text-xl truncate">{selectedLesson.name}</h4>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedLesson(null)}
                  className="w-10 h-10 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full flex items-center justify-center"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="flex-1 bg-black relative">
                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-slate-50 to-white">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring" }}
                      className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6"
                    >
                      <BookOpen size={40} className="text-blue-600" />
                    </motion.div>
                    <h3 className="text-3xl font-black mb-4">اختبار تفاعلي</h3>
                    <p className="text-slate-500 mb-8">اضغط بالأسفل لبدء الاختبار</p>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedLesson.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl"
                    >
                      ابدأ الآن <ArrowUpRight size={20} className="inline mr-1" />
                    </motion.a>
                  </div>
                )}
              </div>
              
              {selectedLesson.description && (
                <div className="p-4 md:p-6 bg-white border-t">
                  <p className="text-slate-600">{selectedLesson.description}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== مكونات الفيديو والـ PDF (بدون تغيير جوهري) ====================
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
        settings: ['quality', 'speed'],
        invertTime: true,
        autoplay: true,
        muted: false,
        ratio: '16:9',
        clickToPlay: true,
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, autoplay: 1 },
        vimeo: { byline: false, portrait: false, title: false, transparent: false, autoplay: true, muted: false }
      });
      setPlayer(plyrInstance);
      plyrInstance.on('ready', () => setIsLoading(false));
      return () => plyrInstance?.destroy();
    }
  }, [videoId, provider]);

  return (
    <div className="w-full h-full bg-black relative">
      {isValid ? (
        <div className="w-full h-full" onClick={() => player?.playing ? player.pause() : player?.play()}>
          <div key={`${provider}-${videoId}`} ref={containerRef} data-plyr-provider={provider} data-plyr-embed-id={videoId} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400">الرابط غير صالح</div>
      )}
    </div>
  );
}

function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }
  return (
    <div className="w-full h-full relative bg-slate-100">
      <iframe src={embedUrl} className="w-full h-full border-none" title="PDF" />
    </div>
  );
}