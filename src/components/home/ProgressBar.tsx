import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import '../../styles/home/ProgressBar.css';

const ProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="progress-bar" style={{ scaleX }} />;
};
export default ProgressBar;