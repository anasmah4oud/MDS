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

      if (transError) {
        console.error('Transaction Log Error:', transError);
        // Error in log shouldn't revert the balance update for the user in this UI flow, 
        // but we should know about it. Usually it's an RLS issue.
      }

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
                      <img src={foundUser.photo_url || `data:image/png;base64,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`} className="w-20 h-20 rounded-full border-4 border-white" alt="Found User" />
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
