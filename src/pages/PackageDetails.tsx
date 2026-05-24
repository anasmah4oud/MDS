/**
 * @license SPDX-License-Identifier: Apache-2.0
 * ✦ تصميم ساحر وعصري لصفحة تفاصيل الباقة ✦
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight, Play, FileText, Clock, ChevronDown,
  LayoutDashboard, PlayCircle, Eye, X, Sparkles,
  Star, Calendar, BookOpen, Search, Filter, Layers,
  Target, Trophy, Flame, GraduationCap, Rocket, Wifi,
  ArrowUpRight, Grid3X3, Sun, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

/* ── حركات Framer Motion مُعدة مسبقاً ── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24 }
  }
};

const float = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
  }
};

const pulseRing = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.4, 0, 0.4],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
  }
};

/* ── جسيمات خلفية متحركة ── */
const Particles = () => {
  const items = useMemo(() =>
    [...Array(18)].map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.15 + 0.05,
      color: ['#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981'][Math.floor(Math.random() * 5)]
    })), []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color, opacity: p.opacity }}
          animate={{ y: [0, -50, 0, 30, 0], x: [0, 20, -10, 15, 0], scale: [1, 1.6, 1, 1.3, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ── المكون الرئيسي ── */
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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState<'content' | 'stats'>('content');

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.2]);

  useEffect(() => { fetchData(); }, [id, profile]);

  const fetchData = async () => {
    if (!id || !profile) return;
    try {
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', profile.id).eq('package_id', id).maybeSingle();
      if (!sub) { navigate('/classes'); return; }
      const { data: pkgData } = await supabase.from('packages').select('*').eq('id', id).single();
      setPkg(pkgData);
      const { data: wks } = await supabase.from('weeks').select('*').eq('package_id', id).order('id');
      setWeeks(wks || []);
      if (wks?.length) {
        const { data: less } = await supabase.from('lessons').select('*').in('week_id', wks.map(w => w.id));
        const map: Record<number, Lesson[]> = {};
        less?.forEach(l => { if (!map[l.week_id]) map[l.week_id] = []; map[l.week_id].push(l); });
        setLessonsMap(map);
        setExpandedWeek(wks[0].id);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const totalLessons = useMemo(() => Object.values(lessonsMap).reduce((a, b) => a + b.length, 0), [lessonsMap]);

  const filteredWeeks = useMemo(() => {
    return weeks.filter(w => {
      const weekLessons = lessonsMap[w.id] || [];
      const matchSearch = !search || w.name.includes(search) || weekLessons.some(l => l.name.includes(search));
      const matchFilter = filter === 'all' || weekLessons.some(l => l.type === filter);
      return matchSearch && matchFilter;
    });
  }, [weeks, lessonsMap, search, filter]);

  const lessonTypeInfo = (type: string) => {
    const map: any = {
      video_exp: { label: 'شرح', icon: <PlayCircle size={14} />, grad: 'from-blue-500 to-cyan-500' },
      video_hw: { label: 'تطبيق', icon: <Flame size={14} />, grad: 'from-orange-500 to-red-500' },
      pdf: { label: 'ملزمة', icon: <FileText size={14} />, grad: 'from-emerald-500 to-teal-500' },
      exam_mcq: { label: 'اختبار', icon: <Target size={14} />, grad: 'from-purple-500 to-pink-500' },
      exam_write: { label: 'واجب', icon: <Zap size={14} />, grad: 'from-amber-500 to-yellow-500' }
    };
    return map[type] || { label: type, icon: <BookOpen size={14} />, grad: 'from-slate-500 to-slate-600' };
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 relative overflow-hidden">
      <Particles />
      <motion.div animate={float} className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
          <GraduationCap size={44} className="text-blue-600" />
        </div>
        <p className="text-xl font-bold text-slate-700">جاري تحميل المحتوى...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden" dir="rtl" ref={ref}>
      {/* ═══════════ Hero Section ═══════════ */}
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative h-[55vh] md:h-[75vh] overflow-hidden">
        <motion.img initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.8 }} src={pkg?.image_url || 'https://placehold.co/1200x800/1e293b/f8fafc?text=🎓'} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-[#F8FAFC]" />
        <Particles />
        <div className="absolute inset-0 flex items-end p-4 md:p-12 lg:p-16 z-10">
          <div className="max-w-6xl mx-auto w-full space-y-4 md:space-y-6">
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-white transition"><ChevronRight size={16} /> لوحة التحكم</Link>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black mb-3"><Sparkles size={14} /> {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}</span>
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">{pkg?.name}</h1>
                <p className="text-slate-600 text-lg mt-2 bg-white/60 backdrop-blur-sm p-3 rounded-2xl inline-block">{pkg?.description}</p>
              </div>
              <div className="flex gap-6 bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[28px] shadow-2xl border border-white/60">
                <div className="text-center"><Calendar size={24} className="mx-auto text-blue-600 mb-2" /><p className="text-2xl font-black">{weeks.length}</p><p className="text-xs text-slate-500">أسبوع</p></div>
                <div className="w-px bg-slate-200" />
                <div className="text-center"><PlayCircle size={24} className="mx-auto text-indigo-600 mb-2" /><p className="text-2xl font-black">{totalLessons}</p><p className="text-xs text-slate-500">درس</p></div>
                <div className="w-px bg-slate-200" />
                <div className="text-center"><Star size={24} className="mx-auto text-amber-500 mb-2" fill="#f59e0b" /><p className="text-2xl font-black">4.9</p><p className="text-xs text-slate-500">تقييم</p></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════ شريط الأدوات ═══════════ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-5xl mx-auto px-4 -mt-8 md:-mt-12 relative z-20">
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl p-3 shadow-xl border border-white/60 flex flex-col sm:flex-row gap-3">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {[{ id: 'content', icon: <Layers size={14} />, label: 'المحتوى' }, { id: 'stats', icon: <Trophy size={14} />, label: 'الإحصائيات' }].map(t => (
              <motion.button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${tab === t.id ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`} whileTap={{ scale: 0.95 }}>{t.icon} {t.label}</motion.button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث..." className="w-full bg-slate-100 rounded-xl py-2 pr-9 pl-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200 transition" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {['all', 'video_exp', 'video_hw', 'pdf', 'exam_mcq'].map(f => {
              const info = f === 'all' ? { label: 'الكل', icon: <Grid3X3 size={12} />, grad: '' } : lessonTypeInfo(f);
              return (
                <motion.button key={f} onClick={() => setFilter(filter === f ? 'all' : f)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${filter === f ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow' : 'bg-slate-100 text-slate-500'}`} whileTap={{ scale: 0.9 }}>{info.icon} {info.label}</motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══════════ المحتوى ═══════════ */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {tab === 'content' ? (
            <motion.div key="content" variants={container} initial="hidden" animate="show" exit="hidden" className="space-y-4">
              {filteredWeeks.map((week, i) => {
                const weekLessons = lessonsMap[week.id] || [];
                const isOpen = expandedWeek === week.id;
                return (
                  <motion.div key={week.id} variants={item} layout className={`rounded-2xl md:rounded-3xl border-2 transition-all duration-500 overflow-hidden ${isOpen ? 'bg-white border-blue-100 shadow-2xl shadow-blue-500/5' : 'bg-white/70 border-slate-100 hover:shadow-lg'}`}>
                    <button onClick={() => setExpandedWeek(isOpen ? null : week.id)} className="w-full flex items-center justify-between p-4 md:p-5 text-right group">
                      <div className="flex items-center gap-3 md:gap-4">
                        <motion.div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg font-black transition ${isOpen ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`} animate={isOpen ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}>{i + 1}</motion.div>
                        <div className="text-right">
                          <h4 className="font-bold md:text-lg">{week.name}</h4>
                          <p className="text-xs text-slate-500">{weekLessons.length} دروس</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><ChevronDown size={16} /></motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden bg-slate-50/50">
                          <div className="p-3 md:p-5 space-y-2">
                            {weekLessons.map((lesson, j) => {
                              const info = lessonTypeInfo(lesson.type);
                              return (
                                <motion.button key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }} onClick={() => lesson.type.startsWith('video') ? navigate(`/video/${lesson.id}`) : setSelectedLesson(lesson)} className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition group" whileHover={{ scale: 1.01 }}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${info.grad} text-white flex items-center justify-center`}>{info.icon}</div>
                                    <div className="text-right"><p className="text-sm font-bold">{lesson.name}</p><p className="text-[10px] text-slate-400">{info.label}</p></div>
                                  </div>
                                  <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600"><Eye size={14} /></div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="stats" variants={container} initial="hidden" animate="show" exit="hidden" className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{ label: 'فيديوهات', value: Object.values(lessonsMap).flat().filter(l => l.type.startsWith('video')).length, icon: <PlayCircle size={20} />, grad: 'from-blue-500 to-cyan-500' },
                { label: 'ملازم', value: Object.values(lessonsMap).flat().filter(l => l.type === 'pdf').length, icon: <FileText size={20} />, grad: 'from-emerald-500 to-teal-500' },
                { label: 'اختبارات', value: Object.values(lessonsMap).flat().filter(l => l.type.includes('exam')).length, icon: <Target size={20} />, grad: 'from-purple-500 to-pink-500' },
                { label: 'تقييم', value: '4.9', icon: <Star size={20} fill="#f59e0b" />, grad: 'from-amber-500 to-yellow-500' }].map((s, i) => (
                <motion.div key={s.label} variants={item} className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-lg transition" whileHover={{ y: -4 }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} text-white flex items-center justify-center mb-3`}>{s.icon}</div>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════ نافذة منبثقة ═══════════ */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedLesson(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              <div className="px-4 py-3 flex items-center justify-between border-b bg-white/80 backdrop-blur">
                <h4 className="font-bold truncate">{selectedLesson.name}</h4>
                <button onClick={() => setSelectedLesson(null)} className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100"><X size={16} /></button>
              </div>
              <div className="flex-1 bg-slate-900 flex items-center justify-center">
                {selectedLesson.type.startsWith('video') ? <VideoPlayer url={selectedLesson.url} /> :
                 selectedLesson.type === 'pdf' ? <PdfViewer url={selectedLesson.url} /> :
                 <div className="text-center text-white p-8">
                   <Target size={48} className="mx-auto mb-4" />
                   <a href={selectedLesson.url} target="_blank" className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">بدء الاختبار</a>
                 </div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── مشغل فيديو Plyr ── */
function VideoPlayer({ url }: { url: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Plyr | null>(null);
  const [videoId, setVideoId] = useState('');
  const [provider, setProvider] = useState<'youtube'|'vimeo'>('youtube');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let vid = ''; let prov: 'youtube'|'vimeo' = 'youtube';
    if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
      vid = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('youtu.be/')[1]?.split('?')[0] || '';
      prov = 'youtube';
    } else if (url.includes('vimeo.com/')) {
      vid = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/').pop() || '';
      prov = 'vimeo';
    }
    setVideoId(vid); setProvider(prov);
  }, [url]);

  useEffect(() => {
    if (!videoId || !ref.current) return;
    const plyr = new Plyr(ref.current, {
      autoplay: true, muted: false, ratio: '16:9',
      youtube: { noCookie: true, rel: 0, showinfo: 0, modestbranding: 1 },
      vimeo: { byline: false, portrait: false, title: false }
    });
    setPlayer(plyr);
    plyr.on('ready', () => setLoading(false));
    return () => plyr.destroy();
  }, [videoId, provider]);

  return (
    <div className="w-full h-full relative bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
        </div>
      )}
      <div ref={ref} data-plyr-provider={provider} data-plyr-embed-id={videoId} className="w-full h-full" />
    </div>
  );
}

/* ── عارض PDF ── */
function PdfViewer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1]?.split('/')[0];
    if (id) embedUrl = `https://drive.google.com/file/d/${id}/preview`;
  }
  return (
    <iframe src={embedUrl} className="w-full h-full border-none" title="PDF" />
  );
}