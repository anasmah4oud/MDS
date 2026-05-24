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
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Star, Zap, ArrowLeft, Layers
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// --- حركات Framer Motion ساحرة ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 gap-6">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full" />
        <BookOpen size={52} className="text-blue-600 relative z-10 drop-shadow-lg" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-black italic text-2xl text-slate-700 tracking-tight"
      >
        جاري تحضير المحتوى الساحر...
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F4FF] text-slate-900 overflow-x-hidden relative" dir="rtl">
      
      {/* عناصر متحركة في الخلفية */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-100/20 rounded-full blur-2xl"
        />
      </div>

      {/* الهيدر البطولي */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-slate-900 rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl shadow-blue-900/10 z-10">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={pkg?.image_url || "https://placehold.co/1200x800"}
          className="absolute inset-0 w-full h-full object-cover blur-[1px]"
          alt="Package Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent" />

        <div className="absolute inset-0 flex items-end p-6 md:p-20 z-20">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-blue-700 bg-white/80 backdrop-blur-lg px-5 py-2.5 rounded-full font-bold mb-6 md:mb-8 hover:bg-white hover:shadow-xl transition-all border border-white/50"
              >
                <ArrowLeft size={18} /> العودة للوحة التحكم
              </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/30 flex items-center gap-2">
                    <Zap size={16} className="fill-current" />
                    {pkg?.type === 'offer' ? 'عرض خاص ✨' : 'باقة تعليمية'}
                  </span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-[1.1] text-slate-900 drop-shadow-sm">
                  {pkg?.name}
                </h1>
                <p className="text-lg md:text-2xl text-slate-600 max-w-xl font-medium leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white/60 inline-block shadow-sm">
                  {pkg?.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
                className="flex items-center gap-6 md:gap-12 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem]"
              >
                <div className="text-center group cursor-default">
                  <motion.div variants={floatAnimation} animate="animate" className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:bg-blue-100 transition-colors">
                    <Calendar size={26} />
                  </motion.div>
                  <p className="text-xs font-bold text-slate-500 mb-1">الأسابيع</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">{weeks.length}</p>
                </div>
                <div className="w-px h-20 md:h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                <div className="text-center group cursor-default">
                  <motion.div variants={floatAnimation} animate="animate" className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:bg-indigo-100 transition-colors">
                    <PlayCircle size={26} />
                  </motion.div>
                  <p className="text-xs font-bold text-slate-500 mb-1">المحاضرات</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-800">
                    {Object.values(lessonsMap).reduce((acc: number, curr) => acc + (curr as Lesson[]).length, 0)}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex items-center gap-4 mb-10 md:mb-14"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-2 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"
          />
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            المحتوى التعليمي <Sparkles className="inline text-amber-400 ml-2" size={28} />
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {weeks.map((week, index) => (
            <motion.div
              key={week.id}
              variants={itemVariants}
              layout
              className={`rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
                expandedWeek === week.id
                  ? 'bg-white border-blue-200/80 shadow-2xl shadow-blue-100/50 scale-[1.02]'
                  : 'bg-white/80 border-slate-200/50 hover:bg-white hover:shadow-xl hover:border-blue-200/60 backdrop-blur-sm'
              }`}
            >
              <button
                onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                className="w-full flex items-center justify-between p-5 md:p-8 text-right focus:outline-none group"
              >
                <div className="flex items-center gap-5 md:gap-7">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center font-black text-2xl md:text-3xl transition-all duration-300 ${
                      expandedWeek === week.id
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-400/30'
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}
                  >
                    {index + 1}
                  </motion.div>
                  <div>
                    <h4 className={`text-xl md:text-2xl font-black transition-colors ${expandedWeek === week.id ? 'text-blue-950' : 'text-slate-800'}`}>
                      {week.name}
                    </h4>
                    <p className="text-slate-500 font-semibold text-sm mt-1">{week.description}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedWeek === week.id ? 180 : 0 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    expandedWeek === week.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}
                >
                  <ChevronDown size={22} />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedWeek === week.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                    className="overflow-hidden bg-gradient-to-b from-slate-50/80 to-white border-t border-slate-100"
                  >
                    <div className="p-4 md:p-8 space-y-4">
                      {(lessonsMap[week.id] || []).map((lesson, idx) => (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          whileHover={{ scale: 1.02, y: -3, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (lesson.type.startsWith('video')) {
                              navigate(`/video/${lesson.id}`);
                            } else {
                              setSelectedLesson(lesson);
                            }
                          }}
                          className="w-full flex items-center justify-between p-5 md:p-7 bg-white rounded-[2rem] border border-slate-100/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-4 md:gap-5">
                            <motion.div
                              whileHover={{ rotate: 5 }}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                lesson.type.startsWith('video')
                                  ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-blue-100'
                                  : lesson.type === 'pdf'
                                  ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white shadow-emerald-100'
                                  : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white shadow-amber-100'
                              }`}
                            >
                              {lesson.type.startsWith('video') ? <PlayCircle size={28} /> : lesson.type === 'pdf' ? <FileText size={28} /> : <BookOpen size={28} />}
                            </motion.div>
                            <div className="text-right">
                              <p className="text-lg md:text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">{lesson.name}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                <Clock size={12} />
                                {lesson.type === 'video_exp'
                                  ? 'فيديو شرح تفصيلي'
                                  : lesson.type === 'video_hw'
                                  ? 'فيديو حل وتطبيق'
                                  : lesson.type === 'pdf'
                                  ? 'ملزمة PDF'
                                  : lesson.type === 'exam_mcq'
                                  ? 'اختبار إلكتروني'
                                  : 'واجب إلكتروني'}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                          >
                            <Eye size={20} />
                          </motion.div>
                        </motion.button>
                      ))}
                      {(!lessonsMap[week.id] || lessonsMap[week.id].length === 0) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-10 text-center bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200"
                        >
                          <BookOpen className="mx-auto text-slate-300 mb-4" size={36} />
                          <p className="text-slate-500 font-bold text-base italic">جاري تجهيز محتوى هذا الأسبوع، كن مستعداً يا بطل! 🚀</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* نافذة عرض الدرس الساحرة */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 80, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30, rotateX: -5 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white/95 backdrop-blur-2xl md:rounded-[4rem] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/10 border border-white/50"
            >
              {/* رأس النافذة */}
              <div className="px-6 py-4 md:px-10 md:py-6 flex items-center justify-between border-b border-slate-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: -5 }}
                    className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm"
                  >
                    <img src="/logo.png" className="w-11 h-11 md:w-14 md:h-14 rounded-xl object-contain" alt="Master" />
                  </motion.div>
                  <div>
                    <h4 className="font-black text-xl md:text-2xl text-slate-900 truncate max-w-[180px] md:max-w-md">{selectedLesson.name}</h4>
                    <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> البارع محمود الديب</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={() => setSelectedLesson(null)}
                  className="w-12 h-12 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <X size={24} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* محتوى العرض */}
              <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-amber-100 to-orange-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner"
                    >
                      <BookOpen className="text-amber-600 w-14 h-14 md:w-18 md:h-18" />
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
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-14 py-5 rounded-2xl text-xl font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-3"
                    >
                      بدء الاختبار الآن <Zap size={22} className="fill-white" />
                    </motion.a>
                  </motion.div>
                )}
              </div>

              {selectedLesson.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 bg-white border-t border-slate-100 text-right"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-amber-400 mt-1 flex-shrink-0" size={22} />
                    <p className="text-slate-600 font-medium leading-relaxed md:text-lg">{selectedLesson.description}</p>
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

// مكون مشغل الفيديو المحسن
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
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, autoplay: 1 },
        vimeo: { byline: false, portrait: false, title: false, transparent: false, autoplay: true, muted: false }
      });

      setPlayer(plyrInstance);

      plyrInstance.on('ready', () => {
        setIsLoading(false);
        const playPromise = plyrInstance?.play();
        if (playPromise && playPromise instanceof Promise) {
          playPromise.catch(() => console.log("Autoplay blocked"));
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
      player.playing ? player.pause() : player.play();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative group overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem]">
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
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-400 rounded-full"
                />
                <p className="text-white mt-6 font-bold tracking-widest text-sm">جاري التحميل...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: player?.playing ? 0 : 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl">
                <Play size={48} className="ml-1 drop-shadow-lg" fill="white" />
              </div>
            </motion.div>
          )}

          <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
            <div className="bg-black/30 backdrop-blur-lg px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest text-white/90 uppercase border border-white/10">
              منصة البارع • حقوق النشر محفوظة
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4 bg-slate-50 w-full h-full">
          <PlayCircle size={52} className="text-slate-300" />
          <p className="font-bold text-xl">عذراً، رابط الفيديو غير متاح حالياً.</p>
        </div>
      )}
    </div>
  );
}

// عارض PDF محسن
function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <div className="w-full h-full bg-slate-100/50 relative rounded-b-[3rem] md:rounded-b-[4rem] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <FileText size={52} className="text-slate-300" />
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