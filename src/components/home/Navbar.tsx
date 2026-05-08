import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Globe, LayoutDashboard, LogIn, UserPlus, Headset, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleDashboardClick = () => {
    if (user && profile) {
      navigate(isAdmin ? '/anas/md/200/9' : '/dashboard');
    }
  };

  return (
    <>
      {/* Desktop Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                البارع
              </span>
              <span className="hidden md:block text-xl text-white font-medium">محمود الديب</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                الرئيسية
              </Link>
              <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                الكورسات
              </Link>
              <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                عن المنصة
              </Link>

              {user ? (
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-all border border-transparent hover:border-white/10 rounded-xl"
                  >
                    <LogIn size={18} />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <UserPlus size={18} />
                    إنشاء حساب
                  </Link>
                </>
              )}

              <div className="h-6 w-px bg-white/10" />

              <a href="#contact" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
                <Headset size={16} />
                تواصل معنا
              </a>
              <a href="#support" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
                <MessageSquare size={16} />
                الدعم الفني
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="قائمة التنقل"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-lg md:hidden pt-20 overflow-y-auto">
          <div className="px-6 py-8 space-y-6">
            <Link to="/" onClick={closeMobileMenu} className="block text-white text-lg">
              الرئيسية
            </Link>
            <Link to="/courses" onClick={closeMobileMenu} className="block text-white text-lg">
              الكورسات
            </Link>
            <Link to="/about" onClick={closeMobileMenu} className="block text-white text-lg">
              عن المنصة
            </Link>

            <div className="pt-4 border-t border-white/10 space-y-4">
              {user ? (
                <button
                  onClick={() => {
                    handleDashboardClick();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"
                >
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white border border-white/10 rounded-xl"
                  >
                    <LogIn size={18} />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl"
                  >
                    <UserPlus size={18} />
                    إنشاء حساب جديد
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <a href="#contact" onClick={closeMobileMenu} className="flex items-center gap-2 text-white/60">
                <Headset size={16} /> تواصل معنا
              </a>
              <a href="#support" onClick={closeMobileMenu} className="flex items-center gap-2 text-white/60">
                <MessageSquare size={16} /> الدعم الفني
              </a>
              <a href="#academic" onClick={closeMobileMenu} className="flex items-center gap-2 text-white/60">
                <Globe size={16} /> الدعم العلمي
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;