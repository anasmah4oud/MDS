import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogIn, UserPlus, Headset, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/home/Navbar.css';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, profile, isAdmin } = useAuth();
  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleDashboardClick = () => {
    if (user && profile) {
      window.location.href = isAdmin ? '/anas/md/200/9' : '/dashboard';
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={() => window.scrollTo(0,0)}>
            البارع
            <span className="navbar-logo-sub">محمود الديب</span>
          </Link>

          <div className="navbar-desktop-links">
            <Link to="/" className="nav-link">الرئيسية</Link>
            <Link to="/courses" className="nav-link">الكورسات</Link>
            <Link to="/about" className="nav-link">عن المنصة</Link>

            {user ? (
              <button onClick={handleDashboardClick} className="nav-btn nav-btn-dashboard">
                <LayoutDashboard size={18} />
                لوحة التحكم
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-btn nav-btn-login">
                  <LogIn size={18} />
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="nav-btn nav-btn-register">
                  <UserPlus size={18} />
                  إنشاء حساب
                </Link>
              </>
            )}

            <div className="navbar-divider"></div>
            <a href="#contact" className="nav-link" style={{display:'flex', alignItems:'center', gap:'0.3rem'}}>
              <Headset size={16} /> تواصل معنا
            </a>
            <a href="#support" className="nav-link" style={{display:'flex', alignItems:'center', gap:'0.3rem'}}>
              <MessageSquare size={16} /> الدعم الفني
            </a>
          </div>

          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={closeMobileMenu}>الرئيسية</Link>
            <Link to="/courses" className="mobile-menu-link" onClick={closeMobileMenu}>الكورسات</Link>
            <Link to="/about" className="mobile-menu-link" onClick={closeMobileMenu}>عن المنصة</Link>
            <div className="mobile-menu-divider">
              {user ? (
                <button onClick={() => { handleDashboardClick(); closeMobileMenu(); }} className="mobile-btn-full mobile-btn-dashboard">
                  <LayoutDashboard size={18} /> لوحة التحكم
                </button>
              ) : (
                <>
                  <Link to="/login" className="mobile-btn-full mobile-btn-login" onClick={closeMobileMenu}>
                    <LogIn size={18} /> تسجيل الدخول
                  </Link>
                  <Link to="/register" className="mobile-btn-full mobile-btn-register" onClick={closeMobileMenu}>
                    <UserPlus size={18} /> إنشاء حساب جديد
                  </Link>
                </>
              )}
              <a href="#contact" className="mobile-btn-full" style={{background:'transparent', border:'1px solid #e2e8f0', color:'#334155'}} onClick={closeMobileMenu}>
                <Headset size={16} /> تواصل معنا
              </a>
              <a href="#support" className="mobile-btn-full" style={{background:'transparent', border:'1px solid #e2e8f0', color:'#334155'}} onClick={closeMobileMenu}>
                <MessageSquare size={16} /> الدعم الفني
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;