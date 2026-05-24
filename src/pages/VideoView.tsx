/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Clock, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initializeContentProtection } from '../lib/content-protection';
import { Lesson } from '../types';
import Plyr from 'plyr-react';
import "plyr-react/plyr.css";
import '../styles/VideoView.css';

export default function VideoView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [sidebarMounted, setSidebarMounted] = useState(false);
  const [plyrSource, setPlyrSource] = useState<any>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchLesson();
    
    // تفعيل جميع طبقات الحماية
    const protectionCleanup = initializeContentProtection();

    // تعطيل القائمة المنسدلة واختصارات المطور
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // منع فحص الـ iframe
    const observer = new MutationObserver(() => {
      document.querySelectorAll('iframe').forEach(iframe => {
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // تفعيل حركة ظهور العناصر بعد التحميل
    setTimeout(() => setSidebarMounted(true), 100);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
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
      await initializePlayer(data as Lesson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializePlayer = async (lessonData: Lesson) => {
    try {
      // محاكاة تحميل سريع للفيديو
      await new Promise(resolve => setTimeout(resolve, 300));
      const videoId = getYouTubeId(lessonData.url);
      
      setPlyrSource({
        type: 'video',
        sources: [{ src: videoId, provider: 'youtube' }],
      });
      setPlayerReady(true);
    } catch (err) {
      console.error('Error initializing player:', err);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const plyrOptions = {
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
    ],
    settings: ['quality', 'speed'],
    youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
    ratio: '16:9',
    hideYoutubeSharing: true,
  };

  // جسيمات عائمة للجمال وتشتيت التسجيل
  const floatingDots = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    style: {
      left: `${10 + (i * 12) % 85}%`,
      top: `${10 + (i * 15) % 80}%`,
      animationDelay: `${i * 0.7}s`,
      animationDuration: `${4 + i % 3}s`,
    }
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="video-loading-shimmer w-64 h-40 rounded-2xl"></div>
          <p className="text-blue-600 font-bold text-sm animate-pulse">جاري تجهيز الدرس...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <AlertCircle size={64} className="text-red-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-black text-slate-900 mb-4">عفواً، الدرس غير موجود</h2>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105">العودة للخلف</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900 overflow-x-hidden font-sans relative" dir="rtl">
      {/* تأثير شبكة خلفية دقيقة */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

      {/* Header زجاجي محسن */}
      <header className="h-16 md:h-20 bg-white/70 backdrop-blur-2xl border-b border-white/50 flex items-center justify-between px-4 md:px-12 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-blue-50 rounded-2xl transition-all active:scale-95 border border-slate-200 bg-white/80 shadow-sm hover:shadow-md group"
          >
            <ChevronRight className="text-blue-600 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="text-right">
            <h1 className="text-sm md:text-xl font-black tracking-tight text-slate-900 line-clamp-1">{lesson.name}</h1>
            <p className="text-[10px] md:text-xs font-bold text-blue-600 tracking-widest uppercase">البارع التعليمية • م/ محمود الديب</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50/80 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black border border-blue-200/50 backdrop-blur-sm animate-pulse-slow">
            <Shield size={14} className="text-blue-500" /> 
            <span>محتوى محمي برمجياً</span>
            <Sparkles size={12} className="text-yellow-500 animate-spin-slow" />
          </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-5rem)]">
        {/* Player Container مع تأثيرات جمالية */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden relative group min-h-[300px] md:min-h-[500px] shadow-2xl">
          {/* جسيمات عائمة للتمويه الجمالي */}
          {floatingDots.map(dot => (
            <div
              key={dot.id}
              className="floating-dot"
              style={dot.style}
            />
          ))}
          
          {/* إطار التوهج حول المشغل */}
          <div className="absolute inset-0 player-glow-border pointer-events-none"></div>

          <div className="w-full h-full flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className={`w-full aspect-video shadow-2xl transition-all duration-1000 transform ${playerReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {plyrSource && <Plyr ref={playerRef} source={plyrSource} options={plyrOptions} />}
            </div>
          </div>
          
          {/* علامة مائية متحركة */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="floating-watermark text-xl md:text-2xl font-black italic text-white/5">
              البارع - {profile?.first_name} {profile?.last_name}
            </div>
          </div>
        </div>

        {/* Lesson Info Sidebar بتأثير انزلاقي ساحر */}
        <div 
          className={`w-full lg:w-[420px] bg-white/90 backdrop-blur-xl border-r border-white/50 p-6 md:p-10 flex flex-col overflow-y-auto shadow-xl transition-all duration-700 ease-out ${
            sidebarMounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}
        >
          {/* وصف الدرس */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 rounded-3xl p-8 mb-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-black text-blue-600 mb-4 inline-flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" /> وصف الدرس
            </h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed text-right">
              {lesson.description || "استمتع بمشاهدة شرح المبدع م/ محمود الديب. تأكد من تدوين ملاحظاتك الهامة والتركيز في كل دقيقة."}
            </p>
          </div>

          <div className="space-y-6 flex-1 text-right">              
            {/* تنبيه الحماية */}
            <div className="p-6 bg-yellow-50/70 border border-yellow-200/60 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-yellow-100/10 animate-subtle-bg-shift"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2 bg-yellow-100 rounded-full animate-pulse-slow">
                  <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                </div>
                <div>
                  <h4 className="font-black text-yellow-800 text-sm mb-1">تنبيه حماية</h4>
                  <p className="text-xs font-bold text-yellow-700 leading-relaxed">
                    يمنع منعاً باتاً تصوير الشاشة أو محاولة تحميل الفيديو، الحساب مراقب آلياً وسيتم حظر أي محاولة للتلاعب.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100/80 text-center">
            <p className="text-[10px] font-bold text-slate-400 mb-2 italic">جميع الحقوق محفوظة لمنصة البارع التعليمية © 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}