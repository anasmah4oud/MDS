/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, BookOpen, 
  Eye, LayoutDashboard, PlayCircle, Clock, 
  CheckCircle2, Circle, Sparkles, TrendingUp,
  Calendar, User, Award, ChevronLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
};

export default function WeekDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [week, setWeek] = useState<Week | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"]
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Load completed lessons from localStorage
  useEffect(() => {
    if (profile && id) {
      const storageKey = `completed_lessons_${profile.id}_${id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedLessons(new Set(JSON.parse(saved)));
      }
    }
  }, [profile, id]);

  // Save completed lessons to localStorage
  const saveCompletedLessons = (newCompleted: Set<string>) => {
    if (profile && id) {
      const storageKey = `completed_lessons_${profile.id}_${id}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(newCompleted)));
    }
  };

  const toggleLessonComplete = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      saveCompletedLessons(newSet);
      return newSet;
    });
  };

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

  const completionPercentage = lessons.length > 0 
    ? (completedLessons.size / lessons.length) * 100 
    : 0;

  // Get lesson icon based on type
  const getLessonIcon = (type: string) => {
    if (type.startsWith('video')) return <PlayCircle className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">جاري التحميل...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10" dir="rtl" ref={mainRef}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 -left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Sticky Header with Animation */}
      <motion.header 
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-slate-900 to-slate-600"
            >
              {week?.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-slate-500 font-bold"
            >
              الأسبوع {week?.week_number}
            </motion.p>
          </div>
        </div>

        {/* Progress indicator in header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-600">{Math.round(completionPercentage)}%</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 relative z-10">
        {/* Hero Section with Parallax Effect */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="relative mb-10"
        >
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-blue-200/50 overflow-hidden group">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.1 }}
              transition={{ duration: 1 }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"
            />
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-4"
              >
                <Calendar className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100 text-sm font-bold">الأسبوع {week?.week_number}</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-black text-white mb-4 italic leading-tight"
              >
                {week?.name}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 font-medium text-base md:text-lg max-w-2xl"
              >
                {week?.description || "محتوى الأسبوع التعليمي المخصص لك. رحلة ممتعة نحو الإتقان!"}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-700">التقدم في الأسبوع</span>
            </div>
            <span className="text-2xl font-black text-blue-600">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full relative"
            >
              <motion.div 
                animate={{ x: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-white/30 rounded-full"
                style={{ width: '30%' }}
              />
            </motion.div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {completedLessons.size} من {lessons.length} محاضرة مكتملة
          </p>
        </motion.div>

        {/* Lessons List with Stagger Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              const isHovered = hoveredLesson === lesson.id;
              
              return (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  custom={index}
                  onHoverStart={() => setHoveredLesson(lesson.id)}
                  onHoverEnd={() => setHoveredLesson(null)}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group"
                >
                  <div className={`
                    bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                    ${isCompleted ? 'border-emerald-200 shadow-md shadow-emerald-100/50' : 'border-slate-100 shadow-sm'}
                    ${isHovered ? 'border-blue-300 shadow-xl shadow-blue-100/50' : ''}
                  `}>
                    <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Completion Checkbox */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => toggleLessonComplete(lesson.id, e)}
                          className="flex-shrink-0 focus:outline-none"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <Circle className="w-7 h-7 text-slate-300 group-hover:text-blue-400 transition-colors" />
                          )}
                        </motion.button>

                        {/* Icon with animated background */}
                        <motion.div 
                          animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.1 } : {}}
                          transition={{ duration: 0.3 }}
                          className={`
                            p-3 rounded-xl transition-all duration-300 flex-shrink-0
                            ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-blue-600 group-hover:bg-blue-50'}
                          `}
                        >
                          {getLessonIcon(lesson.type)}
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`
                            font-black text-base md:text-lg truncate transition-colors
                            ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-blue-700'}
                          `}>
                            {lesson.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className={`
                              text-xs font-bold px-2 py-0.5 rounded-full capitalize
                              ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}
                            `}>
                              {lesson.type}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">15 دقيقة</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link to={lesson.type.startsWith('video') ? `/video/${lesson.id}` : '#'}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2
                            ${isCompleted 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                              : 'bg-slate-900 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                            }
                          `}
                        >
                          {isCompleted ? (
                            <>
                              <Eye className="w-4 h-4" />
                              مراجعة
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              دخول
                            </>
                          )}
                        </motion.button>
                      </Link>
                    </div>
                    
                    {/* Progress indicator inside card */}
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 origin-right"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {lessons.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-400 font-black text-lg">لا يوجد محاضرات في هذا الأسبوع حالياً</p>
              <p className="text-slate-300 text-sm mt-2">ترقب المزيد قريباً!</p>
            </motion.div>
          )}
        </motion.div>

        {/* Motivational Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-slate-500 font-medium">
              {completionPercentage === 100 
                ? "🎉 مذهل! أكملت هذا الأسبوع بالكامل. أنت مميز!" 
                : `✨ استمر بهذا المستوى الرائع! أنت في منتصف الطريق نحو ${Math.round(completionPercentage)}%`}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}