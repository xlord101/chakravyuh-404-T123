import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Users, Clock, MapPin, Phone, ShieldCheck, CheckCircle2, Ticket } from 'lucide-react';
import type { EventItem } from '../data/symposiumData';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegisterClick: (eventId: string) => void;
}

export const EventModal = ({ event, onClose, onRegisterClick }: EventModalProps) => {
  const [activeTab, setActiveTab] = useState<'rounds' | 'rules' | 'coordinators'>('rounds');

  if (!event) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(7, 22, 34, 0.8)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: '#ffffff',
            border: '2px solid #14b3ad',
            borderRadius: '20px',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(12, 35, 52, 0.35)',
            color: '#0e2a3d',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0c2334 0%, #0e2a3d 100%)',
            padding: '28px 32px 20px',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
            color: '#e9f7f3',
            position: 'relative'
          }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #1f4763',
                borderRadius: '8px',
                color: '#e9f7f3',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px' }}>
                {event.categoryLabel}
              </span>
              <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px' }}>
                {event.badge}
              </span>
            </div>

            <h2 style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '6px',
              color: '#ffffff'
            }}>
              {event.title}
            </h2>

            <p style={{ fontSize: '14px', color: '#7fa6a8', lineHeight: 1.5 }}>
              {event.tagline}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            background: '#eef7f1',
            borderBottom: '1px solid #c5e0d7',
            padding: '14px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={16} color="#f0ac1b" />
              <div>
                <div style={{ fontSize: '10px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>PRIZE POOL</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0e2a3d' }}>{event.prizePool}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#14b3ad" />
              <div>
                <div style={{ fontSize: '10px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>TEAM SIZE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0e2a3d' }}>{event.teamSize}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#0c8a86" />
              <div>
                <div style={{ fontSize: '10px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>TIMING</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0e2a3d' }}>{event.time}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#ef5f5f" />
              <div>
                <div style={{ fontSize: '10px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>VENUE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0e2a3d' }}>{event.venue}</div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: '24px 28px' }}>
            <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#0c8a86', letterSpacing: '0.06em', marginBottom: '8px' }}>
              // EVENT OVERVIEW
            </h4>
            <p style={{ fontSize: '15px', color: '#3c5b6a', lineHeight: 1.6, marginBottom: '20px' }}>
              {event.description}
            </p>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '2px solid #eef7f1',
              paddingBottom: '10px',
              marginBottom: '18px'
            }}>
              {(['rounds', 'rules', 'coordinators'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: activeTab === tab ? '#0c2334' : '#5e7d8c',
                    background: activeTab === tab ? '#d9ecdf' : 'transparent',
                    border: activeTab === tab ? '1px solid #c5e0d7' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab === 'rounds' ? 'Rounds Breakdown' : tab === 'rules' ? 'Rules & Eligibility' : 'Coordinators'}
                </button>
              ))}
            </div>

            {/* Tab 1: Rounds */}
            {activeTab === 'rounds' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {event.rounds.map((round, idx) => (
                  <div
                    key={round.title}
                    style={{
                      background: '#f8fcfa',
                      border: '1px solid #c5e0d7',
                      borderRadius: '10px',
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#14b3ad',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {idx + 1}
                      </span>
                      <h5 style={{ fontSize: '15px', fontWeight: 700, color: '#0e2a3d' }}>
                        {round.title}
                      </h5>
                    </div>
                    <p style={{ fontSize: '14px', color: '#3c5b6a', lineHeight: 1.5, paddingLeft: '34px' }}>
                      {round.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Rules */}
            {activeTab === 'rules' && (
              <div style={{
                background: '#f8fcfa',
                border: '1px solid #c5e0d7',
                borderRadius: '12px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <ShieldCheck size={18} color="#0c8a86" />
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0e2a3d' }}>
                    Official Competition Guidelines:
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {event.rules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={16} color="#14b3ad" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#3c5b6a', lineHeight: 1.5 }}>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Coordinators */}
            {activeTab === 'coordinators' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {event.coordinators.map((c) => (
                  <div
                    key={c.name}
                    style={{
                      background: '#f8fcfa',
                      border: '1px solid #c5e0d7',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#0c8a86', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {c.role}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0e2a3d' }}>
                      {c.name}
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      style={{
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        color: '#14b3ad',
                        fontWeight: 600
                      }}
                    >
                      <Phone size={14} />
                      <span>{c.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Modal Action */}
            <div style={{
              marginTop: '28px',
              paddingTop: '18px',
              borderTop: '1px solid #eef7f1',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>ENTRY FEE: </span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0c8a86', marginLeft: '6px' }}>{event.entryFee}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: '#5e7d8c',
                    background: '#eef7f1',
                    border: '1px solid #c5e0d7'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => onRegisterClick(event.id)}
                  className="btn-tactile-primary"
                >
                  <Ticket size={16} />
                  <span>REGISTER FOR THIS EVENT →</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
