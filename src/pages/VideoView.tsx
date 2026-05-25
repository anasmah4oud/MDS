/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Shield, BookOpen, AlertCircle, 
  Sparkles, ShieldAlert, Copyright, Smartphone, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initializeContentProtection } from '../lib/content-protection';
import { Lesson } from '../types';
import '../styles/VideoView.css';

// الحركات الانسيابية الفاخرة للواجهة
const pageTransition = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function VideoView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string>('');

  useEffect(() => {
    fetchLesson();
    
    // تفعيل أقوى طبقات الحماية لتعطيل الأزرار واختصارات لوحة التحكم
    const protectionCleanup = initializeContentProtection();

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      if (protectionCleanup && typeof protectionCleanup === 'function') protectionCleanup();
    };
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      setLesson(data as Lesson);
      setYoutubeId(getYouTubeId(data.url));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="font-bold text-slate-600 text-xs">جاري تشفير وتأمين المحاضرة الحصرية...</p>
      </div>
    );
  }

  if (!lesson || !youtubeId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl mb-3">
          <ShieldAlert size={26} />
        </div>
        <h2 className="text-lg font-black text-slate-800 mb-4">المحاضرة غير متوفرة حالياً</h2>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold">العودة للخلف</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative flex flex-col antialiased" dir="rtl">
      {/* لمسات تصميمية خلفية تعطي جمال ساحر للوضع الفاتح */}
      <div className="absolute inset-0 bg-grid-premium opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* الهيدر الزجاجي الفخم المتجاوب */}
      <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all border border-slate-100 bg-white active:scale-95 shrink-0"
          >
            <ChevronRight size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm font-black text-slate-800 line-clamp-1">{lesson.name}</h1>
            <p className="text-[10px] font-bold text-indigo-600 mt-0.5">م/ محمود الديب • البارع التعليمية</p>
          </div>
        </div>
        
        <div className="shrink-0">
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100/60 text-emerald-600 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-black shadow-inner">
            <Shield size={12} className="animate-pulse" /> 
            <span>اتصال آمن ومحمي</span>
            <Sparkles size={10} className="text-amber-500" />
          </div>
        </div>
      </header>

      {/* ساحة العرض والبيانات الهيكلية */}
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={pageTransition}
        className="flex-1 flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto p-4 md:p-6 gap-6 h-auto lg:h-[calc(100vh-5rem)] overflow-hidden"
      >
        
        {/* صندوق السينما الرئيسي للفيديو */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden flex items-center justify-center lg:h-full">
          
          <div className="w-full h-full relative flex items-center justify-center">
            
            {/* واجهة الانطلاق الفاخرة لضمان التشغيل الفوري والسهل */}
            {!isPlaying ? (
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <motion.button 
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsPlaying(true)}
                  className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/40 hover:bg-indigo-500 transition-colors"
                >
                  <Play size={24} className="fill-current translate-x-[-1px]" />
                </motion.button>
                <h4 className="text-white font-black text-xs md:text-sm mt-4 tracking-wide">اضغط هنا لبدء تشغيل الحصة الفنية بأمان</h4>
                <p className="text-slate-400 font-medium text-[10px] mt-1">مدعوم بنظام حظر الإعلانات والتسريبات التلقائي</p>
              </div>
            ) : null}

            {/* طبقة الحماية الشفافة الفوقية لحجب فحص العناصر المباشر داخل مشغل اليوتيوب */}
            <div className="absolute inset-0 z-10 pointer-events-none select-none" />

            {/* تشغيل الفيديو الفوري النظيف من خلال النطاق الخالي من الكوكيز التابع لجوجل */}
            {isPlaying && (
              <div className="premium-cinema-holder w-full aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&disablekb=1`}
                  title={lesson.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
            )}
          </div>
          
          {/* علامة مائية عائمة ومتحركة في الخلفية لحفظ الحقوق البصرية */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
            <div className="premium-watermark text-[10px] md:text-xs font-bold text-white/5 bg-white/[0.01] border border-white/[0.03] px-3 py-1.5 rounded-lg">
              منصة البارع • {profile?.first_name || 'طالب'} {profile?.last_name || 'مميز'}
            </div>
          </div>
        </div>

        {/* الشريط الجانبي الفاتح الفاخر */}
        <div className="w-full lg:w-[360px] flex flex-col gap-4 shrink-0 lg:h-full overflow-y-auto">
          
          {/* كارت محاور وتفاصيل الدرس */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-black text-indigo-600 mb-2 flex items-center gap-1.5">
              <BookOpen size={14} /> تفاصيل ومحاور المحاضرة
            </h3>
            <p className="text-slate-500 font-medium text-xs leading-relaxed text-right">
              {lesson.description || "أهلاً بك يا بطل في هذه المحاضرة الحصرية مع م/ محمود الديب. يرجى التركيز التام وتدوين الملاحظات المستنتجة لضمان التميز البارع."}
            </p>
          </div>

          {/* كارت إرشادات الحماية الرقمية */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                <AlertCircle size={14} />
              </div>
              <div>
                <h4 className="font-black text-amber-800 text-xs mb-1">الخصوصية والأمان الآلي</h4>
                <p className="text-[10px] font-bold text-amber-700/80 leading-relaxed">
                  أنظمة التتبع الفني ترصد أي محاولات لتسجيل الحصة أو مشاركة الكود البرمجي الخارجي مع أطراف أخرى خارج المنصة.
                </p>
              </div>
            </div>
          </div>

          {/* كارت توجيهي للهواتف مدمج سفلي */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm mt-auto">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Smartphone size={14} />
            </div>
            <div>
              <h5 className="text-[11px] font-black text-slate-700">دعم المشاهدة الذكية</h5>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">اقلب جهازك المحمول أفقياً للحصول على أبعاد سينمائية كاملة.</p>
            </div>
          </div>

          {/* الفوتر الصغير الفخم لتوثيق الملكية الفكرية للمنصة */}
          <div className="text-center flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
            <Copyright size={10} />
            <span>جميع الحقوق محفوظة لمنصة البارع التعليمية 2026</span>
          </div>

        </div>
      </motion.main>
    </div>
  );
}