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
  ChevronLeft, ChevronRight, Camera,
  CheckCircle2, AlertCircle
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

      // 2. Create Auth User
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('فشل إنشاء المستخدم');

      const user = authData.user;

      // 3. Create User Profile
      const studentCode = Math.floor(5000 + Math.random() * 95000);
      const isAdminEmail = ['anasmd2026@gmail.com', 'anasmah4oud@gmail.com'].includes(formData.email.toLowerCase());
      
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        student_code: studentCode,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        parent_phone: formData.parentPhone,
        governorate: formData.governorate,
        city: formData.city,
        email: formData.email,
        grade: Number(formData.grade),
        track: formData.track,
        birth_date: formData.birthDate,
        gender: formData.gender,
        photo_url: formData.photoUrl || `data:image/png;base64,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`,
        wallet_balance: 0,
        role: isAdminEmail ? 'admin' : 'student',
        is_blocked: false
      });

      if (profileError) throw profileError;

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
