/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, CheckCircle, 
  Lock, Calendar, BookOpen, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// --- حركات Framer Motion مجهزة مسبقاً ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
        
        // فتح أول أسبوع تلقائياً إذا كان موجوداً
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-blue-600 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full animate-pulse" />
        <BookOpen size={48} className="animate-bounce relative z-10" />
      </div>
      <p className="font-black italic text-xl text-slate-800 animate-pulse">جاري تحضير المحتوى الساحر...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden" dir="rtl">
      
      {/* Background Hero Section */}
      <div className="relative h-[45vh] md:h-[65vh] overflow-hidden bg-slate-900">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={pkg?.image_url || "https://placehold.co/1200x800"} 
          className="absolute inset-0 w-full h-full object-cover blur-[2px]" 
          alt="Package Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-end p-6 md:p-20 z-10">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full font-bold mb-6 md:mb-8 hover:bg-white hover:shadow-lg transition-all">
                 <ChevronRight size={18} /> العودة للوحة التحكم
              </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 flex items-center gap-2">
                    <Sparkles size={14} />
                    {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}
                  </span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black mb-3 md:mb-4 tracking-tighter leading-tight text-slate-900 drop-shadow-sm">
                  {pkg?.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 inline-block">
                  {pkg?.description}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="flex items-center gap-6 md:gap-10 bg-white/70 backdrop-blur-xl border border-white shadow-2xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] px-8 md:px-12"
              >
                 <div className="text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                      <Calendar size={24} />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-1">الأسابيع</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-800">{weeks.length}</p>
                 </div>
                 <div className="w-px h-20 md:h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                 <div className="text-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                      <PlayCircle size={24} />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-1">المحاضرات</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-800">
                      {Object.values(lessonsMap).reduce((acc: number, curr) => acc + (curr as Lesson[]).length, 0)}
                    </p>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
          <h3 className="text-2xl md:text-3xl font-black text-slate-900">
            المحتوى التعليمي
          </h3>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {weeks.map((week, index) => (
            <motion.div 
              key={week.id} 
              variants={itemVariants}
              layout
              className={`rounded-[24px] md:rounded-[32px] overflow-hidden border transition-all duration-300 ${expandedWeek === week.id ? 'bg-white border-blue-100 shadow-xl shadow-blue-900/5' : 'bg-white/60 border-slate-200/60 hover:bg-white hover:shadow-md'}`}
            >
              <button 
                onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                className="w-full flex items-center justify-between p-5 md:p-8 text-right focus:outline-none group"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[20px] flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-300 ${expandedWeek === week.id ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`text-lg md:text-2xl font-black transition-colors ${expandedWeek === week.id ? 'text-blue-950' : 'text-slate-800'}`}>
                      {week.name}
                    </h4>
                    <p className="text-slate-500 font-bold text-xs md:text-sm mt-1">{week.description}</p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${expandedWeek === week.id ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>

              <AnimatePresence>
                {expandedWeek === week.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-slate-50/50 border-t border-slate-100/50"
                  >
                    <div className="p-4 md:p-8 space-y-3 md:space-y-4">
                      {(lessonsMap[week.id] || []).map((lesson, idx) => (
                        <motion.button 
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (lesson.type.startsWith('video')) {
                              navigate(`/video/${lesson.id}`);
                            } else {
                              setSelectedLesson(lesson);
                            }
                          }}
                          className="w-full flex items-center justify-between p-4 md:p-6 bg-white rounded-[20px] md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                               lesson.type.startsWith('video') ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                               lesson.type === 'pdf' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                               'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                             }`}>
                                {lesson.type.startsWith('video') ? <PlayCircle size={24} /> :
                                 lesson.type === 'pdf' ? <FileText size={24} /> :
                                 <BookOpen size={24} />}
                             </div>
                             <div className="text-right">
                                <p className="text-sm md:text-lg font-black text-slate-800 group-hover:text-blue-700 transition-colors">{lesson.name}</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                                  <Clock size={12} className="inline" />
                                  {lesson.type === 'video_exp' ? 'فيديو شرح تفصيلي' :
                                   lesson.type === 'video_hw' ? 'فيديو حل وتطبيق' :
                                   lesson.type === 'pdf' ? 'ملزمة PDF' :
                                   lesson.type === 'exam_mcq' ? 'اختبار إلكتروني' : 'واجب إلكتروني'}
                                </p>
                             </div>
                          </div>
                          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                             <Eye size={18} />
                          </div>
                        </motion.button>
                      ))}
                      {(!lessonsMap[week.id] || lessonsMap[week.id].length === 0) && (
                        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                          <BookOpen className="mx-auto text-slate-300 mb-3" size={32} />
                          <p className="text-slate-500 font-bold text-sm italic">جاري تجهيز محتوى هذا الأسبوع، كن مستعداً يا بطل!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Modern Lesson Viewer Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/20 border border-white"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                 <div className="flex items-center gap-4">
                    <div className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <img src="/logo.png" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-contain" alt="Master" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg md:text-2xl text-slate-900 truncate max-w-[200px] md:max-w-md">{selectedLesson.name}</h4>
                      <p className="text-xs font-bold text-blue-600 mt-1">البارع محمود الديب</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setSelectedLesson(null)}
                  className="w-12 h-12 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
                 >
                   <X size={24} strokeWidth={2.5} />
                 </button>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 overflow-hidden relative bg-[#F8FAFC] flex items-center justify-center">
                 {selectedLesson.type.startsWith('video') ? (
                    <VideoPlayer url={selectedLesson.url} />
                 ) : selectedLesson.type === 'pdf' ? (
                    <PdfViewer url={selectedLesson.url} />
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center">
                       <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[32px] flex items-center justify-center mb-8 shadow-inner"
                       >
                          <BookOpen className="text-blue-600 w-12 h-12 md:w-16 md:h-16" />
                       </motion.div>
                       <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">نافذة الاختبار التفاعلي</h3>
                       <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
                         حان وقت تقييم مستواك! اضغط على الزر بالأسفل لبدء الاختبار في بيئة مخصصة.
                       </p>
                       <motion.a 
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        href={selectedLesson.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-3"
                       >
                         بدء الاختبار الآن <ChevronRight size={24} />
                       </motion.a>
                    </div>
                 )}
              </div>

              {/* Footer / Description */}
              {selectedLesson.description && (
                <div className="p-6 md:p-8 bg-white border-t border-slate-100 text-right">
                   <div className="flex items-start gap-3">
                     <Sparkles className="text-amber-400 mt-1 flex-shrink-0" size={20} />
                     <p className="text-slate-600 font-medium leading-relaxed md:text-lg">{selectedLesson.description}</p>
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

function VideoPlayer({ url }: { url: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [videoId, setVideoId] = React.useState('');
  const [provider, setProvider] = React.useState<'youtube' | 'vimeo'>('youtube');
  const [isValid, setIsValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [player, setPlayer] = React.useState<Plyr | null>(null);

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
          
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={20} className="text-blue-500 ml-1 opacity-50" />
                  </div>
                </div>
                <p className="text-white mt-6 font-bold tracking-widest text-sm animate-pulse">جاري التحميل...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <div 
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${player?.playing ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}
            >
               <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                  {player?.playing ? (
                    <div className="w-8 h-8 flex gap-2"><div className="w-2 h-full bg-white rounded-full"/><div className="w-2 h-full bg-white rounded-full"/></div>
                  ) : (
                    <Play size={40} className="ml-2 drop-shadow-md" fill="currentColor" />
                  )}
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4 bg-slate-50 w-full h-full">
           <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100">
              <PlayCircle size={48} className="text-slate-300" />
           </div>
           <p className="font-bold text-lg">عذراً، رابط الفيديو غير متاح حالياً.</p>
        </div>
      )}

      {/* Security Overlay */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest text-white/80 uppercase border border-white/10 shadow-lg">
          منصة البارع • حقوق النشر محفوظة
        </div>
      </div>
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
    <div className="w-full h-full bg-slate-100/50 relative">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <FileText size={48} className="text-slate-300" />
           <p className="text-slate-400 font-bold">جاري تحميل الملف...</p>
        </div>
      </div>
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