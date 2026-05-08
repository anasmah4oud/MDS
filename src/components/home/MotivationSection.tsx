import React from 'react';

interface MotivationCardProps {
  text: string;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ text }) => (
  <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
    <p className="text-xl text-white/80 leading-relaxed">{text}</p>
  </div>
);

const MotivationSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            البارع محمود الديب
          </h2>
          <p className="text-white/60 text-lg">ابدأ رحلتك نحو التفوق الآن</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MotivationCard text="النجاح ليس ضربة حظ، بل نتيجة جهد واجتهاد مستمر." />
          <MotivationCard text="من طلب العلا سهر الليالي، ومن جد وجد." />
          <MotivationCard text="كلما لزمت الدرب وصلت، فاثبت ولا تيأس." />
        </div>
      </div>
    </section>
  );
};

export default MotivationSection;