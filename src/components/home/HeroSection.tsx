import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import '../../styles/home/HeroSection.css';

const HeroSection: React.FC = () => (
  <section className="hero">
    <div className="hero-content">
      <div className="hero-text">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          الشهرة في اللغة العربية
        </div>
        <h1 className="hero-title">
          البارع <span className="hero-title-highlight">محمود الديب</span>
        </h1>
        <p className="hero-description">
          أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="hero-btn-primary">
            ابدأ رحلتك الآن
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
      <div className="hero-image-wrapper">
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
            alt="محمود الديب"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;