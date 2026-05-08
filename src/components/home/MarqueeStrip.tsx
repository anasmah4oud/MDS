
import React from 'react';

const MarqueeStrip: React.FC = () => {
  const text = "( وما توفيقي إلا بالله )";
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 py-6 overflow-hidden border-y border-white/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* تكرار مزدوج لحركة مستمرة */}
        {[...Array(2)].map((_, j) => (
          <div key={j} className="flex gap-12">
            {Array(10).fill(text).map((item, i) => (
              <span key={`${j}-${i}`} className="text-2xl md:text-3xl font-bold text-white/20 mx-6">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;