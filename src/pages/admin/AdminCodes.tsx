/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Database, Plus, Trash2, ChevronRight, 
  Search, Filter, Copy, CheckCircle2, 
  AlertCircle, X, Download, Scissors
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ActivationCode, Package } from '../../types';

export default function AdminCodes() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    packageId: '',
    count: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: codesData, error: codesError } = await supabase
        .from('codes')
        .select('*')
        .order('id', { ascending: false });
      
      if (codesError) throw codesError;
      setCodes(codesData as ActivationCode[]);

      const { data: packsData, error: packsError } = await supabase
        .from('packages')
        .select('*');
      
      if (packsError) throw packsError;
      setPackages(packsData as Package[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MD-2026-${result}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      for (let i = 0; i < formData.count; i++) {
        const codeString = generateCode();
        const { error } = await supabase
          .from('codes')
          .insert({
            code: codeString,
            package_id: Number(formData.packageId),
            is_used: false
          });
        
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء إنشاء الأكواد');
    }
  };

  const filteredCodes = codes.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.package_id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-16 md:h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
           <img src="/logo.png" className="w-10 h-10 md:w-12 md:h-12 rounded-full" alt="Master" />
           <h1 className="text-lg md:text-xl font-black text-slate-900">إدارة الأكواد</h1>
        </div>
        <button 
          onClick={() => navigate('/anas/md/200/9')}
          className="flex items-center gap-1 md:gap-2 text-sm md:text-base text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight size={18} />
          <span className="hidden sm:inline">العودة للمسؤول</span>
          <span className="sm:hidden">رجوع</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full max-w-md">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="ابحث بالكود أو ID الباقة..."
                 className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-transform hover:-translate-y-1"
            >
              <Plus /> إنشاء أكواد جديدة
            </button>
        </div>

        <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
             {loading ? (
               <div className="p-20 text-center font-black animate-pulse text-slate-400">جاري تحميل سجل الأكواد...</div>
             ) : (
               <table className="w-full text-right min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                      <th className="p-6 md:p-8">ID</th>
                      <th className="p-6 md:p-8">الكــــــــود</th>
                      <th className="p-6 md:p-8">خـاص بالبـاقة</th>
                      <th className="p-6 md:p-8">الحــــالة</th>
                      <th className="p-6 md:p-8">بواسطـة</th>
                      <th className="p-6 md:p-8">الإجـراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCodes.map(code => (
                      <tr key={code.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 md:p-8 font-mono text-slate-400">#{code.id}</td>
                        <td className="p-6 md:p-8 relative group">
                           <span className="font-black text-lg md:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{code.code}</span>
                           <button 
                            onClick={() => { navigator.clipboard.writeText(code.code); alert('تم النسخ'); }}
                            className="mr-3 p-1.5 bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Copy size={16} />
                           </button>
                        </td>
                        <td className="p-6 md:p-8">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{packages.find(p => p.id === code.package_id)?.name || 'باقة غير موجودة'}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">ID: #{code.package_id}</span>
                           </div>
                        </td>
                        <td className="p-6 md:p-8">
                           {code.is_used ? (
                             <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-black italic">مُستخدم</span>
                           ) : (
                             <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black italic">متاح</span>
                           )}
                        </td>
                        <td className="p-6 md:p-8 font-bold text-slate-500 text-xs">
                           {code.used_by || '---'}
                        </td>
                        <td className="p-6 md:p-8">
                           <button 
                            onClick={async () => { if(window.confirm('حذف الكود؟')) { await supabase.from('codes').delete().eq('id', code.id); fetchData(); }}}
                            className="p-3 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all"
                           >
                             <Trash2 size={20} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             )}
           </div>
        </div>
      </main>

      {/* Modal Generator */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               exit={{ scale: 0.9, y: 20 }} 
               className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 space-y-8"
             >
                <div className="text-center">
                   <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
                     <Scissors size={40} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 italic tracking-tight underline decoration-blue-600 underline-offset-8 decoration-4">توليد أكواد جديدة</h2>
                   <p className="text-slate-500 font-bold mt-6 italic">سيتم إنشاء أكواد فريدة مخصصة لباقة معينة.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700">اختر الباقة المفتوحة بالكود</label>
                      <select 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all appearance-none"
                        value={formData.packageId}
                        onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                      >
                         <option value="">اختر الباقة...</option>
                         {packages.map(p => <option key={p.id} value={p.id}>{p.name} (الصف {p.gradeId}) - ID: {p.id}</option>)}
                      </select>
                   </div>

                   <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700">كم عدد الأكواد؟</label>
                      <input 
                        required
                        type="number"
                        min="1"
                        max="100"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black italic outline-none focus:border-blue-600 transition-all"
                        value={formData.count}
                        onChange={(e) => setFormData({...formData, count: Number(e.target.value)})}
                      />
                   </div>

                   <div className="flex gap-4 pt-6">
                      <button type="submit" className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-200">
                         توليد الأكواد الآن
                      </button>
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-3xl font-black text-xl hover:bg-slate-200">
                         إلغاء
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
