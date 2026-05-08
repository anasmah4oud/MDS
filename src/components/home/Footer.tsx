import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import '../../styles/home/Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-col">
        <h3>البارع</h3>
        <p>المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر.</p>
      </div>
      <div className="footer-col">
        <h4>روابط سريعة</h4>
        <div className="footer-links">
          <Link to="/">الرئيسية</Link>
          <Link to="/courses">الكورسات</Link>
          <a href="#support">الدعم الفني</a>
          <a href="#contact">تواصل معنا</a>
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
      <div className="footer-col">
        <h4>تواصل مباشر</h4>
        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'#475569'}}>
          <PhoneCall size={18} />
          <span>01006984012</span>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      جميع الحقوق محفوظة © {new Date().getFullYear()} للأستاذ محمود الديب
    </div>
  </footer>
);

export default Footer;