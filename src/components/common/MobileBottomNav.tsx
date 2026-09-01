import React from 'react';
import { Home, PenTool, LayoutDashboard, Trophy, User, Plus } from 'lucide-react';
import { useProject, AppView } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  onOpenLogin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenLogin }) => {
  const { currentView, setCurrentView, createProject } = useProject();
  const { isAuthenticated } = useAuth();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
  };

  const handleNewCanvas = () => {
    createProject();
    setCurrentView('whiteboard');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pointer-events-none flex justify-center w-full max-w-full">
      <nav 
        aria-label="Mobile Navigation"
        className="pointer-events-auto w-full max-w-md mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/20 px-3 py-2 flex items-center justify-around"
      >
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          aria-label="Go to Homepage"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            currentView === 'landing'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'landing' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* 2. Whiteboard */}
        <button
          type="button"
          onClick={() => handleNav('whiteboard')}
          aria-label="Go to Whiteboard Canvas"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            currentView === 'whiteboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PenTool className={`w-5 h-5 ${currentView === 'whiteboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium">Whiteboard</span>
        </button>

        {/* 3. Central Quick Create Canvas Action Button */}
        <button
          type="button"
          onClick={handleNewCanvas}
          aria-label="Create New Whiteboard"
          className="relative -top-3 w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Dashboard */}
        <button
          type="button"
          onClick={() => handleNav('dashboard')}
          aria-label="Go to Dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${currentView === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>

        {/* 5. Competitive Exam Prep or Account */}
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              handleNav('competitive');
            } else {
              onOpenLogin();
            }
          }}
          aria-label={isAuthenticated ? 'Competitive Exam Hub' : 'Sign In'}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            currentView === 'competitive'
              ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isAuthenticated ? (
            <>
              <Trophy className={`w-5 h-5 ${currentView === 'competitive' ? 'text-amber-500 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium">Exams</span>
            </>
          ) : (
            <>
              <User className="w-5 h-5 stroke-2" />
              <span className="text-[10px] font-medium">Login</span>
            </>
          )}
        </button>
      </nav>
    </div>
  );
};
