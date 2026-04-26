/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Star, Filter, ShoppingCart, 
  CreditCard, Key, AlertCircle, CheckCircle2, 
  ChevronRight, ArrowRight, LayoutDashboard, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Package } from '../types';

export default function Classes() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
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
  }, [profile, user]);

  const fetchData = async () => {
    if (!profile) return;
    try {
      // 1. Fetch Packages for the student's grade
      const { data: packList, error: packError } = await supabase
        .from('packages')
        .select('*')
        .eq('gradeId', profile.grade);
      
      if (packError) throw packError;
      setPackages(packList as Package[]);

      // 2. Fetch User Subscriptions
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('packageId')
        .eq('userId', profile.id);
      
      if (subError) throw subError;
      const subList = subData.map(d => d.packageId);
      setSubscriptions(subList);
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
      // Note: Real-world apps should use a Database Function (RPC) for transaction logic
      // to ensure atomic balance deduction and subscription creation.
      
      // 1. Check balance first
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', profile.id)
        .single();

      if (userError || !userData) throw new Error('مستخدم غير موجود');

      if (userData.wallet_balance < selectedPackage.price) {
        throw new Error('رصيدك غير كافي في المحفظة، يرجى الشحن أولاً');
      }

      // 2. Deduct from wallet
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: userData.wallet_balance - selectedPackage.price })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // 3. Create subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          userId: profile.id,
          packageId: selectedPackage.id,
          paymentMethod: 'wallet'
        });

      if (subError) throw subError;

      // 4. Create transaction log
      await supabase.from('transactions').insert({
        userId: profile.id,
        amount: selectedPackage.price,
        type: 'purchase',
        description: `شراء باقة: ${selectedPackage.name}`
      });

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
      // 1. Check if code is valid
      const { data: codeData, error: codeError } = await supabase
        .from('codes')
        .select('*')
        .eq('code', activationCode)
        .eq('packageId', selectedPackage.id)
        .eq('isUsed', false)
        .single();

      if (codeError || !codeData) {
        throw new Error('كود غير صحيح أو مستخدم مسبقاً لهذا النوع من الباقات');
      }

      // 2. Mark code as used
      const { error: updateError } = await supabase
        .from('codes')
        .update({
          isUsed: true,
          usedBy: profile.id,
          usedAt: new Date().toISOString()
        })
        .eq('id', codeData.id);

      if (updateError) throw updateError;

      // 3. Create subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          userId: profile.id,
          packageId: selectedPackage.id,
          paymentMethod: 'code'
        });

      if (subError) throw subError;

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
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Search/Header */}
      <div className="bg-blue-600 pt-8 pb-16 md:pt-12 md:pb-24 px-4 md:px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 relative z-10">
          <div className="text-center md:text-right">
            <Link to="/dashboard" className="text-blue-100 font-bold flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-6 hover:underline">
              <ChevronRight size={18} />
              العودة للوحة التحكم
            </Link>
            <h1 className="text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter italic">البارع محمود الديب</h1>
            <p className="text-lg md:text-2xl font-bold text-blue-100 opacity-90">ابدأ الآن طريقك إلى التفوق في اللغة العربية</p>
          </div>
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-[20px] md:rounded-3xl p-1 md:p-2 flex border border-white/20">
              <input 
                type="text" 
                placeholder="ابحث عن باقة معينة..."
                className="bg-transparent border-none outline-none flex-1 px-3 md:px-4 text-base md:text-lg font-bold placeholder:text-blue-200"
              />
              <button className="bg-white text-blue-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl">
                 <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-12 pb-24 space-y-12">
        {/* Filters */}
        <div className="bg-white p-3 md:p-4 rounded-[20px] md:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap gap-2 md:gap-4 items-center justify-center">
          <FilterItem active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>الكل</FilterItem>
          <FilterItem active={activeFilter === 'offer'} onClick={() => setActiveFilter('offer')}>العروض</FilterItem>
          <FilterItem active={activeFilter === 'monthly'} onClick={() => setActiveFilter('monthly')}>الباقات الشهرية</FilterItem>
          <FilterItem active={activeFilter === 'weekly'} onClick={() => setActiveFilter('weekly')}>الأسبوعية</FilterItem>
          <FilterItem active={activeFilter === 'quarterly'} onClick={() => setActiveFilter('quarterly')}>باقات الـ 3 شهور</FilterItem>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold animate-pulse">جاري تحميل الباقات...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((p) => (
              <PackageCard 
                key={p.id} 
                pkg={p} 
                isSubscribed={subscriptions.includes(p.id)}
                onBuy={() => {
                  setSelectedPackage(p);
                  setPurchaseStep('options');
                  setPurchaseError(null);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
              onClick={() => setSelectedPackage(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/20"
            >
              <div className="bg-blue-600 p-8 text-white relative">
                <button 
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-8 left-8 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShoppingCart />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-100">تأكيد الاشتراك</span>
                </div>
                <h3 className="text-2xl font-black">{selectedPackage.name}</h3>
                <p className="text-blue-100 font-bold text-sm mt-2 opacity-80">{selectedPackage.description}</p>
                <div className="mt-6 text-4xl font-black tracking-tight">{selectedPackage.price} <span className="text-lg opacity-70">ج.م</span></div>
              </div>

              <div className="p-8">
                {purchaseError && (
                  <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-xl flex gap-3 text-sm">
                    <AlertCircle className="shrink-0" />
                    {purchaseError}
                  </div>
                )}

                {purchaseStep === 'options' && (
                   <div className="space-y-4">
                      <p className="text-slate-500 font-bold mb-6">اختر وسيلة الدفع المناسبة لك:</p>
                      <button 
                        onClick={() => setPurchaseStep('wallet')}
                        className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-600 rounded-3xl transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white">
                              <CreditCard />
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-800">الدفع من المحفظة</p>
                               <p className="text-xs font-bold text-slate-500">رصيدك: {profile?.walletBalance} ج.م</p>
                            </div>
                         </div>
                         <ChevronRight className="text-slate-300 group-hover:text-blue-600" />
                      </button>

                      <button 
                         onClick={() => setPurchaseStep('code')}
                         className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-100 hover:border-emerald-600 rounded-3xl transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                              <Key />
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-800">استخدام كود تفعيل</p>
                               <p className="text-xs font-bold text-slate-500">ادخل الكود المكون من 12 حرف</p>
                            </div>
                         </div>
                         <ChevronRight className="text-slate-300 group-hover:text-emerald-600" />
                      </button>
                   </div>
                )}

                {purchaseStep === 'wallet' && (
                  <div className="space-y-8">
                     <div className="text-center">
                        <p className="text-slate-500 font-bold mb-2">سيتم خصم {selectedPackage.price} ج.م من محفظتك</p>
                        <p className="text-sm font-bold text-slate-400">الرصيد المتبقي بعد العملية: { (profile?.walletBalance || 0) - selectedPackage.price } ج.م</p>
                     </div>
                     <div className="flex gap-4">
                        <button 
                          onClick={() => setPurchaseStep('options')}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200"
                        >
                          إلغاء
                        </button>
                        <button 
                          disabled={purchaseLoading}
                          onClick={handleManualPurchase}
                          className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50"
                        >
                          {purchaseLoading ? 'جاري الدفع...' : 'تأكيد الشراء والاشتراك'}
                        </button>
                     </div>
                  </div>
                )}

                {purchaseStep === 'code' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">ادخل كود التفعيل</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-5 px-6 text-2xl font-black text-emerald-600 outline-none focus:border-emerald-600 transition-colors uppercase"
                         placeholder="MD-2026-XXXX"
                         value={activationCode}
                         onChange={(e) => setActivationCode(e.target.value)}
                       />
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setPurchaseStep('options')}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200"
                      >
                        رجوع
                      </button>
                      <button 
                         disabled={purchaseLoading || !activationCode}
                         onClick={handleCodePurchase}
                         className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 disabled:opacity-50"
                      >
                        {purchaseLoading ? 'جاري التحقق...' : 'تفعيل الكود الآن'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterItem({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      {children}
    </button>
  );
}

const PackageCard: React.FC<{ pkg: Package, isSubscribed: boolean, onBuy: () => void }> = ({ pkg, isSubscribed, onBuy }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col group h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={pkg.imageUrl || "https://placehold.co/600x400/3b82f6/white?text=البارع"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={pkg.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {isSubscribed && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-lg shadow-green-500/40 flex items-center gap-1">
             <CheckCircle2 size={14} /> مشترك بالفعل
          </div>
        )}
        
        {pkg.oldPrice && pkg.oldPrice > pkg.price && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-lg shadow-orange-500/40">
             عرض محدود!
          </div>
        )}

        <div className="absolute bottom-6 right-6">
           <span className="text-white/80 text-xs font-bold block mb-1">الدفعة الجديدة 2026</span>
           <h4 className="text-white text-2xl font-black">{pkg.name}</h4>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2">{pkg.description}</p>
        
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
             {pkg.oldPrice && (
               <span className="text-xs font-bold text-slate-400 line-through mb-1">{pkg.oldPrice} ج.م</span>
             )}
             <span className="text-2xl font-black text-slate-900">{pkg.price} <span className="text-sm font-bold text-slate-500">ج.م</span></span>
          </div>

          {isSubscribed ? (
            <Link 
              to={`/package/${pkg.id}`}
              className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all"
            >
              دخول المحتوي <ChevronRight size={18} />
            </Link>
          ) : (
            <button 
              onClick={onBuy}
              className="bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
            >
              شراء الآن <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
