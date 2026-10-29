import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Sparkles, Ticket } from 'lucide-react';
import { LiveCountdown } from './LiveCountdown';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '3D Hardware', href: '#hardware-hero' },
    { label: 'Events & Tracks', href: '#events' },
    { label: 'Timeline', href: '#schedule' },
    { label: 'Passes', href: '#passes' },
    { label: 'E&TC Dept', href: '#department' },
    { label: 'FAQs & Venue', href: '#faqs' },
  ];

  return (
    <>
      {/* Top Telemetry Strip */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 101,
        background: '#081926',
        borderBottom: '1px solid #1f4763',
        padding: '6px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#7fa6a8',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="beacon-dot" />
          <span style={{ color: '#6fe9e2', fontWeight: 600 }}>SYS_STATUS: ONLINE</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span className="hidden sm:inline">
            E&TC NATIONAL TECHNICAL SYMPOSIUM
          </span>
          <span style={{ opacity: 0.4 }} className="hidden sm:inline">|</span>
          <span style={{ color: '#f0ac1b' }}>PRIZE POOL: ₹1,00,000+</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#e9f7f3' }}>OCT 29–31, 2026</span>
          <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px', padding: '2px 6px' }}>
            TEAM 404
          </span>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: '32px',
          left: 0,
          width: '100%',
          zIndex: 100,
          padding: isScrolled ? '10px 24px' : '16px 32px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isScrolled ? 'rgba(12, 35, 52, 0.88)' : 'rgba(12, 35, 52, 0.65)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(197, 224, 215, 0.12)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none'
        }}
      >
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Logo & Branding */}
          <a
            href="#hardware-hero"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ffffff',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #14b3ad 0%, #0c8a86 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0c2334',
              boxShadow: '0 2px 8px rgba(20, 179, 173, 0.35)'
            }}>
              <Cpu size={20} strokeWidth={2.5} />
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 900,
                  fontSize: '20px',
                  letterSpacing: '-0.03em',
                  color: '#e9f7f3',
                  lineHeight: 1
                }}>
                  CHAKRAVYUH
                </span>
                <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px' }}>
                  2026
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#7fa6a8',
                letterSpacing: '0.06em',
                marginTop: '3px'
              }}>
                DEPT. OF E&TC // NATL SYMPOSIUM
              </div>
            </div>
          </a>

          {/* Center Navigation Links - Desktop */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 500,
            color: '#c5e0d7'
          }}
          className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: '#c5e0d7',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6fe9e2';
                  e.currentTarget.style.background = 'rgba(111, 233, 226, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#c5e0d7';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action & Countdown (Desktop) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-actions">
            <LiveCountdown />

            <a
              href="#passes"
              className="btn-tactile-primary"
              style={{
                textDecoration: 'none',
                padding: '10px 18px',
                fontSize: '13px'
              }}
            >
              <Ticket size={16} />
              <span>GET PASS</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-toggle">
            <a
              href="#passes"
              className="btn-tactile-primary"
              style={{
                textDecoration: 'none',
                padding: '8px 14px',
                fontSize: '12px'
              }}
            >
              <Ticket size={14} />
              <span>PASS</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid #1f4763',
                borderRadius: '8px',
                color: '#e9f7f3',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '90px',
              left: '12px',
              right: '12px',
              zIndex: 99,
              background: '#0c2334',
              border: '1px solid #1f4763',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              color: '#e9f7f3'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <LiveCountdown />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: '#c5e0d7',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(31, 71, 99, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: '#14b3ad', fontSize: '12px' }}>→</span>
                </a>
              ))}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1f4763' }}>
              <a
                href="#passes"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-tactile-gold"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                <Sparkles size={16} />
                <span>REGISTER FOR CHAKRAVYUH 2026</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
