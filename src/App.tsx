/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Pages - I will create these shortly
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Support = React.lazy(() => import('./pages/Support'));
const ScientificSupport = React.lazy(() => import('./pages/ScientificSupport'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Classes = React.lazy(() => import('./pages/Classes'));
const MyClasses = React.lazy(() => import('./pages/MyClasses'));
const FreeClasses = React.lazy(() => import('./pages/FreeClasses'));
const PackageDetails = React.lazy(() => import('./pages/PackageDetails'));
const WeekDetails = React.lazy(() => import('./pages/WeekDetails'));
const Wallet = React.lazy(() => import('./pages/Wallet'));
const MyAccount = React.lazy(() => import('./pages/MyAccount'));
const VideoView = React.lazy(() => import('./pages/VideoView'));

// Admin specific pages
const AdminPasswords = React.lazy(() => import('./pages/admin/AdminPasswords'));
const AdminBlocked = React.lazy(() => import('./pages/admin/AdminBlocked'));
const AdminWallet = React.lazy(() => import('./pages/admin/AdminWallet'));
const AdminCodes = React.lazy(() => import('./pages/admin/AdminCodes'));
const AdminGradeManage = React.lazy(() => import('./pages/admin/AdminGradeManage'));

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;
  if (profile?.isBlocked) return <div>حسابك محظور. يرجى التواصل مع الدعم.</div>;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="relative w-24 h-24 mb-4">
      <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full animate-pulse" />
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">جاري التحميل...</p>
    <div className="w-48 h-2 bg-slate-200 mt-4 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Router>
          <React.Suspense fallback={<LoadingScreen />}>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/support" element={<Support />} />
            <Route path="/scientific-support" element={<ScientificSupport />} />
            <Route path="/contact" element={<Contact />} />

            {/* Student Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
            <Route path="/my-classes" element={<ProtectedRoute><MyClasses /></ProtectedRoute>} />
            <Route path="/free" element={<ProtectedRoute><FreeClasses /></ProtectedRoute>} />
            <Route path="/package/:id" element={<ProtectedRoute><PackageDetails /></ProtectedRoute>} />
            <Route path="/week/:id" element={<ProtectedRoute><WeekDetails /></ProtectedRoute>} />
            <Route path="/video/:lessonId" element={<ProtectedRoute><VideoView /></ProtectedRoute>} />
            <Route path="/charge" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/my" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/anas/md/200/9" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/p" element={<ProtectedRoute adminOnly><AdminPasswords /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/BL" element={<ProtectedRoute adminOnly><AdminBlocked /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/w" element={<ProtectedRoute adminOnly><AdminWallet /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/cl" element={<ProtectedRoute adminOnly><AdminCodes /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/1" element={<ProtectedRoute adminOnly><AdminGradeManage grade={1} /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/2" element={<ProtectedRoute adminOnly><AdminGradeManage grade={2} /></ProtectedRoute>} />
            <Route path="/anas/md/200/9/3" element={<ProtectedRoute adminOnly><AdminGradeManage grade={3} /></ProtectedRoute>} />

            {/* Redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}
