import React from 'react';
import '../../styles/home/MotivationSection.css';

interface MotivationCardProps {
  text: string;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ text }) => (
  <div className="motivation-card">
    <p>{text}</p>
  </div>
);

const MotivationSection: React.FC = () => {
  const quotes = [
    'النجاح ليس ضربة حظ، بل نتيجة جهد واجتهاد مستمر.',
    'من طلب العلا سهر الليالي، ومن جد وجد.',
    'كلما لزمت الدرب وصلت، فاثبت ولا تيأس.',
  ];

  return (
    <section className="motivation-section">
      <div className="motivation-container">
        <div className="motivation-header">
          <h2>البارع محمود الديب</h2>
          <p>ابدأ رحلتك نحو التفوق الآن</p>
        </div>
        <div className="motivation-grid">
          {quotes.map((q, i) => (
            <MotivationCard key={i} text={q} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MotivationSection;