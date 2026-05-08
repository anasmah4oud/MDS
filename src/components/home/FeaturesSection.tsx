import React from 'react';
import { BookOpen, Users, CheckCircle, GraduationCap } from 'lucide-react';
import '../../styles/home/FeaturesSection.css';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

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
          <FeatureItem icon={<BookOpen size={24} />} title="شرح مفصل" desc="شرح كل جزء بأسلوب مبسط وسلس" />
          <FeatureItem icon={<Users size={24} />} title="متابعة مستمرة" desc="متابعة مع ولي الأمر لضمان التقدم" />
        </div>
        <div className="features-center-logo">©</div>
        <div className="feature-column">
          <FeatureItem icon={<CheckCircle size={24} />} title="امتحانات دورية" desc="امتحان على كل حصة لتقييم الاستيعاب" />
          <FeatureItem icon={<GraduationCap size={24} />} title="امتحان شامل" desc="امتحان شهري مع هدايا قيمة للمتفوقين" />
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;