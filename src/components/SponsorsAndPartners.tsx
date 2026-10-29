import { SPONSORS } from '../data/symposiumData';

export const SponsorsAndPartners = () => {
  return (
    <section
      style={{
        padding: '80px 24px',
        background: 'var(--bg-surface-2)',
        borderTop: '1px solid var(--line-soft)',
        borderBottom: '1px solid var(--line-soft)',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="pixel-badge pixel-badge-teal">
            ECOSYSTEM ALLIANCE // INDUSTRY & ACADEMIA
          </span>
        </div>

        <h3 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: 'var(--ink-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '36px'
        }}>
          SUPPORTED BY SILICON LEADERS & TECHNICAL SOCIETIES
        </h3>

        {/* Sponsor Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {SPONSORS.map((s) => (
            <div
              key={s.name}
              className="ditto-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid var(--line-soft)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: 'var(--screen-bg)'
              }}>
                [{s.logo}]
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--ink-primary)'
              }}>
                {s.name}
              </div>

              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink-faint)'
              }}>
                {s.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

