/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Shield, BookOpen, AlertCircle, 
  Sparkles, ShieldAlert, Copyright, Smartphone, Play, Pause, GraduationCap, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initializeContentProtection } from '../lib/content-protection';
import { Lesson } from '../types';
import '../styles/VideoView.css';

// تمديد واجهة Window لدعم سكريبت يوتيوب الآلي
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function VideoView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string>('');
  
  const playerRef = useRef<any>(null);
  const iframeId = "barie-secure-player";

  useEffect(() => {
    fetchLesson();
    
    // تفعيل جدار حماية المحتوى لتعطيل الاختصارات
    const protectionCleanup = initializeContentProtection();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      if (protectionCleanup && typeof protectionCleanup === 'function') protectionCleanup();
    };
  }, [lessonId]);

  // استدعاء الـ API الخاص بيوتيوب للتحكم الخارجي الآمن
  useEffect(() => {
    if (!youtubeId || !isVideoStarted) return;

    // تحميل السكريبت إذا لم يكن موجوداً
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          'onReady': (event: any) => {
            event.target.playVideo();
            setIsPlaying(true);
          },
          'onStateChange': (event: any) => {
            // تحديث حالة الأزرار الخارجية بناءً على حالة الفيديو الداخلية
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [youtubeId, isVideoStarted]);

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

  // وظائف التحكم الخارجية المشفرة
  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="font-black text-slate-700 text-sm animate-pulse">جاري فحص جدار الحماية المجاني...</p>
      </div>
    );
  }

  if (!lesson || !youtubeId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">المحاضرة غير متوفرة حالياً</h2>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md mt-4">العودة للخلف</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative flex flex-col antialiased overflow-x-hidden" dir="rtl">
      <div className="absolute inset-0 bg-premium-mesh-pattern opacity-40 pointer-events-none" />

      {/* الهيدر الفخم */}
      <header className="h-16 md:h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3.5 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-indigo-50/80 text-slate-600 hover:text-indigo-600 rounded-xl transition-all border border-slate-200/60 bg-white shadow-sm shrink-0">
            <ChevronRight size={18} />
          </button>
          <div className="min-w-0 text-right">
            <h1 className="text-xs md:text-sm font-black text-slate-800 line-clamp-1">{lesson.name}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <GraduationCap size={12} className="text-indigo-600" />
              <p className="text-[10px] font-bold text-indigo-600">م/ محمود الديب • سلسلة البارع التعليمية</p>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black shadow-sm">
            <Shield size={13} className="text-emerald-600 animate-pulse" /> 
            <span>تأمين بصرى مطلق</span>
            <Sparkles size={11} className="text-amber-500" />
          </div>
        </div>
      </header>

      {/* المحتوى الأساسي */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1450px] w-full mx-auto p-4 md:p-6 gap-6 h-auto lg:h-[calc(100vh-5rem)] overflow-hidden">
        
        {/* صندوق السينما الذكي */}
        <div className="flex-1 bg-slate-950 rounded-2xl md:rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between lg:h-full group">
          
          <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            
            {/* واجهة البدء المخصصة */}
            <AnimatePresence>
              {!isVideoStarted && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVideoStarted(true)}
                    className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-white/10 hover:bg-indigo-500 shadow-xl cursor-pointer relative"
                  >
                    <Play size={26} className="fill-current translate-x-[-2px]" />
                    <span className="absolute inset-0 rounded-full bg-indigo-600/30 animate-ping" style={{ animationDuration: '3s' }} />
                  </motion.button>
                  <h3 className="text-white font-black text-sm md:text-base mt-5">اضغط لبدء تشغيل الحصة الآمنة</h3>
                  <p className="text-slate-400 font-medium text-[11px] md:text-xs mt-1">مشغل ذكي ومحمي كلياً ضد النسخ العشوائي</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* الخدعة الكبرى: جدار حماية شفاف (Overlay) يغطي الفيديو بالكامل ويمنع النقر عليه */}
            {isVideoStarted && (
              <div className="absolute inset-0 z-30 bg-transparent cursor-default" />
            )}

            {/* إطار الفيديو المشفر */}
            {isVideoStarted && (
              <div className="barie-video-container w-full aspect-video">
                <iframe
                  id={iframeId}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&disablekb=1&origin=${window.location.origin}`}
                  title={lesson.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
            )}
          </div>
          
          {/* شريط التحكم الخارجي الأنيق التابع للمنصة (بديل أزرار يوتيوب) */}
          {isVideoStarted && (
            <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex items-center justify-between z-40">
              <button 
                onClick={togglePlayPause}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
              >
                {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
              </button>
              <span className="text-[10px] md:text-xs font-black text-slate-400">لوحة تحكم مشفرة خاصة بمنصة البارع</span>
            </div>
          )}

          {/* العلامة المائية الديناميكية */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
            <div className="barie-floating-watermark text-[10px] md:text-xs font-black text-white/5 bg-white/[0.01] border border-white/[0.03] px-3 py-1.5 rounded-xl shadow-lg">
              سلسلة البارع الرقمية • {profile?.first_name || 'طالب'} {profile?.last_name || 'متميز'}
            </div>
          </div>
        </div>

        {/* الشريط الجانبي الفاخر الكروت الفاتحة */}
        <div className="w-full lg:w-[360px] flex flex-col gap-4 shrink-0 lg:h-full overflow-y-auto pb-4 lg:pb-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-indigo-50/50 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <h3 className="text-xs font-black text-indigo-600 mb-2.5 flex items-center gap-1.5">
              <Award size={15} className="text-indigo-500" /> محتوى ومحاور الشرح
            </h3>
            <p className="text-slate-500 font-bold text-xs leading-relaxed text-right relative z-10">
              {lesson.description || "أهلاً بك يا بطل في هذه المحاضرة الحصرية مع م/ محمود الديب. يرجى التركيز التام وتدوين كافة الملاحظات والروابط الفنية الهامة لضمان التفوق البارع."}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/20 border border-amber-100/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100/80 text-amber-600 rounded-xl shrink-0 shadow-sm">
                <AlertCircle size={15} />
              </div>
              <div className="text-right">
                <h4 className="font-black text-amber-900 text-xs mb-1">حماية الحقوق الفكرية</h4>
                <p className="text-[11px] font-bold text-amber-700/90 leading-relaxed">
                  تم حجب روابط البث الخارجية وتأمين المشغل برمجياً لحماية مجهودك وضمان خصوصية المحاضرات المدفوعة.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm mt-auto">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/30 text-indigo-600 flex items-center justify-center shrink-0">
              <Smartphone size={15} />
            </div>
            <div className="text-right">
              <h5 className="text-xs font-black text-slate-700">المشاهدة السينمائية</h5>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">اقلب الهاتف أفقياً لملء شاشة العرض تلقائياً.</p>
            </div>
          </div>

          <div className="pt-1 text-center flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider select-none">
            <Copyright size={10} />
            <span>جميع الحقوق محفوظة لمنصة البارع التعليمية 2026</span>
          </div>
        </div>
      </main>
    </div>
  );
}