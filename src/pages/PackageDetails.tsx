/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, CheckCircle, 
  Lock, Calendar, BookOpen, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Layers, Video, HelpCircle, Award, ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// --- حركات Framer Motion المحسنة للأداء ---
const pageFadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.98, y: 20, transition: { duration: 0.2 } }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-5 px-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full animate-pulse" />
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <BookOpen size={28} className="absolute text-indigo-600 animate-bounce" />
      </div>
      <div className="text-center">
        <p className="font-black text-xl text-slate-800 tracking-tight">جاري تجهيز محاضراتك</p>
        <p className="text-sm text-slate-400 font-medium mt-1">منصة البارع ترحب بك دائمًا</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 overflow-x-hidden antialiased selection:bg-indigo-100" dir="rtl">
      
      {/* غطاء الخلفية العلوي المتدرج بدلاً من الصورة الداكنة المجهدة للعين */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-indigo-50/70 via-slate-50/40 to-transparent pointer-events-none" />

      {/* الهيكل الرئيسي للمحتوى */}
      <motion.div 
        variants={pageFadeIn}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 pt-6 pb-24 relative z-10"
      >
        {/* زر العودة الذكي للموبايل والديسك توب */}
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/dashboard" 
            className="group flex items-center gap-2 text-slate-600 bg-white border border-slate-100 shadow-sm px-4 py-2.5 rounded-2xl text-sm font-bold hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all active:scale-95"
          >
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /> 
            <span>العودة للوحة التحكم</span>
          </Link>
        </div>

        {/* كارت البطاقة التعريفية للباقة (Hero Card) - بتصميم فائق الفخامة يناسب الموبايل */}
        <div className="bg-white border border-slate-100 shadow-[0_4px_30px_rgba(15,23,42,0.03)] rounded-[32px] p-5 md:p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-violet-400/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="animate-pulse" />
                  {pkg?.type === 'offer' ? 'عرض خاص ومميز' : 'باقة تعليمية متكاملة'}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {pkg?.name}
              </h1>
              
              <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                {pkg?.description}
              </p>
            </div>

            {/* العدادات والإحصائيات كلوحة منفصلة سريعة الاستجابة */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 lg:w-[340px] shrink-0">
              <div className="bg-white p-3.5 rounded-xl border border-slate-100/80 shadow-inner text-center">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar size={16} />
                </div>
                <p className="text-[11px] font-bold text-slate-400">الأسابيع المتاحة</p>
                <p className="text-xl font-black text-slate-800 mt-0.5">{weeks.length}</p>
              </div>
              
              <div className="bg-white p-3.5 rounded-xl border border-slate-100/80 shadow-inner text-center">
                <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Layers size={16} />
                </div>
                <p className="text-[11px] font-bold text-slate-400">مجموع العناصر</p>
                <p className="text-xl font-black text-slate-800 mt-0.5">
                  {Object.values(lessonsMap).reduce((acc: number, curr) => acc + (curr as Lesson[]).length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* قسم المحتوى والمحاضرات الهيكلي */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 mb-6 px-1">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-xl md:text-2xl font-black text-slate-800">الخطة الدراسية للباقة</h2>
          </div>

          {/* قائمة الأسابيع التفاعلية */}
          <motion.div 
            variants={containerVariants}
            className="space-y-3"
          >
            {weeks.map((week, index) => {
              const isWeekExpanded = expandedWeek === week.id;
              const currentWeekLessons = lessonsMap[week.id] || [];

              return (
                <motion.div 
                  key={week.id} 
                  variants={itemVariants}
                  layout="position"
                  className={`rounded-2xl border transition-all duration-300 ${
                    isWeekExpanded 
                      ? 'bg-white border-indigo-100 shadow-[0_10px_25px_rgba(99,102,241,0.04)] ring-1 ring-indigo-500/5' 
                      : 'bg-white border-slate-100 shadow-sm hover:border-slate-200/80'
                  }`}
                >
                  {/* رأس الأسبوع القابل للضغط */}
                  <button 
                    onClick={() => setExpandedWeek(isWeekExpanded ? null : week.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-right focus:outline-none"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* الرقم الترتيبي المستدير */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all duration-300 ${
                        isWeekExpanded 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className={`text-base md:text-lg font-black truncate transition-colors ${isWeekExpanded ? 'text-indigo-600' : 'text-slate-800'}`}>
                          {week.name}
                        </h3>
                        {week.description && (
                          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{week.description}</p>
                        )}
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 shrink-0 ${
                      isWeekExpanded ? 'bg-indigo-50 text-indigo-600 border-indigo-100 rotate-180' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* المحاضرات المدرجة تحت الأسبوع */}
                  <AnimatePresence initial={false}>
                    {isWeekExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden bg-slate-50/50 border-t border-slate-50"
                      >
                        <div className="p-4 space-y-2.5">
                          {currentWeekLessons.map((lesson) => {
                            // تخصيص الألوان والأيقونات بناءً على نوع الدرس لسهولة الفهم البصري
                            const isVideo = lesson.type.startsWith('video');
                            const isPdf = lesson.type === 'pdf';
                            const isExam = lesson.type.includes('exam') || lesson.type.includes('hw');
                            
                            let iconElement = <BookOpen size={18} />;
                            let badgeText = 'محتوى تعليمي';
                            let themeClass = 'bg-slate-50 text-slate-600 border-slate-100';

                            if (isVideo) {
                              iconElement = <Video size={18} />;
                              badgeText = lesson.type === 'video_exp' ? 'فيديو شرح' : 'فيديو تطبيق';
                              themeClass = 'bg-blue-50 text-blue-600 border-blue-100/50';
                            } else if (isPdf) {
                              iconElement = <FileText size={18} />;
                              badgeText = 'ملف ملزمة PDF';
                              themeClass = 'bg-emerald-50 text-emerald-600 border-emerald-100/50';
                            } else if (isExam) {
                              iconElement = <Award size={18} />;
                              badgeText = lesson.type === 'exam_mcq' ? 'اختبار إلكتروني' : 'واجب إلكتروني';
                              themeClass = 'bg-amber-50 text-amber-600 border-amber-100/50';
                            }

                            return (
                              <button 
                                key={lesson.id}
                                onClick={() => {
                                  if (isVideo) {
                                    navigate(`/video/${lesson.id}`);
                                  } else {
                                    setSelectedLesson(lesson);
                                  }
                                }}
                                className="w-full text-right p-3.5 bg-white border border-slate-100 hover:border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 group active:scale-[0.99]"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${themeClass} group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600`}>
                                    {iconElement}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                                      {lesson.name}
                                    </p>
                                    <span className="inline-block text-[10px] font-extrabold text-slate-400 mt-0.5">
                                      {badgeText}
                                    </span>
                                  </div>
                                </div>

                                <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                  <Eye size={14} />
                                </div>
                              </button>
                            );
                          })}

                          {currentWeekLessons.length === 0 && (
                            <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-200">
                              <BookOpen className="mx-auto text-slate-300 mb-2" size={24} />
                              <p className="text-xs text-slate-400 font-bold italic">جاري إعداد ورفع المحاضرات لهذا الأسبوع.</p>
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
        </div>
      </motion.div>

      {/* مودال العرض المطور (Lesson Viewer Modal) - يفتح لـ PDF والاختبارات التفاعلية كصفحة تغطية ممتازة */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedLesson(null)}
            />
            
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative w-full h-full sm:max-w-5xl sm:h-[85vh] bg-white sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* هيدر المودال */}
              <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-20 shrink-0">
                 <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0">
                      <Layers size={18} className="text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-sm md:text-lg text-slate-800 truncate max-w-[180px] sm:max-w-md">
                        {selectedLesson.name}
                      </h4>
                      <p className="text-[10px] font-bold text-indigo-500 mt-0.5">منصة البارع التعليمية</p>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => setSelectedLesson(null)}
                  className="w-9 h-9 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-100 rounded-xl flex items-center justify-center transition-colors"
                 >
                   <X size={16} />
                 </button>
              </div>

              {/* منطقة محتوى المودال المرن */}
              <div className="flex-1 overflow-hidden relative bg-slate-50 flex items-center justify-center">
                 {selectedLesson.type === 'pdf' ? (
                    <PdfViewer url={selectedLesson.url} />
                 ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 max-w-md w-full">
                       <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                         <Award className="text-amber-500 w-8 h-8" />
                       </div>
                       <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">الاختبار جاهز لك الآن!</h3>
                       <p className="text-xs md:text-sm text-slate-400 font-medium mb-6 leading-relaxed">
                         اضغط على الزر بالأسفل للانتقال الفوري لنافذة الاختبار التفاعلي المنفصلة لضمان استقرار الإجابة والأداء.
                       </p>
                       <motion.a 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={selectedLesson.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl text-sm font-black shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                       >
                         <span>ابدأ الاختبار التفاعلي</span>
                         <ArrowLeft size={16} />
                       </motion.a>
                    </div>
                 )}
              </div>

              {/* فوتر اختياري مخصص للوصف والدعم البصري */}
              {selectedLesson.description && (
                <div className="p-4 bg-white border-t border-slate-50 text-right shrink-0">
                   <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <Sparkles className="text-amber-500 mt-0.5 shrink-0" size={14} />
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">{selectedLesson.description}</p>
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

// --- مشغل الفيديو الذكي والمحمي بقفل الكليكات المزعجة (Video Player Component) ---
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
        ratio: '16:9',
        clickToPlay: true,
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, autoplay: 1 },
        vimeo: { byline: false, portrait: false, title: false, transparent: false, autoplay: true }
      });

      setPlayer(plyrInstance);

      plyrInstance.on('ready', () => {
        setIsLoading(false);
        plyrInstance?.play()?.catch(() => console.log("Autoplay context pending user gesture"));
      });

      plyrInstance.on('play', () => setIsLoading(false));

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
      player.playing ? player.pause() : player.play();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 relative group overflow-hidden">
      {isValid ? (
        <div className="w-full h-full relative" onClick={handleManualToggle}>
          <div 
            key={`${provider}-${videoId}`} 
            ref={containerRef} 
            data-plyr-provider={provider} 
            data-plyr-embed-id={videoId} 
            className="w-full h-full pointer-events-none"
          />
          
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/95"
              >
                <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-white/70 text-xs font-bold mt-4 tracking-wider animate-pulse">جاري تهيئة البث المتوازن...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-3 bg-slate-900 w-full h-full">
          <PlayCircle size={36} className="text-slate-600" />
          <p className="font-bold text-sm text-white/90">رابط الفيديو غير صالح أو تم نقله.</p>
        </div>
      )}

      {/* غطاء حماية العلامة المائية ومنع القرصنة بشكل احترافي ناعم */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black tracking-wider text-white/80 border border-white/5 shadow-md">
          منصة البارع • محمية بحقوق الطبع
        </div>
      </div>
    </div>
  );
}

// --- مشغل ملفات الملازم والمستندات (PDF Viewer Component) ---
function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-100 relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 gap-3">
         <FileText size={36} className="text-indigo-200 animate-pulse" />
         <p className="text-slate-400 font-bold text-xs">جاري سحب مستند الملزمة...</p>
      </div>
      <iframe 
        src={embedUrl} 
        className="relative z-10 w-full h-full border-none"
        title="PDF Viewer"
        allow="autoplay"
        loading="lazy"
      />
    </div>
  );
}