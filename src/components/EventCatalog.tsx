import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Search, ArrowRight, Sparkles, Info } from 'lucide-react';
import { SYMPOSIUM_EVENTS } from '../data/symposiumData';
import type { EventItem } from '../data/symposiumData';
import { EventModal } from './EventModal';

interface EventCatalogProps {
  onSelectEventForRegistration: (eventId: string) => void;
}

export const EventCatalog = ({ onSelectEventForRegistration }: EventCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);

  const categories = [
    { key: 'all', label: 'All Events (6)' },
    { key: 'robotics', label: 'Robotics' },
    { key: 'circuits', label: 'Circuits & VLSI' },
    { key: 'hackathon', label: 'AI & Hackathon' },
    { key: 'paper', label: 'Paper & Expo' },
    { key: 'nontech', label: 'Non-Tech Glitch' },
  ];

  const filteredEvents = useMemo(() => {
    return SYMPOSIUM_EVENTS.filter((e) => {
      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleRegister = (eventId: string) => {
    setModalEvent(null);
    onSelectEventForRegistration(eventId);
    const passElem = document.getElementById('passes');
    if (passElem) {
      passElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="events"
      style={{
        padding: '100px 24px',
        background: 'var(--bg-page)',
        position: 'relative'
      }}
    >
      {/* Background Grid Pattern */}
      <div className="bg-grid-light" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="beacon-dot" />
            <span className="pixel-badge pixel-badge-teal">
              COMPETITION MATRIX // 12+ TRACKS
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            color: 'var(--ink-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            FLAGSHIP TECHNICAL ARENAS
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'var(--ink-secondary)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            From autonomous line bots and precision circuit diagnostics to 24-hour AI hacks. Compete against top engineering talent nationwide for ₹1,00,000+ in bounties.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--line-soft)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '36px',
          boxShadow: '0 4px 16px rgba(12, 35, 52, 0.04)'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: selectedCategory === cat.key ? 700 : 500,
                  color: selectedCategory === cat.key ? '#ffffff' : 'var(--ink-secondary)',
                  background: selectedCategory === cat.key ? 'var(--screen-bg)' : 'var(--bg-surface-2)',
                  border: selectedCategory === cat.key ? '1px solid var(--screen-bg)' : '1px solid var(--line-soft)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            minWidth: '260px',
            flex: '1',
            maxWidth: '360px'
          }}>
            <Search size={16} color="#7fa6a8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search competitions, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid var(--line-soft)',
                background: 'var(--bg-surface-2)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--ink-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="ditto-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Strip */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: event.accentColor
              }} />

              <div>
                {/* Badge Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px' }}>
                    {event.categoryLabel}
                  </span>
                  <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px' }}>
                    {event.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--ink-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '8px'
                }}>
                  {event.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: 'var(--ink-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {event.tagline}
                </p>

                {/* Specs Chips */}
                <div style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={16} color="#f0ac1b" />
                    <div>
                      <div style={{ fontSize: '9px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>PRIZE POOL</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0e2a3d' }}>{event.prizePool}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#14b3ad" />
                    <div>
                      <div style={{ fontSize: '9px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>TEAM SIZE</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0e2a3d' }}>{event.teamSize}</div>
                    </div>
                  </div>
                </div>

                {/* Timing & Venue */}
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-faint)',
                  marginBottom: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div><strong style={{ color: 'var(--ink-primary)' }}>SCHEDULE:</strong> {event.date} • {event.time}</div>
                  <div><strong style={{ color: 'var(--ink-primary)' }}>VENUE:</strong> {event.venue}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--line-soft)' }}>
                <button
                  onClick={() => setModalEvent(event)}
                  style={{
                    flex: '1',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--line-soft)',
                    color: 'var(--ink-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-teal)';
                    e.currentTarget.style.background = '#eef7f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line-soft)';
                    e.currentTarget.style.background = 'var(--bg-surface-2)';
                  }}
                >
                  <Info size={14} />
                  <span>RULES & ROUNDS</span>
                </button>

                <button
                  onClick={() => handleRegister(event.id)}
                  className="btn-tactile-primary"
                  style={{
                    padding: '10px 16px',
                    fontSize: '12px'
                  }}
                >
                  <span>REGISTER</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div style={{
          marginTop: '48px',
          background: 'var(--screen-bg)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#e9f7f3',
          border: '1px solid var(--line-screen)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="beacon-dot" />
              <span className="pixel-badge pixel-badge-teal">
                ALL-IN-ONE REGISTRATION
              </span>
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
              Want to compete in multiple events or bring your full college squad?
            </h4>
            <p style={{ fontSize: '14px', color: '#7fa6a8', marginTop: '4px' }}>
              Get our All-Access VIP Pass or Team Pass with combo discounts and official kits.
            </p>
          </div>

          <a href="#passes" className="btn-tactile-gold">
            <Sparkles size={16} />
            <span>VIEW DELEGATE PASS TIERS →</span>
          </a>
        </div>
      </div>

      {/* Modal Popup */}
      <EventModal
        event={modalEvent}
        onClose={() => setModalEvent(null)}
        onRegisterClick={handleRegister}
      />
    </section>
  );
};
