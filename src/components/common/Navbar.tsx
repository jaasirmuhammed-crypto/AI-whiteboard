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
  Crown, 
  Zap,
  Eye,
  Home
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useI18n } from '../../i18n';
import { useProject, AppView } from '../../context/ProjectContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenUpgradeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister, onOpenUpgradeModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, isPremium } = useAuth();
  const { setAccessibilityModalOpen } = useAccessibility();
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
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-brand tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                  {t.brand.name}
                </span>
                {isPremium && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
                    <Crown className="w-3 h-3 text-amber-100" />
                    <span>PREMIUM USER</span>
                  </span>
                )}
              </div>
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
              <span>{t.nav.competitive || 'Competitive Mode'}</span>
            </button>

            {/* Docs & Guides Link */}
            <button
              onClick={() => navigateTo('docs')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'docs'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Docs</span>
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
              <span>{t.nav.admin || 'Admin'}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Tokens / Upgrade Trigger for Free Users */}
            {!isPremium ? (
              <button
                onClick={onOpenUpgradeModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-xs"
                title="Upgrade to Unlimited Premium"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Upgrade Plan</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                <Crown className="w-3.5 h-3.5 text-emerald-500" />
                <span>Unlimited AI</span>
              </div>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Accessibility & High Contrast Quick Toggle */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              aria-label="Open Accessibility & Assistive Settings"
              title="Accessibility & High Contrast Mode (WCAG 2.1)"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        {isPremium ? (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                            PRO
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px]">
                            FREE
                          </span>
                        )}
                      </div>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all duration-200"
                >
                  {t.nav.register}
                </button>
              </div>
            )}

            {/* Direct Mobile Quick Launch Pills (Visible on tablet/sm screens) */}
            <div className="hidden sm:flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigateTo('landing')}
                aria-label="Homepage"
                className={`p-1.5 rounded-xl border transition-all ${
                  currentView === 'landing'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Homepage"
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('whiteboard')}
                aria-label="Whiteboard Canvas"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs ${
                  currentView === 'whiteboard'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/30'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                }`}
                title="Open Whiteboard Canvas"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Canvas</span>
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Mobile Navigation"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1.5 animate-in fade-in slide-in-from-top-2 shadow-2xl">
          <button
            onClick={() => navigateTo('landing')}
            className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-3 transition-colors ${
              currentView === 'landing'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5 text-indigo-500" />
            <span>{t.nav.home || 'Home'}</span>
          </button>

          <button
            onClick={() => navigateTo('whiteboard')}
            className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-3 transition-colors ${
              currentView === 'whiteboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-5 h-5 text-purple-500" />
            <span>{t.nav.whiteboard || 'Whiteboard Canvas'}</span>
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-3 transition-colors ${
              currentView === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            <span>{t.nav.dashboard || 'My Dashboard'}</span>
          </button>

          <button
            onClick={() => navigateTo('competitive')}
            className={`w-full text-left px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-3 transition-colors ${
              currentView === 'competitive'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Competitive Exams & Practice</span>
          </button>

          <button
            onClick={() => navigateTo('docs')}
            className="w-full text-left px-4 py-3 text-sm font-bold rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
          >
            <BookOpen className="w-5 h-5 text-cyan-500" />
            <span>Documentation & Guides</span>
          </button>

          <button
            onClick={() => navigateTo('admin')}
            className="w-full text-left px-4 py-3 text-sm font-bold rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setAccessibilityModalOpen(true);
            }}
            className="w-full text-left px-4 py-3 text-sm font-semibold rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
          >
            <Eye className="w-5 h-5 text-indigo-500" />
            <span>Accessibility Settings (WCAG 2.1)</span>
          </button>

          {!isPremium && onOpenUpgradeModal && (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenUpgradeModal(); }}
              className="w-full text-left px-4 py-3 text-sm font-bold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
            >
              Upgrade to Premium 👑
            </button>
          )}
        </div>
      )}
    </header>
  );
};
