/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Single-file MyAccount page with embedded animations & responsive design.
 */

import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    LogOut,
    ShieldCheck,
    GraduationCap,
    Calendar,
    UserCircle,
    Clock,
    Sparkles,
    Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

/* ───────────────────────────────────────────
   Animation Variants
   ─────────────────────────────────────────── */
const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.08,
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 20, mass: 0.6 },
    },
};

const cardSpring = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 80, damping: 22, mass: 0.8 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 120,
            damping: 18,
            delay: i * 0.06,
        },
    }),
};

const buttonTap = { scale: 0.94, transition: { type: 'spring', stiffness: 400, damping: 15 } };
const buttonHover = { scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } };

const avatarFloat = {
    animate: {
        y: [0, -8, 0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
};

const glowPulse = {
    animate: {
        boxShadow: [
            '0 0 0 0 rgba(99, 102, 241, 0.4)',
            '0 0 0 14px rgba(99, 102, 241, 0)',
            '0 0 0 0 rgba(99, 102, 241, 0)',
        ],
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
};

/* ───────────────────────────────────────────
   Decorative Background Orbs
   ─────────────────────────────────────────── */
const FloatingOrbs = () => (
    <div className="floating-orbs" aria-hidden="true">
        <motion.div
            className="orb orb-1"
            animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="orb orb-2"
            animate={{ x: [0, -50, 40, 0], y: [0, 30, -50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="orb orb-3"
            animate={{ x: [0, 35, -45, 0], y: [0, -55, 15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
    </div>
);

/* ───────────────────────────────────────────
   Info Item Component
   ─────────────────────────────────────────── */
function InfoItem({
    label,
    value,
    icon,
    index = 0,
}: {
    label: string;
    value?: string;
    icon: React.ReactNode;
    index?: number;
}) {
    return (
        <motion.div
            className="info-card"
            variants={staggerItem}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.18)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <motion.div
                className="info-card-icon"
                whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                {icon}
            </motion.div>
            <div className="info-card-content">
                <span className="info-card-label">{label}</span>
                <span className="info-card-value">{value || '---'}</span>
            </div>
            <motion.div
                className="info-card-shimmer"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
        </motion.div>
    );
}

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */
export default function MyAccount() {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();

    const gradeLabel = useMemo(() => {
        if (!profile?.grade) return '';
        const labels: Record<number, string> = {
            1: 'الأول بكالوريا',
            2: 'الثاني بكالوريا',
            3: 'الثالث الثانوى',
        };
        return labels[profile.grade] || '';
    }, [profile?.grade]);

    const genderLabel = useMemo(() => {
        if (!profile?.gender) return '';
        return profile.gender === 'male' ? 'ذكر' : 'أنثى';
    }, [profile?.gender]);

    const joinDate = useMemo(() => {
        if (!profile?.created_at) return 'غير معروف';
        return new Date(profile.created_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, [profile?.created_at]);

    const infoItems = useMemo(() => {
        if (!profile) return [];
        return [
            { label: 'البريد الإلكتروني', value: profile.email, icon: <Mail size={20} /> },
            { label: 'رقم الهاتف', value: profile.phone, icon: <Phone size={20} /> },
            { label: 'رقم ولي الأمر', value: profile.parent_phone, icon: <Phone size={20} /> },
            { label: 'المحافظة', value: profile.governorate, icon: <MapPin size={20} /> },
            { label: 'الصف الدراسي', value: gradeLabel, icon: <GraduationCap size={20} /> },
            { label: 'تاريخ الميلاد', value: profile.birth_date, icon: <Calendar size={20} /> },
            { label: 'النوع', value: genderLabel, icon: <UserCircle size={20} /> },
            { label: 'تاريخ الانضمام', value: joinDate, icon: <Clock size={20} /> },
        ];
    }, [profile, gradeLabel, genderLabel, joinDate]);

    if (loading) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="my-account-page"
                dir="rtl"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Embedded CSS – one file, zero dependencies */}
                <style>{myAccountCSS}</style>

                {/* Floating decorative orbs */}
                <FloatingOrbs />

                {/* Header */}
                <motion.header
                    className="account-header"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="header-inner">
                        <motion.div
                            className="header-brand"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <motion.img
                                src="/logo.png"
                                className="header-logo"
                                alt="Master"
                                whileHover={{ rotate: [0, -15, 15, -8, 0] }}
                                transition={{ duration: 0.6 }}
                            />
                            <div className="header-title-group">
                                <h1 className="header-title">حسابي الشخصي</h1>
                                <span className="header-subtitle">ملفك التعليمي</span>
                            </div>
                        </motion.div>
                        <motion.button
                            onClick={() => navigate('/dashboard')}
                            className="back-button"
                            whileHover={{ x: 6, color: '#4f46e5' }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <ChevronRight size={20} />
                            <span>العودة للوحة التحكم</span>
                        </motion.button>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="account-main">
                    {/* Profile Card */}
                    <motion.div
                        className="profile-card-wrapper"
                        variants={cardSpring}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="profile-card-glow"
                            animate={{
                                opacity: [0.5, 0.8, 0.5],
                                scale: [1, 1.02, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        <div className="profile-card">
                            <div className="profile-banner">
                                <div className="profile-banner-pattern" />
                                <motion.div
                                    className="profile-banner-sparkle sparkle-1"
                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
                                >
                                    <Sparkles size={18} color="#fff" />
                                </motion.div>
                                <motion.div
                                    className="profile-banner-sparkle sparkle-2"
                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 0.8] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                                >
                                    <Sparkles size={14} color="#fff" />
                                </motion.div>
                                <motion.div
                                    className="profile-banner-sparkle sparkle-3"
                                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2.8, repeat: Infinity, delay: 2 }}
                                >
                                    <Sparkles size={16} color="#fff" />
                                </motion.div>
                            </div>

                            <div className="profile-body">
                                <div className="profile-avatar-row">
                                    <motion.div
                                        className="profile-avatar-container"
                                        variants={avatarFloat}
                                        animate="animate"
                                        whileHover={{ scale: 1.08, rotate: -3 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <motion.img
                                            src={
                                                profile?.photo_url ||
                                                `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaNICFXdNewDbNF-IJXqbBeshcCBdSxxYlCtnmYXE7hg&s=10`
                                            }
                                            className="profile-avatar-img"
                                            alt="الصورة الشخصية"
                                        />
                                        <motion.div
                                            className="avatar-ring"
                                            animate={{
                                                rotate: [0, 360],
                                            }}
                                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </motion.div>

                                    <div className="profile-name-area">
                                        <h2 className="profile-name">
                                            {profile?.first_name} {profile?.last_name}
                                        </h2>
                                        <span className="profile-code">
                                            كود الطالب: #{profile?.student_code}
                                        </span>
                                    </div>

                                    <motion.div
                                        className="wallet-badge"
                                        variants={glowPulse}
                                        animate="animate"
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Wallet size={20} />
                                        <span>
                                            الرصيد:{' '}
                                            <strong>
                                                {profile?.wallet_balance?.toLocaleString?.() ??
                                                    profile?.wallet_balance ??
                                                    '0'}{' '}
                                                ج.م
                                            </strong>
                                        </span>
                                        <motion.span
                                            className="wallet-shimmer"
                                            animate={{ x: ['-200%', '200%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
                                        />
                                    </motion.div>
                                </div>

                                <div className="info-grid">
                                    {infoItems.map((item, i) => (
                                        <InfoItem
                                            key={item.label}
                                            label={item.label}
                                            value={item.value}
                                            icon={item.icon}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="actions-row"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                navigate('/');
                            }}
                            className="btn-signout"
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                        >
                            <motion.span
                                className="btn-icon-circle"
                                whileHover={{ rotate: [0, -20, 20, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <LogOut size={20} />
                            </motion.span>
                            <span>تسجيل الخروج</span>
                        </motion.button>

                        <motion.div
                            className="btn-support-wrapper"
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                        >
                            <Link to="/support" className="btn-support">
                                <motion.span
                                    className="btn-icon-circle btn-icon-circle-dark"
                                    whileHover={{ scale: 1.2 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <ShieldCheck size={20} />
                                </motion.span>
                                <span>طلب تعديل البيانات</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.p
                        className="footer-note"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <span className="footer-note-icon">💡</span>
                        في حالة الرغبة في تعديل البريد الإلكتروني أو تاريخ الميلاد، يرجى
                        التواصل مع الدعم الفني مباشرة.
                    </motion.p>
                </main>
            </motion.div>
        </AnimatePresence>
    );
}

/* ───────────────────────────────────────────
   Complete CSS (inline, no external files)
   ─────────────────────────────────────────── */
const myAccountCSS = `
/* ═══════════════════════════════════════
   MyAccount Embedded Styles
   ═══════════════════════════════════════ */

.my-account-page {
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --primary-soft: #eef2ff;
  --primary-glow: rgba(99, 102, 241, 0.25);
  --surface: #ffffff;
  --surface-alt: #f8fafc;
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  --text: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 35px 60px -15px rgba(79, 70, 229, 0.18);
  --radius-sm: 16px;
  --radius-md: 24px;
  --radius-lg: 32px;
  --radius-xl: 40px;
  --font-ar: 'Tajawal', 'Cairo', 'Almarai', system-ui, -apple-system, sans-serif;

  position: relative;
  min-height: 100vh;
  background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 30%, #eef2ff 70%, #faf5ff 100%);
  font-family: var(--font-ar);
  overflow-x: hidden;
  direction: rtl;
}

.floating-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #818cf8 0%, transparent 70%);
  top: -120px;
  left: -100px;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #a78bfa 0%, transparent 70%);
  bottom: -100px;
  right: -80px;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #60a5fa 0%, transparent 70%);
  top: 50%;
  left: 40%;
}

.account-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  padding: 0 48px;
  height: 80px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .account-header {
    padding: 0 20px;
    height: 72px;
  }
}

.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  text-decoration: none;
}

.header-logo {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-family: var(--font-ar);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-button svg {
  transform: rotate(180deg);
}

.back-button:hover {
  background: var(--primary-soft);
  border-color: var(--primary-light);
  color: var(--primary);
}

@media (max-width: 480px) {
  .back-button span {
    display: none;
  }
  .back-button {
    padding: 10px 14px;
  }
}

.account-main {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

@media (max-width: 768px) {
  .account-main {
    padding: 24px 16px 48px;
    gap: 28px;
  }
}

.profile-card-wrapper {
  position: relative;
}

.profile-card-glow {
  position: absolute;
  inset: -6px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, #818cf8, #6366f1, #4f46e5, #818cf8);
  background-size: 300% 300%;
  z-index: -1;
  filter: blur(18px);
  opacity: 0.5;
}

.profile-card {
  background: var(--surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.profile-banner {
  height: 150px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 30%, #818cf8 60%, #a78bfa 100%);
  background-size: 200% 200%;
  position: relative;
  overflow: hidden;
}

.profile-banner-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.profile-banner-sparkle {
  position: absolute;
  pointer-events: none;
}

.sparkle-1 { top: 18px; left: 22%; }
.sparkle-2 { top: 50px; right: 18%; }
.sparkle-3 { bottom: 22px; left: 55%; }

.profile-body {
  padding: 0 40px 40px;
  position: relative;
  margin-top: -55px;
}

@media (max-width: 768px) {
  .profile-body {
    padding: 0 24px 32px;
    margin-top: -50px;
  }
}

@media (max-width: 480px) {
  .profile-body {
    padding: 0 16px 24px;
  }
}

.profile-avatar-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .profile-avatar-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
}

.profile-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar-img {
  width: 110px;
  height: 110px;
  border-radius: 28px;
  border: 5px solid white;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.18), 0 0 0 4px rgba(79, 70, 229, 0.1);
  object-fit: cover;
  position: relative;
  z-index: 2;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 36px;
  border: 3px dashed rgba(99, 102, 241, 0.35);
  z-index: 1;
}

.profile-name-area {
  flex: 1;
  min-width: 0;
  padding-bottom: 12px;
}

.profile-name {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin: 0;
}

.profile-code {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--primary-light);
  background: var(--primary-soft);
  padding: 4px 14px;
  border-radius: 50px;
  letter-spacing: 0.3px;
}

@media (max-width: 640px) {
  .profile-name {
    font-size: 1.5rem;
  }
}

.wallet-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: var(--primary);
  padding: 14px 22px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 800;
  border: 2px solid rgba(99, 102, 241, 0.15);
  box-shadow: 0 8px 20px -8px rgba(79, 70, 229, 0.2);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  align-self: flex-end;
  margin-bottom: 8px;
}

.wallet-badge strong {
  font-weight: 900;
  color: #3730a3;
}

.wallet-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
  pointer-events: none;
}

@media (max-width: 640px) {
  .wallet-badge {
    align-self: center;
    margin-bottom: 0;
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.info-card {
  background: var(--surface-alt);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: all 0.3s ease;
}

.info-card-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.info-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info-card-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.info-card-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  word-break: break-all;
  line-height: 1.3;
}

.info-card-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.info-card:hover .info-card-shimmer {
  opacity: 1;
}

.actions-row {
  display: flex;
  gap: 20px;
}

@media (max-width: 500px) {
  .actions-row {
    flex-direction: column;
    gap: 14px;
  }
}

.btn-signout,
.btn-support {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 28px;
  border-radius: 50px;
  font-family: var(--font-ar);
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-signout {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
}

.btn-signout:hover {
  background: #fee2e2;
  border-color: #f87171;
  box-shadow: 0 15px 30px -10px rgba(220, 38, 38, 0.15);
}

.btn-support-wrapper {
  flex: 1;
}

.btn-support {
  background: var(--text);
  color: white;
  width: 100%;
}

.btn-support:hover {
  background: #1e293b;
  box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.3);
}

.btn-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.btn-signout .btn-icon-circle {
  color: #dc2626;
}

.btn-icon-circle-dark {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  box-shadow: none;
}

@media (max-width: 480px) {
  .btn-signout,
  .btn-support {
    padding: 16px 22px;
    font-size: 0.95rem;
    gap: 10px;
  }
  .btn-icon-circle {
    width: 36px;
    height: 36px;
  }
}

.footer-note {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 8px 16px;
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto;
}

.footer-note-icon {
  margin-left: 6px;
}

/* Scrollbar */
.my-account-page::-webkit-scrollbar {
  width: 6px;
}

.my-account-page::-webkit-scrollbar-track {
  background: transparent;
}

.my-account-page::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 20px;
}

.my-account-page::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Selection */
.my-account-page ::selection {
  background: #c7d2fe;
  color: #312e81;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .my-account-page *,
  .my-account-page *::before,
  .my-account-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
