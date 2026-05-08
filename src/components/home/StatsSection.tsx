import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            البارع محمود الديب
          </h2>
          <p className="text-white/60 text-lg">دي مش مجرد أرقام دي أدلة أنك في المكان الصح</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                1200
              </div>
              <div className="text-white/60">حصة تعليمية</div>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                5000
              </div>
              <div className="text-white/60">طالب فخور</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src="https://placehold.co/600x600?text=محمود+الديب"
                alt="محمود الديب"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;