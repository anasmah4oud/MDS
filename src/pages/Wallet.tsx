/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  ChevronRight,
  PhoneCall,
  Calculator,
  Info,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const adminPhones = ['01100196131', '01023958772'];
  const adminWhatsApp = '201023958772';

  const calculateTotal = (amount: number) => {
    return amount + amount * 0.05; // 5% fee
  };

  const handleCopy = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Animated background blob (performance-friendly, pure CSS alternative is fine too)
  const FloatingBlobs = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-50 rounded-full opacity-50 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );

  // Stagger variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative" dir="rtl">
      <FloatingBlobs />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <motion.img
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            src="/logo.png"
            className="w-12 h-12 rounded-full shadow-md"
            alt="Master"
          />
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-black text-slate-900 tracking-tight"
          >
            شحن المحفظة
          </motion.h1>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-xl"
        >
          <ChevronRight />
          <span className="hidden sm:inline">العودة</span>
        </motion.button>
      </motion.header>

      <main className="max-w-4xl mx-auto p-4 md:p-12 space-y-10">
        {/* Hero / Introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center md:text-right"
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-blue-100 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <WalletIcon className="w-6 h-6 text-blue-600" />
            </motion.div>
            <span className="text-sm font-bold text-blue-800">
              أضف رصيداً إلى محفظتك بكل سهولة
            </span>
          </motion.div>
        </motion.div>

        {/* Calculator Section (now first) */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 bg-blue-100 rounded-2xl"
            >
              <Calculator className="text-blue-600 w-7 h-7" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">حاسبة الشحن</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <motion.div variants={itemVariants} className="space-y-4">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                الرصيد الذي تريد إضافته
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-blue-500"
                >
                  💰
                </motion.span>
              </label>
              <div className="relative group">
                <motion.input
                  type="number"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-5 px-6 text-2xl md:text-3xl font-black text-blue-600 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100"
                  placeholder="0"
                  value={chargeAmount || ''}
                  onChange={(e) => setChargeAmount(Number(e.target.value))}
                  whileFocus={{ scale: 1.01 }}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400 bg-slate-50 group-focus-within:bg-white px-2 rounded-md">
                  ج.م
                </span>
                {/* Decorative bottom line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: chargeAmount > 0 ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {/* Decorative background elements */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-300 mb-2">
                  إجمالي المبلغ المطلوب تحويله
                </p>
                <motion.p
                  className="text-4xl md:text-5xl font-black text-blue-300"
                  key={calculateTotal(chargeAmount)}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {calculateTotal(chargeAmount).toLocaleString()}{' '}
                  <span className="text-xl font-bold text-slate-400">ج.م</span>
                </motion.p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800/50 rounded-full px-3 py-1 w-fit">
                  <Info className="w-3 h-3" />
                  شامل 5% رسوم خدمة
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-2 italic bg-slate-50 p-3 rounded-xl"
          >
            * لاحظ أن الـ 5% هي مصاريف إدارية تضاف على المبلغ الذي تريد إضافته للمحفظة.
          </motion.p>
        </motion.section>

        {/* Instructions Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="bg-white rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-green-100 rounded-2xl"
            >
              <PhoneCall className="text-green-600 w-7 h-7" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">طريقة الشحن</h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <p className="text-lg md:text-xl font-bold text-slate-600 leading-relaxed">
              قم بالتحويل إلى أحد الأرقام التالية عبر محفظة <span className="text-red-600">فودافون كاش</span> أو{' '}
              <span className="text-orange-500">أورنج كاش</span> أو <span className="text-green-600">اتصالات كاش</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminPhones.map((phone) => (
                <motion.div
                  key={phone}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                  className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 flex items-center justify-between group transition-all"
                >
                  <span className="text-xl md:text-2xl font-black text-slate-800 tracking-wider font-mono" dir="ltr">
                    {phone}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCopy(phone)}
                    className={`p-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all ${
                      copiedPhone === phone
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                    }`}
                  >
                    {copiedPhone === phone ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        تم النسخ
                      </motion.span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        نسخ
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-green-50/70 border border-green-100 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
            whileHover={{ boxShadow: '0 20px 40px -15px rgba(34,197,94,0.2)' }}
          >
            <h3 className="text-xl font-black text-green-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              بعد إتمام التحويل
            </h3>
            <motion.ul
              className="space-y-5 text-green-800 font-bold"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                'صور سكرين شوت لرسالة التحويل',
                'أرسل الصورة + الرقم المحول منه + اسمك + رقم هاتف الطالب',
                'تواصل مباشرة عبر الواتساب لتأكيد الشحن خلال دقائق',
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={listItemVariants}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="p-1.5 bg-green-200 rounded-full"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  </motion.div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              href={`https://wa.me/${adminWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-2xl text-lg md:text-xl font-black hover:bg-green-600 transition-all shadow-xl shadow-green-200"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px -10px rgba(34,197,94,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <PhoneCall className="w-6 h-6" />
              </motion.span>
              تواصل واتساب للتأكيد
            </motion.a>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}