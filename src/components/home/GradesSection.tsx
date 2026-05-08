import React from 'react';
import { ChevronRight } from 'lucide-react';

interface GradeCardProps {
  grade: number;
  title: string;
  img: string;
}

const GradeCard: React.FC<GradeCardProps> = ({ grade, title, img }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-blue-400 text-sm">الصف {grade}</span>
            <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const GradesSection: React.FC = () => {
  const grades = [
    { grade: 1, title: 'الصف الأول الثانوي', img: 'https://placehold.co/600x400?text=Grade+1' },
    { grade: 2, title: 'الصف الثاني الثانوي', img: 'https://placehold.co/600x400?text=Grade+2' },
    { grade: 3, title: 'الصف الثالث الثانوي', img: 'https://placehold.co/600x400?text=Grade+3' },
  ];

  return (
    <section id="grades" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            المراحل الدراسية
          </h2>
          <p className="text-white/60 text-lg">اختر صفك الدراسي وابدأ الآن</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {grades.map((g) => (
            <GradeCard key={g.grade} grade={g.grade} title={g.title} img={g.img} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GradesSection;