import { Navigation, Plane, Train, Bus } from 'lucide-react';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';

export const FooterAndVenue = () => {
  return (
    <footer
      style={{
        background: '#071622',
        color: '#e9f7f3',
        borderTop: '1px solid #1f4763',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle CRT pattern */}
      <div className="bg-grid-screen" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      {/* Main Venue Section */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '90px 24px 60px',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Left Column: Venue & Address */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="beacon-dot" />
              <span className="pixel-badge pixel-badge-teal">
                CAMPUS LOCATOR // VENUE
              </span>
            </div>

            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              CHAKRAVYUH 2026 ARENA
            </h3>

            <p style={{ fontSize: '15px', color: '#c5e0d7', lineHeight: 1.6, marginBottom: '20px' }}>
              Department of Electronics & Telecommunication Engineering<br />
              Academic Complex & Central Auditorium<br />
              Pune – 411038, Maharashtra, India
            </p>

            <div style={{
              background: 'rgba(12, 35, 52, 0.75)',
              border: '1px solid #1f4763',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '11px', color: '#7fa6a8', fontFamily: 'var(--font-mono)' }}>HELPDESK HOTLINES</div>
              <div style={{ fontSize: '15px', color: '#6fe9e2', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {SYMPOSIUM_CONFIG.helpdesk}
              </div>
              <div style={{ fontSize: '12px', color: '#7fa6a8', marginTop: '4px' }}>
                Email: {SYMPOSIUM_CONFIG.contactEmail}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-tactile-primary"
                style={{ fontSize: '13px', padding: '10px 18px' }}
              >
                <Navigation size={15} />
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
            </div>
          </div>

          {/* Right Column: Transit Options */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Navigation size={18} color="#14b3ad" />
              <span>Transit & Commute Directions</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid #1f4763',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                gap: '14px'
              }}>
                <Plane size={20} color="#14b3ad" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>By Air (Pune International Airport - PNQ)</div>
                  <div style={{ fontSize: '13px', color: '#7fa6a8', marginTop: '2px' }}>
                    14 km from campus. Prepaid airport cabs and AC metro feeder buses available directly to the university north gate.
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid #1f4763',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                gap: '14px'
              }}>
                <Train size={20} color="#f0ac1b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>By Train (Pune Junction / Shivajinagar)</div>
                  <div style={{ fontSize: '13px', color: '#7fa6a8', marginTop: '2px' }}>
                    8 km from campus. Direct local trains & Metro Purple Line connect from railway station to College Metro Hub (Gate 3).
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid #1f4763',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                gap: '14px'
              }}>
                <Bus size={20} color="#6fe9e2" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>By Road / Interstate Bus</div>
                  <div style={{ fontSize: '13px', color: '#7fa6a8', marginTop: '2px' }}>
                    Swargate and Shivaji Nagar ST depots connect buses from Mumbai, Nashik, Kolhapur, and Bangalore.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint Arena Layout Schematic */}
        <div style={{
          background: '#091d2d',
          border: '1px dashed #1f4763',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '50px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6fe9e2', fontWeight: 700 }}>
              // ARENA BLUEPRINT SCHEMATIC
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7fa6a8' }}>
              GRID_SCALE: 1:100 // GROUND LEVEL
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ background: '#0c2334', border: '1px solid #1f4763', borderRadius: '8px', padding: '14px' }}>
              <div style={{ color: '#14b3ad', fontWeight: 700, fontSize: '13px' }}>ZONE A: AUDITORIUM</div>
              <div style={{ fontSize: '11px', color: '#7fa6a8', marginTop: '2px' }}>Keynotes, Paper Expo & Grand Finale</div>
            </div>
            <div style={{ background: '#0c2334', border: '1px solid #1f4763', borderRadius: '8px', padding: '14px' }}>
              <div style={{ color: '#f0ac1b', fontWeight: 700, fontSize: '13px' }}>ZONE B: ROBOTICS ARENA</div>
              <div style={{ fontSize: '11px', color: '#7fa6a8', marginTop: '2px' }}>Robo-Kshethra Time Trials & Maze Track</div>
            </div>
            <div style={{ background: '#0c2334', border: '1px solid #1f4763', borderRadius: '8px', padding: '14px' }}>
              <div style={{ color: '#6fe9e2', fontWeight: 700, fontSize: '13px' }}>ZONE C: HARDWARE LABS</div>
              <div style={{ fontSize: '11px', color: '#7fa6a8', marginTop: '2px' }}>Silicon Matrix, Circuit Bug Hunt & DSOs</div>
            </div>
            <div style={{ background: '#0c2334', border: '1px solid #1f4763', borderRadius: '8px', padding: '14px' }}>
              <div style={{ color: '#ef5f5f', fontWeight: 700, fontSize: '13px' }}>ZONE D: COMPUTING LABS</div>
              <div style={{ fontSize: '11px', color: '#7fa6a8', marginTop: '2px' }}>24h AI Vibe Hackathon & UI Pulse</div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Git Repository */}
        <div style={{
          paddingTop: '30px',
          borderTop: '1px solid #1f4763',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#7fa6a8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>CHAKRAVYUH 2026 // ALL RIGHTS RESERVED</span>
            <span>•</span>
            <span>DEPT. OF E&TC</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://github.com/xlord101/chakravyuh-404-T123"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#6fe9e2',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>xlord101 / chakravyuh-404-T123</span>
            </a>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#e9f7f3' }}>
              <span>CRAFTED BY</span>
              <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px', padding: '2px 6px' }}>
                TEAM 404
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
