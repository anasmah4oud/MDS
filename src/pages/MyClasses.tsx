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
import { normalizePackageImageUrl, handleBrokenPackageImage } from '../lib/image-url';
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
                 مرحباً بك يا عزيزي الطالب <GraduationCap className="text-yellow-400" size={36} />
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
               <img src="data:image/jpeg;base64,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" className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover bg-white" alt="المعلم" />
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
                           src={normalizePackageImageUrl(p.image_url)}
                           alt={p.name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           onError={handleBrokenPackageImage}
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
                        
                        <p className="text-slate-700 text-base font-bold line-clamp-3 mb-6 flex-grow leading-relaxed">
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