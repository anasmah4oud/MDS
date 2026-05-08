import React from 'react';
import { CheckCircle, GraduationCap, Users, BookOpen, Headset } from 'lucide-react';
import '../../styles/home/FeaturesSection.css';

interface FeatureItemProps { icon: React.ReactNode; title: string; desc: string }
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section className="features-section">
    <div className="features-container">
      <div className="features-header">
        <h2>لماذا منصة البارع؟</h2>
        <p>نجمع بين العلم والمتابعة لضمان تفوقك</p>
      </div>
      <div className="features-grid">
        <div className="feature-column">
          <FeatureItem icon={<BookOpen size={24} />} title="شرح مفصل" desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط" />
          <FeatureItem icon={<Users size={24} />} title="متابعة مستمرة" desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب" />
        </div>
        <div className="features-center-logo">©</div>
        <div className="feature-column">
          <FeatureItem icon={<CheckCircle size={24} />} title="امتحانات دورية" desc="امتحانات على كل حصة لتقييم استيعاب الطالب" />
          <FeatureItem icon={<GraduationCap size={24} />} title="امتحان شامل" desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين" />
        </div>
      </div>
    </div>
  </section>
);
export default FeaturesSection;