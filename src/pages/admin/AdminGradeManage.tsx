/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, ChevronRight, LayoutDashboard, 
  Package, Calendar, BookOpen, Layers, Save, X, Eye, 
  Settings, Database, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Package as PackageType, Week, Lesson } from '../../types';

export default function AdminGradeManage({ grade }: { grade: 1 | 2 | 3 }) {
  // ألوان متدرجة جديدة
  const gradeColors = {
    1: 'from-blue-500 to-blue-300',
    2: 'from-emerald-500 to-emerald-300',
    3: 'from-orange-500 to-orange-300',
  };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'packages' | 'weeks' | 'lessons'>('packages');
  const [loading, setLoading] = useState(true);
  
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [grade, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'packages') {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('grade_id', grade);
        if (error) throw error;
        setPackages(data as PackageType[]);
      } else if (activeTab === 'weeks') {
        const { data, error } = await supabase
          .from('weeks')
          .select('*');
        if (error) throw error;
        setWeeks(data as Week[]);
      } else if (activeTab === 'lessons') {
        const { data, error } = await supabase
          .from('lessons')
          .select('*');
        if (error) throw error;
        setLessons(data as Lesson[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coll: string, id: number) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع عن ذلك.')) return;
    try {
      const { error } = await supabase
        .from(coll)
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      let finalId = currentEdit?.id;
      let coll = '';

      if (activeTab === 'packages') {
        coll = 'packages';
        const payload = {
          grade_id: grade,
          name: data.name,
          description: data.description,
          type: data.type,
          price: Number(data.price),
          old_price: Number(data.old_price || 0),
          image_url: data.image_url,
          is_free: data.is_free === 'on'
        };

        if (finalId) {
          const { error } = await supabase.from(coll).update(payload).eq('id', finalId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from(coll).insert(payload);
          if (error) throw error;
        }
      } else if (activeTab === 'weeks') {
        coll = 'weeks';
        const payload = {
          package_id: Number(data.package_id),
          name: data.name,
          description: data.description
        };

        if (finalId) {
          const { error } = await supabase.from(coll).update(payload).eq('id', finalId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from(coll).insert(payload);
          if (error) throw error;
        }
      } else if (activeTab === 'lessons') {
        coll = 'lessons';
        const payload = {
          week_id: Number(data.week_id),
          name: data.name,
          description: data.description,
          type: data.type,
          url: data.url
        };

        if (finalId) {
          const { error } = await supabase.from(coll).update(payload).eq('id', finalId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from(coll).insert(payload);
          if (error) throw error;
        }
      }

      setIsModalOpen(false);
      setCurrentEdit(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Admin Header */}
      <header className={`bg-gradient-to-l ${gradeColors[grade]} border-b border-slate-200 h-24 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-blue-100/20` }>
        <div className="flex items-center gap-4">
           <img src="/logo.png" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Master" />
           <div>
             <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow">إدارة الصف {grade === 1 ? 'الأول' : grade === 2 ? 'الثاني' : 'الثالث'} الثانوى</h1>
             <span className="text-white/80 font-bold text-sm">لوحة تحكم احترافية لإدارة الباقات والمحتوى</span>
           </div>
        </div>
        <button 
          onClick={() => navigate('/anas/md/200/9')}
          className="flex items-center gap-2 bg-white/20 text-white font-black px-6 py-3 rounded-xl hover:bg-white/40 transition-all shadow-md backdrop-blur"
        >
          <ChevronRight />
          العودة للمسؤول
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 space-y-8">
        {/* شريط ترحيبي */}
        <div className={`rounded-2xl p-6 mb-4 bg-gradient-to-l ${gradeColors[grade]} text-white font-black text-lg shadow-md flex items-center gap-4`}>
          <LayoutDashboard size={28} className="drop-shadow" />
          أهلاً بك في لوحة تحكم الصف {grade === 1 ? 'الأول' : grade === 2 ? 'الثاني' : 'الثالث'} - يمكنك إدارة الباقات والأسابيع والمحتوى بسهولة واحترافية.
        </div>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 bg-white p-3 md:p-4 rounded-[20px] md:rounded-[28px] border border-slate-200 shadow-lg shadow-blue-100/10 items-center">
            <TabButton active={activeTab === 'packages'} onClick={() => setActiveTab('packages')} icon={<Package size={18} />}>الباقات</TabButton>
            <TabButton active={activeTab === 'weeks'} onClick={() => setActiveTab('weeks')} icon={<Calendar size={18} />}>الأسابيع</TabButton>
            <TabButton active={activeTab === 'lessons'} onClick={() => setActiveTab('lessons')} icon={<BookOpen size={18} />}>المحتوى</TabButton>
             
            <div className="mr-auto w-full md:w-auto">
               <button 
                onClick={() => { setCurrentEdit(null); setIsModalOpen(true); }}
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all hover:-translate-y-1 mt-2 md:mt-0"
               >
                 <Plus size={20} /> إضافة جديد
               </button>
            </div>
        </div>

        {/* Content Table Container */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xl shadow-blue-100/10 overflow-hidden">
           <div className="overflow-x-auto">
             {loading ? (
               <div className="p-20 text-center font-bold text-slate-400 animate-pulse italic">جاري تحميل البيانات...</div>
             ) : (
               <table className="w-full text-right min-w-[800px] font-cairo">
                  <thead>
                    <tr className="bg-gradient-to-l from-blue-50 to-white border-b border-slate-100 text-blue-700 text-xs font-black uppercase tracking-widest">
                      <th className="p-6 text-right">ID</th>
                    <th className="p-6">الاسـم</th>
                    <th className="p-6">التفاصيل</th>
                    <th className="p-6">السعر / النوع</th>
                    <th className="p-6">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeTab === 'packages' && packages.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="p-6 font-mono font-black text-blue-600">#{p.id}</td>
                      <td className="p-6 font-black text-slate-900">{p.name}</td>
                      <td className="p-6 font-bold text-slate-500 max-w-xs truncate">{p.description}</td>
                      <td className="p-6">
                         <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-xs font-black">{p.price} ج.م</span>
                         {p.is_free && <span className="mr-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-black italic">مجاني</span>}
                      </td>
                      <td className="p-6 flex items-center gap-3">
                        <button onClick={() => { setCurrentEdit(p); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                        <button onClick={() => handleDelete('packages', p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'weeks' && weeks.map(w => (
                    <tr key={w.id} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="p-6 font-mono font-black text-emerald-600">#{w.id}</td>
                      <td className="p-6 font-black text-slate-900">{w.name}</td>
                      <td className="p-6 font-bold text-slate-500">من باقة #{w.package_id}</td>
                      <td className="p-6"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black italic">أسبوع جديد</span></td>
                      <td className="p-6 flex items-center gap-3">
                         <button onClick={() => { setCurrentEdit(w); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                         <button onClick={() => handleDelete('weeks', w.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                   {activeTab === 'lessons' && lessons.map(l => (
                    <tr key={l.id} className="hover:bg-orange-50/40 transition-colors group">
                      <td className="p-6 font-mono font-black text-orange-600">#{l.id}</td>
                      <td className="p-6 font-black text-slate-900">{l.name}</td>
                      <td className="p-6 font-bold text-slate-500">لأسبوع #{l.week_id}</td>
                      <td className="p-6"><span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black italic">{l.type}</span></td>
                      <td className="p-6 flex items-center gap-3">
                         <button onClick={() => { setCurrentEdit(l); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                         <button onClick={() => handleDelete('lessons', l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}

                  {((activeTab === 'packages' && packages.length === 0) || 
                    (activeTab === 'weeks' && weeks.length === 0) || 
                    (activeTab === 'lessons' && lessons.length === 0)) && !loading && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-400 font-black italic">لا يوجد بيانات لعرضها. أضف جديداً الآن!</td>
                    </tr>
                  )}
                </tbody>
             </table>
           )}
         </div>
        </div>
      </main>

      {/* Admin Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               exit={{ scale: 0.9, y: 20 }} 
               className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
             >
                <form onSubmit={handleSave}>
                  <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                     <div>
                       <h2 className="text-2xl font-black italic">ضبط {activeTab === 'packages' ? 'باقة' : activeTab === 'weeks' ? 'أسبوع' : 'محتوى'}</h2>
                       <p className="text-slate-400 font-bold text-sm">أدخل البيانات المطلوبة بدقة.</p>
                     </div>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20}/></button>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Common Fields */}
                    <div className="space-y-2">
                       <label className="text-sm font-black text-slate-700">الاسم</label>
                       <input 
                         required
                         name="name"
                         defaultValue={currentEdit?.name}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all"
                         placeholder="اسم العنصر هنا..."
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-slate-700">الوصف</label>
                       <textarea 
                         name="description"
                         defaultValue={currentEdit?.description}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all min-h-[100px]"
                         placeholder="وصف تفصيلي..."
                       />
                    </div>

                    {/* Conditional Fields for Packages */}
                    {activeTab === 'packages' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700 underline decoration-blue-600 decoration-2">رابط الصورة (Drive/URL)</label>
                              <div className="relative">
                                <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                                <input name="image_url" defaultValue={currentEdit?.image_url} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 font-bold outline-none focus:border-blue-600 transition-all" placeholder="رابط صورة الباقة..." />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">نوع الباقة</label>
                              <select name="type" defaultValue={currentEdit?.type || 'monthly'} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all appearance-none">
                                 <option value="offer">عرض خاص</option>
                                 <option value="monthly">باقة شهرية</option>
                                 <option value="weekly">حصة أسبوعية</option>
                                 <option value="quarterly">باقة 3 شهور</option>
                              </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">السعر الحالي</label>
                              <input name="price" type="number" defaultValue={currentEdit?.price} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black italic outline-none focus:border-blue-600 transition-all" placeholder="0" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">السعر قبل الخصم (اختياري)</label>
                              <input name="old_price" type="number" defaultValue={currentEdit?.old_price} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black italic outline-none focus:border-blue-600 transition-all" placeholder="0" />
                           </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-green-50 border-2 border-dashed border-green-200 rounded-2xl">
                           <input type="checkbox" name="is_free" defaultChecked={currentEdit?.is_free} className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500" />
                           <span className="text-green-800 font-black italic">باقة مجانية (تظهر في قسم المحاضرات المجانية)</span>
                        </label>
                      </div>
                    )}

                    {/* Conditional Fields for Weeks */}
                    {activeTab === 'weeks' && (
                      <div className="space-y-2">
                         <label className="text-sm font-black text-slate-700">تبع باقة ID (الرقم)</label>
                         <input required name="package_id" type="number" defaultValue={currentEdit?.package_id} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black italic outline-none focus:border-blue-600 transition-all" placeholder="مثلاً: 5000" />
                      </div>
                    )}

                    {/* Conditional Fields for Lessons */}
                    {activeTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">تبع أسبوع ID</label>
                              <input required name="week_id" type="number" defaultValue={currentEdit?.week_id} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black italic outline-none focus:border-blue-600 transition-all" placeholder="مثلاً: 1" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-black text-slate-700">نوع المحتوى</label>
                              <select name="type" defaultValue={currentEdit?.type || 'video_exp'} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all appearance-none">
                                 <option value="video_exp">فيديو شرح</option>
                                 <option value="video_hw">فيديو حل واجب</option>
                                 <option value="pdf">ملف PDF</option>
                                 <option value="exam_mcq">امتحان MCQ</option>
                                 <option value="hw_mcq">واجب MCQ</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700">رابط المحتوى (يوتيوب أو درايف)</label>
                          <div className="relative">
                            <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                            <input required name="url" defaultValue={currentEdit?.url} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 font-bold outline-none focus:border-blue-600 transition-all" placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 border-t border-slate-50 flex gap-4">
                     <button type="submit" className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                        <Save size={24} /> حفظ التغييرات
                     </button>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-colors">إلغاء</button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ children, active, onClick, icon }: { children: React.ReactNode, active: boolean, onClick: () => void, icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-sm transition-all border-2 ${active ? 'bg-gradient-to-l from-blue-600 to-blue-400 text-white shadow-xl border-blue-400' : 'text-blue-700 border-blue-100 hover:bg-blue-50/30'} font-cairo`}
    >
      {icon}
      {children}
    </button>
  );
}
