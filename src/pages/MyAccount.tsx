/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
import '../styles/MyAccount.css';

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
            1: 'الأول الثانوى',
            2: 'الثاني الثانوى',
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
                        {/* Animated border glow */}
                        <motion.div
                            className="profile-card-glow"
                            animate={{
                                opacity: [0.5, 0.8, 0.5],
                                scale: [1, 1.02, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        <div className="profile-card">
                            {/* Gradient banner */}
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

                            {/* Profile info area */}
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
                                                `data:image/png;base64,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`
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

                                {/* Info Grid */}
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

                    {/* Action Buttons */}
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

                    {/* Footer Note */}
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