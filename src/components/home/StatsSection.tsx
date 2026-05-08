import React from 'react';
import '../../styles/home/StatsSection.css';

const StatsSection: React.FC = () => (
  <section className="stats-section">
    <div className="stats-container">
      <div className="stats-header">
        <h2>البارع محمود الديب</h2>
        <p>أرقام تثبت أنك في المكان الصحيح</p>
      </div>
      <div className="stats-grid">
        <div className="stats-numbers">
          <div className="stat-box">
            <div className="stat-value">1200</div>
            <div className="stat-label">حصة تعليمية</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">5000</div>
            <div className="stat-label">طالب فخور</div>
          </div>
        </div>
        <div className="stats-image-wrapper">
          <div className="stats-image">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face"
              alt="محمود الديب"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;