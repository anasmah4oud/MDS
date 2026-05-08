import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              البارع
            </h3>
            <p className="text-white/60 leading-relaxed">
              المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-white/60 hover:text-white transition-colors">الرئيسية</Link>
              <Link to="/courses" className="block text-white/60 hover:text-white transition-colors">الكورسات</Link>
              <a href="#support" className="block text-white/60 hover:text-white transition-colors">الدعم الفني</a>
              <a href="#contact" className="block text-white/60 hover:text-white transition-colors">تواصل معنا</a>
              <Link to="/login" className="block text-white/60 hover:text-white transition-colors">تسجيل الدخول</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">تواصل مباشر</h4>
            <div className="flex items-center gap-2 text-white/60">
              <PhoneCall size={18} />
              <span>واتساب: 01006984012</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-white/40 text-sm">
            جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}
          </p>
          <p className="text-white/30 text-xs mt-2">
            تم الإنشاء بكل الحب لطلاب الثانوية العامة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;