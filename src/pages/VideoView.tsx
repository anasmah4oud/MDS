/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Shield, BookOpen, AlertCircle, 
  Sparkles, Play, ShieldAlert, Copyright, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { initializeContentProtection } from '../lib/content-protection';
import { Lesson } from '../types';
import Plyr from 'plyr-react';
import "plyr-react/plyr.css";
import '../styles/VideoView.css';

// حركات Framer Motion المحسنة للأداء (تستخدم GPU Acceleration)
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

const headerFade = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function VideoView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [plyrSource, setPlyrSource] = useState<any>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchLesson();
    
    // تفعيل أقوى طبقات الحماية البرمجية لمنع القرصنة وتصوير الشاشة
    const protectionCleanup = initializeContentProtection();

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // مراقبة الـ DOM لفرض جدار حماية صارم على الـ Iframe والروابط الخلفية
    const observer = new MutationObserver(() => {
      document.querySelectorAll('iframe').forEach(iframe => {
        if (!iframe.getAttribute('sandbox')) {
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        }
        iframe.style.pointerEvents = 'none'; // تحويل كل الضغطات لأزرار التحكم الرسمية فقط
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
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
      await initializePlayer(data as Lesson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializePlayer = async (lessonData: Lesson) => {
    try {
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

  // إعدادات التحكم الحصرية والآمنة تماماً للمشغل
  const plyrOptions = {
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'
    ],
    settings: ['quality', 'speed'],
    youtube: { 
      noCookie: true, 
      rel: 0, 
      showinfo: 0, 
      iv_load_policy: 3, 
      modestbranding: 1,
      fs: 1,
      controls: 0,
      disablekb: 1
    },
    ratio: '16:9',
    keyboard: { focused: true, global: false }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-5 px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full animate-pulse" />
          <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <Shield size={22} className="absolute text-indigo-600 animate-bounce" />
        </div>
        <div className="text-center">
          <p className="font-black text-lg text-slate-800 tracking-tight">جاري تهيئة البث الآمن</p>
          <p className="text-xs text-slate-400 font-medium mt-1">منصة البارع تحمى وتجهز بياناتك الآن</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-2xl mb-4 animate-bounce">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">عفواً، المحاضرة غير متوفرة</h2>
        <p className="text-sm text-slate-400 max-w-xs mb-6">قد يكون الرابط غير صحيح أو تم تعديل صلاحيات الوصول.</p>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md active:scale-95">العودة للخلف</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 overflow-x-hidden font-sans relative flex flex-col" dir="rtl">
      
      {/* تأثير شبكة متدرجة للخلفية الفاتحة تضفي فخامة بصرية مذهلة */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/40 via-slate-50/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none" />

      {/* الهيدر الاحترافي الزجاجي المتجاوب */}
      <motion.header 
        variants={headerFade}
        initial="hidden"
        animate="visible"
        className="h-16 md:h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.01)]"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 bg-white shadow-sm group active:scale-95 shrink-0"
          >
            <ChevronRight className="text-slate-600 transition-transform group-hover:translate-x-0.5" size={18} />
          </button>
          <div className="text-right min-w-0">
            <h1 className="text-sm md:text-base font-black text-slate-800 line-clamp-1 leading-tight">{lesson.name}</h1>
            <p className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-wide mt-0.5">م/ محمود الديب • البارع التعليمية</p>
          </div>
        </div>
        
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black border border-indigo-100/40 shadow-sm animate-pulse-slow">
            <Shield size={13} className="text-indigo-500 animate-spin-slow" /> 
            <span className="hidden sm:inline">جدار حماية نشط</span>
            <span className="sm:hidden">محمي</span>
            <Sparkles size={11} className="text-amber-500" />
          </div>
        </div>
      </motion.header>

      {/* المنطقة الأساسية متجاوبة الأبعاد بالكامل */}
      <main className="flex-1 flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-5rem)] overflow-hidden relative z-10">
        
        {/* سينما العرض السينمائية - مصممة لراحة العين ومنع التشتيت */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden relative min-h-[240px] sm:min-h-[380px] md:min-h-[480px] lg:h-full shadow-inner group">
          
          {/* الجزيئات التمويهية الفنية لتشتيت أدوات تصوير الشاشة والكاميرات الخارجية */}
          <div className="absolute inset-0 pointer-events-none opacity-30 select-none overflow-hidden">
            <div className="dot-particle dot-1" />
            <div className="dot-particle dot-2" />
            <div className="dot-particle dot-3" />
          </div>

          <div className="w-full h-full flex items-center justify-center relative z-10">
            <div className={`w-full aspect-video transition-all duration-1000 transform ${playerReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {plyrSource && (
                <div className="plyr-protection-wrapper w-full h-full relative">
                  <Plyr ref={playerRef} source={plyrSource} options={plyrOptions} />
                </div>
              )}
            </div>
          </div>
          
          {/* علامة مائية عائمة متطورة تتحرك ديناميكياً بهدوء لحماية الحقوق */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
            <div className="floating-watermark text-[11px] md:text-xs font-black text-white/5 bg-white/[0.02] border border-white/[0.03] backdrop-blur-[1px] px-3 py-1.5 rounded-xl shadow-2xl">
              البارع الرقمية • {profile?.first_name || 'طالب'} {profile?.last_name || 'مميز'}
            </div>
          </div>
        </div>

        {/* الشريط الجانبي المحسن للمعلومات والملاحظات */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[380px] bg-white lg:border-r border-t lg:border-t-0 border-slate-100 p-5 md:p-6 flex flex-col overflow-y-auto shrink-0 lg:h-full shadow-[0_-4px_30px_rgba(0,0,0,0.02)] lg:shadow-none"
        >
          {/* بطاقة الترحيب والوصف الفاخرة */}
          <div className="bg-gradient-to-br from-indigo-50/40 via-indigo-50/10 to-transparent border border-indigo-100/50 rounded-2xl p-4 md:p-5 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50/50 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            
            <h3 className="text-xs font-black text-indigo-600 mb-2 flex items-center gap-1.5 relative z-10">
              <BookOpen size={15} className="text-indigo-500" /> تفاصيل ومحاور المحاضرة
            </h3>
            <p className="text-slate-500 font-medium text-xs leading-relaxed text-right relative z-10">
              {lesson.description || "أهلاً بك يا بطل في هذه المحاضرة الحصرية مع م/ محمود الديب. يرجى التركيز التام وتدوين الملاحظات والروابط الهامة المستنتجة من الشرح الفني لضمان التفوق البارع."}
            </p>
          </div>

          <div className="space-y-4 flex-1 text-right">            
            {/* بطاقة التحذير القانوني بنقوش ذهبية/حمراء جذابة وغير منفصلة عن بيئة التصميم الفاتح */}
            <div className="p-4 bg-amber-50/50 border border-amber-100/70 rounded-xl relative overflow-hidden shadow-sm">
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 animate-pulse">
                  <AlertCircle size={15} />
                </div>
                <div>
                  <h4 className="font-black text-amber-800 text-xs mb-0.5 flex items-center gap-1">
                    <span>تنبيه الخصوصية الآلي</span>
                  </h4>
                  <p className="text-[11px] font-bold text-amber-700/90 leading-relaxed">
                    مشاركة حسابك الشخصي مع الآخرين أو محاولة تحميل الفيديو أو تصوير الشاشة يعرض عضويتك للحظر الفوري والمساءلة القانونية.
                  </p>
                </div>
              </div>
            </div>

            {/* بطاقة توجيهية إضافية لدعم الواجهة وتأكيد الفخامة البصرية */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/20">
                <Smartphone size={14} />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-700">دعم المشاهدة الذكية</h5>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">تدعم المنصة التدوير التلقائي لملء شاشة الهاتف.</p>
              </div>
            </div>
          </div>

          {/* فوتر الشريط الجانبي الأنيق */}
          <div className="mt-6 pt-4 border-t border-slate-50 text-center flex items-center justify-center gap-1 text-[9px] font-black text-slate-400/80 uppercase tracking-wider">
            <Copyright size={10} />
            <span>جميع الحقوق محفوظة لمنصة البارع التعليمية 2026</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}