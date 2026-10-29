import type { ReactNode } from 'react';
import { Compass, Cpu, Bug, Target, User, Sparkles } from 'lucide-react';
import type { AppView, SparkUserState } from '../../store/useSparkStore';

interface AppShellProps {
  currentView: AppView;
  user: SparkUserState;
  onNavigate: (view: AppView) => void;
  onOpenSparkTutor: () => void;
  children: ReactNode;
}

export const AppShell = ({
  currentView,
  user,
  onNavigate,
  onOpenSparkTutor,
  children
}: AppShellProps) => {
  const navItems = [
    { view: 'learn' as AppView, label: 'Journey', icon: Compass },
    { view: 'onboarding' as AppView, label: 'Diagnostic Quiz', icon: Sparkles },
    { view: 'lab' as AppView, label: 'Virtual Lab', icon: Cpu },
    { view: 'dojo' as AppView, label: 'Debug Dojo', icon: Bug },
    { view: 'missions' as AppView, label: 'Missions', icon: Target },
    { view: 'profile' as AppView, label: 'Profile', icon: User },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      color: 'var(--color-text)'
    }}>
      {/* Top Stats Bar (PRD Section 7) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 15, 14, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-line)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Wordmark (Logo removed per user instruction) */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'baseline', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
        >
          <span
            className="font-pixel"
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: '#ffffff',
              letterSpacing: '0.08em',
            }}
          >
            ENIGMA
          </span>
          <span className="font-pixel chip-tag chip-tag-signal hidden sm:inline" style={{ fontSize: '8px' }}>
            SMART ENTC
          </span>
        </div>

        {/* Gamification Stats: Streak, XP, Level, Daily Goal (PRD 7 & 16) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          {/* Streak LED */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            padding: '5px 10px',
            borderRadius: '6px'
          }}>
            <span className="streak-flame" />
            <span style={{ color: 'var(--color-amber)', fontWeight: 700 }}>{user.streak} DAYS</span>
          </div>

          {/* XP & Level Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            padding: '5px 12px',
            borderRadius: '6px'
          }}>
            <span style={{ color: 'var(--color-muted)' }}>LVL:</span>
            <span style={{ color: 'var(--color-signal)', fontWeight: 800 }}>{user.level.toUpperCase()}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{user.xp} XP</span>
          </div>

          {/* Onboarding Diagnostic Quiz Button */}
          <button
            onClick={() => onNavigate('onboarding')}
            className="btn-tactile-surface hidden sm:flex"
            style={{
              fontSize: '11px',
              padding: '5px 10px',
              alignItems: 'center',
              gap: '6px',
              borderColor: user.onboarding?.completed ? 'var(--color-signal)' : 'var(--color-amber)',
              color: user.onboarding?.completed ? 'var(--color-signal)' : 'var(--color-amber)'
            }}
            title="Take or retake the 6-question diagnostic questionnaire"
          >
            <Sparkles size={12} />
            <span>{user.onboarding?.completed ? `LEVEL: ${(user.onboarding.selectedLevel || user.onboarding.recommendedLevel || 'Beginner').toUpperCase()}` : 'TAKE DIAGNOSTIC'}</span>
          </button>

          {/* Quick Exit to Landing */}
          <button
            onClick={() => onNavigate('landing')}
            className="btn-tactile-surface"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            Landing
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Navigation */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Left Rail (Desktop) */}
        <aside style={{
          width: '220px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-line)',
          padding: '20px 12px',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }} className="md:flex">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#071911' : 'var(--color-muted)',
                    background: isActive ? 'var(--color-signal)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Concept Card Preview */}
          <div style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-line)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ color: 'var(--color-signal)', fontWeight: 700, marginBottom: '4px' }}>
              // CONCEPT OF THE DAY
            </div>
            <div style={{ color: '#ffffff', fontWeight: 600 }}>Pull-Down Resistor</div>
            <div style={{ color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Ties floating inputs to 0V ground to prevent induced RF false triggers.
            </div>
          </div>
        </aside>

        {/* Main Routed Content Area */}
        <main style={{ flex: 1, paddingBottom: '70px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      {/* Floating Spark AI Tutor Button (PRD 7 & 14.1) */}
      <button
        onClick={onOpenSparkTutor}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 250,
          background: 'linear-gradient(135deg, #173d4c 0%, #0c2334 100%)',
          color: 'var(--color-cyan)',
          border: '1px solid var(--color-cyan)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 16px rgba(92, 200, 255, 0.3)',
          borderRadius: '999px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        <Sparkles size={16} />
        <span>Ask Spark AI</span>
      </button>

      {/* Mobile Bottom Navigation Bar (PRD Section 7) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(17, 24, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-line)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 4px',
        zIndex: 90
      }} className="md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--color-signal)' : 'var(--color-muted)',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                padding: '4px 8px'
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

