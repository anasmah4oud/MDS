/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Star, Filter, ShoppingCart, 
  CreditCard, Key, AlertCircle, CheckCircle2, 
  ChevronRight, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Package } from '../types';
import '../styles/Classes.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
};

export default function Classes() {
  const { profile } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'options' | 'code' | 'wallet'>('options');
  const [activationCode, setActivationCode] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;
    try {
      const { data: packList, error: packError } = await supabase
        .from('packages')
        .select('*')
        .eq('grade_id', profile.grade);
      
      if (packError) throw packError;
      setPackages(packList as Package[]);

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

  const filteredPackages = packages.filter(p => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  const handleManualPurchase = async () => {
    if (!selectedPackage || !profile) return;
    setPurchaseLoading(true);
    setPurchaseError(null);
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', profile.id)
        .single();
      if (userError || !userData) throw new Error('مستخدم غير موجود');
      if (userData.wallet_balance < selectedPackage.price) {
        throw new Error('رصيدك غير كافي في المحفظة، يرجى الشحن أولاً');
      }
      await supabase.from('profiles').update({ wallet_balance: userData.wallet_balance - selectedPackage.price }).eq('id', profile.id);
      await supabase.from('subscriptions').insert({ user_id: profile.id, package_id: selectedPackage.id, payment_method: 'wallet' });
      await supabase.from('transactions').insert({ user_id: profile.id, amount: selectedPackage.price, type: 'purchase', description: `شراء باقة: ${selectedPackage.name}` });
      setSelectedPackage(null);
      fetchData();
      alert('تم الاشتراك بنجاح! استمتع برحلتك');
    } catch (err: any) {
      setPurchaseError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleCodePurchase = async () => {
    if (!selectedPackage || !profile || !activationCode) return;
    setPurchaseLoading(true);
    setPurchaseError(null);
    try {
      const { data: codeData, error: codeError } = await supabase
        .from('codes')
        .select('*')
        .eq('code', activationCode)
        .eq('package_id', selectedPackage.id)
        .eq('is_used', false)
        .maybeSingle();
      if (codeError || !codeData) throw new Error('كود غير صحيح أو مستخدم مسبقاً');
      await supabase.from('codes').update({ is_used: true, used_by: profile.id, used_at: new Date().toISOString() }).eq('id', codeData.id);
      await supabase.from('subscriptions').insert({ user_id: profile.id, package_id: selectedPackage.id, payment_method: 'code' });
      setSelectedPackage(null);
      fetchData();
      alert('تم تفعيل الكود والاشتراك بنجاح!');
    } catch (err: any) {
      setPurchaseError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      {/* Hero Section بتصميم أنيق مع عناصر متحركة */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <motion.h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            منهج <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">البارع</span> التعليمي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-300/90 font-medium max-w-xl mx-auto"
          >
            نخبة مختارة من أفضل الكورسات التعليمية لمساعدتك على التفوق مع م/ محمود الديب
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-10"
          >
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/20 transition-all duration-300 group"
            >
              <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              العودة للوحة التحكم
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* الفلاتر العائمة */}
      <div className="sticky top-6 z-40 flex justify-center -mt-10 mb-12">
        <div className="filter-glass px-4 py-3 rounded-3xl border border-white/40 shadow-xl shadow-blue-100/20 flex gap-2 md:gap-3">
          <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>الكل</FilterButton>
          <FilterButton active={activeFilter === 'offer'} onClick={() => setActiveFilter('offer')}>العروض</FilterButton>
          <FilterButton active={activeFilter === 'monthly'} onClick={() => setActiveFilter('monthly')}>شهرية</FilterButton>
          <FilterButton active={activeFilter === 'weekly'} onClick={() => setActiveFilter('weekly')}>أسبوعية</FilterButton>
        </div>
      </div>

      {/* عرض الباقات */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-slate-50 rounded-[2.5rem] h-96 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredPackages.map((pkg) => (
              <motion.div key={pkg.id} variants={cardVariants}>
                <PackageCard 
                  pkg={pkg}
                  isSubscribed={subscriptions.includes(pkg.id)}
                  onBuy={() => {
                    setSelectedPackage(pkg);
                    setPurchaseStep('options');
                    setPurchaseError(null);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* نافذة الشراء المنبثقة */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedPackage(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/20"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white relative">
                <button 
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-6 left-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-100">تأكيد الاشتراك</span>
                </div>
                <h3 className="text-2xl font-black">{selectedPackage.name}</h3>
                <p className="text-blue-100 font-medium text-sm mt-2 opacity-90">{selectedPackage.description}</p>
                <div className="mt-6 text-4xl font-black tracking-tight">
                  {selectedPackage.price} <span className="text-lg opacity-70">ج.م</span>
                </div>
              </div>
              <div className="p-8">
                {purchaseError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-xl flex gap-3 text-sm"
                  >
                    <AlertCircle className="shrink-0" />
                    {purchaseError}
                  </motion.div>
                )}
                <AnimatePresence mode="wait">
                  {purchaseStep === 'options' && (
                    <motion.div 
                      key="options"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <p className="text-slate-500 font-bold mb-4">اختر وسيلة الدفع:</p>
                      <button onClick={() => setPurchaseStep('wallet')} className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-500 rounded-2xl transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <CreditCard size={22} />
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-800">الدفع من المحفظة</p>
                            <p className="text-xs font-bold text-slate-500">رصيدك: {profile?.walletBalance} ج.م</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
                      </button>
                      <button onClick={() => setPurchaseStep('code')} className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-500 rounded-2xl transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Key size={22} />
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-800">كود تفعيل</p>
                            <p className="text-xs font-bold text-slate-500">ادخل الكود المكون من 12 حرف</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600" />
                      </button>
                    </motion.div>
                  )}
                  {purchaseStep === 'wallet' && (
                    <motion.div 
                      key="wallet"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 text-center"
                    >
                      <p className="text-slate-500 font-bold">سيتم خصم {selectedPackage.price} ج.م من محفظتك</p>
                      <p className="text-sm font-bold text-slate-400">الرصيد المتبقي: {(profile?.walletBalance || 0) - selectedPackage.price} ج.م</p>
                      <div className="flex gap-4 mt-8">
                        <button onClick={() => setPurchaseStep('options')} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">رجوع</button>
                        <button disabled={purchaseLoading} onClick={handleManualPurchase} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200">
                          {purchaseLoading ? 'جاري الدفع...' : 'تأكيد الشراء'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {purchaseStep === 'code' && (
                    <motion.div 
                      key="code"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">كود التفعيل</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-5 px-6 text-2xl font-black text-emerald-600 outline-none focus:border-emerald-500 transition-colors uppercase"
                          placeholder="MD-2026-XXXX"
                          value={activationCode}
                          onChange={(e) => setActivationCode(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setPurchaseStep('options')} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">رجوع</button>
                        <button disabled={purchaseLoading || !activationCode} onClick={handleCodePurchase} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200">
                          {purchaseLoading ? 'جاري التحقق...' : 'تفعيل الكود'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* مكون زر الفلتر */
function FilterButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active-pulse' 
          : 'text-slate-600 hover:bg-white/50 hover:text-blue-600'
      }`}
    >
      {children}
    </motion.button>
  );
}

/* بطاقة الباقة */
function PackageCard({ pkg, isSubscribed, onBuy }: { pkg: Package; isSubscribed: boolean; onBuy: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="shimmer-border bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full overflow-hidden transition-shadow duration-500 group"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img 
          src={pkg.image_url || "https://placehold.co/1920x1080/0f172a/3b82f6?text=البارع"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={pkg.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        {isSubscribed && (
          <div className="absolute top-5 right-5 bg-emerald-500 text-white px-4 py-1.5 rounded-full font-black text-xs shadow-lg flex items-center gap-1.5">
            <CheckCircle2 size={15} /> مشترك
          </div>
        )}
        {pkg.old_price && pkg.old_price > pkg.price && (
          <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-1.5 rounded-full font-black text-xs shadow-lg">
            وفر {Math.round(((pkg.old_price - pkg.price) / pkg.old_price) * 100)}%
          </div>
        )}
        <div className="absolute bottom-6 right-6">
          <h4 className="text-white text-2xl md:text-3xl font-black tracking-tight">{pkg.name}</h4>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between space-y-6 text-right">
        <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">{pkg.description}</p>
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col items-end">
            {pkg.old_price && (
              <span className="text-xs font-bold text-slate-400 line-through">{pkg.old_price} ج.م</span>
            )}
            <span className="text-3xl font-black text-slate-900">{pkg.price} <span className="text-sm font-bold text-slate-400">ج.م</span></span>
          </div>
          {isSubscribed ? (
            <Link 
              to={`/package/${pkg.id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              دخول <ChevronRight size={18} className="rotate-180" />
            </Link>
          ) : (
            <button 
              onClick={onBuy}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              شراء <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}