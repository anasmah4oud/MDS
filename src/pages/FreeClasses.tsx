/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gift, ChevronRight, PlayCircle, Star, 
  CheckCircle2, ArrowRight, LayoutDashboard, Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Package } from '../types';

export default function FreeClasses() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreePackages();
  }, [profile]);

  const fetchFreePackages = async () => {
    if (!profile) return;
    try {
      const { data: packData, error: packError } = await supabase
        .from('packages')
        .select('*')
        .eq('grade_id', profile.grade)
        .eq('is_free', true);
      
      if (packError) throw packError;
      setPackages(packData as Package[]);

      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('package_id')
        .eq('user_id', profile.id);
      
      if (subError) throw subError;
      setSubscriptions(subData.map(d => d.package_id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activateFreePackage = async (pId: number) => {
    if (!profile) return;
    try {
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: profile.id,
          package_id: pId,
          payment_method: 'free'
        });

      if (subError) throw subError;

      fetchFreePackages();
      navigate(`/package/${pId}`);
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/dashboard" className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight /></Link>
           <h1 className="text-xl font-black text-slate-900">الحصص المجانية</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black italic">
           <Gift size={16} /> هدية لطلابنا
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 space-y-12">
        <div className="text-center md:text-right max-w-2xl">
           <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">محتوى مجاني للكل!</h2>
           <p className="text-xl text-slate-500 font-bold leading-relaxed italic">
             نوفر لك بعض الدروس والمحاضرات الهامة مجاناً لتتعرف على طريقة "البارع" في تبسيط اللغة العربية.
           </p>
        </div>

        {loading ? (
          <div className="py-20 text-center font-black animate-pulse text-slate-400 italic">جاري تحميل الهدايا...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(p => (
              <div key={p.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 group flex flex-col h-full">
                 <div className="relative h-60 overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <PlayCircle size={60} className="text-white" />
                    </div>
                    <div className="absolute top-6 right-6 bg-emerald-500 text-white px-5 py-2 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2">
                       <Bookmark size={14} /> مجاناً تماماً
                    </div>
                 </div>

                 <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2 truncate">{p.name}</h4>
                      <div className="flex items-center gap-4 text-xs font-black text-slate-400 mb-4">
                         <span className="flex items-center gap-1 italic"><Star size={14} className="text-yellow-400 fill-yellow-400" /> لكل الطلاب</span>
                         <span className="flex items-center gap-1 italic"><CheckCircle2 size={14} className="text-emerald-500" /> جودة عالية</span>
                      </div>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                       {subscriptions.includes(p.id) ? (
                         <Link 
                          to={`/package/${p.id}`}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-center block hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                         >
                           مشاهدة الآن <ArrowRight size={20} />
                         </Link>
                       ) : (
                         <button 
                          onClick={() => activateFreePackage(p.id)}
                          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                         >
                           تفعيل المجاني الآن <Bookmark size={20} />
                         </button>
                       )}
                    </div>
                 </div>
              </div>
            ))}
            
            {packages.length === 0 && !loading && (
               <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                     <Gift size={48} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black italic text-xl">لا يوجد محتوى مجاني متاح لصفك حالياً.</p>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
