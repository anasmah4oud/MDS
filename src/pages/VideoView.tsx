/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Shield, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
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

  useEffect(() => {
    fetchLesson();
    // Disable right click and common dev shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
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
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-white mb-4">عفواً، الدرس غير موجود</h2>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">العودة للخلف</button>
      </div>
    );
  }

  // Determine video source
  const videoId = lesson.url.includes('v=') ? lesson.url.split('v=')[1]?.split('&')[0] : 
                  lesson.url.includes('youtu.be/') ? lesson.url.split('youtu.be/')[1] : lesson.url;

  const plyrSource = {
    type: 'video' as const,
    sources: [
      {
        src: videoId,
        provider: 'youtube' as const,
      },
    ],
  };

  const plyrOptions = {
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
    ],
    settings: ['quality', 'speed'],
    youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans" dir="rtl">
      {/* Header */}
      <header className="h-16 md:h-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-12 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-95 border border-white/5 bg-white/5">
            <ChevronRight className="text-blue-400" />
          </button>
          <div>
            <h1 className="text-sm md:text-xl font-black tracking-tight text-white/90 line-clamp-1 font-display">{lesson.name}</h1>
            <p className="text-[10px] md:text-xs font-bold text-blue-500/80 tracking-widest uppercase">البارع التعليمية • م/ محمود الديب</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black border border-blue-400/30 shadow-glow">
              <Shield size={14} /> محتوى محمي برمجياً
           </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        {/* Player Container */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative group">
           <div className="w-full h-full flex items-center justify-center">
              <div className="w-full aspect-video shadow-4xl shadow-black/50">
                 <Plyr source={plyrSource} options={plyrSource.type === 'video' ? plyrOptions : undefined} />
              </div>
           </div>
           
           {/* Privacy Overlay Watermark */}
           <div className="absolute top-1/4 right-1/4 opacity-10 pointer-events-none select-none text-2xl font-black italic tracking-tighter text-white">
              البارع - {profile?.first_name} {profile?.last_name}
           </div>
        </div>

        {/* Lesson Info Sidebar */}
        <div className="w-full lg:w-[420px] bg-slate-900/90 backdrop-blur-md border-r border-white/10 p-6 md:p-10 flex flex-col overflow-y-auto shadow-2xl">
           <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 rounded-3xl p-8 mb-10 shadow-soft">
              <h3 className="text-xl font-black text-blue-400 mb-4 inline-flex items-center gap-2">
                 <BookOpen size={20} /> وصف الدرس
              </h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed text-balance">
                {lesson.description || "استمتع بمشاهدة شرح المبدع م/ محمود الديب. تأكد من تدوين ملاحظاتك الهامة والتركيز في كل دقيقة."}
              </p>
           </div>

           <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                 <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-300">وقت المشاهدة</span>
                 </div>
                 <span className="text-xs font-black text-white">45:00 د</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                 <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-300">المرفقات</span>
                 </div>
                 <span className="text-xs font-black text-blue-400 cursor-pointer hover:underline">تحميل PDF</span>
              </div>
           </div>

           <div className="mt-auto pt-8 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold text-slate-500 mb-4 italic">حقوق النشر محفوظة لمنصة البارع © 2026</p>
              <div className="flex gap-2">
                 <button className="flex-1 py-4 bg-white/5 rounded-xl font-black text-sm hover:bg-white/10 transition-all border border-white/5">الدرس السابق</button>
                 <button className="flex-1 py-4 bg-blue-600 rounded-xl font-black text-sm hover:bg-blue-700 transition-all">الدرس القادم</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
