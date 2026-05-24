/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScientificSupport() {
  const navigate = useNavigate();

  // إعدادات الحركة (Animations)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden" dir="rtl">
      {/* خلفيات ضبابية لإعطاء مظهر متقدم واحترافي */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* الهيدر مع تأثير الزجاج (Glassmorphism) */}
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="Master" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">الدعم العلمي</h1>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-slate-100"
        >
          <ChevronRight size={18} /> العودة
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-12 relative z-10 flex items-center justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[40px] space-y-12 text-center border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full relative"
        >
          {/* لمسة ديكور علوية */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-blue-600 to-sky-400 rounded-b-full" />

          <motion.div variants={itemVariants} className="relative inline-block">
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
            <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-xl relative rotate-3 hover:rotate-0 transition-transform duration-300">
              <Lightbulb size={50} strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              اسأل في <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-sky-500">المنهج</span>
              {/* مسافة بين السطور باستخدام block و margin */}
              <span className="block mt-6 text-3xl md:text-4xl">وهنجاوبك بالتفصيل</span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              عندك سؤال في النحو؟ البلاغة واقفة معاك؟ فريقنا المساعد مستعد لتوضيح أي نقطة غامضة في المنهج خطوة بخطوة.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 flex justify-center">
            <WhatsAppCard 
              title="تواصل مع الدعم العلمي" 
              detail="+20 120 357 8747" 
              href="https://wa.me/201203578747" 
            />
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-sky-50/50 p-6 rounded-3xl border border-blue-100/50 flex items-start md:items-center gap-5 text-right shadow-sm">
            <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0">
              <BookOpen className="text-blue-500" size={24} />
            </div>
            <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed">
              <span className="font-black text-blue-800 ml-2">نظام الدعم:</span> 
              يتم الرد على الأسئلة العلمية بانتظام لضمان وصول المعلومة صحيحة ومفصلة لكل طالب في أسرع وقت.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <footer className="p-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest relative z-10">
        جميع الحقوق محفوظة للأستاذ محمود الديب
      </footer>
    </div>
  );
}

// كارت الواتساب بتصميم مخصص ولوجو حقيقي
function WhatsAppCard({ title, detail, href }: { title: string, detail: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="block w-full max-w-sm p-8 bg-white border border-slate-100 rounded-[32px] transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden"
    >
      {/* تأثير إضاءة خفيف عند التمرير */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
          {/* لوجو الواتساب الرسمي (SVG) */}
          <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
        <div className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-[#128C7E] font-black font-mono tracking-widest text-lg group-hover:bg-[#25D366]/10 transition-colors">
          {detail}
        </div>
      </div>
    </a>
  );
}