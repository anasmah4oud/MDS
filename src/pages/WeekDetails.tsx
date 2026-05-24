/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  PlayCircle,
  FileText,
  BookOpen,
  Clock,
  ArrowLeft,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';

// حركات قابلة لإعادة الاستخدام (محسّنة للأداء)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

// عنصر متحرك للخلفية (بسيط وخفيف)
const FloatingBlob = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    animate={{
      scale: [1, 1.15, 1],
      rotate: [0, 8, -8, 0],
    }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export default function WeekDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [week, setWeek] = useState<Week | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !profile) return;
    fetchWeekData();
  }, [id, profile]);

  const fetchWeekData = async () => {
    try {
      const { data: weekData, error: weekError } = await supabase
        .from('weeks')
        .select('*')
        .eq('id', id)
        .single();
      if (weekError) throw weekError;

      if (weekData) {
        setWeek(weekData as Week);
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('week_id', id);
        if (lessonsError) throw lessonsError;
        setLessons(lessonsData as Lesson[]);
      }
    } catch (err) {
      console.error('خطأ في جلب بيانات الأسبوع:', err);
    } finally {
      setLoading(false);
    }
  };

  // حالة التحميل بتصميم ساحر
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-14 h-14 rounded-full border-4 border-blue-500 border-t-transparent"
          />
          <p className="text-slate-600 font-bold text-lg">نحضّر لك تجربة ساحرة...</p>
        </motion.div>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 font-bold">الأسبوع غير موجود</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* زخارف خلفية متحركة (خفيفة جداً) */}
      <FloatingBlob className="top-[-10%] left-[-5%] w-80 h-80 bg-blue-400/30" delay={0} />
      <FloatingBlob className="bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-300/20" delay={1.5} />
      <FloatingBlob className="top-[30%] left-[60%] w-64 h-64 bg-cyan-300/20" delay={3} />

      {/* شريط علوي زجاجي */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 h-16 px-4 md:px-8 flex items-center justify-between shadow-sm"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-500">محتوى الأسبوع</span>
        </div>
      </motion.header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">
        {/* بطاقة الأسبوع الرئيسية (بطاقة ساحرة) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative bg-white rounded-[36px] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* شريط زخرفي علوي */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" />

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <motion.div
              className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-inner"
              whileHover={{ rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-8 h-8 text-blue-600" />
            </motion.div>
            <div className="flex-1">
              <motion.h2
                className="text-2xl md:text-4xl font-black text-slate-800 mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {week.name}
              </motion.h2>
              <motion.p
                className="text-base md:text-lg text-slate-500 font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {week.description || 'رحلة تعليمية ممتعة تنتظرك. استعد لاكتساب مهارات جديدة.'}
              </motion.p>

              {/* شريط تقدم تفاعلي */}
              <motion.div
                className="mt-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Target className="w-5 h-5 text-slate-300" />
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${lessons.length > 0 ? 25 : 5}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-400">تقدّم سلس</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* قائمة الدروس */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={item}
              whileHover={{ scale: 1.01, y: -2 }}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200/60 transition-all duration-300 p-5 md:p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-inner"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                >
                  {lesson.type.startsWith('video') ? (
                    <PlayCircle className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </motion.div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg md:text-xl mb-1">
                    {lesson.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 capitalize flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.type === 'video' ? 'فيديو تعليمي' : 'مستند قراءة'}
                  </p>
                </div>
              </div>

              <Link
                to={lesson.type.startsWith('video') ? `/video/${lesson.id}` : '#'}
                className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors duration-300 group/btn overflow-hidden"
              >
                <span className="relative z-10">ابدأ</span>
                <ChevronRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}

          {/* حالة عدم وجود دروس */}
          {lessons.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-6"
              >
                <BookOpen className="w-20 h-20 text-slate-200" />
              </motion.div>
              <p className="text-slate-400 font-black italic text-xl">
                لا توجد محاضرات في هذا الأسبوع بعد
              </p>
              <p className="text-slate-300 text-sm font-medium mt-2">
                سيتم إضافة المحتوى قريباً .. ترقب المفاجآت!
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}