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

  return (
    <>
      <NoiseOverlay />
      {currentView === 'landing' ? (
        /* S1 - S11: Landing Page with Hero Live Circuit, Background Frame Sequence & Story */
        <LandingPage onStartLearning={(view, lessonId) => navigateTo(view || 'learn', lessonId)} />
      ) : (
        /* S12+: App Shell for Students & Judges */
        <AppShell
          currentView={currentView}
          user={user}
          onNavigate={(view) => navigateTo(view)}
          onOpenSparkTutor={() => setSparkTutorOpen(true)}
        >
          {currentView === 'learn' && (
            <LearnView user={user} onSelectLesson={(id) => navigateTo('lesson', id)} />
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

          {currentView === 'profile' && <ProfileView user={user} />}
        </AppShell>
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
