import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from '../components/home/LoadingScreen';
import ProgressBar from '../components/home/ProgressBar';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import MarqueeStrip from '../components/home/MarqueeStrip';
import FeaturesSection from '../components/home/FeaturesSection';
import GradesSection from '../components/home/GradesSection';
import MotivationSection from '../components/home/MotivationSection';
import StatsSection from '../components/home/StatsSection';
import Footer from '../components/home/Footer';

import '../styles/Home.css'; // أنماط إضافية إن وجدت

const Home: React.FC = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // إعادة التوجيه عند تسجيل الدخول
  useEffect(() => {
    if (!loading && user && profile) {
      navigate(isAdmin ? '/anas/md/200/9' : '/dashboard', { replace: true });
    }
  }, [user, profile, isAdmin, navigate, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <ProgressBar />
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <MarqueeStrip />
      <FeaturesSection />
      <GradesSection />
      <MotivationSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Home;