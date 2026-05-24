/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Play, FileText, BookOpen, 
  Eye, LayoutDashboard, PlayCircle, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Week, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';

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

  if (loading) return <div className="p-20 text-center font-black">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight /></Link>
              <h1 className="text-xl font-black text-slate-900">{week?.name}</h1>
           </div>
       </header>

       <main className="max-w-4xl mx-auto p-4 md:p-12 space-y-8">
          <div className="bg-blue-600 p-10 rounded-[40px] text-white shadow-xl shadow-blue-100">
             <h2 className="text-3xl font-black mb-4 italic">{week?.name}</h2>
             <p className="text-lg text-blue-100 font-bold opacity-80">{week?.description || "محتوى الأسبوع التعليمي المخصص لك."}</p>
          </div>

          <div className="space-y-4">
             {lessons.map(lesson => (
                <div key={lesson.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-600 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 text-blue-600 rounded-xl">
                        {lesson.type.startsWith('video') ? <PlayCircle /> : <FileText />}
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900">{lesson.name}</h4>
                         <p className="text-xs font-bold text-slate-400 capitalize">{lesson.type}</p>
                      </div>
                   </div>
                   <Link 
                    to={lesson.type.startsWith('video') ? `/video/${lesson.id}` : '#'} 
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all text-center min-w-[100px]"
                   >
                     دخول
                   </Link>
                </div>
             ))}
             {lessons.length === 0 && (
               <div className="text-center py-20 text-slate-300 font-black italic">لا يوجد محاضرات في هذا الأسبوع حالياً.</div>
             )}
          </div>
       </main>
    </div>
  );
}
