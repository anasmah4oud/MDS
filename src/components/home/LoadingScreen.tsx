import React from 'react';
import '../../styles/home/LoadingScreen.css';

const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p className="loading-text">يتم التحميل...</p>
  </div>
);
export default LoadingScreen;