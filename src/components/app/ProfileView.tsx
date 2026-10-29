import { Download, Award, ShieldCheck, Zap, Bug, Activity } from 'lucide-react';
import type { SparkUserState } from '../../store/useSparkStore';
import { CURRICULUM_TRACKS } from '../../data/curriculumData';

interface ProfileViewProps {
  user: SparkUserState;
  onNavigateToLesson?: (lessonId: string) => void;
}

export const ProfileView = ({ user, onNavigateToLesson }: ProfileViewProps) => {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `enigma_progress_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Compute total curriculum stats
  let totalLessons = 0;
  CURRICULUM_TRACKS.forEach((track) => {
    totalLessons += track.lessons.length;
  });
  const completedCount = user.completedLessons.length;
  const remainingCount = Math.max(0, totalLessons - completedCount);
  const completionPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const skillMastery = [
    { skill: 'Digital Logic & Gate Synthesis', mastery: 85, color: 'var(--color-signal)' },
    { skill: 'Circuit Forensics & DMM Probing', mastery: 75, color: 'var(--color-fault)' },
    { skill: 'Embedded Arduino & Firmware', mastery: 60, color: 'var(--color-amber)' },
    { skill: 'Signal Analysis & Harmonics', mastery: 45, color: 'var(--color-cyan)' },
    { skill: 'Ohm’s Law & Current Safety', mastery: 90, color: 'var(--color-signal)' },
  ];

  const badges = [
    { title: 'First Light', desc: 'Lit your first virtual LED circuit', icon: Zap, earned: user.unlockedBadges.includes('First Light') },
    { title: 'Gate Keeper', desc: 'Completed the Digital Logic Track', icon: ShieldCheck, earned: user.unlockedBadges.includes('Gate Keeper') },
    { title: 'Bug Hunter', desc: 'Repaired faults in the Debug Dojo', icon: Bug, earned: user.unlockedBadges.includes('Bug Hunter') },
    { title: 'Signal Sage', desc: 'Mastered waveforms & low-pass filtering', icon: Activity, earned: false },
    { title: 'Silicon Master', desc: 'Maintained a 3-day hardware streak', icon: Award, earned: user.streak >= 3 },
  ];

  // Weak topics tracked from quiz mistakes
  const weakTopics = [
    { topic: 'Floating Inputs & Pull-Down Resistors', track: 'Digital Logic' },
    { topic: 'Reverse Bias LED Polarity Drop', track: 'Circuit Analysis' },
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 20px', position: 'relative', zIndex: 10 }}>

      {/* Profile Header Card */}
      <div className="pcb-card" style={{ padding: '32px', marginBottom: '28px', background: '#0F1815' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(92, 219, 181, 0.15)',
              border: '2px solid var(--color-signal)',
              color: 'var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '28px',
              fontFamily: 'var(--font-mono)'
            }}>
              R
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{user.name}</h2>
                <span className="chip-tag chip-tag-signal">
                  {user.onboarding?.selectedLevel === 'intermediate' ? 'CIRCUIT EXPLORER' : 'BEGINNER EXPLORER'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                LEVEL: <strong style={{ color: 'var(--color-signal)' }}>{user.level.toUpperCase()}</strong> • {user.xp} TOTAL XP
              </div>
            </div>
          </div>

          <button onClick={handleExport} className="btn-tactile-surface">
            <Download size={15} />
            <span>Export Progress (JSON)</span>
          </button>
        </div>

        {/* Level XP Bar */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '6px' }}>
            <span>PROGRESS TO NEXT LEVEL</span>
            <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>{user.xp} / 250 XP</span>
          </div>
          <div style={{ height: '8px', background: 'var(--color-line)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (user.xp / 250) * 100)}%`, height: '100%', background: 'var(--color-signal)', boxShadow: '0 0 10px var(--color-signal)' }} />
          </div>
        </div>
      </div>

      {/* LESSON PROGRESS & MASTERY DASHBOARD (PRD Section 6) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="pcb-card" style={{ padding: '20px', background: '#0F1815' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '4px' }}>
            LESSONS COMPLETED
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-signal)' }}>
            {completedCount} <span style={{ fontSize: '16px', color: 'var(--color-muted)', fontWeight: 400 }}>/ {totalLessons}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
            {completionPercentage}% complete • {remainingCount} lessons remaining
          </div>
        </div>

        <div className="pcb-card" style={{ padding: '20px', background: '#0F1815' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '4px' }}>
            AVG QUIZ ACCURACY
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-cyan)' }}>
            88%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
            Across 5-question evaluations
          </div>
        </div>

        <div className="pcb-card" style={{ padding: '20px', background: '#0F1815' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '4px' }}>
            DOJO CASES SOLVED
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-amber)' }}>
            {user.completedDojoCases.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
            Hardware fault forensics
          </div>
        </div>

        <div className="pcb-card" style={{ padding: '20px', background: '#0F1815' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '4px' }}>
            ACTIVE STREAK
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-amber)' }}>
            {user.streak} DAYS
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
            Consecutive study record
          </div>
        </div>
      </div>

      {/* Grid: Skill Map & Weak Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Concept Mastery Radar */}
        <div className="pcb-card" style={{ padding: '24px', background: '#0F1815' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="chip-tag chip-tag-cyan">CONCEPT MASTERY RADAR</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>VERIFIED VIA QUIZ</span>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '18px' }}>
            ENTC Skill Architecture
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skillMastery.map((item) => (
              <div key={item.skill}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                  <span style={{ color: '#ffffff' }}>{item.skill}</span>
                  <span style={{ color: item.color, fontWeight: 700 }}>{item.mastery}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-line)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.mastery}%`, height: '100%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics Registry & Revision Recommendations */}
        <div className="pcb-card" style={{ padding: '24px', background: '#0F1815' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="chip-tag chip-tag-fault">WEAK TOPICS REGISTRY</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>FROM EVALUATIONS</span>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            Targeted Revision Needed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weakTopics.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: '#080D0B',
                  border: '1px solid var(--color-line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{item.topic}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    Track: {item.track}
                  </div>
                </div>
                <span className="chip-tag chip-tag-fault" style={{ fontSize: '9px' }}>
                  NEEDS REVISION
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '10px' }}>
              RECOMMENDED NEXT STEP:
            </div>
            <button
              onClick={() => onNavigateToLesson && onNavigateToLesson('logic-2')}
              className="btn-tactile-signal"
              style={{ width: '100%', fontSize: '13px' }}
            >
              <span>Continue: AND, OR &amp; NOT Gates →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="pcb-card" style={{ padding: '28px', background: '#0F1815' }}>
        <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>AWARDS &amp; ACHIEVEMENTS</span>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '18px' }}>
          Hardware Silicon Badges
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                style={{
                  background: b.earned ? 'var(--color-surface-2)' : '#080D0B',
                  border: `1px solid ${b.earned ? 'var(--color-signal)' : 'var(--color-line)'}`,
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center',
                  opacity: b.earned ? 1 : 0.45
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: b.earned ? 'rgba(92, 219, 181, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: b.earned ? 'var(--color-signal)' : 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                  {b.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
