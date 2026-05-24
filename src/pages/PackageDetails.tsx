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
  ArrowUp, Zap, Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Package, Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ==================== أنيميشنات وانتقالات ====================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { 
    opacity: 1, y: 0, scale: 1, 
    transition: { type: "spring", stiffness: 280, damping: 22 } 
  }
};

const lessonCardVariants = {
  hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  })
};

const floatingParticle = {
  animate: (i: number) => ({
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    opacity: [0.2, 0.8, 0.2],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut"
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: mainRef });
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.97]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // تتبع التمرير لزر العودة للأعلى
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // عداد محاضرات متحرك
  const totalLessons = Object.values(lessonsMap).reduce((acc, curr) => acc + curr.length, 0);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600"
      />
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-black italic text-2xl text-slate-700"
      >
        جاري تجهيز المحتوى الساحر...
      </motion.p>
    </div>
  );

  return (
    <div ref={mainRef} className="min-h-screen bg-white text-slate-900 overflow-x-hidden" dir="rtl">
      
      {/* خلفية متحركة (جزيئات) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={floatingParticle}
            animate="animate"
            className="absolute rounded-full bg-blue-400/10 blur-xl"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`
            }}
          />
        ))}
      </div>

      {/* زر العودة للأعلى */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-white shadow-2xl border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* الهيدر البطولي */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* تأثير صورة خلفية مع بارالاكس */}
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[url('https://placehold.co/1200x800')] bg-cover bg-center opacity-10 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-blue-600 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full font-bold text-sm md:text-base hover:bg-white hover:shadow-lg transition-all border border-white/50"
            >
              <ChevronRight size={18} /> العودة للوحة التحكم
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  {pkg?.type === 'offer' ? 'عرض خاص' : 'باقة تعليمية'}
                </motion.span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-slate-900">
                {pkg?.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl font-medium leading-relaxed bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/70 shadow-sm">
                {pkg?.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl p-8 md:p-10 rounded-[40px] w-fit flex items-center gap-10">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                  >
                    <Calendar size={28} />
                  </motion.div>
                  <p className="text-sm font-bold text-slate-500 mb-1">الأسابيع</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-4xl font-black text-slate-800"
                  >
                    {weeks.length}
                  </motion.p>
                </div>
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                  >
                    <PlayCircle size={28} />
                  </motion.div>
                  <p className="text-sm font-bold text-slate-500 mb-1">المحاضرات</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-4xl font-black text-slate-800"
                  >
                    {totalLessons}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* المحتوى التعليمي */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center gap-4 mb-10 md:mb-16"
        >
          <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            المحتوى التعليمي
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          {weeks.map((week, index) => (
            <motion.div
              key={week.id}
              variants={itemVariants}
              layout
              className={`rounded-3xl md:rounded-[36px] overflow-hidden border transition-all duration-500 ${
                expandedWeek === week.id
                  ? 'bg-white border-blue-200 shadow-2xl shadow-blue-500/10'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-blue-100'
              }`}
            >
              <button
                onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-right focus:outline-none group"
              >
                <div className="flex items-center gap-5 md:gap-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[20px] flex items-center justify-center font-black text-2xl md:text-3xl transition-all duration-500 ${
                      expandedWeek === week.id
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40'
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}
                  >
                    {index + 1}
                  </motion.div>
                  <div>
                    <h4 className={`text-xl md:text-3xl font-black transition-colors ${
                      expandedWeek === week.id ? 'text-blue-950' : 'text-slate-800'
                    }`}>
                      {week.name}
                    </h4>
                    <p className="text-slate-500 font-bold text-sm md:text-base mt-1">{week.description}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedWeek === week.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    expandedWeek === week.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
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
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden bg-gradient-to-b from-slate-50/80 to-white border-t border-slate-100"
                  >
                    <div className="p-4 md:p-8 space-y-4">
                      {(lessonsMap[week.id] || []).map((lesson, idx) => (
                        <motion.button
                          key={lesson.id}
                          custom={idx}
                          variants={lessonCardVariants}
                          initial="hidden"
                          animate="show"
                          whileHover={{ scale: 1.02, y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (lesson.type.startsWith('video')) {
                              navigate(`/video/${lesson.id}`);
                            } else {
                              setSelectedLesson(lesson);
                            }
                          }}
                          className="w-full flex items-center justify-between p-5 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <motion.div
                              whileHover={{ rotate: 5 }}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                lesson.type.startsWith('video') ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                                lesson.type === 'pdf' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                                'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                              }`}
                            >
                              {lesson.type.startsWith('video') ? <PlayCircle size={28} /> :
                               lesson.type === 'pdf' ? <FileText size={28} /> :
                               <BookOpen size={28} />}
                            </motion.div>
                            <div className="text-right">
                              <p className="text-base md:text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                                {lesson.name}
                              </p>
                              <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                                <Clock size={12} />
                                {lesson.type === 'video_exp' ? 'فيديو شرح تفصيلي' :
                                 lesson.type === 'video_hw' ? 'فيديو حل وتطبيق' :
                                 lesson.type === 'pdf' ? 'ملزمة PDF' :
                                 lesson.type === 'exam_mcq' ? 'اختبار إلكتروني' : 'واجب إلكتروني'}
                              </p>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                            <Eye size={20} />
                          </div>
                        </motion.button>
                      ))}
                      {(!lessonsMap[week.id] || lessonsMap[week.id].length === 0) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200"
                        >
                          <BookOpen className="mx-auto text-slate-300 mb-4" size={40} />
                          <p className="text-slate-500 font-bold text-lg">جاري تجهيز محتوى هذا الأسبوع، كن مستعداً!</p>
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

      {/* نافذة عرض الدرس (مودال) */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            {/* خلفية */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              onClick={() => setSelectedLesson(null)}
            />

            {/* صندوق المحتوى */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full md:max-w-5xl md:h-[85vh] bg-white md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/20 border border-white"
            >
              {/* رأس المودال */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ rotate: 5 }} className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <img src="/logo.png" className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-contain" alt="Master" />
                  </motion.div>
                  <div>
                    <h4 className="font-black text-lg md:text-2xl text-slate-900 truncate max-w-[200px] md:max-w-md">
                      {selectedLesson.name}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 mt-1">البارع محمود الديب</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, backgroundColor: "#fee2e2", color: "#ef4444" }}
                  onClick={() => setSelectedLesson(null)}
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={24} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* منطقة المشاهدة */}
              <div className="flex-1 overflow-hidden relative bg-slate-50 flex items-center justify-center">
                {/* جزيئات ساحرة داخل المودال */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={floatingParticle}
                      animate="animate"
                      className="absolute w-4 h-4 rounded-full bg-blue-400/20"
                      style={{
                        left: `${10 + i * 10}%`,
                        top: `${20 + (i % 4) * 20}%`
                      }}
                    />
                  ))}
                </div>

                {selectedLesson.type.startsWith('video') ? (
                  <VideoPlayer url={selectedLesson.url} />
                ) : selectedLesson.type === 'pdf' ? (
                  <PdfViewer url={selectedLesson.url} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full p-8 md:p-12 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[36px] flex items-center justify-center mb-8 shadow-inner"
                    >
                      <BookOpen className="text-blue-600 w-16 h-16" />
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">
                      نافذة الاختبار التفاعلي
                    </h3>
                    <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-md leading-relaxed">
                      حان وقت تقييم مستواك! اضغط على الزر لبدء الاختبار.
                    </p>
                    <motion.a
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedLesson.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-xl font-black hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-3"
                    >
                      بدء الاختبار الآن <ChevronRight size={24} />
                    </motion.a>
                  </motion.div>
                )}
              </div>

              {/* وصف الدرس */}
              {selectedLesson.description && (
                <div className="p-6 md:p-8 bg-white border-t border-slate-100 text-right">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-amber-400 mt-1 flex-shrink-0" size={20} />
                    <p className="text-slate-600 font-medium leading-relaxed md:text-lg">
                      {selectedLesson.description}
                    </p>
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

// ==================== مشغل الفيديو المحسّن ====================
function VideoPlayer({ url }: { url: string }) {
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
        plyrInstance?.play().catch(() => {});
      });
      plyrInstance.on('play', () => setIsLoading(false));

      const preventDefault = (e: Event) => e.preventDefault();
      document.body.addEventListener('contextmenu', preventDefault);
      return () => {
        plyrInstance?.destroy();
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
    <div className="w-full h-full flex items-center justify-center bg-black relative group">
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full"
                />
                <p className="text-white mt-6 font-bold tracking-widest text-sm">جاري التحميل...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: player?.playing ? 0 : 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-2xl"
              >
                <Play size={40} className="ml-2 drop-shadow-md" fill="currentColor" />
              </motion.div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-4 bg-slate-50 w-full h-full">
          <PlayCircle size={48} className="text-slate-300" />
          <p className="font-bold text-lg">عذراً، رابط الفيديو غير متاح حالياً.</p>
        </div>
      )}

      {/* علامة مائية متحركة */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white/80 uppercase border border-white/10"
        >
          منصة البارع • حقوق النشر محفوظة
        </motion.div>
      </div>
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
    <div className="w-full h-full bg-slate-100/50 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <FileText size={48} className="text-slate-300 animate-pulse" />
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