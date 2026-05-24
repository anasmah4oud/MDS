/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden" dir="rtl">
      {/* Background Glowing Blobs for Advanced UI */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-12 h-12 rounded-full shadow-sm" alt="Master" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">الدعم الفني</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full"
        >
          <ChevronRight size={18} />
          <span>العودة</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-12 relative z-10 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-xl p-8 md:p-16 rounded-[40px] border border-white shadow-2xl shadow-slate-200/50 space-y-10 text-center"
        >
          
          {/* Advanced Central Animated Logo */}
          <SupportHeroIcon />

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.2] tracking-tighter">
              فريقنا جنبك <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                لحظة بلحظة
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              واجهتك أي مشكلة تقنية في المنصة أو الدخول لحسابك ؟ نحن هنا من أجلك، فريقنا متاح للرد وحل مشكلتك في أسرع وقت.
            </p>
          </div>

          {/* WhatsApp Action Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="max-w-md mx-auto pt-4"
          >
            <a 
              href="https://wa.me/201100196131" 
              target="_blank" 
              rel="noreferrer"
              className="relative flex items-center p-6 md:p-8 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-[32px] group overflow-hidden shadow-lg shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-green-500/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-in-out"></div>
              
              <div className="relative z-10 flex items-center w-full gap-6">
                <div className="w-20 h-20 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/40 group-hover:scale-110 transition-transform duration-300">
                  <WhatsAppIcon className="w-10 h-10" />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-green-700 transition-colors">تواصل الآن</h3>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Notice Alert */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-amber-50/80 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/60 flex items-start md:items-center gap-4 text-right max-w-2xl mx-auto shadow-sm"
          >
            <div className="bg-amber-100 p-3 rounded-full shrink-0">
              <Clock className="text-amber-600" size={24} />
            </div>
            <p className="text-amber-900/80 font-medium text-sm md:text-base leading-relaxed">
              <span className="font-black text-amber-600 ml-1">نعتذر عن أي تأخير:</span> 
              نظراً لضغط الرسائل الكبير، قد يستغرق الرد بضع دقائق. تأكد أننا سنصل إليك في أقرب وقت ممكن.
            </p>
          </motion.div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center bg-white/80 backdrop-blur-md border-t border-slate-200 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <img src="/logo.png" className="w-10 h-10 rounded-full shadow-sm" alt="Logo" />
          <span className="text-slate-400 font-bold text-sm tracking-wide">
            جميع الحقوق محفوظة للأستاذ محمود الديب &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}

/* =========================================
   COMPONENTS & ICONS
========================================= */

/**
 * Advanced Animated Central Logo for Support
 */
function SupportHeroIcon() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Outer spinning dashed ring */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200"
      />
      {/* Inner pulsing glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 bg-blue-100 rounded-full filter blur-md"
      />
      {/* Center Circle with Icon */}
      <div className="absolute inset-4 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30">
        <motion.svg 
          initial={{ y: 0 }}
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          xmlns="http://www.w3.org/2000/svg" 
          className="w-12 h-12 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M9 10h.01" />
          <path d="M12 10h.01" />
          <path d="M15 10h.01" />
        </motion.svg>
      </div>
      {/* Floating status dot */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
      >
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </motion.div>
    </div>
  );
}

/**
 * Official Real WhatsApp Logo SVG
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}