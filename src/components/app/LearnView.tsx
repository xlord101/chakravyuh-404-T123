import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, CheckCircle2, ChevronRight, Play, Sparkles, Compass } from 'lucide-react';
import { CURRICULUM_TRACKS } from '../../data/curriculumData';
import type { Lesson } from '../../data/curriculumData';
import type { SparkUserState } from '../../store/useSparkStore';

interface LearnViewProps {
  user: SparkUserState;
  onSelectLesson: (lessonId: string) => void;
  onOpenOnboarding?: () => void;
}

export const LearnView = ({ user, onSelectLesson, onOpenOnboarding }: LearnViewProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('logic');
  const [activeModalLesson, setActiveModalLesson] = useState<Lesson | null>(null);

  const activeTrack = CURRICULUM_TRACKS.find((t) => t.id === selectedTrackId) || CURRICULUM_TRACKS[0];

  const isLessonComplete = (id: string) => user.completedLessons.includes(id);

  const onboardingDone = Boolean(user.onboarding?.completed);
  const currentLevel = user.onboarding?.selectedLevel || user.onboarding?.recommendedLevel || 'beginner';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Adaptive Diagnostic Banner (PRD Section 3 & 4) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124, 255, 178, 0.05) 0%, rgba(92, 200, 255, 0.03) 100%)',
          border: '1px solid',
          borderColor: onboardingDone ? 'rgba(124, 255, 178, 0.3)' : 'rgba(255, 184, 77, 0.4)',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: onboardingDone ? 'rgba(124, 255, 178, 0.15)' : 'rgba(255, 184, 77, 0.15)',
              color: onboardingDone ? 'var(--color-signal)' : 'var(--color-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {onboardingDone ? <Sparkles size={22} /> : <Compass size={22} />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                className="chip-tag"
                style={{
                  fontSize: '9px',
                  background: onboardingDone ? 'rgba(124, 255, 178, 0.15)' : 'rgba(255, 184, 77, 0.15)',
                  color: onboardingDone ? 'var(--color-signal)' : 'var(--color-amber)',
                  borderColor: onboardingDone ? 'var(--color-signal)' : 'var(--color-amber)',
                }}
              >
                {onboardingDone ? 'ADAPTIVE PATHWAY ACTIVE' : 'PERSONALIZED ONBOARDING AVAILABLE'}
              </span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                {onboardingDone
                  ? `Level: ${currentLevel === 'intermediate' ? 'Circuit Explorer' : 'Beginner Explorer'}`
                  : 'Diagnostic (6 Questions)'}
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {onboardingDone
                ? `Calibrated for: ${currentLevel === 'intermediate' ? 'Circuit Explorer (Advanced Diagnostics)' : 'Beginner Explorer (Guided Step-by-Step)'}`
                : "Let's find your starting point in Electronics & ENTC"}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--color-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              {onboardingDone
                ? `Concept score: ${user.onboarding.conceptScore}/6 • Experience score: ${user.onboarding.experienceScore}/9. All curriculum modules remain accessible.`
                : 'Take our 60-second questionnaire to estimate your level and receive personalized hints.'}
            </p>
          </div>
        </div>

        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className={onboardingDone ? 'btn-tactile-surface' : 'btn-tactile-signal'}
            style={{ fontSize: '13px', padding: '10px 18px', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={14} />
            <span>{onboardingDone ? 'Retake Diagnostic Quiz' : 'Start 60s Diagnostic →'}</span>
          </button>
        )}
      </div>

      {/* Track Selector Bar (PRD 8.2) */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '28px'
      }}>
        {CURRICULUM_TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedTrackId(track.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: selectedTrackId === track.id ? 700 : 500,
              background: selectedTrackId === track.id ? 'var(--color-surface-2)' : 'transparent',
              color: selectedTrackId === track.id ? '#ffffff' : 'var(--color-muted)',
              border: selectedTrackId === track.id ? '1px solid var(--color-signal)' : '1px solid var(--color-line)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{track.title}</span>
            {track.status === 'coming_soon' && (
              <span className="chip-tag" style={{ fontSize: '9px' }}>SOON</span>
            )}
          </button>
        ))}
      </div>

      {/* Track Header Card */}
      <div className="pcb-card" style={{ padding: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="chip-tag chip-tag-signal">{activeTrack.badge}</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            {activeTrack.lessons.filter((l) => isLessonComplete(l.id)).length} of {activeTrack.lessons.length} Completed
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
          {activeTrack.title}
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
          {activeTrack.description}
        </p>

        {/* Segmented Progress Line */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginTop: '16px',
          height: '6px'
        }}>
          {activeTrack.lessons.map((l) => (
            <div
              key={l.id}
              style={{
                flex: 1,
                borderRadius: '3px',
                background: isLessonComplete(l.id) ? 'var(--color-signal)' : 'var(--color-line)',
                boxShadow: isLessonComplete(l.id) ? '0 0 8px var(--color-signal)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Interconnected PCB Trace Path (PRD 8.2) */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0 60px'
      }}>
        {/* Nodes List with Inter-Block Copper Traces */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative', zIndex: 5 }}>
          {activeTrack.lessons.map((lesson, idx) => {
            const completed = isLessonComplete(lesson.id);
            const isCurrent = !completed && (idx === 0 || isLessonComplete(activeTrack.lessons[idx - 1]?.id));
            const isLocked = !completed && !isCurrent;

            return (
              <div key={lesson.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Vertical Copper Connector Trace strictly BETWEEN blocks */}
                {idx > 0 && (
                  <div
                    style={{
                      height: '38px',
                      width: '3px',
                      background: completed
                        ? 'var(--color-signal)'
                        : isCurrent
                        ? 'linear-gradient(to bottom, var(--color-signal), var(--color-line))'
                        : 'var(--color-line)',
                      boxShadow: completed ? '0 0 8px var(--color-signal)' : 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Directional Signal Arrow between blocks */}
                    {completed && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'var(--color-signal)',
                          boxShadow: '0 0 6px var(--color-signal)',
                        }}
                      />
                    )}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  {/* Component Node Card - Solid Opaque PCB Substrate */}
                  <div
                    onClick={() => {
                      if (!isLocked) {
                        setActiveModalLesson(lesson);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: completed ? '#0F1815' : isCurrent ? '#15221E' : '#080D0B',
                      border: `1.5px solid ${completed ? 'var(--color-signal)' : isCurrent ? 'var(--color-signal)' : 'var(--color-line)'}`,
                      borderRadius: '16px',
                      padding: '18px 22px',
                      maxWidth: '480px',
                      width: '92%',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      boxShadow: isCurrent ? '0 0 24px rgba(92, 219, 181, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
                      opacity: isLocked ? 0.45 : 1,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      zIndex: 10,
                    }}
                  >
                    {/* Top Solder Terminal Pad */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: completed ? 'var(--color-signal)' : 'var(--color-line)',
                        border: '2px solid #080D0B',
                        boxShadow: completed ? '0 0 6px var(--color-signal)' : 'none',
                      }}
                    />

                    {/* Bottom Solder Terminal Pad */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: completed ? 'var(--color-signal)' : 'var(--color-line)',
                        border: '2px solid #080D0B',
                        boxShadow: completed ? '0 0 6px var(--color-signal)' : 'none',
                      }}
                    />

                    {/* Node Icon Avatar */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: completed ? 'var(--color-signal)' : isCurrent ? 'rgba(92, 219, 181, 0.15)' : 'var(--color-surface-2)',
                      color: completed ? '#071911' : isCurrent ? 'var(--color-signal)' : 'var(--color-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {completed ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={20} /> : <Cpu size={24} />}
                    </div>

                    {/* Node Metadata */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: isCurrent ? 'var(--color-signal)' : 'var(--color-muted)',
                        marginBottom: '3px'
                      }}>
                        <span>{lesson.chapter}</span>
                        <span>•</span>
                        <span>+{lesson.xpReward} XP</span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                        {lesson.title}
                      </h4>

                      <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                        {lesson.summary}
                      </p>
                    </div>

                    {/* Action arrow */}
                    {!isLocked && (
                      <ChevronRight size={18} color={isCurrent ? "var(--color-signal)" : "var(--color-muted)"} />
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Details Bottom Card / Modal */}
      {activeModalLesson && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setActiveModalLesson(null)}
        >
          <div
            className="pcb-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              background: 'var(--color-surface)',
              border: '2px solid var(--color-signal)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="chip-tag chip-tag-signal">{activeModalLesson.chapter}</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', fontWeight: 700 }}>
                +{activeModalLesson.xpReward} XP
              </span>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              {activeModalLesson.title}
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              {activeModalLesson.summary}
            </p>

            <div style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-line)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text)',
              marginBottom: '24px'
            }}>
              <div>// 5-STEP ENIGMA RHYTHM:</div>
              <div style={{ color: 'var(--color-signal)', marginTop: '4px', fontWeight: 600 }}>
                1. DISCOVER (&lt;90s) → 2. EXPERIMENT (Sandbox) → 3. PLAY (Mini-Game) → 4. BREAK &amp; DEBUG → 5. MASTER &amp; 5-Q QUIZ
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveModalLesson(null)}
                className="btn-tactile-surface"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = activeModalLesson.id;
                  setActiveModalLesson(null);
                  onSelectLesson(id);
                }}
                className="btn-tactile-signal"
              >
                <Play size={15} fill="currentColor" />
                <span>Start Lesson Now →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

