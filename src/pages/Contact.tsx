/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Facebook, Youtube, MessageCircle } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-12 h-12 rounded-full shadow-sm" alt="البارع" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">تواصل معنا</h1>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full"
        >
          <ChevronRight size={20} /> العودة
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 md:p-12 mt-8 md:mt-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            البارع <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">محمود الديب</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed">
            انضم إلينا الآن عبر منصاتنا الرسمية لمتابعة أقوى الفيديوهات والمراجعات والنصائح التعليمية لطلاب الثانوية العامة.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <ContactCard 
            icon={<Facebook size={36} className="text-white" />} 
            title="صفحة الفيسبوك" 
            subtitle="تابع أحدث الأخبار والملازم"
            href="#" 
            gradient="from-blue-500 to-blue-700"
            shadowColor="shadow-blue-500/30"
          />

          <ContactCard 
            icon={<Youtube size={36} className="text-white" />} 
            title="قناة اليوتيوب" 
            subtitle="شاهد أقوى المراجعات"
            href="https://www.youtube.com/channel/UCIW308efj12Q86_hV8LgsNw/" 
            gradient="from-red-500 to-red-700"
            shadowColor="shadow-red-500/30"
          />

          <ContactCard 
            icon={<MessageCircle size={36} className="text-white" />} 
            title="رقم الواتساب" 
            subtitle="تواصل مع الدعم الفني مباشرة"
            href="https://wa.me/201023958772" 
            gradient="from-emerald-400 to-emerald-600"
            shadowColor="shadow-emerald-500/30"
          />

        </div>
      </main>
    </div>
  );
}

// Advanced UI Contact Card Component
function ContactCard({ icon, title, subtitle, href, gradient, shadowColor }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="group relative block"
    >
      {/* Background glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-[32px] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Card Body */}
      <div className="relative h-full bg-white border border-slate-100 rounded-[32px] p-8 text-center shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        
        {/* Decorative corner shape */}
        <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

        {/* Icon Container */}
        <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg ${shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
          {icon}
        </div>

        {/* Text */}
        <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 font-bold">{subtitle}</p>
        
        {/* Animated line indicator */}
        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mt-8 group-hover:w-24 group-hover:bg-slate-300 transition-all duration-300" />
      </div>
    </a>
  );
}