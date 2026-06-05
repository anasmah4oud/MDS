/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, MapPin, Mail, Lock, 
  GraduationCap, Calendar, UserCircle, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", 
  "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية", 
  "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "المنيا", "أسيوط", 
  "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", 
  "مطروح", "شمال سيناء", "جنوب سيناء"
];

export default function Register() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    parentPhone: '',
    governorate: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 3,
    track: 'scientific',
    birthDate: '',
    gender: 'male',
    photoUrl: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/anas/md/200/9', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full animate-pulse" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Check phone uniqueness (in profiles table)
      const { data: existingPhone, error: phoneError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', formData.phone)
        .maybeSingle();
      
      if (existingPhone) {
        throw new Error('رقم الهاتف مسجل مسبقاً');
      }

      // 2. Create Auth User & Send Meta Data mapped perfectly to the DB Trigger
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            student_code: String(Math.floor(5000 + Math.random() * 95000)),
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            parent_phone: formData.parentPhone,
            governorate: formData.governorate,
            city: formData.city,
            grade: String(formData.grade), // Sent as string to safely handle DB transformation
            track: formData.track,
            birth_date: formData.birthDate,
            gender: formData.gender,
            photo_url: formData.photoUrl || ''
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('فشل إنشاء المستخدم');
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[40px] text-center shadow-2xl shadow-blue-100 border-2 border-blue-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={60} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">أهلاً بك يا عزيزي الطالب!</h2>
          <p className="text-xl text-slate-600 font-bold mb-8">تم إنشاء حسابك بنجاح. جاري توجيهك لصفحة الدخول خلال 5 ثواني...</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-green-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Left Decoration */}
      <div className="hidden lg:flex flex-1 bg-blue-600 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10 text-center">
          <motion.img 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src="/logo.png" className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-white/20" 
          />
          <h1 className="text-4xl font-black mb-6">البارع محمود الديب</h1>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="max-w-xl w-full">
          <div className="mb-10 text-center md:text-right">
            <Link to="/" className="text-blue-600 font-bold flex items-center gap-2 mb-4 hover:underline">
              <ChevronRight size={20} />
              العودة للرئيسية
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">إنشاء حساب جديد</h2>
            <p className="text-slate-500 font-bold mt-2">انضم لآلاف الطلاب المتفوقين في رحلة النجاح</p>
          </div>

          {error && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-50 border-r-4 border-red-500 p-4 mb-8 flex items-center gap-3 text-red-700 font-bold"
            >
              <AlertCircle />
              {error}
            </motion.div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-12">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">الاسم الأول</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="text" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          placeholder="أحمد"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">الاسم الأخير</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="text" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          placeholder="محمد"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">رقم هاتف الطالب</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="tel" 
                          dir="ltr"
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-right"
                          placeholder="01xxxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">رقم ولي الأمر</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="tel" 
                          dir="ltr"
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-right"
                          placeholder="01xxxxxxxxx"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">المحافظة</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                          required
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none"
                          value={formData.governorate}
                          onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                        >
                          <option value="">اختر المحافظة</option>
                          {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">المدينة / المركز</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="text" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 md:py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          placeholder="المنصورة"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100"
                  >
                    الخطوة التالية
                    <ChevronLeft />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        required
                        type="email" 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="password" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">تأكيد كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="password" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">الصف الدراسي</label>
                      <div className="relative">
                        <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                          required
                          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none"
                          value={formData.grade}
                          onChange={(e) => setFormData({...formData, grade: Number(e.target.value)})}
                        >
                          <option value="1">الصف الأول الثانوي</option>
                          <option value="2">الصف الثاني الثانوي</option>
                          <option value="3">الصف الثالث الثانوي</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">الشعبة</label>
                      <div className="relative">
                        <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                          required
                          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none"
                          value={formData.track}
                          onChange={(e) => setFormData({...formData, track: e.target.value})}
                        >
                          <option value="scientific">علمي</option>
                          <option value="literary">أدبي</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">تاريخ الميلاد</label>
                      <div className="relative">
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required
                          type="date" 
                          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">النوع</label>
                      <div className="flex gap-4">
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, gender: 'male'})}
                          className={`flex-1 py-4 rounded-2xl font-bold border ${formData.gender === 'male' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
                        >
                          ذكر
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, gender: 'female'})}
                          className={`flex-1 py-4 rounded-2xl font-bold border ${formData.gender === 'female' ? 'bg-pink-50 border-pink-600 text-pink-600' : 'bg-white border-slate-200 text-slate-500'}`}
                        >
                          أنثى
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-slate-100 text-slate-700 py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200"
                    >
                      السابق
                    </button>
                    <button 
                      disabled={loading}
                      type="submit"
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50"
                    >
                      {loading ? 'جاري التسجيل...' : 'إتمام الحساب'}
                      <CheckCircle2 />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-12 text-center text-slate-600 font-bold">
            لديك حساب بالفعل؟ {' '}
            <Link to="/login" className="text-blue-600 hover:underline">سجل دخول الآن</Link>
          </p>
        </div>
      </div>
    </div>
  );
}