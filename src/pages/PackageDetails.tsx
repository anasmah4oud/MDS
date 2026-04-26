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
  LayoutDashboard, PlayCircle, Eye, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-black italic text-2xl animate-pulse">
       جاري تحضير المحتوى...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      {/* Background Hero */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden bg-slate-50">
        <img 
          src={pkg?.image_url || "https://placehold.co/1200x800"} 
          className="w-full h-full object-cover opacity-60 blur-sm scale-105" 
          alt="Package Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end p-6 md:p-20">
          <div className="max-w-7xl mx-auto w-full">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 md:mb-8 hover:text-blue-700 transition-colors">
               <ChevronRight size={20} /> لوحة التحكم
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              <div>
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4 inline-block shadow-lg shadow-blue-100">
                  {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}
                </span>
                <h1 className="text-3xl md:text-7xl font-black mb-3 md:mb-4 tracking-tighter leading-tight italic text-slate-900">
                  {pkg?.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium">{pkg?.description}</p>
              </div>
              
              <div className="flex items-center gap-6 md:gap-8 bg-white/80 backdrop-blur-xl border border-slate-200/50 p-6 md:p-8 rounded-[32px] md:rounded-[40px] px-8 md:px-12 shadow-xl shadow-slate-200/20">
                 <div className="text-center">
                    <p className="text-xs md:text-sm font-bold text-slate-400 mb-1">الأسابيع</p>
                    <p className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">{weeks.length}</p>
                 </div>
                 <div className="w-px h-10 md:h-12 bg-slate-200" />
                 <div className="text-center">
                    <p className="text-xs md:text-sm font-bold text-slate-400 mb-1">المحاضرات</p>
                    <p className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">
                      {Object.values(lessonsMap).reduce((acc: number, curr) => acc + (curr as Lesson[]).length, 0)}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <h3 className="text-2xl md:text-3xl font-black mb-8 md:mb-12 flex items-center gap-4 italic underline decoration-blue-500 decoration-4 underline-offset-8 text-slate-900">
          محتوى الباقة
        </h3>

        <div className="space-y-4">
          {weeks.map((week, index) => (
            <div key={week.id} className="rounded-[24px] md:rounded-[28px] overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-slate-50/50 transition-all text-right"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-800">{week.name}</h4>
                    <p className="text-slate-500 font-bold text-xs md:text-sm">{week.description}</p>
                  </div>
                </div>
                <div className={`transition-transform duration-300 ${expandedWeek === week.id ? 'rotate-180' : ''}`}>
                  <ChevronDown className="text-slate-300" />
                </div>
              </button>

              <AnimatePresence>
                {expandedWeek === week.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50/30"
                  >
                    <div className="p-4 md:p-8 pt-0 space-y-2 md:space-y-3">
                      {(lessonsMap[week.id] || []).map((lesson) => (
                        <button 
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className="w-full flex items-center justify-between p-4 md:p-6 bg-white hover:bg-white rounded-[18px] md:rounded-2xl transition-all group border border-slate-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-colors ${
                               lesson.type.startsWith('video') ? 'bg-blue-50 text-blue-600' :
                               lesson.type === 'pdf' ? 'bg-emerald-50 text-emerald-600' :
                               'bg-orange-50 text-orange-600'
                             }`}>
                                {lesson.type.startsWith('video') ? <PlayCircle size={22} /> :
                                 lesson.type === 'pdf' ? <FileText size={22} /> :
                                 <BookOpen size={22} />}
                             </div>
                             <div className="text-right">
                                <p className="text-sm md:text-base font-black group-hover:text-blue-600 transition-colors text-slate-800">{lesson.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                  {lesson.type === 'video_exp' ? 'فيديو شرح' :
                                   lesson.type === 'video_hw' ? 'فيديو حل واجب' :
                                   lesson.type === 'pdf' ? 'ملف PDF' :
                                   lesson.type === 'exam_mcq' ? 'امتحان MCQ' : 'واجب MCQ'}
                                </p>
                             </div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                             <Eye className="text-blue-600" size={18} />
                          </div>
                        </button>
                      ))}
                      {(!lessonsMap[week.id] || lessonsMap[week.id].length === 0) && (
                        <div className="p-8 text-center text-slate-400 font-bold text-sm italic">لا يوجد محتوى متاح لهذا الأسبوع بعد.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>

      {/* Lesson Viewer Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-8 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedLesson(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white md:rounded-[32px] lg:rounded-[40px] overflow-hidden flex flex-col shadow-2xl border border-white/20"
            >
              {/* Modal Header */}
              <div className="p-5 md:p-8 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-1 bg-blue-50 rounded-full shadow-sm shadow-blue-100/50">
                      <img src="/logo.png" className="w-8 h-8 md:w-10 md:h-10 rounded-full" alt="Master" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg md:text-xl truncate max-w-[180px] md:max-w-md text-slate-900">{selectedLesson.name}</h4>
                      <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase italic">محمود الديب - مادة اللغة العربية</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setSelectedLesson(null)}
                  className="p-2.5 md:p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all hover:rotate-90"
                 >
                   <X size={22} />
                 </button>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 overflow-hidden relative bg-slate-50 flex items-center justify-center">
                 {selectedLesson.type.startsWith('video') ? (
                    <VideoPlayer url={selectedLesson.url} />
                 ) : selectedLesson.type === 'pdf' ? (
                    <PdfViewer url={selectedLesson.url} />
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center">
                       <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-sm">
                          <BookOpen className="text-blue-600" size={40} />
                       </div>
                       <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 italic tracking-tight text-slate-900">نافذة الاختبارات</h3>
                       <p className="text-lg md:text-xl text-slate-500 font-bold mb-8 md:mb-12 max-w-md">يرجى الضغط على الزر أدناه لفتح الاختبار في نافذة منفصلة أو اتباع التعليمات الممنوحة لك.</p>
                       <a 
                        href={selectedLesson.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-blue-600 text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                       >
                         بدء الاختبار الآن
                       </a>
                    </div>
                 )}
              </div>

              {/* Footer / Description */}
              <div className="p-6 md:p-8 bg-white border-t border-slate-100 text-right hidden md:block">
                 <p className="text-slate-500 font-bold leading-relaxed italic">{selectedLesson.description || "لا يوجد وصف إضافي لهذا المحتوى. بالتوفيق يا بطل!"}</p>
              </div>
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
        muted: false, // Attempt unmuted first
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
        // Fallback for strict browsers: if autoplay fails, try playing after a tiny delay
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
    <div className="w-full h-full flex items-center justify-center bg-slate-50 relative group overflow-hidden">
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
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50"
              >
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold animate-pulse italic">جاري تشغيل الفيديو...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central Play/Pause Indicator for UX */}
          {!isLoading && (
            <div 
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${player?.playing ? 'opacity-0 outline-none' : 'opacity-100'}`}
            >
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center text-blue-600 transform transition-all border border-white">
                  {player?.playing ? <div className="w-6 h-6 flex gap-1.5"><div className="w-2 h-full bg-blue-600 rounded-full"/><div className="w-2 h-full bg-blue-600 rounded-full"/></div> : <Play size={32} className="mr-1 md:w-10 md:h-10" />}
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center">
              <PlayCircle size={40} className="text-slate-200" />
           </div>
           <p className="font-bold italic">رابط الفيديو غير متاح حالياً.</p>
        </div>
      )}

      {/* Security Overlay */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black tracking-widest text-white/20 uppercase">
          PROTECTED CONTENT • BARA' PLATFORM
        </div>
      </div>
    </div>
  );
}

function PdfViewer({ url }: { url: string }) {
  // Convert Google Drive link to direct viewer embed if possible
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-50">
      <iframe 
        src={embedUrl} 
        className="w-full h-full border-none"
        title="PDF Viewer"
        allow="autoplay"
      />
    </div>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <X size={size} strokeWidth={3} />
  );
}
