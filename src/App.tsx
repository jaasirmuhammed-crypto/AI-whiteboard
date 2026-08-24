import React, { useState, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './components/common/Toast';
import { ProjectProvider, useProject } from './context/ProjectContext';

import { LiveWaveBackground } from './components/common/LiveWaveBackground';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

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

// AI Modals
import { AIProcessingModal } from './components/ai/AIProcessingModal';
import { AISettingsModal } from './components/ai/AISettingsModal';
import { TopicConfirmModal } from './components/ai/TopicConfirmModal';

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
import { ToolType, PenType, PencilType, EraserType, ShapeType } from './types/whiteboard';
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

  // Recording State
  const [isRecording, setIsRecording] = useState(false);

  // Popover / Modal visibility
  const [bgSelectorOpen, setBgSelectorOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  // AI Generation State
  const [topicConfirmOpen, setTopicConfirmOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(1);
  const [processingMessage, setProcessingMessage] = useState('');

  // Competitive Router State
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const selectedExam = selectedExamId ? CompetitiveService.getExamById(selectedExamId) : null;

  // Whiteboard workflow triggers
  const handleStartWriting = () => {
    if (!currentProject) {
      createProject();
    } else {
      setCurrentView('whiteboard');
    }
  };

  const handleStopAndProcess = () => {
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
    setTopicConfirmOpen(true);
  };

  const handleConfirmTopicAndProcess = async (confirmedTopic: string, targetExam?: Exam | null) => {
    setTopicConfirmOpen(false);
    updateProjectTitle(confirmedTopic);
    setIsProcessing(true);
    setProcessingStage(1);
    setProcessingMessage('Capturing whiteboard notes...');

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
      const examName = targetExam ? ` for ${targetExam.name}` : '';
      showToast(`Study Materials Generated for "${confirmedTopic}"${examName}! 🎉`, 'success');
      setCurrentView('study_hub');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      showToast('AI Processing failed. Please try again.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Live Animated Flowing Energy Wave Background with Cursor Bending */}
      <LiveWaveBackground />

      {/* Sticky Global Navigation */}
      <Navbar
        onOpenLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
        onOpenRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {currentView === 'landing' && (
          <div>
            <HeroSection onStartWriting={handleStartWriting} />
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
            {/* Top Whiteboard Control Bar */}
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
            />

            {/* Floating Tools Dock */}
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

      <AIProcessingModal
        isOpen={isProcessing}
        currentStage={processingStage}
        stageMessage={processingMessage}
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
