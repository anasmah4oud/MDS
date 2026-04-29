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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-4">عفواً، الدرس غير موجود</h2>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">العودة للخلف</button>
      </div>
    );
  }

  // Robust video ID extraction
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const videoId = getYouTubeId(lesson.url);

  const plyrSource: any = {
    type: 'video',
    sources: [
      {
        src: videoId,
        provider: 'youtube',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans" dir="rtl">
      {/* Header */}
      <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 md:px-12 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 border border-slate-200 bg-white shadow-sm">
            <ChevronRight className="text-blue-600" />
          </button>
          <div className="text-right">
            <h1 className="text-sm md:text-xl font-black tracking-tight text-slate-900 line-clamp-1 font-display">{lesson.name}</h1>
            <p className="text-[10px] md:text-xs font-bold text-blue-600 tracking-widest uppercase">البارع التعليمية • م/ محمود الديب</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black border border-blue-100">
              <Shield size={14} /> محتوى محمي برمجياً
           </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-5rem)]">
        {/* Player Container */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden relative group min-h-[300px] md:min-h-[500px] lg:min-h-0">
           <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="w-full h-full max-w-full max-h-full">
                 <Plyr source={plyrSource} options={plyrOptions} className="w-full h-full" />
              </div>
           </div>
           
           {/* Privacy Overlay Watermark */}
           <div className="absolute top-1/4 right-1/4 opacity-10 pointer-events-none select-none text-xl md:text-2xl font-black italic tracking-tighter text-white">
              البارع - {profile?.first_name} {profile?.last_name}
           </div>
        </div>

        {/* Lesson Info Sidebar */}
        <div className="w-full lg:w-[420px] bg-white border-r border-slate-100 p-6 md:p-10 flex flex-col overflow-y-auto shadow-sm">
           <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-10">
              <h3 className="text-xl font-black text-blue-600 mb-4 inline-flex items-center gap-2">
                 <BookOpen size={20} /> وصف الدرس
              </h3>
              <p className="text-slate-600 font-medium text-sm leading-relaxed text-right">
                {lesson.description || "استمتع بمشاهدة شرح المبدع م/ محمود الديب. تأكد من تدوين ملاحظاتك الهامة والتركيز في كل دقيقة."}
              </p>
           </div>

           <div className="space-y-6 flex-1 text-right">
              <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-500">مدة الدرس</span>
                 </div>
                 <span className="text-xs font-black text-slate-900">متغير حسب المحتوى</span>
              </div>
              
              <div className="p-6 bg-yellow-50/50 border border-yellow-100 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <AlertCircle className="text-yellow-600 shrink-0" size={24} />
                    <div>
                       <h4 className="font-black text-yellow-800 text-sm mb-1">تنبيه حماية</h4>
                       <p className="text-xs font-bold text-yellow-700 leading-relaxed">
                          يمنع منعاً باتاً تصوير الشاشة أو محاولة تحميل الفيديو، الحساب مراقب آلياً وسيتم حظر أي محاولة للتلاعب.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-2 italic">جميع الحقوق محفوظة لمنصة البارع التعليمية © 2026</p>
           </div>
        </div>
      </main>
    </div>
  );
}
