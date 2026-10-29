import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useSparkStore } from './store/useSparkStore';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell } from './components/app/AppShell';
import { LearnView } from './components/app/LearnView';
import { LessonPlayer } from './components/app/LessonPlayer';
import { VirtualLab } from './components/app/VirtualLab';
import { DebugDojo } from './components/app/DebugDojo';
import { MissionsView } from './components/app/MissionsView';
import { ProfileView } from './components/app/ProfileView';
import { SparkTutorDrawer } from './components/app/SparkTutorDrawer';
import { SparkMascot } from './components/mascot/SparkMascot';
import { OnboardingQuestionnaire } from './components/onboarding/OnboardingQuestionnaire';
import { NoiseOverlay } from './components/layout/NoiseOverlay';
import './index.css';

function App() {
  const {
    currentView,
    activeLessonId,
    user,
    sparkTutorOpen,
    messages,
    navigateTo,
    completeLesson,
    completeDojoCase,
    completeOnboarding,
    skipOnboarding,
    setSparkTutorOpen,
    sendSparkMessage
  } = useSparkStore();

  // Lenis smooth scroll active on landing page (matching Portfolio standard)
  useEffect(() => {
    if (currentView !== 'landing') return;

    const lenis = new Lenis({
      duration: 2.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.58,
      touchMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, [currentView]);

  // User CTA from landing page: "Launch Workspace" launches the diagnostic questionnaire
  const handleLandingStart = (view?: any, lessonId?: string) => {
    if (view === 'onboarding' || !view || view === 'learn') {
      navigateTo('onboarding');
    } else {
      navigateTo(view, lessonId);
    }
  };

  return (
    <>
      <NoiseOverlay />

      {currentView === 'landing' ? (
        /* S1 - S11: Landing Page with Hero Live Circuit, Background Frame Sequence & Story */
        <LandingPage onStartLearning={handleLandingStart} />
      ) : currentView === 'onboarding' ? (
        /* Adaptive Diagnostic Onboarding Questionnaire (PRD Section 3) */
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          position: 'relative',
        }}>
          {/* Pixel Art Ruins Atmosphere */}
          <div className="ruins-ambient-bg" />
          {/* Header */}
          <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(11, 15, 14, 0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-line)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div
              onClick={() => navigateTo('landing')}
              style={{ display: 'flex', alignItems: 'baseline', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
            >
              <span className="font-pixel" style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff', letterSpacing: '0.08em' }}>
                ENIGMA
              </span>
              <span className="font-pixel chip-tag chip-tag-signal" style={{ fontSize: '8px' }}>
                ADAPTIVE ONBOARDING
              </span>
            </div>

            <button
              onClick={skipOnboarding}
              className="btn-tactile-surface"
              style={{ fontSize: '11px', padding: '6px 14px' }}
            >
              Skip to Learning Map →
            </button>
          </header>

          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', zIndex: 1 }}>
            <OnboardingQuestionnaire
              onComplete={(answers, conceptScore, experienceScore, level, startingLessonId) => {
                completeOnboarding(answers, conceptScore, experienceScore, level, startingLessonId);
              }}
              onSkip={skipOnboarding}
            />
          </main>
        </div>
      ) : (
        /* S12+: App Shell for Students & Judges */
        <AppShell
          currentView={currentView}
          user={user}
          onNavigate={(view) => navigateTo(view)}
          onOpenSparkTutor={() => setSparkTutorOpen(true)}
        >
          {currentView === 'learn' && (
            <LearnView
              user={user}
              onSelectLesson={(id) => navigateTo('lesson', id)}
              onOpenOnboarding={() => navigateTo('onboarding')}
            />
          )}

          {currentView === 'lesson' && (
            <LessonPlayer
              lessonId={activeLessonId}
              onComplete={(id) => completeLesson(id)}
              onExit={() => navigateTo('learn')}
              onAskSpark={() => setSparkTutorOpen(true)}
            />
          )}

          {currentView === 'lab' && <VirtualLab />}

          {currentView === 'dojo' && (
            <DebugDojo
              onCaseSolved={(id) => completeDojoCase(id)}
              onAskSpark={() => setSparkTutorOpen(true)}
            />
          )}

          {currentView === 'missions' && (
            <MissionsView onMissionCompleted={() => {}} />
          )}

          {currentView === 'profile' && (
            <ProfileView
              user={user}
              onNavigateToLesson={(id) => navigateTo('lesson', id)}
            />
          )}
        </AppShell>
      )}

      {/* Interactive Mascot — Spark (PRD Section 8) */}
      {currentView !== 'landing' && (
        <SparkMascot
          user={user}
          currentLessonId={currentView === 'lesson' ? activeLessonId : undefined}
          onOpenSparkTutor={(prompt?: string) => {
            setSparkTutorOpen(true);
            if (prompt) {
              sendSparkMessage(prompt);
            }
          }}
        />
      )}

      {/* Persistent Floating Spark AI Tutor Drawer (PRD Section 14) */}
      <SparkTutorDrawer
        isOpen={sparkTutorOpen}
        onClose={() => setSparkTutorOpen(false)}
        messages={messages}
        onSendMessage={sendSparkMessage}
        currentContextHint={currentView === 'lesson' ? `LESSON: ${activeLessonId}` : currentView.toUpperCase()}
      />
    </>
  );
}

export default App;
