/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, 
  ChevronRight, LogOut, ShieldCheck, 
  GraduationCap, Calendar, UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/MyAccount.css';

export default function MyAccount() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
       <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-12 h-12 rounded-full" alt="Master" />
           <h1 className="text-xl font-black text-slate-900">حسابي الشخصي</h1>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronRight />
          العودة
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-12 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-blue-50 overflow-hidden">
           <div className="bg-blue-600 h-40 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
           </div>
           
           <div className="px-10 pb-10 relative -mt-16 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                 <img 
                   src={profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`} 
                   className="w-32 h-32 rounded-[40px] border-4 border-white shadow-xl relative z-10" 
                   alt="Profile"
                 />
                 <div className="flex-1 pb-2">
                    <h2 className="text-4xl font-black text-slate-900">{profile?.first_name} {profile?.last_name}</h2>
                    <p className="text-blue-600 font-black italic">كود الطالب: #{profile?.student_code}</p>
                 </div>
                 <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-lg">
                    الرصيد: {profile?.wallet_balance} ج.م
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InfoItem label="البريد الإلكتروني" value={profile?.email} icon={<Mail />} />
                 <InfoItem label="رقم الهاتف" value={profile?.phone} icon={<Phone />} />
                 <InfoItem label="رقم ولي الأمر" value={profile?.parent_phone} icon={<Phone />} />
                 <InfoItem label="المحافظة" value={profile?.governorate} icon={<MapPin />} />
                 <InfoItem label="الصف الدراسي" value={profile?.grade === 1 ? 'الأول الثانوى' : profile?.grade === 2 ? 'الثاني الثانوى' : 'الثالث الثانوى'} icon={<GraduationCap />} />
                 <InfoItem label="تاريخ الميلاد" value={profile?.birth_date} icon={<Calendar />} />
                 <InfoItem label="النوع" value={profile?.gender === 'male' ? 'ذكر' : 'أنثى'} icon={<UserCircle />} />
                 <InfoItem label="تاريخ الانضمام" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ar-EG') : 'غير معروف'} icon={<Clock />} />
              </div>
           </div>
        </div>

        <div className="flex gap-4">
           <button 
            onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
            className="flex-1 bg-red-50 text-red-600 py-6 rounded-3xl font-black text-xl hover:bg-red-100 transition-all flex items-center justify-center gap-3"
           >
              <LogOut /> تسجيل الخروج
           </button>
           <Link 
            to="/support"
            className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3"
           >
              <ShieldCheck /> طلب تعديل البيانات
           </Link>
        </div>

        <p className="text-center text-slate-400 font-bold italic text-sm">
           في حالة الرغبة في تعديل البريد الإلكتروني أو تاريخ الميلاد، يرجى التواصل مع الدعم الفني مباشرة.
        </p>
      </main>
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string, value?: string, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4 text-right">
       <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-lg font-black text-slate-900 leading-none">{value || '---'}</p>
       </div>
    </div>
  );
}

function Clock({ size }: { size?: number }) {
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
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    );
  }
