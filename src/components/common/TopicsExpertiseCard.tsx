import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Atom, 
  Code2, 
  Binary, 
  Stethoscope, 
  Landmark, 
  GraduationCap, 
  ArrowRight,
  Zap,
  BookOpenCheck
} from 'lucide-react';

interface TopicCategory {
  id: string;
  name: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  accentBg: string;
  description: string;
  popularTopics: string[];
  features: string[];
}

interface TopicsExpertiseCardProps {
  onSelectTopic?: (topic: string) => void;
  className?: string;
}

export const TopicsExpertiseCard: React.FC<TopicsExpertiseCardProps> = ({ 
  onSelectTopic, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<string>('stem');

  const categories: TopicCategory[] = [
    {
      id: 'stem',
      name: 'Science & Physics',
      badge: 'Formula Derivations',
      icon: <Atom className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Excels at biochemical mechanisms, physics laws, equations, reactions, and cellular biology.',
      popularTopics: [
        'Photosynthesis & Light Reactions',
        'Quantum Mechanics & Wave Functions',
        'Newtonian Dynamics & Forces',
        'Thermodynamics & Carnot Engine',
        'Cellular Respiration & ATP Cycle',
        'Organic Reaction Mechanisms'
      ],
      features: ['Step-by-step reaction flows', 'Key formula extraction', 'Diagram visual descriptions']
    },
    {
      id: 'tech',
      name: 'Computer Science & AI',
      badge: 'Code & Architecture',
      icon: <Code2 className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      description: 'Ideal for system designs, data structures, algorithms, SQL querying, and neural network concepts.',
      popularTopics: [
        'Binary Search & Complexity (O(log n))',
        'Neural Networks & Backpropagation',
        'Database Normalization & SQL Joins',
        'System Architecture & Microservices',
        'Dynamic Programming & Recursion',
        'REST APIs & Asynchronous JavaScript'
      ],
      features: ['Algorithmic time complexity', 'System architecture flows', 'Data structure comparisons']
    },
    {
      id: 'math',
      name: 'Mathematics & Stats',
      badge: 'Proofs & Solutions',
      icon: <Binary className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      accentBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'High precision for algebraic formulas, calculus theorems, probability, and coordinate geometry.',
      popularTopics: [
        'Calculus: Derivatives & Integration',
        'Linear Algebra & Matrix Operations',
        'Probability & Bayes Theorem',
        'Trigonometric Identities & Proofs',
        'Differential Equations Modeling',
        'Complex Numbers & Euler Identity'
      ],
      features: ['Exact formula breakdowns', 'Stepwise calculations', 'Real-world math applications']
    },
    {
      id: 'med',
      name: 'Medicine & Healthcare',
      badge: 'Clinical Diagnostics',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-500',
      accentBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Specially optimized for anatomical structures, disease pathogenesis, pharmacology, and medical vignettes.',
      popularTopics: [
        'Cardiac Cycle & ECG Waveforms',
        'Pharmacology & Drug Mechanism',
        'Hematology & Anemia Classifications',
        'Endocrine System & Hormones',
        'Pathology & Diagnostic Criteria',
        'Neuroanatomy & Cranial Nerves'
      ],
      features: ['Physiological mechanism flows', 'Diagnostic tables', 'Clinical trial relevance']
    },
    {
      id: 'history',
      name: 'History & Civics',
      badge: 'Timelines & Geopolitics',
      icon: <Landmark className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Accurate chronological timelines, constitutional articles, treaty breakdowns, and historical causes.',
      popularTopics: [
        'World War 2: Battles & Geopolitics',
        'Constitutional Rights & Law Articles',
        'Industrial Revolution Transformations',
        'Cold War Alliances & Space Race',
        'Ancient Civilizations & Trade Routes',
        'Economic Policies & Monetary Policy'
      ],
      features: ['Chronological timeline mapping', 'Constitutional article index', 'Global cause-and-effect']
    },
    {
      id: 'exams',
      name: 'Competitive Exams',
      badge: 'Targeted MCQs',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-violet-500 to-fuchsia-500',
      accentBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      description: 'Built-in question syllabus tailored for major national and international entrance exams.',
      popularTopics: [
        'UPSC / Civil Services Prelims',
        'JEE Main & Advanced Physics/Math',
        'NEET & MCAT Biology Preparation',
        'SAT / GRE / GMAT Critical Reasoning',
        'USMLE Step 1 Clinical High-Yields',
        'Gaokao & National Entrance Exams'
      ],
      features: ['Official exam syllabus patterns', 'Vignette style MCQs', 'Speed-solving formulas']
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-white ${className}`}>
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 p-6 sm:p-8 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Content Mastery</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Topics AI Whiteboard Excels At
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Our multimodal engine is tuned for structured academic accuracy, formula precision, and exam-grade slides.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0 self-start sm:self-center">
            <BookOpenCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold text-slate-200">100% Fact-Checked</span>
              <span className="block text-slate-400 text-[10px]">Strict anti-hallucination rules</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-indigo-600/30 scale-[1.02]`
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Content */}
      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold mb-2 border ${currentCategory.accentBg}">
              <Zap className="w-3 h-3" />
              <span>{currentCategory.badge}</span>
            </div>
            <h4 className="text-xl font-bold text-white">{currentCategory.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{currentCategory.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentCategory.features.map((feat, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Popular Topic Pills (Clickable) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Popular High-Accuracy Topics
            </span>
            <span className="text-[11px] text-indigo-400">Click any topic to test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {currentCategory.popularTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => onSelectTopic && onSelectTopic(topic)}
                className="group p-3 rounded-2xl bg-slate-800/50 hover:bg-indigo-950/50 border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98]"
              >
                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-200 transition-colors line-clamp-1">
                  {topic}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
