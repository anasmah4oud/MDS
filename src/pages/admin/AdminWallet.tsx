/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wallet, Search, PlusCircle, ArrowUpRight, 
  ArrowDownLeft, History, ChevronRight, User,
  CheckCircle2, AlertCircle, Save, X, DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Transaction, UserProfile } from '../../types';

export default function AdminWallet() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState<number>(0);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('id', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setTransactions(data as Transaction[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setFoundUser(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', searchTerm)
        .single();
      
      if (error || !data) {
        alert('المستخدم غير موجود');
      } else {
        setFoundUser(data as UserProfile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!foundUser || amountToAdd <= 0) return;
    try {
      // 1. Update wallet balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: foundUser.wallet_balance + amountToAdd })
        .eq('id', foundUser.id);
      
      if (updateError) throw updateError;

      // 2. Create transaction log
      const { error: transError } = await supabase
        .from('transactions')
        .insert({
          user_id: foundUser.id,
          amount: amountToAdd,
          type: 'deposit',
          description: 'إيداع نقدي بواسطة الإدارة'
        });

      if (transError) throw transError;

      alert('تمت إضافة المبلغ بنجاح');
      setIsModalOpen(false);
      setFoundUser(null);
      setSearchTerm('');
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء العملية');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">إدارة المحفظة والماليات</h1>
        </div>
        <button 
          onClick={() => navigate('/anas/md/200/9')}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة للمسؤول
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Search & Add Section */}
           <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-blue-100/50 space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                    <PlusCircle size={32} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">إضافة رصيد للطالب</h2>
                    <p className="text-slate-400 font-bold text-sm">ابحث عن الطالب برقم الهاتف للإيداع.</p>
                 </div>
              </div>

              <form onSubmit={handleUserSearch} className="flex gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="tel"
                      placeholder="رقم الهاتف..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pr-12 pl-4 font-black outline-none focus:border-blue-600 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <button 
                  disabled={searchLoading}
                  type="submit"
                  className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50"
                 >
                   بحث
                 </button>
              </form>

              {foundUser && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 space-y-6"
                >
                   <div className="flex items-center gap-6">
                      <img src={foundUser.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.id}`} className="w-20 h-20 rounded-full border-4 border-white" alt="Found User" />
                      <div>
                         <h4 className="text-2xl font-black text-slate-900">{foundUser.first_name} {foundUser.last_name}</h4>
                         <p className="text-blue-600 font-bold italic">رصيده الحالي: {foundUser.wallet_balance} ج.م</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700 underline decoration-blue-600">المبلغ المراد إيداعه</label>
                      <div className="relative">
                         <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                         <input 
                          type="number"
                          className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pr-12 pl-4 text-3xl font-black text-slate-900 outline-none focus:border-blue-600 transition-all"
                          placeholder="0"
                          value={amountToAdd || ''}
                          onChange={(e) => setAmountToAdd(Number(e.target.value))}
                         />
                      </div>
                   </div>

                   <button 
                    onClick={handleAddMoney}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-transform hover:-translate-y-1"
                   >
                     <Save /> تأكيد الإيداع الآن
                   </button>
                </motion.div>
              )}
           </section>

           {/* History Section */}
           <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <History className="text-slate-400" />
                    <h2 className="text-2xl font-black text-slate-900">آخر العمليات</h2>
                 </div>
                 <button onClick={fetchTransactions} className="text-blue-600 font-bold hover:underline">تحديث</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-2">
                 {transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                             {t.type === 'deposit' ? <ArrowUpRight /> : <ArrowDownLeft />}
                          </div>
                          <div>
                             <p className="font-black text-slate-800 text-sm">{(t as any).userName || 'مستخدم'}</p>
                             <p className="text-[10px] font-bold text-slate-400">{t.description}</p>
                          </div>
                       </div>
                       <div className="text-left">
                          <p className={`text-xl font-black ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'deposit' ? '+' : '-'}{t.amount} ج.م
                          </p>
                          <p className="text-[9px] font-black text-slate-400 tracking-tighter">
                            {t.createdAt?.toDate ? new Date(t.createdAt.toDate()).toLocaleString('ar-EG') : 'الآن'}
                          </p>
                       </div>
                    </div>
                 ))}
                 {transactions.length === 0 && !loading && (
                    <div className="py-20 text-center text-slate-300 font-black italic">لا يوجد سجل معاملات متاح.</div>
                 )}
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
