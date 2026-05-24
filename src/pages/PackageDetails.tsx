/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, Clock, Sparkles,
  LayoutDashboard, PlayCircle, Eye, X, Star,
  ArrowUpRight, GraduationCap, Trophy, BookOpen, Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ==================== حركات ====================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 20 } }
};

export default function PackageDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<number, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeWeekTab, setActiveWeekTab] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

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

      if (subError || !subData) { navigate('/classes'); return; }

      const { data: pkgData } = await supabase.from('packages').select('*').eq('id', id).single();
      setPkg(pkgData as Package);

      const { data: weeksList } = await supabase.from('weeks').select('*').eq('package_id', id).order('id');
      setWeeks(weeksList as Week[]);

      const ids = weeksList.map(w => w.id);
      if (ids.length > 0) {
        const { data: lessonsData } = await supabase.from('lessons').select('*').in('week_id', ids);
        const map: Record<number, Lesson[]> = {};
        lessonsData.forEach(l => {
          if (!map[l.week_id]) map[l.week_id] = [];
          map[l.week_id].push(l as Lesson);
        });
        setLessonsMap(map);
        setActiveWeekTab(ids[0]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const totalLessons = Object.values(lessonsMap).reduce((a, b) => a + b.length, 0);
  const activeLessons = activeWeekTab ? lessonsMap[activeWeekTab] || [] : [];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
      <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
        <GraduationCap size={32} className="text-blue-600" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden" dir="rtl">
      
      {/* ========== الهيرو ========== */}
      <motion.header 
        ref={heroRef}
        initial="hidden"
        animate={isHeroInView ? "show" : "hidden"}
        variants={stagger}
        className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-10 bg-gradient-to-b from-blue-50/50 to-white"
      >
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          {/* رابط العودة */}
          <motion.div variants={fadeUp}>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:bg-white transition-all">
              <ChevronRight size={18} /> لوحة التحكم
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* العنوان والوصف */}
            <motion.div variants={fadeUp} className="space-y-4 max-w-2xl">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-200"
              >
                <Sparkles size={14} /> {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}
              </motion.span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-800">
                {pkg?.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                {pkg?.description}
              </p>
            </motion.div>

            {/* بطاقات الإحصائيات */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 md:gap-6">
              {[
                { icon: Calendar, label: 'أسابيع', value: weeks.length, color: 'blue' },
                { icon: PlayCircle, label: 'محاضرات', value: totalLessons, color: 'indigo' },
                { icon: Trophy, label: 'مكتمل', value: '0%', color: 'amber' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 min-w-[120px] flex flex-col items-center gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-center">
                    <span className="text-2xl md:text-3xl font-black text-slate-800">{stat.value}</span>
                    <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ========== شريط الأسابيع (Tabs) ========== */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-10 flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {weeks.map((week, idx) => {
            const isActive = activeWeekTab === week.id;
            return (
              <motion.button
                key={week.id}
                onClick={() => setActiveWeekTab(week.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="weekTabBg"
                    className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                الأسبوع {idx + 1}: {week.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========== قائمة الدروس ========== */}
      <section className="max-w-6xl mx-auto px-4 md:px-10 py-10 md:py-16">
        <motion.div 
          key={activeWeekTab}
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {activeLessons.map((lesson, idx) => (
            <motion.article
              key={lesson.id}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              onClick={() => {
                if (lesson.type.startsWith('video')) navigate(`/video/${lesson.id}`);
                else setSelectedLesson(lesson);
              }}
              className="group relative bg-white rounded-3xl p-6 shadow-lg shadow-slate-100 border border-slate-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/30 transition-all cursor-pointer overflow-hidden"
            >
              {/* ضوء متحرك */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    lesson.type.startsWith('video') ? 'bg-blue-50 text-blue-600' :
                    lesson.type === 'pdf' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {lesson.type.startsWith('video') ? <PlayCircle size={22} /> :
                     lesson.type === 'pdf' ? <FileText size={22} /> : <BookOpen size={22} />}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {lesson.type === 'video_exp' ? 'شرح' : lesson.type === 'video_hw' ? 'تطبيق' : lesson.type === 'pdf' ? 'PDF' : 'اختبار'}
                  </span>
                </div>
                
                <h3 className="font-black text-xl text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {lesson.name}
                </h3>
                
                {lesson.description && (
                  <p className="text-slate-500 text-sm line-clamp-2">{lesson.description}</p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock size={14} /> متاح
                  </span>
                  <motion.span 
                    whileHover={{ x: -3 }}
                    className="text-blue-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    شاهد <Eye size={16} />
                  </motion.span>
                </div>
              </div>
            </motion.article>
          ))}
          
          {activeLessons.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
              <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
              <p className="font-bold text-lg">لا توجد دروس بعد في هذا الأسبوع</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ========== نافذة عرض الدرس ========== */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLesson(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                  <GraduationCap size={24} className="text-blue-600" />
                  <h3 className="font-black text-xl truncate">{selectedLesson.name}</h3>
                </div>
                <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 bg-black">
                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-50 to-white p-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                      <BookOpen size={36} className="text-blue-600" />
                    </motion.div>
                    <h3 className="text-2xl font-black mb-4">اختبار إلكتروني</h3>
                    <a href={selectedLesson.url} target="_blank" rel="noreferrer"
                       className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                      ابدأ الاختبار <ArrowUpRight className="inline mr-1" size={20} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== مشغل الفيديو ====================
function VideoPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoId, setVideoId] = useState('');
  const [provider, setProvider] = useState<'youtube' | 'vimeo'>('youtube');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let vid = '', prov: 'youtube' | 'vimeo' = 'youtube', valid = false;
    try {
      if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
        vid = url.includes('v=') ? url.split('v=')[1].split('&')[0] : 
              url.includes('embed/') ? url.split('embed/')[1].split('?')[0] :
              url.split('youtu.be/')[1].split('?')[0];
        prov = 'youtube'; valid = !!vid;
      } else if (url.includes('vimeo.com/')) {
        const parts = url.split('vimeo.com/')[1].split('?')[0].split('/');
        vid = parts[parts.length - 1]; prov = 'vimeo'; valid = !!vid;
      }
    } catch {}
    setVideoId(vid); setProvider(prov); setIsValid(valid); setIsLoading(true);
  }, [url]);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    const player = new Plyr(containerRef.current, {
      settings: ['quality', 'speed'], invertTime: true, autoplay: true,
      youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, autoplay: 1 },
      vimeo: { byline: false, portrait: false, title: false, transparent: false, autoplay: true }
    });
    player.on('ready', () => setIsLoading(false));
    return () => player.destroy();
  }, [videoId, provider]);

  return (
    <div className="w-full h-full bg-black relative">
      {isValid ? (
        <>
          <div ref={containerRef} data-plyr-provider={provider} data-plyr-embed-id={videoId} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400">رابط غير صالح</div>
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
    <div className="w-full h-full bg-slate-100">
      <iframe src={embedUrl} className="w-full h-full border-none" title="PDF" />
    </div>
  );
}