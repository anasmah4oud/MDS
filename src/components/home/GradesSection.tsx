import React from 'react';
import { ChevronRight } from 'lucide-react';
import '../../styles/home/GradesSection.css';

interface GradeCardProps {
  grade: number;
  title: string;
  img: string;
}

const GradeCard: React.FC<GradeCardProps> = ({ grade, title, img }) => (
  <div className="grade-card">
    <div className="grade-card-img">
      <img src={img} alt={title} />
    </div>
    <div className="grade-card-body">
      <div className="info">
        <span>الصف {grade}</span>
        <h3>{title}</h3>
      </div>
      <div className="grade-arrow">
        <ChevronRight size={20} />
      </div>
    </div>
  </div>
);

const GradesSection: React.FC = () => {
  const grades = [
    { grade: 1, title: 'الصف الأول الثانوي', img: 'https://images.unsplash.com/photo-1523050854058-8df90910e89c?w=600&h=400' },
    { grade: 2, title: 'الصف الثاني الثانوي', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db7b9?w=600&h=400' },
    { grade: 3, title: 'الصف الثالث الثانوي', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400' },
  ];

  return (
    <section className="grades-section">
      <div className="grades-container">
        <div className="grades-header">
          <h2>المراحل الدراسية</h2>
          <p>اختر صفك الدراسي وابدأ الآن</p>
        </div>
        <div className="grades-grid">
          {grades.map(g => (
            <GradeCard key={g.grade} grade={g.grade} title={g.title} img={g.img} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GradesSection;