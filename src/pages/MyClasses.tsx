/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, ChevronRight, BookOpen, 
  Clock, Star, ArrowLeft, GraduationCap,
  Sparkles, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Package } from '../types';
import '../styles/MyClasses.css';

export default function MyClasses() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPackages();
  }, [profile]);

  const fetchMyPackages = async () => {
    if (!profile) return;
    try {
      // 1. Get sub package IDs first
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('package_id')
        .eq('user_id', profile.id);
      
      if (subError) throw subError;

      const subIds = subData.map(d => d.package_id);

      if (subIds.length === 0) {
        setPackages([]);
        return;
      }

      // 2. Get packages details
      const { data: packData, error: packError } = await supabase
        .from('packages')
        .select('*')
        .in('id', subIds);
      
      if (packError) throw packError;
      setPackages(packData as Package[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-blue-200" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
             <ChevronRight size={22} />
           </button>
           <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <BookOpen className="text-blue-600" size={24} />
             دوراتي المشترك بها
           </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
           <Sparkles size={16} className="text-blue-600" />
           <span className="text-blue-700 text-sm font-semibold">استمر في إبداعك!</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-10">
        
        {/* Welcome & Motivation Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 overflow-hidden shadow-lg shadow-blue-600/20">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                 مرحباً بك يا بطل <GraduationCap className="text-yellow-400" size={36} />
              </h2>
              <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                اللغة العربية هي مفتاح تفوقك. كل درس تدرسه هنا يقربك خطوة نحو الدرجة النهائية. نحن معك في رحلتك!
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Tip text="ركز في التفاصيل" />
                <Tip text="حل الواجب بانتظام" />
                <Tip text="راجع أخطاءك" />
              </div>
            </div>
            <div className="hidden lg:block shrink-0">
               <img src="/master_avatar.png" className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover bg-white" alt="المعلم" />
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Layers className="text-indigo-500" size={26} />
               محتواك التعليمي
             </h3>
             <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
               {packages.length} {packages.length <= 2 || packages.length >= 11 ? 'دورة' : 'دورات'}
             </span>
          </div>

          {loading ? (
             /* Skeleton Loader */
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map(n => (
                 <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                   <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
                   <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                   <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                   <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                   <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                 </div>
               ))}
             </div>
          ) : packages.length > 0 ? (
            /* Courses Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((p, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={p.id}
                >
                  <Link to={`/package/${p.id}`} className="block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col group">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img 
                           src={p.image_url || '/placeholder-course.jpg'} 
                           alt={p.name} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 shadow-2xl">
                             <PlayCircle size={36} className="fill-white/20" />
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                           <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                             دورة نشطة
                           </span>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                           <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"><Clock size={14} /> أحدث محتوى</span>
                           <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md"><Star size={14} /> متميز</span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </h4>
                        
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                          {p.description}
                        </p>
                        
                        {/* Action Button */}
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold group-hover:text-blue-700">
                           <span>متابعة التعلم</span>
                           <ArrowLeft size={20} className="transform group-hover:-translate-x-2 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm max-w-2xl mx-auto mt-10">
               <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <BookOpen size={48} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-3">لم تشترك في أي دورة بعد</h3>
               <p className="text-slate-500 mb-8 max-w-md mx-auto">
                 ابدأ رحلتك التعليمية الآن، تصفح الدورات المتاحة وانضم للدفعة الجديدة لتحقيق أفضل النتائج.
               </p>
               <Link 
                 to="/classes" 
                 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1"
               >
                 تصفح الدورات المتاحة <ArrowLeft size={20} />
               </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Tip Component
function Tip({ text }: { text: string }) {
  return (
    <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
      <Sparkles size={14} className="text-yellow-300" /> {text}
    </span>
  );
}