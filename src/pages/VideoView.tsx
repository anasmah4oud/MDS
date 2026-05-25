/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Shield, AlertCircle, Sparkles, ShieldAlert, 
  Copyright, Play, Pause, GraduationCap, Award,
  RotateCw, RotateCcw, Maximize, Minimize, Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initializeContentProtection } from '../lib/content-protection';
import { Lesson } from '../types';
import '../styles/VideoView.css';

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
  
  // حالات التحكم المتزامنة
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showRatesMenu, setShowRatesMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef<any>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const timeIntervalRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<any>(null);
  const iframeId = "barie-secure-player";

  useEffect(() => {
    fetchLesson();
    const protectionCleanup = initializeContentProtection();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    const handleFullscreenChange = () => {
      const isCurrentlyFull = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFull);
      
      // التشغيل الأفقي التلقائي في الموبايل عند ملء الشاشة برمجياً
      if (isCurrentlyFull && window.screen && window.screen.orientation) {
        window.screen.orientation.lock('landscape').catch(() => {});
      } else if (!isCurrentlyFull && window.screen && window.screen.orientation) {
        window.screen.orientation.unlock();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(timeIntervalRef.current);
      clearTimeout(controlsTimeoutRef.current);
      if (protectionCleanup && typeof protectionCleanup === 'function') protectionCleanup();
    };
  }, [lessonId]);

  useEffect(() => {
    if (!youtubeId || !isVideoStarted) return;

    const loadAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = initPlayer;
      } else {
        initPlayer();
      }
    };

    const initPlayer = () => {
      setTimeout(() => {
        if (!document.getElementById(iframeId)) return;
        
        playerRef.current = new window.YT.Player(iframeId, {
          events: {
            'onReady': (event: any) => {
              event.target.playVideo();
              setIsPlaying(true);
              setDuration(event.target.getDuration());
              startTrackingTime();
              resetControlsTimeout();
            },
            'onStateChange': (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startTrackingTime();
                resetControlsTimeout();
              } else {
                setIsPlaying(false);
                clearInterval(timeIntervalRef.current);
                setShowControls(true); // إبقاء عناصر التحكم ظاهرة عند الإيقاف المؤقت
              }
            }
          }
        });
      }, 100);
    };

    loadAPI();
    return () => clearInterval(timeIntervalRef.current);
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
    } finaly {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const startTrackingTime = () => {
    clearInterval(timeIntervalRef.current);
    timeIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        if (duration === 0) setDuration(playerRef.current.getDuration());
      }
    }, 250); // تسريع التحديث لضمان تلوين الـ Timeline بسلاسة تامة دون تقطيع
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
    resetControlsTimeout();
  };

  const handleSeek = (amount: number) => {
    if (!playerRef.current || !playerRef.current.getCurrentTime) return;
    const newTime = Math.max(0, Math.min(duration, playerRef.current.getCurrentTime() + amount));
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime, true);
    resetControlsTimeout();
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowRatesMenu(false);
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(rate);
    }
    resetControlsTimeout();
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!videoBoxRef.current) return;
    if (!isFullscreen) {
      if (videoBoxRef.current.requestFullscreen) videoBoxRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
    resetControlsTimeout();
  };

  // وظيفة إخفاء أزرار التحكم تلقائياً بعد 3 ثوانٍ من عدم النشاط لتوفير رؤية كاملة
  const resetControlsTimeout = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowRatesMenu(false);
      }, 3000);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="font-black text-slate-700 text-sm animate-pulse">جاري فحص وتأمين بيئة اللاب توب المعاصرة...</p>
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

      {/* الهيدر */}
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

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1450px] w-full mx-auto p-4 md:p-6 gap-6 h-auto lg:h-[calc(100vh-6rem)] overflow-hidden">
        
        {/* حاوية سينما الفيديو الحصري ذو الأبعاد الكاملة بدون اقتطاع */}
        <div 
          ref={videoBoxRef}
          onMouseMove={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
          className="flex-[2] bg-black rounded-2xl md:rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-center justify-center w-full aspect-video lg:h-full lg:w-auto group"
        >
          
          {/* واجهة البدء الكبرى */}
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
                <h3 className="text-white font-black text-sm md:text-base mt-5">اضغط لبدء فك تشفير الحصة</h3>
                <p className="text-slate-400 font-medium text-[11px] md:text-xs mt-1">مشغل ذكي ومحمي كلياً يمنع استخراج الروابط</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* جدار حماية شفاف للنقرات */}
          {isVideoStarted && (
            <div className="absolute inset-0 z-30 bg-transparent cursor-default" />
          )}

          {/* إطار الفيديو المتكامل بأبعاده الأصلية */}
          {isVideoStarted && (
            <div className="barie-video-wrapper w-full h-full">
              <iframe
                id={iframeId}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&disablekb=1&origin=${window.location.origin}`}
                title={lesson.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
          )}
          
          {/* لوحة تحكم تطفو بشكل زجاجي ذكي وتختفي تلقائياً لعدم أكل مساحة الفيديو */}
          {isVideoStarted && (
            <div className={`barie-floating-controls-panel ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              
              {/* شريط الـ Time Line التفاعلي المحاكي ليوتيوب بالأزرق الفاخر */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-[11px] font-mono font-bold text-white select-none min-w-[35px] text-left">{formatTime(currentTime)}</span>
                <div className="flex-1 relative flex items-center">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleTimelineChange}
                    className="barie-timeline-slider flex-1 h-1.5 rounded-lg appearance-none cursor-pointer relative z-10 bg-transparent"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-white select-none min-w-[35px] text-right">{formatTime(duration)}</span>
              </div>

              {/* أزرار التشغيل والسرعات والملء الأفقية */}
              <div className="flex items-center justify-between w-full mt-1">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlayPause} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md active:scale-95">
                    {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
                  </button>

                  <button onClick={() => handleSeek(-10)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95" title="تأخير 10 ثواني">
                    <RotateCcw size={16} />
                  </button>

                  <button onClick={() => handleSeek(10)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95" title="تقديم 10 ثواني">
                    <RotateCw size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 relative">
                  <button 
                    onClick={() => setShowRatesMenu(!showRatesMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Sliders size={14} />
                    <span>{playbackRate}x</span>
                  </button>

                  <AnimatePresence>
                    {showRatesMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-12 left-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-1 flex flex-col gap-0.5 min-w-[80px] shadow-2xl z-50"
                      >
                        {[0.5, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handleRateChange(rate)}
                            className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg text-center transition-colors ${playbackRate === rate ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={toggleFullscreen} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95" title={isFullscreen ? "تصغير" : "تطوير العرض كامل"}>
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* العلامة المائية */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
            <div className="barie-floating-watermark text-[10px] md:text-xs font-black text-white/5 bg-white/[0.01] border border-white/[0.03] px-3 py-1.5 rounded-xl shadow-lg">
              سلسلة البارع الرقمية • {profile?.first_name || 'طالب'} {profile?.last_name || 'متميز'}
            </div>
          </div>
        </div>

        {/* الشريط الجانبي الفاخر الكروت الفاتحة */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4 shrink-0 lg:h-full overflow-y-auto pb-4 lg:pb-0">
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

          <div className="pt-1 text-center flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider select-none mt-auto">
            <Copyright size={10} />
            <span>جميع الحقوق محفوظة لمنصة البارع التعليمية 2026</span>
          </div>
        </div>
      </main>
    </div>
  );
}