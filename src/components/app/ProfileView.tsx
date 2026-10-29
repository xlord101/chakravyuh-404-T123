import { Download } from 'lucide-react';
import type { SparkUserState } from '../../store/useSparkStore';

interface ProfileViewProps {
  user: SparkUserState;
}

export const ProfileView = ({ user }: ProfileViewProps) => {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sparkpath_progress_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const skillMastery = [
    { skill: 'Digital Logic & Gate Synthesis', mastery: 85, color: 'var(--color-signal)' },
    { skill: 'Circuit Forensics & DMM Probing', mastery: 70, color: 'var(--color-fault)' },
    { skill: 'Embedded Arduino & Firmware', mastery: 55, color: 'var(--color-amber)' },
    { skill: 'Signal Analysis & FFT Filtering', mastery: 40, color: 'var(--color-cyan)' },
  ];

  const badges = [
    { title: 'First Light', desc: 'Lit your first virtual LED circuit', icon: '💡', earned: user.unlockedBadges.includes('First Light') },
    { title: 'Gate Keeper', desc: 'Completed the Digital Logic Track', icon: '⚡', earned: user.unlockedBadges.includes('Gate Keeper') },
    { title: 'Bug Hunter', desc: 'Repaired faults in the Debug Dojo', icon: '🐞', earned: user.unlockedBadges.includes('Bug Hunter') },
    { title: 'Signal Sage', desc: 'Mastered waveforms & low-pass filtering', icon: '🌊', earned: false },
    { title: 'Night Owl', desc: 'Solved an embedded bug past midnight', icon: '🦉', earned: true },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Profile Header Card */}
      <div className="pcb-card" style={{ padding: '32px', marginBottom: '28px' }}>
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
              background: 'rgba(124, 255, 178, 0.15)',
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
                <span className="chip-tag chip-tag-signal">STUDENT</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                ENTC LEVEL: <strong style={{ color: 'var(--color-signal)' }}>{user.level.toUpperCase()}</strong> • {user.xp} TOTAL XP
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

      {/* Grid: Skill Map & Streak Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Skill Map (PRD 15.1) */}
        <div className="pcb-card" style={{ padding: '24px' }}>
          <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '14px' }}>CONCEPT MASTERY</span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '18px' }}>
            ENTC Skill Map
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

        {/* Streak Calendar LED Grid (PRD 15.1 & 16.2) */}
        <div className="pcb-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="chip-tag chip-tag-amber">STREAK GRID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', fontWeight: 700 }}>
              <span className="streak-flame" />
              <span>{user.streak} DAYS ACTIVE</span>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            October 2026 Activity
          </h3>

          {/* 30 Day LED Dot Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            background: '#07100D',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--color-line)'
          }}>
            {Array.from({ length: 28 }).map((_, i) => {
              const isLit = i >= 24 && i <= 27; // Last 4 days active
              return (
                <div
                  key={i}
                  style={{
                    height: '24px',
                    borderRadius: '4px',
                    background: isLit ? 'var(--color-amber)' : 'var(--color-surface-2)',
                    boxShadow: isLit ? '0 0 10px var(--color-amber)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    color: isLit ? '#000000' : 'var(--color-muted)',
                    fontWeight: 700
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges Showcase (PRD 16.3) */}
      <div className="pcb-card" style={{ padding: '28px' }}>
        <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>AWARDS & TROPHIES</span>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '18px' }}>
          Earned Silicon Badges
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {badges.map((b) => (
            <div
              key={b.title}
              style={{
                background: b.earned ? 'var(--color-surface-2)' : '#07100D',
                border: `1px solid ${b.earned ? 'var(--color-signal)' : 'var(--color-line)'}`,
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
                opacity: b.earned ? 1 : 0.4
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{b.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>{b.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

