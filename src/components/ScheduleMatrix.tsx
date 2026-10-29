import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { SCHEDULE_DAYS } from '../data/symposiumData';

export const ScheduleMatrix = () => {
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  const tracks = ['all', 'Keynote', 'Robotics', 'Circuits', 'Coding', 'Paper', 'Non-Tech'];

  const dayEvents = useMemo(() => {
    return SCHEDULE_DAYS.filter((item) => {
      const matchDay = item.day === selectedDay;
      const matchTrack = selectedTrack === 'all' || item.track === selectedTrack;
      return matchDay && matchTrack;
    });
  }, [selectedDay, selectedTrack]);

  return (
    <section
      id="schedule"
      style={{
        padding: '100px 24px',
        background: 'var(--screen-bg)',
        color: 'var(--screen-ink)',
        position: 'relative'
      }}
    >
      {/* Background Grid Pattern */}
      <div className="bg-grid-screen" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="beacon-dot" />
            <span className="pixel-badge pixel-badge-teal">
              SYMPOSIUM TIMELINE // 48-HOUR MATRIX
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            SCHEDULE OF OPERATIONS
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'var(--screen-dim)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Precision synchronized agenda across our Main University Auditorium, RF & Microwave Labs, Robotics Sandbox, and Innovation Center.
          </p>
        </div>

        {/* Day Selector Buttons & Track Filter */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Day 1 vs Day 2 Tabs */}
          <div style={{
            background: 'var(--screen-bg-2)',
            border: '1px solid var(--line-screen)',
            borderRadius: '12px',
            padding: '6px',
            display: 'inline-flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setSelectedDay(1)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: selectedDay === 1 ? '#0c2334' : 'var(--screen-dim)',
                background: selectedDay === 1 ? 'var(--color-teal)' : 'transparent',
                boxShadow: selectedDay === 1 ? '0 2px 8px rgba(20, 179, 173, 0.4)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Calendar size={16} />
              <span>DAY 01 (OCT 29)</span>
            </button>

            <button
              onClick={() => setSelectedDay(2)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: selectedDay === 2 ? '#0c2334' : 'var(--screen-dim)',
                background: selectedDay === 2 ? 'var(--color-teal)' : 'transparent',
                boxShadow: selectedDay === 2 ? '0 2px 8px rgba(20, 179, 173, 0.4)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Calendar size={16} />
              <span>DAY 02 (OCT 30)</span>
            </button>
          </div>

          {/* Track Filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: selectedTrack === track ? 700 : 500,
                  color: selectedTrack === track ? '#ffffff' : 'var(--screen-dim)',
                  background: selectedTrack === track ? 'var(--screen-bg-elevated)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedTrack === track ? '1px solid var(--color-teal)' : '1px solid var(--line-screen)',
                  transition: 'all 0.15s ease'
                }}
              >
                {track === 'all' ? 'All Tracks' : track}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Cards Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          {dayEvents.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              viewport={{ once: true }}
              className="ditto-card-screen"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}
            >
              {/* Header Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: '#6fe9e2',
                    fontWeight: 700,
                    background: 'rgba(20, 179, 173, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(20, 179, 173, 0.3)'
                  }}>
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>

                  <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px' }}>
                    {item.track}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#7fa6a8'
                }}>
                  <MapPin size={14} color="#f0ac1b" />
                  <span>{item.venue}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: '14px',
                color: 'var(--screen-dim)',
                lineHeight: 1.6
              }}>
                {item.description}
              </p>

              {/* Speaker / Judge Chip */}
              {item.speakerOrJudge && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#e9f7f3',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--line-screen)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  width: 'fit-content'
                }}>
                  <User size={13} color="#14b3ad" />
                  <span>{item.speakerOrJudge}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
