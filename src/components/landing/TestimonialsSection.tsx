import React from 'react';
import { Star, Quote, Award, CheckCircle, GraduationCap, School, Heart } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  institution: string;
  avatar: string;
  rating: number;
  quote: string;
  highlight: string;
  badge: string;
}

export const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Dr. Evelyn Reed',
      role: 'Associate Professor of Physics',
      institution: 'Stanford University',
      avatar: 'ER',
      rating: 5,
      quote: 'I used to spend 3 hours every Sunday preparing PowerPoint slides for Monday morning lectures. With AI Whiteboard, I just sketch free-body diagrams and equations naturally, and I get publication-ready 16:9 slides in seconds.',
      highlight: 'Saves 3+ hours per lecture prep',
      badge: 'STEM Professor',
    },
    {
      name: 'Rahul Sharma',
      role: 'UPSC CSE All India Rank 42',
      institution: 'Civil Services Academy',
      avatar: 'RS',
      rating: 5,
      quote: 'The timeline and constitutional judgment matrices are pure gold for UPSC Mains. Transforming scattered revision points into comparative tables gave me the exact structural clarity needed for answer writing.',
      highlight: 'Top 50 Rank in UPSC CSE',
      badge: 'Competitive Aspirant',
    },
    {
      name: 'Sarah Chen',
      role: 'Medical Student (MD Candidate)',
      institution: 'Johns Hopkins Medicine',
      avatar: 'SC',
      rating: 5,
      quote: 'Sketching complex biochemical pathways and having them converted into USMLE practice questions and clean Notion toggle blocks has completely transformed my spaced repetition routine.',
      highlight: '99th Percentile USMLE Step 1',
      badge: 'Medical Scholar',
    },
    {
      name: 'Marcus Vance',
      role: 'High School AP Calculus Educator',
      institution: 'Boston STEM Academy',
      avatar: 'MV',
      rating: 5,
      quote: 'My students love the interactive Cartesian graphs and step-by-step calculus derivations. We export directly to Google Slides and share with the whole class via Google Classroom with 1 tap.',
      highlight: '100% AP Exam Pass Rate',
      badge: 'High School Educator',
    },
  ];

  return (
    <section className="py-20 relative bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800" aria-labelledby="testimonials-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Stats */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Loved by 50,000+ Students & Educators</span>
          </div>

          <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-slate-900 dark:text-white">
            Trusted Across Top Universities and Classrooms
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            See how educators save hours of lecture preparation and how students accelerate competitive exam mastery.
          </p>

          {/* Social Proof Badges Strip */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500">★★★★★</span>
              <span>4.9 / 5 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>120+ Universities Worldwide</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Verified Educator Reviews</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Rating & Highlight Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                    {t.highlight}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{t.institution}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {t.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
