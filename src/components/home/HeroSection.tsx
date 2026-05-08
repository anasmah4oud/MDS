import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-repeat" style={{ backgroundImage: "url('/pattern.svg')" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              الشهرة في اللغة العربية
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="text-white">البارع </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                محمود الديب
              </span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed">
              أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all"
              >
                ابدأ رحلتك الآن
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src="https://placehold.co/600x800?text=محمود+الديب"
                alt="محمود الديب"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب" }}
              />
            </div>
            <div className="absolute -z-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;