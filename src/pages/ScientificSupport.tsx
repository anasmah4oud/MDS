/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, MessageSquare, Send, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScientificSupport() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
       <header className="bg-slate-50 border-b border-slate-100 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">الدعم العلمي</h1>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600">
          <ChevronRight /> العودة
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-12">
        <div className="bg-slate-50 p-10 md:p-16 rounded-[60px] space-y-12 text-center border-t-8 border-blue-600 shadow-2xl">
           <div className="w-32 h-32 bg-blue-600 text-white rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Lightbulb size={60} />
           </div>
           
           <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">
             اسأل في <span className="text-blue-600"> المنهج</span> <br/> وهنجاوبك بالتفصيل
           </h2>
           
           <p className="text-xl text-slate-500 font-bold max-w-lg mx-auto">
             عندك سؤال في النحو؟ البلاغة واقفة معاك؟ فريقنا المساعد مستعد لتوضيح أي نقطة غامضة في المنهج.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <SupportCard title="واتساب العلمي" detail="01012345678" color="bg-green-500" href="https://wa.me/201012345678" />
              <SupportCard title="مجموعة التيليجرام" detail="@ElBarie_Scientific" color="bg-sky-500" href="https://t.me/ElBarie_Scientific" />
           </div>

           <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4 text-right">
              <BookOpen className="text-blue-500 shrink-0" />
              <p className="text-blue-800 font-bold text-sm leading-relaxed">
                <span className="font-black italic">نظام الدعم:</span> يتم الرد على الأسئلة العلمية بانتظام لضمان وصول المعلومة صحيحة ومفصلة لكل طالب.
              </p>
           </div>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-400 font-black text-xs uppercase tracking-widest italic">جميع الحقوق محفوظة للأستاذ محمود الديب</footer>
    </div>
  );
}

function SupportCard({ title, detail, color, href }: { title: string, detail: string, color: string, href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="p-10 bg-white border border-slate-100 rounded-[40px] hover:scale-105 transition-all shadow-lg hover:shadow-xl group">
       <div className={`w-20 h-20 ${color} text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:rotate-6 transition-transform`}>
          <MessageSquare size={32} />
       </div>
       <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
       <p className="text-slate-400 font-bold font-mono">{detail}</p>
    </a>
  );
}
