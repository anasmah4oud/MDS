/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gift, ChevronRight, PlayCircle, Star, 
  CheckCircle2, ArrowLeft, Bookmark, Sparkles, Unlock
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

  // إعدادات الأنيميشن للكروت
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans" dir="rtl">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0"></div>
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 z-0"></div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-white/50 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">الحصص المجانية</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-black shadow-inner border border-emerald-200/50">
          <Gift size={18} className="animate-bounce" /> 
          <span>هدية البارع لطلابه</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 relative z-10 space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-right max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-2xl font-bold text-sm mb-2 shadow-sm">
            <Sparkles size={16} /> محتوى مفتوح للجميع
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
            استكشف طريقة <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-teal-400">البارع</span> مجاناً
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
            نقدم لك مجموعة مختارة من الدروس والمحاضرات الهامة بدون أي تكلفة، لتبدأ رحلتك نحو التفوق في اللغة العربية بثقة.
          </p>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white/60 rounded-[32px] h-[450px] animate-pulse border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        ) : packages.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map(p => {
              const isSubscribed = subscriptions.includes(p.id);

              return (
                <motion.div 
                  variants={cardVariants}
                  key={p.id} 
                  className="bg-white/80 backdrop-blur-md rounded-[32px] overflow-hidden border border-white shadow-xl shadow-slate-200/50 group flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image & Badges */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={p.image_url || '/placeholder-course.jpg'} 
                      alt={p.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    
                    {/* Floating Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                        <PlayCircle size={48} className="text-white drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-emerald-600 px-4 py-1.5 rounded-full font-black text-xs shadow-lg border border-emerald-100 flex items-center gap-1.5">
                      <Gift size={14} /> مجاني 100%
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between relative bg-white">
                    <div className="space-y-4">
                      <h4 className="text-2xl font-black text-slate-900 leading-snug line-clamp-2">{p.name}</h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <Star size={16} className="text-amber-400 fill-amber-400" /> متاح للكل
                        </span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-emerald-500" /> جودة متميزة
                        </span>
                      </div>
                      
                      <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isSubscribed ? (
                        <Link 
                          to={`/package/${p.id}`}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/25 group/btn"
                        >
                          متابعة المشاهدة 
                          <ArrowLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <button 
                          onClick={() => activateFreePackage(p.id)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-black hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                          <span className="relative z-10 flex items-center gap-2">
                            تفعيل الباقة المجانية <Unlock size={18} />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-24 px-6 text-center bg-white/50 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shadow-sm"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <Gift size={56} className="text-slate-400" />
              <div className="absolute -top-2 -right-2 bg-amber-100 p-2 rounded-full border-4 border-white animate-bounce">
                <Sparkles size={16} className="text-amber-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">لا توجد هدايا حالياً</h3>
            <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
              لم يتم إضافة محتوى مجاني لصفك الدراسي في الوقت الحالي. ترقبوا المزيد قريباً!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}