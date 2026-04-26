/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet as WalletIcon, ChevronRight, PhoneCall, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [chargeAmount, setChargeAmount] = useState<number>(0);

  const adminPhones = ["01100196131", "+201023958772"];
  const adminWhatsApp = "201023958772";

  const calculateTotal = (amount: number) => {
    return amount + (amount * 0.05); // 5% fee
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">شحن المحفظة</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-12 space-y-12">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-10 text-white shadow-2xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
             <p className="text-lg font-bold text-blue-100 mb-2 opacity-80 italic tracking-wide">رصيدك الحالي بالمحفظة</p>
             <h2 className="text-6xl font-black tracking-tighter">
               {profile?.walletBalance || 0} <span className="text-2xl opacity-70">ج.م</span>
             </h2>
           </div>
           <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex flex-col items-center">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
               <WalletIcon size={32} />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-blue-50">آمن ومحمي 100%</span>
           </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10">
          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Info className="text-blue-600" />
              طريقة الشحن
            </h3>
            <div className="space-y-6">
              <p className="text-xl font-bold text-slate-600">
                يمكنك شحن رصيدك بسهولة عن طريق تحويل المبلغ لأي من الأرقام التالية عبر (فودافون كاش - اتصالات كاش - أورنج كاش):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminPhones.map(phone => (
                  <div key={phone} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-center justify-between group">
                    <span className="text-2xl font-black text-slate-800 tracking-wider font-mono">{phone}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(phone)}
                      className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      نسخ الرقم
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-green-50 rounded-3xl p-8 border border-green-100">
            <h4 className="text-xl font-black text-green-900 mb-4">بعد التحويل:</h4>
            <ul className="space-y-4 text-green-800 font-bold">
              <li className="flex items-center gap-3"><CheckCircle2 className="shrink-0" /> صور سكرين شوت لرسالة التحويل</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="shrink-0" /> أرسل الصورة + الرقم المحول منه + اسمك + كود الطالب</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="shrink-0" /> تواصل مباشرة عبر الواتساب لتأكيد الشحن خلال دقائق</li>
            </ul>
            <a 
              href={`https://wa.me/${adminWhatsApp}`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-green-500 text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-green-600 transition-all shadow-xl shadow-green-100"
            >
              <PhoneCall />
              تواصل واتساب للتأكيد
            </a>
          </section>

          {/* Calculator */}
          <section className="pt-10 border-t border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Calculator className="text-blue-600" />
              حاسبة الرصيد (التحويل)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500">الرصيد المراد استلامه في المحفظة</label>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-6 px-8 text-3xl font-black text-blue-600 outline-none focus:border-blue-600 transition-colors"
                    placeholder="0"
                    value={chargeAmount || ''}
                    onChange={(e) => setChargeAmount(Number(e.target.value))}
                  />
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">ج.م</span>
                </div>
              </div>
              
              <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calculator size={80} />
                </div>
                <p className="text-sm font-bold text-slate-400 mb-2">إجمالي الرصيد الذي يجب تحويله (+5% مصاريف):</p>
                <p className="text-4xl font-black text-blue-400">
                  {calculateTotal(chargeAmount).toLocaleString()} <span className="text-lg">ج.م</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-2 italic">
              * لاحظ أن الـ 5% هي مصاريف إدارية تضاف على المبلغ المستلم في المحفظة.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
