import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface ExamSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  categories: string[];
  countries: string[];
}

export const ExamSearch: React.FC<ExamSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  categories,
  countries,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search exams by name, country (e.g. JEE, UPSC, Gaokao, MCAT, GRE)..."
          className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Category & Country Pills */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
        <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

        <span className="text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
          Country:
        </span>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
