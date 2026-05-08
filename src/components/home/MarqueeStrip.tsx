import React from 'react';
import '../../styles/home/MarqueeStrip.css';

const MarqueeStrip: React.FC = () => {
  const phrase = '( وما توفيقي إلا بالله )';
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {[...Array(2)].map((_, j) => (
          <div key={j} className="marquee-group">
            {Array(10).fill(phrase).map((text, i) => (
              <span key={`${j}-${i}`} className="marquee-text">{text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MarqueeStrip;