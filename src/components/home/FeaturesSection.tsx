import React from 'react';
import { CheckCircle, Users, BookOpen, Headset } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/60 leading-relaxed">{desc}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            لماذا منصة البارع؟
          </h2>
          <p className="text-white/60 text-lg">نجمع بين العلم والمتابعة لضمان تفوقك</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left Features */}
          <div className="space-y-8">
            <FeatureItem
              icon={<BookOpen size={24} />}
              title="شرح مفصل"
              desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط"
            />
            <FeatureItem
              icon={<Users size={24} />}
              title="متابعة مستمرة"
              desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب"
            />
          </div>

          {/* Center Logo */}
          <div className="hidden md:flex justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
              <span className="text-5xl font-bold text-white/20">©</span>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-8">
            <FeatureItem
              icon={<CheckCircle size={24} />}
              title="امتحانات دورية"
              desc="امتحانات على كل حصة لتقييم استيعاب الطالب"
            />
            <FeatureItem
              icon={<GraduationCap size={24} />}
              title="امتحان شامل"
              desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;