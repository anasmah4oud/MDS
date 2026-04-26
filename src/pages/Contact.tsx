/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Facebook, Instagram, Youtube, Send, MessageCircle, Globe, MapPin } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">تواصل معنا</h1>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600">
          <ChevronRight /> العودة
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-10">
              <h2 className="text-5xl font-black text-slate-900 leading-tight">البارع محمود الديب <br/> <span className="text-blue-600">دايماً معاك</span></h2>
              <p className="text-xl text-slate-500 font-bold leading-relaxed">
                يمكنك متابعتنا عبر جميع وسائل التواصل الاجتماعي لمشاهدة أقوى الفيديوهات والنصائح التعليمية لطلاب الثانوية العامة.
              </p>

              <div className="space-y-4">
                 <ContactLink icon={<Facebook className="text-blue-600" />} label="فيسبوك" value="البارع في اللغة العربية" href="#" />
                 <ContactLink icon={<Youtube className="text-red-600" />} label="يوتيوب" value="قناة البارع محمود الديب" href="#" />
                 <ContactLink icon={<Instagram className="text-pink-600" />} label="انستجرام" value="mahmoud.eldeeb.arabic" href="#" />
                 <ContactLink icon={<MessageCircle className="text-green-600" />} label="واتساب" value="01023958772" href="https://wa.me/201023958772" />
                 <ContactLink icon={<Send className="text-sky-600" />} label="تيليجرام" value="قناة البارع التعليمية" href="#" />
              </div>
           </div>

           <div className="bg-slate-950 rounded-[60px] p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600 opacity-20 blur-[100px] -mr-40 -mt-40" />
              <div className="relative z-10 space-y-8">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center">
                    <MapPin size={40} className="text-blue-400" />
                 </div>
                 <h3 className="text-3xl font-black italic">نحن متواجدون <br/> في قلب الدلتا</h3>
                 <p className="text-slate-400 font-bold text-lg">
                    المنصورة - محافظة الدقهلية <br/>
                    وجميع مراكز المحافظة عبر مراكزنا التعليمية المعتمدة.
                 </p>
                 <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                       <Globe size={24} />
                    </div>
                    <span className="font-black italic">خدمة جميع طلاب مصر أونلاين</span>
                 </div>
              </div>
              <img src="/logo.png" className="absolute bottom-10 left-10 w-32 h-32 opacity-10 grayscale" alt="Ghost logo" />
           </div>
        </div>
      </main>
    </div>
  );
}

function ContactLink({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-102 transition-all group">
       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
          {icon}
       </div>
       <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
          <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
       </div>
    </a>
  );
}
