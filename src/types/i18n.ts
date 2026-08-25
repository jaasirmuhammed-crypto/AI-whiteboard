export type SupportedLanguage = 
  | 'en' // English
  | 'ta' // Tamil
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'ar' // Arabic
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'zh'; // Chinese

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    signature: string;
  };
  nav: {
    home: string;
    whiteboard: string;
    features: string;
    howItWorks: string;
    about: string;
    dashboard: string;
    competitive: string;
    admin: string;
    login: string;
    register: string;
    logout: string;
  };
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    startWriting: string;
    howItWorks: string;
    badge: string;
    demoNoteTitle: string;
    demoBullet1: string;
    demoBullet2: string;
    demoBullet3: string;
    zeroLatency?: string;
    pptxPdfMindmap?: string;
    languagesSupported?: string;
    livePreview?: string;
    aiActive?: string;
    pptGenerated?: string;
    mcqsReady?: string;
    mindMapBadge?: string;
  };
  cta?: {
    badge: string;
    title: string;
    subtitle: string;
    button: string;
  };
  faq?: {
    badge: string;
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  howItWorks: {
    badge?: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  features: {
    badge?: string;
    title: string;
    subtitle: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
  };
  outputs: {
    badge?: string;
    title: string;
    subtitle: string;
    pptTitle: string;
    pptDesc: string;
    mcqTitle: string;
    mcqDesc: string;
    mindMapTitle: string;
    mindMapDesc: string;
    generatePPT: string;
    generateMCQ: string;
    generateMindMap: string;
    readyTitle: string;
  };
  benefits: {
    badge?: string;
    title: string;
    subtitle: string;
    b1Title: string;
    b1Desc: string;
    b2Title: string;
    b2Desc: string;
    b3Title: string;
    b3Desc: string;
    b4Title: string;
    b4Desc: string;
  };
  whiteboard: {
    startWriting: string;
    stopAndProcess: string;
    saving: string;
    saved: string;
    tools: string;
    pens: string;
    pencils: string;
    eraser: string;
    shapes: string;
    text: string;
    colors: string;
    background: string;
    undo: string;
    redo: string;
    clear: string;
    clearConfirmTitle: string;
    clearConfirmDesc: string;
    cancel: string;
    clearBoard: string;
    zoomIn: string;
    zoomOut: string;
    zoomReset: string;
    fullscreen: string;
    shortcuts: string;
    newBoard: string;
    myNotes: string;
    generatedPPTs: string;
    mcqs: string;
    mindMaps: string;
  };
  processing: {
    title: string;
    subtitle: string;
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
    stage5: string;
  };
  auth: {
    welcomeBack: string;
    signInToContinue: string;
    createAccount: string;
    startYourJourney: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    rememberMe: string;
    loginButton: string;
    registerButton: string;
    guestDemo: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
  };
  footer: {
    rights: string;
    builtBy: string;
  };
}
