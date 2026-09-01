import React, { useState } from 'react';
import { Star, CheckCircle, GraduationCap, Sparkles, LayoutGrid, Repeat } from 'lucide-react';
import { InfiniteCarousel } from '../common/InfiniteCarousel';

interface Testimonial {
  name: string;
  role: string;
  institution: string;
  avatar: string;
  rating: number;
  quote: string;
  highlight: string;
  badge: string;
  accent: string;
}

export const TestimonialsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const testimonialsRow1: Testimonial[] = [
    {
      name: 'Dr. Evelyn Reed',
      role: 'Associate Professor of Physics',
      institution: 'Stanford University',
      avatar: 'ER',
      rating: 5,
      quote: 'I used to spend 3 hours every Sunday preparing PowerPoint slides for Monday morning lectures. With AI Whiteboard, I just sketch free-body diagrams and equations naturally, and I get publication-ready 16:9 slides in seconds.',
      highlight: 'Saves 3+ hours per lecture prep',
      badge: 'STEM Professor',
      accent: 'from-indigo-500 to-purple-600',
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
      accent: 'from-amber-500 to-orange-600',
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
      accent: 'from-emerald-500 to-teal-600',
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
      accent: 'from-blue-500 to-cyan-600',
    },
  ];

  const testimonialsRow2: Testimonial[] = [
    {
      name: 'Ananya Deshmukh',
      role: 'JEE Advanced Rank 114',
      institution: 'IIT Bombay (CSE)',
      avatar: 'AD',
      rating: 5,
      quote: 'Drawing rough rotational dynamics vectors and getting instant multi-option calibrated MCQs with step-by-step calculus derivations helped me solidify my weakest physics areas in weeks.',
      highlight: '99.98 Percentile JEE Advanced',
      badge: 'Engineering Scholar',
      accent: 'from-rose-500 to-pink-600',
    },
    {
      name: 'Prof. David K. Miller',
      role: 'Director of Organic Chemistry',
      institution: 'Oxford University',
      avatar: 'DM',
      rating: 5,
      quote: 'The real-time chemical formula recognizer and LaTeX rendering turn my chaotic chalkboard sketches into crystal clear vectorized PDFs. A game changer for higher education.',
      highlight: 'Used across 4 chemistry labs',
      badge: 'Chemistry Chair',
      accent: 'from-violet-500 to-indigo-600',
    },
    {
      name: 'Elena Rostova',
      role: 'NEET-PG All India Rank 88',
      institution: 'All India Institute of Medical Sciences',
      avatar: 'ER',
      rating: 5,
      quote: 'The AI mind maps for neuroanatomy pathways cut my revision time by half. The offline local saving ensures I never lose notes during 24-hour hospital rotations.',
      highlight: 'AIR 88 in NEET-PG',
      badge: 'Clinical Resident',
      accent: 'from-teal-500 to-emerald-600',
    },
    {
      name: 'Liam Zhang',
      role: 'SAT Math 800 / ACT 36',
      institution: 'UC Berkeley Aspirant',
      avatar: 'LZ',
      rating: 5,
      quote: 'Being able to doodle geometry proofs, hit analyze, and receive instant diagnostic flashcards gave me the exact confidence I needed for a perfect 800.',
      highlight: 'Perfect 800 Score',
      badge: 'High School Senior',
      accent: 'from-cyan-500 to-blue-600',
    },
  ];

  const universities = [
    'Stanford University',
    'MIT',
    'Oxford University',
    'Harvard University',
    'IIT Bombay',
    'Johns Hopkins Medicine',
    'Cambridge University',
    'UC Berkeley',
    'ETH Zurich',
    'National University of Singapore',
  ];

  const renderCard = (t: Testimonial, idx: number) => (
    <div
      key={idx}
      className="w-[340px] sm:w-[400px] shrink-0 p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 text-left group"
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
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-4 group-hover:line-clamp-none transition-all">
          "{t.quote}"
        </p>
      </div>

      {/* Author Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${t.accent} text-white font-bold flex items-center justify-center shadow-md shadow-indigo-500/20 text-xs`}>
            {t.avatar}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {t.role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{t.institution}</span>
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
          {t.badge}
        </span>
      </div>
    </div>
  );

  return (
    <section className="py-20 relative bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 overflow-hidden" aria-labelledby="testimonials-title">
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
            See how educators save hours of lecture preparation and how students accelerate competitive exam mastery with AI-powered synthesis.
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

          {/* View Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setViewMode('carousel')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'carousel'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" /> Infinite Carousel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid View
            </button>
          </div>
        </div>

        {/* Global Universities Infinite Carousel Strip */}
        <div className="space-y-3 pt-2 pb-4 border-y border-slate-100 dark:border-slate-800/80">
          <p className="text-center text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Scholars & Faculty Connected From
          </p>
          <InfiniteCarousel direction="left" speedSeconds={28} gap="gap-8">
            {universities.map((uni, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 shadow-xs hover:border-indigo-500/40 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{uni}</span>
              </div>
            ))}
          </InfiniteCarousel>
        </div>

        {/* Testimonials Display (Infinite Carousels vs Grid View) */}
        {viewMode === 'carousel' ? (
          <div className="space-y-6 pt-2">
            {/* Row 1: Left Scrolling Infinite Carousel */}
            <InfiniteCarousel direction="left" speedSeconds={42} gap="gap-6">
              {testimonialsRow1.map((t, idx) => renderCard(t, idx))}
            </InfiniteCarousel>

            {/* Row 2: Right Scrolling Infinite Carousel */}
            <InfiniteCarousel direction="right" speedSeconds={46} gap="gap-6">
              {testimonialsRow2.map((t, idx) => renderCard(t, idx))}
            </InfiniteCarousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...testimonialsRow1, ...testimonialsRow2].map((t, idx) => renderCard(t, idx))}
          </div>
        )}

      </div>
    </section>
  );
};
