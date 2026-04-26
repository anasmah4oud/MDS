/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, ChevronRight, BookOpen, 
  Clock, Star, LayoutDashboard, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Package } from '../types';

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
        .select('packageId')
        .eq('userId', profile.id);
      
      if (subError) throw subError;

      const subIds = subData.map(d => d.packageId);

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
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight /></Link>
           <h1 className="text-xl font-black text-slate-900">دوراتي المشترك بها</h1>
        </div>
        <div className="bg-blue-600 px-4 py-1.5 rounded-full text-white text-xs font-black italic">كمل يا بطل!</div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 space-y-12">
        {/* Motivation Card */}
        <div className="bg-slate-900 rounded-[40px] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 flex-1 text-center md:text-right">
                 <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">استمر في التعلم والاجتهاد</h2>
                 <p className="text-xl text-slate-400 font-bold max-w-xl">
                   اللغة العربية هي مفتاح التفوق في الثانوية العامة. كل خطوة بتعملها بتفربك من الـ 80 درجة.
                 </p>
                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Tip text="ركز في كل تفصيلة" />
                    <Tip text="حل الواجب بانتظام" />
                    <Tip text="اسأل عن اللي مش فاهمه" />
                 </div>
              </div>
              <img src="/master_avatar.png" className="w-56 h-56 rounded-full border-4 border-blue-600/30 shadow-2xl" alt="Avatar" />
           </div>
        </div>

        {/* Courses List */}
        <section>
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <BookOpen className="text-blue-600" />
               كورساتك الحالية
             </h3>
             <span className="text-slate-400 font-bold">{packages.length} دورات</span>
          </div>

          {loading ? (
             <div className="py-20 text-center font-black animate-pulse text-slate-400">جاري تحميل كورساتك...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map(p => (
                <Link key={p.id} to={`/package/${p.id}`}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col group"
                  >
                     <div className="relative h-52">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-white text-blue-600 p-4 rounded-full shadow-2xl">
                              <PlayCircle size={32} />
                           </div>
                        </div>
                     </div>
                     <div className="p-8 space-y-4">
                        <h4 className="text-2xl font-black text-slate-900">{p.name}</h4>
                        <div className="flex items-center gap-4 text-xs font-black text-slate-400 italic">
                           <span className="flex items-center gap-1"><Clock size={14} /> الدفعة الجديدة</span>
                           <span className="flex items-center gap-1"><Star size={14} /> أعلى تقييم</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm line-clamp-2">{p.description}</p>
                        
                        <div className="pt-6 border-t border-slate-50">
                           <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">دخول الدورة الآن</button>
                        </div>
                     </div>
                  </motion.div>
                </Link>
              ))}
              
              {packages.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center space-y-6">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <BookOpen size={40} />
                   </div>
                   <p className="text-slate-400 font-black italic">أنت غير مشترك في أي كورسات بعد.</p>
                   <Link to="/classes" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-black">اشترك في أول كورس لك الآن</Link>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <span className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-blue-100 border border-white/5 italic">
      {text}
    </span>
  );
}
