import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSizeScale = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (val: FontSizeScale) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (val: boolean) => void;
  accessibilityModalOpen: boolean;
  setAccessibilityModalOpen: (val: boolean) => void;
  srAnnouncement: string;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('ai_whiteboard_high_contrast') === 'true';
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>(() => {
    return (localStorage.getItem('ai_whiteboard_font_scale') as FontSizeScale) || 'normal';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem('ai_whiteboard_reduced_motion') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [dyslexicFont, setDyslexicFontState] = useState<boolean>(() => {
    return localStorage.getItem('ai_whiteboard_dyslexic_font') === 'true';
  });

  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState<boolean>(false);
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');

  const announceToScreenReader = useCallback((message: string) => {
    setSrAnnouncement(message);
    setTimeout(() => setSrAnnouncement(''), 3000);
  }, []);

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('ai_whiteboard_high_contrast', String(val));
    announceToScreenReader(val ? 'High contrast mode enabled' : 'High contrast mode disabled');
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);

  const setFontSizeScale = (val: FontSizeScale) => {
    setFontSizeScaleState(val);
    localStorage.setItem('ai_whiteboard_font_scale', val);
    announceToScreenReader(`Font size set to ${val}`);
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem('ai_whiteboard_reduced_motion', String(val));
    announceToScreenReader(val ? 'Reduced motion enabled' : 'Reduced motion disabled');
  };

  const setDyslexicFont = (val: boolean) => {
    setDyslexicFontState(val);
    localStorage.setItem('ai_whiteboard_dyslexic_font', String(val));
    announceToScreenReader(val ? 'Dyslexia-friendly font enabled' : 'Dyslexia-friendly font disabled');
  };

  // Sync class names to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.classList.remove('font-scale-large', 'font-scale-xlarge');
    if (fontSizeScale === 'large') {
      root.classList.add('font-scale-large');
    } else if (fontSizeScale === 'xlarge') {
      root.classList.add('font-scale-xlarge');
    }
  }, [highContrast, dyslexicFont, reducedMotion, fontSizeScale]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        toggleHighContrast,
        fontSizeScale,
        setFontSizeScale,
        reducedMotion,
        setReducedMotion,
        dyslexicFont,
        setDyslexicFont,
        accessibilityModalOpen,
        setAccessibilityModalOpen,
        srAnnouncement,
        announceToScreenReader,
      }}
    >
      {children}
      {/* Invisible Screen Reader Live Announcer Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {srAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
