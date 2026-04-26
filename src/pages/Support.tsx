/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, PhoneCall, MessageCircle, 
  Send, HelpCircle, UserCheck, Clock, AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Support() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">الدعم الفني</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-12">
        <div className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-xl shadow-blue-50 space-y-12 text-center">
           <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-32 h-32 bg-blue-100 text-blue-600 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Headset size={60} />
           </motion.div>
           
           <h2 className="text-4xl font-black text-slate-900 leading-tight italic tracking-tighter">
             طريقة البارع في الدعم <br/> من خلال <span className="text-blue-600">لحظة بلحظة</span>
           </h2>
           
           <p className="text-xl text-slate-500 font-bold max-w-lg mx-auto">
             واجهتك أي مشكلة تقنية في الموقع أو الدخول؟ فريقنا متاح للرد عليك وحل مشكلتك فوراً.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <SupportCard 
                title="تواصل عبر واتساب" 
                detail="01023958772" 
                icon={<MessageCircle size={32} />} 
                color="bg-green-500" 
                href="https://wa.me/201023958772"
              />
              <SupportCard 
                title="قناة التيليجرام" 
                detail="@ElBarie_Support" 
                icon={<Send size={32} />} 
                color="bg-sky-500" 
                href="https://t.me/ElBarie_Admin"
              />
           </div>

           <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4 text-right">
              <Clock className="text-amber-500 shrink-0" />
              <p className="text-amber-800 font-bold text-sm leading-relaxed">
                <span className="font-black italic">نعتذر عن أي تأخير:</span> نظراً لضغط الرسائل الكبير، قد يستغرق الرد بضع دقائق. تأكد أننا سنصل إليك في أقرب وقت ممكن.
              </p>
           </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-white border-t border-slate-100">
         <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Logo" />
            <span className="text-slate-400 font-black text-xs uppercase tracking-widest italic">جميع الحقوق محفوظة للأستاذ محمود الديب</span>
         </div>
      </footer>
    </div>
  );
}

function SupportCard({ title, detail, icon, color, href }: { title: string, detail: string, icon: React.ReactNode, color: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="p-8 bg-slate-50 border-2 border-slate-50 rounded-[32px] hover:border-slate-200 transition-all group hover:bg-white hover:shadow-lg"
    >
       <div className={`w-16 h-16 ${color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
       <p className="text-sm font-bold text-slate-400 font-mono tracking-wider">{detail}</p>
    </a>
  );
}

function Headset({ size }: { size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 14c-1.1 0-2-.9-2-2V7C1 3.1 4.1 0 8 0h8c3.9 0 7 3.1 7 7v5c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2V7c0-2.2-1.8-4-4-4H9C6.8 3 5 4.8 5 7v5c0 1.1-.9 2-2 2h-1z"/><path d="M19 14v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
