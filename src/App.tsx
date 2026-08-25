import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './components/common/Toast';
import { ProjectProvider, useProject } from './context/ProjectContext';

import { LiveWaveBackground } from './components/common/LiveWaveBackground';
import { BrushIntroScreen } from './components/common/BrushIntroScreen';
import { TopicsExpertiseCard } from './components/common/TopicsExpertiseCard';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { OutputsShowcase } from './components/landing/OutputsShowcase';
import { BenefitsSection } from './components/landing/BenefitsSection';
import { DemoWhiteboard } from './components/landing/DemoWhiteboard';
import { LiveStudentReviewsSection } from './components/landing/LiveStudentReviewsSection';
import { FAQSection } from './components/landing/FAQSection';
import { CTASection } from './components/landing/CTASection';

// Auth Modals
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Dashboard View
import { DashboardView } from './components/dashboard/DashboardView';

// Whiteboard Studio Components
import { WhiteboardCanvas, WhiteboardCanvasRef } from './components/whiteboard/WhiteboardCanvas';
import { TopControlBar } from './components/whiteboard/TopControlBar';
import { FloatingToolbar } from './components/whiteboard/FloatingToolbar';
import { ViewControls } from './components/whiteboard/ViewControls';
import { ClearBoardModal } from './components/whiteboard/ClearBoardModal';
import { ShortcutsModal } from './components/whiteboard/ShortcutsModal';
import { BackgroundSelector } from './components/whiteboard/BackgroundSelector';
import { CollaborationModal } from './components/whiteboard/CollaborationModal';
import { VersionHistoryModal } from './components/whiteboard/VersionHistoryModal';
import { LayersPanelModal } from './components/whiteboard/LayersPanelModal';
import { TemplatesModal } from './components/whiteboard/TemplatesModal';

// AI Modals
import { AIProcessingModal } from './components/ai/AIProcessingModal';
import { AISettingsModal } from './components/ai/AISettingsModal';
import { TopicConfirmModal } from './components/ai/TopicConfirmModal';
import { OCRReviewModal } from './components/ai/OCRReviewModal';
import { OutputCustomizationModal } from './components/ai/OutputCustomizationModal';

// Common Core Modals & Payments
import { ExportHubModal } from './components/common/ExportHubModal';
import { QuotaUsageModal } from './components/common/QuotaUsageModal';
import { TokensExhaustedModal } from './components/common/TokensExhaustedModal';
import { OnboardingTourModal } from './components/common/OnboardingTourModal';

// Study Hub
import { StudyMaterialsHub } from './components/study/StudyMaterialsHub';
import { Exam } from './types/competitive';

// Competitive Mode & Admin Components
import { CompetitiveHubView } from './components/competitive/CompetitiveHubView';
import { ExamDetailView } from './components/competitive/ExamDetailView';
import { TopicLearningView } from './components/competitive/TopicLearningView';
import { MCQTestSystem } from './components/competitive/MCQTestSystem';
import { BookmarksView } from './components/competitive/BookmarksView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { CompetitiveService } from './services/competitiveService';
import { Topic } from './types/competitive';

// Types & Services
import { ToolType, PenType, PencilType, EraserType, ShapeType, CanvasLayer, CollaboratorCursor, LineSmoothingLevel } from './types/whiteboard';
import { OutputCustomizationSettings, UserQuotaState, VersionSnapshot, CanvasPerformanceTelemetry } from './types/advancedFeatures';
import { AIService } from './services/aiService';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentProject,
    createProject,
    updateCurrentProjectElements,
    updateProjectTitle,
    updateBackgroundPattern,
    setGeneratedMaterials,
    activeStudyMaterials,
  } = useProject();
  const { user, isPremium, deductToken, upgradeToPremium } = useAuth();
  const { showToast } = useToast();

  // Canvas Reference
  const canvasRef = useRef<WhiteboardCanvasRef | null>(null);

  // Auth Modals State
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Whiteboard Tool State
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [activePen, setActivePen] = useState<PenType>('basic-pen');
  const [activePencil, setActivePencil] = useState<PencilType>('hb-pencil');
  const [activeEraser, setActiveEraser] = useState<EraserType>('small-eraser');
  const [activeShape, setActiveShape] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState('#4f46e5');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(1);

  // Text state
  const [fontFamily, setFontFamily] = useState("'Plus Jakarta Sans', sans-serif");
  const [fontSize, setFontSize] = useState(20);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Canvas Viewport State
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);

  // Advanced Drawing Engine Options
  const [smoothingLevel, setSmoothingLevel] = useState<LineSmoothingLevel>('medium');
  const [pressureEnabled, setPressureEnabled] = useState(true);
  const [shapeAutoDetect, setShapeAutoDetect] = useState(true);

  // Layers System
  const [layers, setLayers] = useState<CanvasLayer[]>([
    { id: 'layer_default', name: 'Main Canvas Layer', visible: true, locked: false, opacity: 1 },
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer_default');

  // Performance Telemetry State
  const [telemetry, setTelemetry] = useState<CanvasPerformanceTelemetry>({
    fps: 60,
    drawLatencyMs: 6,
    activeStrokesCount: 0,
    memoryEstimateKB: 16,
    smoothingEnabled: true,
    deviceType: 'stylus',
  });

  // Multiplayer Collaboration State
  const [isMultiplayerActive, setIsMultiplayerActive] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([
    { id: 'c1', name: 'Dr. Sarah Chen', avatar: '👩‍🏫', color: '#10b981', x: 220, y: 180, lastActive: Date.now() },
    { id: 'c2', name: 'Alex Rivera (MIT)', avatar: '👨‍🎓', color: '#f59e0b', x: 540, y: 320, lastActive: Date.now() },
  ]);

  // Version Control History
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [currentVersionNumber, setCurrentVersionNumber] = useState(1);

  // Output Customization Settings
  const [customizationSettings, setCustomizationSettings] = useState<OutputCustomizationSettings>({
    pptTheme: 'modern',
    mcqDifficulty: 'medium',
    mindMapStyle: 'circular',
    contentDepth: 'detailed',
    includeSlides: true,
    includeMCQs: true,
    includeMindMap: true,
    targetLanguage: 'English',
    includeFormulas: true,
    includeHistoricalContext: true,
  });

  // User Quota State
  const [quotaState, setQuotaState] = useState<UserQuotaState>(() => ({
    dailyGenerationsAllowed: isPremium ? 999999 : 5,
    generationsUsedToday: 0,
    resetHoursRemaining: 10,
    isProUser: isPremium,
    tierName: isPremium ? 'Pro Scholar' : 'Free Starter',
    priorityQueueActive: isPremium,
  }));

  // Synchronize quota state with user auth changes
  useEffect(() => {
    setQuotaState((prev) => ({
      ...prev,
      isProUser: isPremium,
      dailyGenerationsAllowed: isPremium ? 999999 : 5,
      tierName: isPremium ? 'Pro Scholar' : 'Free Starter',
      priorityQueueActive: isPremium,
    }));
  }, [isPremium]);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);

  // Popovers & Core Modals visibility
  const [bgSelectorOpen, setBgSelectorOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [exportHubOpen, setExportHubOpen] = useState(false);
  const [outputCustomizationOpen, setOutputCustomizationOpen] = useState(false);
  const [collaborationModalOpen, setCollaborationModalOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [layersModalOpen, setLayersModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [tokensExhaustedModalOpen, setTokensExhaustedModalOpen] = useState(false);
  const [onboardingTourOpen, setOnboardingTourOpen] = useState(false);

  // Live Brush Intro Animation State
  const [showIntro, setShowIntro] = useState(true);

  // AI Generation State
  const [topicConfirmOpen, setTopicConfirmOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(1);
  const [processingMessage, setProcessingMessage] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Competitive Router State
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const selectedExam = selectedExamId ? CompetitiveService.getExamById(selectedExamId) : null;

  // Animate remote multiplayer cursors slightly when active
  useEffect(() => {
    if (!isMultiplayerActive) return;

    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x + (Math.random() - 0.5) * 40,
          y: c.y + (Math.random() - 0.5) * 30,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isMultiplayerActive]);

  // Whiteboard workflow triggers
  const handleStartWriting = () => {
    if (!currentProject) {
      createProject();
    } else {
      setCurrentView('whiteboard');
    }
  };

  const handleStopAndProcess = () => {
    // 1. Check Token / Quota Balance
    if (!isPremium && quotaState.dailyGenerationsAllowed - quotaState.generationsUsedToday <= 0) {
      setTokensExhaustedModalOpen(true);
      return;
    }

    let topicToUse = currentProject?.title || 'Machine Learning & AI';
    if (topicToUse === 'Untitled Project' || topicToUse.startsWith('Notebook #')) {
      const elements = currentProject?.elements || [];
      const typed = elements
        .filter((el) => el.type === 'text' || el.type === 'sticky')
        .map((el: any) => el.text)
        .filter(Boolean)
        .join(' ');
      if (typed && typed.length > 2) {
        topicToUse = typed.split('\n')[0].slice(0, 50).trim();
      }
    }
    setPendingTopic(topicToUse);
    // Trigger OCR & handwriting recognition pre-pass
    setOcrModalOpen(true);
  };

  const handleConfirmTopicAndProcess = async (confirmedTopic: string, targetExam?: Exam | null) => {
    // Token deduction check
    if (!isPremium) {
      const hasTokens = deductToken();
      if (!hasTokens) {
        setTopicConfirmOpen(false);
        setOcrModalOpen(false);
        setTokensExhaustedModalOpen(true);
        return;
      }
    }

    setTopicConfirmOpen(false);
    setOcrModalOpen(false);
    updateProjectTitle(confirmedTopic);
    setIsProcessing(true);
    setProcessingStage(1);
    setProcessingMessage('Capturing high-resolution whiteboard notes...');
    setGenerationError(null);

    try {
      const elements = currentProject?.elements || [];
      const canvasSnapshot = canvasRef.current?.getSnapshotDataUrl() || '';
      const projId = currentProject?.id || 'proj_1';

      const studyPackage = await AIService.processWhiteboardToStudyMaterials(
        projId,
        confirmedTopic,
        elements,
        canvasSnapshot,
        targetExam,
        (stage, msg) => {
          setProcessingStage(stage);
          setProcessingMessage(msg);
        }
      );

      setGeneratedMaterials(studyPackage);
      setIsProcessing(false);

      // Record snapshot to version history
      const newVersion: VersionSnapshot = {
        id: 'ver_' + Date.now(),
        versionNumber: versions.length + 1,
        timestamp: new Date().toISOString(),
        title: confirmedTopic,
        elementsCount: elements.length,
        thumbnail: canvasSnapshot,
        elements: [...elements],
        studyPackage,
      };
      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionNumber(newVersion.versionNumber);

      // Increment Quota used if free user
      if (!isPremium) {
        setQuotaState((q) => ({
          ...q,
          generationsUsedToday: Math.min(q.dailyGenerationsAllowed, q.generationsUsedToday + 1),
        }));
      }

      const examName = targetExam ? ` for ${targetExam.name}` : '';
      showToast(`Study Materials Generated for "${confirmedTopic}"${examName}! 🎉`, 'success');
      setCurrentView('study_hub');
    } catch (err) {
      console.error(err);
      setGenerationError('AI generation encountered a timeout. You can retry with exponential backoff or use manual text.');
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        const maxW = 340;
        const aspect = img.height / (img.width || 1);
        const width = Math.min(img.width || maxW, maxW);
        const height = width * aspect;

        const newImageElement: any = {
          id: 'img_' + Date.now(),
          type: 'image',
          x: (-panOffset.x + window.innerWidth / 2 - width / 2) / (scale || 1),
          y: (-panOffset.y + window.innerHeight / 2 - height / 2) / (scale || 1),
          width,
          height,
          src: dataUrl,
          opacity: 1,
        };

        const updated = [...(currentProject?.elements || []), newImageElement];
        updateCurrentProjectElements(updated);
        showToast('Image inserted onto whiteboard! 🖼️', 'success');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSuccessActivation = () => {
    upgradeToPremium('pay_live_verified');
    setQuotaState({
      dailyGenerationsAllowed: 999999,
      generationsUsedToday: 0,
      resetHoursRemaining: 720,
      isProUser: true,
      tierName: 'Pro Scholar',
      priorityQueueActive: true,
    });
    showToast('Payment successful! Your Premium plan is now active. 👑', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Live Brush Intro Animation */}
      {showIntro && <BrushIntroScreen onComplete={() => setShowIntro(false)} />}

      {/* Global Offline Mode Status Banner */}
      <OfflineBanner />

      {/* Global Dynamic Wave Background */}
      <LiveWaveBackground />

      {/* Sticky Global Navigation */}
      <Navbar
        onOpenLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
        onOpenRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
        onOpenUpgradeModal={() => setTokensExhaustedModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {currentView === 'landing' && (
          <div>
            <HeroSection onStartWriting={handleStartWriting} />

            {/* AI Topics & Subject Expertise Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <TopicsExpertiseCard
                onSelectTopic={(selectedTopic) => {
                  createProject(selectedTopic);
                  setCurrentView('whiteboard');
                }}
              />
            </div>

            <HowItWorksSection />
            <FeaturesSection />
            <OutputsShowcase onExploreOutput={() => handleStartWriting()} />
            <BenefitsSection />
            <DemoWhiteboard />
            <LiveStudentReviewsSection />
            <FAQSection />
            <CTASection onStartWriting={handleStartWriting} />
            <Footer />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div>
            <DashboardView />
            <Footer />
          </div>
        )}

        {currentView === 'study_hub' && activeStudyMaterials && (
          <div>
            <StudyMaterialsHub packageData={activeStudyMaterials} />
            <Footer />
          </div>
        )}

        {/* Competitive Mode Hub Router */}
        {currentView === 'competitive' && (
          <div>
            <CompetitiveHubView
              onSelectExam={(examId) => {
                setSelectedExamId(examId);
                CompetitiveService.recordExamVisit(examId);
                setCurrentView('exam_detail');
              }}
              onOpenBookmarks={() => setCurrentView('bookmarks')}
            />
            <Footer />
          </div>
        )}

        {/* Exam Detail View */}
        {currentView === 'exam_detail' && selectedExam && (
          <div>
            <ExamDetailView
              exam={selectedExam}
              onBack={() => setCurrentView('competitive')}
              onSelectTopic={(topicObj) => {
                setSelectedTopic(topicObj);
                setCurrentView('topic_view');
              }}
              onStartMCQ={() => {
                setCurrentView('mcq_test');
              }}
            />
            <Footer />
          </div>
        )}

        {/* Topic Learning Detail View */}
        {currentView === 'topic_view' && selectedExam && selectedTopic && (
          <div>
            <TopicLearningView
              exam={selectedExam}
              topic={selectedTopic}
              onBack={() => setCurrentView('exam_detail')}
              onTakeMCQ={() => setCurrentView('mcq_test')}
            />
            <Footer />
          </div>
        )}

        {/* MCQ Test System View */}
        {currentView === 'mcq_test' && selectedExam && (
          <div>
            <MCQTestSystem
              exam={selectedExam}
              initialTopicId={selectedTopic?.id}
              onBack={() => setCurrentView('exam_detail')}
            />
            <Footer />
          </div>
        )}

        {/* Saved Bookmarks View */}
        {currentView === 'bookmarks' && (
          <div>
            <BookmarksView
              onBack={() => setCurrentView('competitive')}
              onSelectExam={(examId) => {
                setSelectedExamId(examId);
                setCurrentView('exam_detail');
              }}
            />
            <Footer />
          </div>
        )}

        {/* Admin Portal View */}
        {currentView === 'admin' && (
          <div>
            <AdminDashboardView />
            <Footer />
          </div>
        )}

        {currentView === 'whiteboard' && (
          <div className="relative w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden">
            {/* Top Whiteboard Control Bar with all core feature triggers */}
            <TopControlBar
              canUndo={canvasRef.current?.canUndo || false}
              canRedo={canvasRef.current?.canRedo || false}
              onUndo={() => canvasRef.current?.undo()}
              onRedo={() => canvasRef.current?.redo()}
              onOpenClearModal={() => setClearModalOpen(true)}
              onOpenAISettings={() => setAiSettingsOpen(true)}
              isRecording={isRecording}
              onToggleRecording={() => setIsRecording(!isRecording)}
              onStopAndProcess={handleStopAndProcess}
              onOpenBackgrounds={() => setBgSelectorOpen(!bgSelectorOpen)}
              onOpenExportHub={() => setExportHubOpen(true)}
              onOpenCollaboration={() => setCollaborationModalOpen(true)}
              onOpenVersionHistory={() => setVersionHistoryOpen(true)}
              onOpenLayers={() => setLayersModalOpen(true)}
              onOpenTemplates={() => setTemplatesModalOpen(true)}
              onOpenTutorial={() => setOnboardingTourOpen(true)}
              onOpenQuota={() => (isPremium ? setQuotaModalOpen(true) : setTokensExhaustedModalOpen(true))}
              onOpenCustomization={() => setOutputCustomizationOpen(true)}
              isMultiplayerActive={isMultiplayerActive}
              quotaRemaining={isPremium ? 9999 : Math.max(0, quotaState.dailyGenerationsAllowed - quotaState.generationsUsedToday)}
            />

            {/* Background Pattern Selector Popover */}
            {bgSelectorOpen && (
              <div className="absolute top-14 right-32 z-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
                <BackgroundSelector
                  currentPattern={currentProject?.backgroundPattern || 'ruled'}
                  onSelectPattern={(pat) => {
                    updateBackgroundPattern(pat);
                    setBgSelectorOpen(false);
                  }}
                />
              </div>
            )}

            {/* Whiteboard Interactive Canvas Engine */}
            <WhiteboardCanvas
              ref={canvasRef}
              elements={currentProject?.elements || []}
              onElementsChange={(els, thumb) => updateCurrentProjectElements(els, thumb)}
              backgroundPattern={currentProject?.backgroundPattern || 'ruled'}
              activeTool={activeTool}
              activePen={activePen}
              activePencil={activePencil}
              activeEraser={activeEraser}
              activeShape={activeShape}
              color={color}
              strokeWidth={strokeWidth}
              opacity={opacity}
              fontFamily={fontFamily}
              fontSize={fontSize}
              isBold={isBold}
              isItalic={isItalic}
              isUnderline={isUnderline}
              textAlign={textAlign}
              scale={scale}
              panOffset={panOffset}
              isPanMode={isPanMode}
              onPanChange={setPanOffset}
              onScaleChange={setScale}
              smoothingLevel={smoothingLevel}
              pressureEnabled={pressureEnabled}
              shapeAutoDetect={shapeAutoDetect}
              layers={layers}
              activeLayerId={activeLayerId}
              collaborators={isMultiplayerActive ? collaborators : []}
              onTelemetryUpdate={(fps, lat, count) => {
                setTelemetry((prev) => ({
                  ...prev,
                  fps,
                  drawLatencyMs: lat,
                  activeStrokesCount: count,
                }));
              }}
            />

            {/* Clean Floating Tools Dock */}
            <FloatingToolbar
              activeTool={activeTool}
              activePen={activePen}
              activePencil={activePencil}
              activeEraser={activeEraser}
              activeShape={activeShape}
              color={color}
              strokeWidth={strokeWidth}
              opacity={opacity}
              fontFamily={fontFamily}
              fontSize={fontSize}
              isBold={isBold}
              isItalic={isItalic}
              isUnderline={isUnderline}
              textAlign={textAlign}
              onSelectTool={setActiveTool}
              onSelectPen={(pen) => {
                if (pen.includes('pencil')) {
                  setActivePencil(pen as PencilType);
                  setActiveTool('pencil');
                } else if (pen === 'highlighter') {
                  setActivePen('highlighter');
                  setActiveTool('highlighter');
                } else {
                  setActivePen(pen as PenType);
                  setActiveTool('pen');
                }
              }}
              onSelectEraser={(eraser) => {
                setActiveEraser(eraser);
                setActiveTool('eraser');
              }}
              onSelectShape={setActiveShape}
              onColorChange={setColor}
              onStrokeWidthChange={setStrokeWidth}
              onOpacityChange={setOpacity}
              onFontChange={setFontFamily}
              onFontSizeChange={setFontSize}
              onBoldToggle={() => setIsBold(!isBold)}
              onItalicToggle={() => setIsItalic(!isItalic)}
              onUnderlineToggle={() => setIsUnderline(!isUnderline)}
              onAlignChange={setTextAlign}
              canUndo={canvasRef.current?.canUndo || false}
              canRedo={canvasRef.current?.canRedo || false}
              onUndo={() => canvasRef.current?.undo()}
              onRedo={() => canvasRef.current?.redo()}
              onClear={() => setClearModalOpen(true)}
              onImageUpload={handleImageUpload}
              scale={scale}
              onZoomIn={() => setScale((s) => Math.min(4, s + 0.2))}
              onZoomOut={() => setScale((s) => Math.max(0.25, s - 0.2))}
              onResetZoom={() => {
                setScale(1);
                setPanOffset({ x: 0, y: 0 });
              }}
            />

            {/* Viewport Zoom & Pan Controls */}
            <ViewControls
              scale={scale}
              isPanMode={isPanMode}
              onZoomIn={() => setScale((s) => Math.min(4, s + 0.2))}
              onZoomOut={() => setScale((s) => Math.max(0.25, s - 0.2))}
              onZoomReset={() => { setScale(1); setPanOffset({ x: 0, y: 0 }); }}
              onTogglePanMode={() => setIsPanMode(!isPanMode)}
              onToggleFullscreen={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              onOpenShortcuts={() => setShortcutsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Global Application Modals */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
      />

      <ClearBoardModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={() => canvasRef.current?.clearCanvas()}
      />

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* OCR Handwriting Pre-Recognition Review Modal */}
      <OCRReviewModal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        canvasSnapshot={canvasRef.current?.getSnapshotDataUrl() || ''}
        elements={currentProject?.elements || []}
        initialTopic={pendingTopic}
        onProceedToAI={(correctedTopic) => {
          setOcrModalOpen(false);
          setPendingTopic(correctedTopic);
          setTopicConfirmOpen(true);
        }}
      />

      {/* AI Processing Modal with Progress & Error Recovery */}
      <AIProcessingModal
        isOpen={isProcessing}
        currentStage={processingStage}
        stageMessage={processingMessage}
        isError={!!generationError}
        errorMessage={generationError || ''}
        onCancel={() => {
          setIsProcessing(false);
          setGenerationError(null);
        }}
        onRetry={() => handleConfirmTopicAndProcess(pendingTopic, selectedExam)}
        onManualFallback={() => {
          setIsProcessing(false);
          setTopicConfirmOpen(true);
        }}
      />

      <AISettingsModal
        isOpen={aiSettingsOpen}
        onClose={() => setAiSettingsOpen(false)}
      />

      <TopicConfirmModal
        isOpen={topicConfirmOpen}
        initialTopic={pendingTopic}
        initialExamId={selectedExamId}
        onClose={() => setTopicConfirmOpen(false)}
        onConfirm={handleConfirmTopicAndProcess}
      />

      {/* Export Hub Modal */}
      <ExportHubModal
        isOpen={exportHubOpen}
        onClose={() => setExportHubOpen(false)}
        studyPackage={activeStudyMaterials}
        canvasSnapshot={canvasRef.current?.getSnapshotDataUrl()}
        canvasSvgString={canvasRef.current?.getSVGString()}
      />

      {/* Output Customization Modal */}
      <OutputCustomizationModal
        isOpen={outputCustomizationOpen}
        onClose={() => setOutputCustomizationOpen(false)}
        settings={customizationSettings}
        onSaveSettings={(newSettings) => {
          setCustomizationSettings(newSettings);
          showToast('Output style & difficulty settings saved!', 'success');
        }}
      />

      {/* Multiplayer Collaboration Modal */}
      <CollaborationModal
        isOpen={collaborationModalOpen}
        onClose={() => setCollaborationModalOpen(false)}
        isMultiplayerActive={isMultiplayerActive}
        onToggleMultiplayer={setIsMultiplayerActive}
        collaborators={collaborators}
        whiteboardTitle={currentProject?.title || 'AI Whiteboard'}
      />

      {/* Version History & Rollback Modal */}
      <VersionHistoryModal
        isOpen={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        versions={versions}
        currentVersionNumber={currentVersionNumber}
        onRestoreVersion={(ver) => {
          if (currentProject) {
            updateCurrentProjectElements(ver.elements, ver.thumbnail);
            updateProjectTitle(ver.title);
            if (ver.studyPackage) {
              setGeneratedMaterials(ver.studyPackage);
            }
            setCurrentVersionNumber(ver.versionNumber);
          }
        }}
      />

      {/* Canvas Layers Modal */}
      <LayersPanelModal
        isOpen={layersModalOpen}
        onClose={() => setLayersModalOpen(false)}
        layers={layers}
        activeLayerId={activeLayerId}
        onSelectLayer={setActiveLayerId}
        onUpdateLayers={setLayers}
      />

      {/* Daily Quota & Pricing Modal */}
      <QuotaUsageModal
        isOpen={quotaModalOpen}
        onClose={() => setQuotaModalOpen(false)}
        quotaState={quotaState}
        onUpgrade={handlePaymentSuccessActivation}
      />

      {/* Dedicated Tokens Exhausted Upgrade Modal */}
      <TokensExhaustedModal
        isOpen={tokensExhaustedModalOpen}
        onClose={() => setTokensExhaustedModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccessActivation}
      />

      {/* Structured Notebook Templates Modal */}
      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onApplyTemplate={(newElements) => {
          if (currentProject) {
            updateCurrentProjectElements([...currentProject.elements, ...newElements]);
          }
        }}
      />

      {/* Interactive 30-Second Onboarding Tour */}
      <OnboardingTourModal
        isOpen={onboardingTourOpen}
        onClose={() => setOnboardingTourOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <ProjectProvider>
              <MainAppContent />
            </ProjectProvider>
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
