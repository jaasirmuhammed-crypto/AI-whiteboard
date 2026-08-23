import React, { useState } from 'react';
import { Exam } from '../../types/competitive';
import { CompetitiveService } from '../../services/competitiveService';
import { ExamSearch } from './ExamSearch';
import {
  Trophy,
  Globe,
  BookOpen,
  Bookmark,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  SearchX,
} from 'lucide-react';

interface CompetitiveHubViewProps {
  onSelectExam: (examId: string) => void;
  onOpenBookmarks: () => void;
}

export const CompetitiveHubView: React.FC<CompetitiveHubViewProps> = ({
  onSelectExam,
  onOpenBookmarks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const exams = CompetitiveService.searchExams(searchQuery, selectedCategory, selectedCountry);

  const categories = [
    'All',
    'Civil Services & Governance',
    'Engineering & Technology',
    'Medicine & Healthcare',
    'Higher Education Entrance',
    'Graduate Studies',
    'Business & Management',
    'Law',
  ];

  const countries = ['India', 'China', 'USA & Canada', 'South Korea', 'Global (USA/International)'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-indigo-500/30">
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Competitive & Entrance Exam Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-brand leading-tight">
            Master the World’s Toughest Examinations
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Explore structured topics, AI-generated flashcards, visual diagrams, and adaptive practice tests for Gaokao, UPSC, JEE, NEET, MCAT, GRE, GMAT, LSAT, and top global entrance exams.
          </p>
        </div>

        <button
          onClick={onOpenBookmarks}
          className="btn-interactive relative z-10 shrink-0 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center gap-2"
        >
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" /> View Saved Bookmarks
        </button>
      </div>

      {/* Search & Filters */}
      <ExamSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        categories={categories}
        countries={countries}
      />

      {/* Exam Cards Grid */}
      {exams.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <SearchX className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No entrance exams match "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the category and country filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCountry('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onSelectExam(exam.id)}
              className="card-hover-effect p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 cursor-pointer flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/60">
                    {exam.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" /> {exam.country}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold font-brand text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {exam.category}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {exam.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> {exam.subjects.length} Major Subjects
                </span>

                <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Exam <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
