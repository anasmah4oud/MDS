/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, BookOpen, 
  Eye, LayoutDashboard, PlayCircle, Clock, ArrowRight,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';

// تعريف حركات انتقالية قابلة لإعادة الاستخدام
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function WeekDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [week, setWeek] = useState<Week | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeekData();
  }, [id, profile]);

  const fetchWeekData = async () => {
    if (!id || !profile) return;
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-bold text-lg">جاري تحميل المحتوى الساحر...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden" dir="rtl">
      {/* عناصر زخرفية متحركة في الخلفية */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* الهيدر الزجاجي العصري */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </Link>
          <motion.h1 
            className="text-xl md:text-2xl font-black text-slate-900"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {week?.name}
          </motion.h1>
        </div>
        <motion.div
          className="hidden md:flex items-center gap-2 text-slate-400"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">محتوى الأسبوع</span>
        </motion.div>
      </motion.header>

      <main className="max-w-4xl mx-auto p-4 md:p-12 space-y-8 relative z-10">
        {/* بطاقة الأسبوع الرئيسية مع تأثيرات ساحرة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 md:p-10 rounded-[40px] text-white shadow-2xl shadow-blue-200/50 overflow-hidden"
        >
          {/* شكل متحرك داخل البطاقة */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-black mb-4 italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {week?.name}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-blue-100 font-bold opacity-90 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {week?.description || "محتوى الأسبوع التعليمي المخصص لك. استعد لرحلة تعلم ممتعة!"}
            </motion.p>
            
            {/* شريط تقدم افتراضي لإضفاء طابع الألعاب (Gamification) */}
            <motion.div 
              className="mt-6 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${lessons.length > 0 ? 30 : 0}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
              <span className="text-sm font-bold text-white/80">استمر في التقدم</span>
            </motion.div>
          </div>
        </motion.div>

        {/* قائمة الدروس مع حركات متداخلة */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                transition: { duration: 0.2 }
              }}
              className="group bg-white p-5 md:p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:border-blue-200/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-slate-50 to-blue-50 text-blue-600 rounded-2xl shadow-inner"
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.3 } }}
                >
                  {lesson.type.startsWith('video') ? (
                    <PlayCircle className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </motion.div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg md:text-xl mb-1">{lesson.name}</h4>
                  <p className="text-xs font-bold text-slate-400 capitalize flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.type === 'video' ? 'فيديو تعليمي' : 'مستند قراءة'}
                  </p>
                </div>
              </div>
              <Link 
                to={lesson.type.startsWith('video') ? `/video/${lesson.id}` : '#'} 
                className="relative overflow-hidden bg-slate-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all duration-300 min-w-[90px] text-center group/btn"
              >
                <span className="relative z-10 flex items-center justify-center gap-1">
                  دخول
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </Link>
            </motion.div>
          ))}
          
          {lessons.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                {...floatingAnimation}
                className="inline-block mb-4"
              >
                <BookOpen className="w-16 h-16 text-slate-200" />
              </motion.div>
              <p className="text-slate-400 font-black italic text-lg">لا يوجد محاضرات في هذا الأسبوع حالياً.</p>
              <p className="text-slate-300 text-sm font-medium mt-2">ترقب الإضافات القادمة قريباً!</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}