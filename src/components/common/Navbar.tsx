import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  PenTool, 
  BookOpen, 
  ChevronDown,
  Trophy,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';
import { useProject, AppView } from '../../context/ProjectContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const { currentView, setCurrentView, createProject } = useProject();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleStartWhiteboard = () => {
    createProject();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-brand tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                {t.brand.name}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1 hidden sm:block">
                AI Study Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.nav.home}
            </button>

            <button
              onClick={() => navigateTo('whiteboard')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'whiteboard'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              {t.nav.whiteboard}
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {t.nav.dashboard}
            </button>

            {/* Competitive Mode Link */}
            <button
              onClick={() => navigateTo('competitive')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'competitive' || currentView === 'exam_detail' || currentView === 'topic_view' || currentView === 'mcq_test'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {t.nav.competitive || 'Competitive Mode'}
            </button>

            {/* Admin Dashboard Link */}
            <button
              onClick={() => navigateTo('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t.nav.admin || 'Admin'}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Auth Buttons / User Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      {t.nav.dashboard}
                    </button>
                    <button
                      onClick={() => navigateTo('competitive')}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Competitive Mode
                    </button>
                    <button
                      onClick={() => navigateTo('admin')}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Admin Dashboard
                    </button>
                    <button
                      onClick={handleStartWhiteboard}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4 text-emerald-500" />
                      {t.whiteboard.newBoard}
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {t.nav.register}
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-3">
            <button
              onClick={() => navigateTo('landing')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              {t.nav.home}
            </button>
            <button
              onClick={() => navigateTo('whiteboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <PenTool className="w-4 h-4 text-indigo-500" />
              {t.nav.whiteboard}
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              {t.nav.dashboard}
            </button>
            <button
              onClick={() => navigateTo('competitive')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Competitive Mode
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Admin Portal
            </button>

            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-indigo-600 text-white"
                >
                  {t.nav.register}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
