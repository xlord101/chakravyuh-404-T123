import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Zap, ShieldCheck, Power, RefreshCw } from 'lucide-react';
import { CURRICULUM_TRACKS } from '../../data/curriculumData';
import type { Lesson, LessonStep } from '../../data/curriculumData';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: (lessonId: string) => void;
  onExit: () => void;
  onAskSpark: () => void;
}

export const LessonPlayer = ({
  lessonId,
  onComplete,
  onExit,
  onAskSpark
}: LessonPlayerProps) => {
  // Find current lesson from tracks
  let foundLesson: Lesson | undefined;
  for (const track of CURRICULUM_TRACKS) {
    const l = track.lessons.find((item) => item.id === lessonId);
    if (l) {
      foundLesson = l;
      break;
    }
  }

  const lesson = foundLesson || CURRICULUM_TRACKS[0].lessons[0];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Live Interactive Widget State (Beat 3)
  const [switchOn, setSwitchOn] = useState(false);

  // Break & Fix State (Beat 5)
  const [wireFixed, setWireFixed] = useState(false);

  // Completion state
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const step: LessonStep = lesson.steps[currentStepIndex] || lesson.steps[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / lesson.steps.length) * 100);

  const handleNextStep = () => {
    setSelectedChoiceIndex(null);
    setIsAnswerChecked(false);

    if (currentStepIndex + 1 < lesson.steps.length) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed full lesson!
      setIsLessonFinished(true);
      onComplete(lesson.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7CFFB2', '#5CC8FF', '#FFB84D']
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      color: 'var(--color-text)'
    }}>
      {/* Top Header & Progress Bar (PRD 9.3) */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-line)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <button
          onClick={onExit}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Exit lesson"
        >
          <X size={20} />
        </button>

        {/* Segmented Progress Bar */}
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-muted)',
            marginBottom: '6px'
          }}>
            <span>{lesson.title}</span>
            <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>
              STEP {currentStepIndex + 1} OF {lesson.steps.length}
            </span>
          </div>

          <div style={{
            height: '6px',
            background: 'var(--color-line)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'var(--color-signal)',
              boxShadow: '0 0 10px var(--color-signal)',
              transition: 'width 0.25s ease'
            }} />
          </div>
        </div>

        <button
          onClick={onAskSpark}
          style={{
            background: 'rgba(92, 200, 255, 0.1)',
            border: '1px solid var(--color-cyan)',
            color: 'var(--color-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '6px 14px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={14} />
          <span>Spark Hint</span>
        </button>
      </div>

      {/* Main Lesson Body */}
      <div style={{
        flex: 1,
        maxWidth: '840px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 20px 100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {isLessonFinished ? (
          /* ==========================================================================
             LESSON COMPLETION CARD (PRD 9.4)
             ========================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pcb-card-active"
            style={{ padding: '40px', textAlign: 'center' }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(124, 255, 178, 0.2)',
              color: 'var(--color-signal)',
              border: '2px solid var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(124, 255, 178, 0.3)'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <span className="chip-tag chip-tag-signal" style={{ marginBottom: '10px' }}>
              LESSON COMPLETED // MASTERED
            </span>

            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              {lesson.title}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--color-muted)', marginBottom: '28px' }}>
              You touched the circuit, verified the theory, and repaired the faulty breadboard bug!
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              background: '#07100D',
              border: '1px solid var(--color-line)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '460px',
              margin: '0 auto 32px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>XP EARNED</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-signal)' }}>+{lesson.xpReward} XP</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>ACCURACY</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cyan)' }}>100%</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>STREAK</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-amber)' }}>+1 DAY</div>
              </div>
            </div>

            <button onClick={onExit} className="btn-tactile-signal" style={{ fontSize: '15px', padding: '14px 28px' }}>
              <span>Continue to Next Lesson on Journey Map →</span>
            </button>
          </motion.div>
        ) : (
          /* ==========================================================================
             ACTIVE STEP CONTENT
             ========================================================================== */
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Step Header */}
            <div>
              <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '8px' }}>
                BEAT {currentStepIndex + 1} OF 5 // {step.type.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                {step.title}
              </h3>
            </div>

            {/* Hook if present */}
            {step.hook && (
              <div style={{
                borderLeft: '3px solid var(--color-signal)',
                paddingLeft: '14px',
                fontSize: '15px',
                color: 'var(--color-signal)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}>
                "{step.hook}"
              </div>
            )}

            {/* Read Content */}
            {step.content && (
              <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                {step.content}
              </p>
            )}

            {/* BEAT 2: Try It Live Interactive Widget */}
            {step.type === 'widget' && (
              <div className="pcb-card" style={{ padding: '24px', background: '#07100D', border: '1px solid var(--color-line)' }}>
                <div style={{ fontSize: '13px', color: '#ffffff', marginBottom: '16px', fontWeight: 700 }}>
                  TASK: {step.task}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '28px',
                  background: '#040807',
                  borderRadius: '10px',
                  border: '1px solid #1c2723',
                  marginBottom: '20px'
                }}>
                  {/* Switch */}
                  <button
                    onClick={() => setSwitchOn(!switchOn)}
                    className={switchOn ? "btn-tactile-signal" : "btn-tactile-surface"}
                  >
                    <Power size={18} />
                    <span>{switchOn ? 'SWITCH CLOSED (ON)' : 'SWITCH OPEN (OFF)'}</span>
                  </button>

                  <div style={{ fontSize: '20px', color: switchOn ? 'var(--color-signal)' : 'var(--color-line)' }}>
                    ──────►
                  </div>

                  {/* Virtual LED */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: switchOn ? 'var(--color-signal)' : '#1a2923',
                      boxShadow: switchOn ? '0 0 24px var(--color-signal)' : 'none',
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: switchOn ? '#071911' : '#455952'
                    }}>
                      <Zap size={20} />
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: switchOn ? 'var(--color-signal)' : 'var(--color-muted)', fontWeight: 700 }}>
                      {switchOn ? 'LED GLOWING (HIGH)' : 'LED OFF (LOW)'}
                    </span>
                  </div>
                </div>

                {switchOn && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(124, 255, 178, 0.12)',
                    border: '1px solid var(--color-signal)',
                    color: 'var(--color-signal)',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} />
                    <span>Goal achieved! 5V flows through the diode. Click Continue below.</span>
                  </div>
                )}
              </div>
            )}

            {/* BEAT 3: Multiple Choice Check */}
            {step.type === 'choice' && step.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  {step.task}
                </p>

                {step.options.map((opt, i) => {
                  const isSelected = selectedChoiceIndex === i;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (!isAnswerChecked) setSelectedChoiceIndex(i);
                      }}
                      className="pcb-card"
                      style={{
                        padding: '16px',
                        cursor: isAnswerChecked ? 'default' : 'pointer',
                        borderColor: isSelected ? (isAnswerChecked ? (opt.correct ? 'var(--color-signal)' : 'var(--color-fault)') : 'var(--color-cyan)') : 'var(--color-line)',
                        background: isSelected ? 'var(--color-surface-2)' : 'var(--color-surface)'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>
                        {opt.text}
                      </div>
                      {isAnswerChecked && isSelected && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: opt.correct ? 'var(--color-signal)' : 'var(--color-fault)',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {opt.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                {!isAnswerChecked && selectedChoiceIndex !== null && (
                  <button
                    onClick={() => setIsAnswerChecked(true)}
                    className="btn-tactile-signal"
                    style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                  >
                    Check Answer
                  </button>
                )}
              </div>
            )}

            {/* BEAT 4: Break & Fix */}
            {step.type === 'debug' && (
              <div className="pcb-card" style={{ padding: '24px', background: '#07100D', border: '1px solid var(--color-line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <AlertCircle size={18} color="var(--color-fault)" />
                  <span style={{ fontWeight: 700, color: 'var(--color-fault)', fontSize: '14px' }}>
                    BREAK & FIX CHALLENGE
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '18px' }}>
                  {step.task}
                </p>

                <div style={{
                  padding: '24px',
                  background: '#040807',
                  borderRadius: '10px',
                  border: `1px dashed ${wireFixed ? 'var(--color-signal)' : 'var(--color-fault)'}`,
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: wireFixed ? 'var(--color-signal)' : 'var(--color-fault)', marginBottom: '14px', fontWeight: 700 }}>
                    {wireFixed ? 'TERMINAL REPAIRED: CLOSED LOOP ESTABLISHED ✓' : 'FAULT: OPEN CIRCUIT BREAK DETECTED AT GND LEAD ✗'}
                  </div>

                  <button
                    onClick={() => setWireFixed(true)}
                    className={wireFixed ? "btn-tactile-signal" : "btn-tactile-amber"}
                  >
                    <RefreshCw size={14} />
                    <span>{wireFixed ? 'Jumper Connected ✓' : 'Click to Solder / Reconnect Jumper Lead'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* BEAT 5: Concept Card Recap */}
            {step.type === 'recap' && (
              <div className="pcb-card-active" style={{ padding: '28px', background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <ShieldCheck size={18} color="var(--color-signal)" />
                  <span style={{ fontWeight: 800, color: 'var(--color-signal)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                    CONCEPT SAVED TO CHEAT SHEET
                  </span>
                </div>
                <div style={{ fontSize: '16px', color: '#ffffff', lineHeight: 1.6, fontWeight: 600 }}>
                  {step.conceptSummary}
                </div>
              </div>
            )}

            {/* Bottom Step Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-line)'
            }}>
              <button
                onClick={onAskSpark}
                className="btn-tactile-surface"
                style={{ fontSize: '13px' }}
              >
                <Sparkles size={14} color="var(--color-cyan)" />
                <span>Need a Hint?</span>
              </button>

              <button
                onClick={handleNextStep}
                className="btn-tactile-signal"
                style={{ fontSize: '14px', padding: '12px 24px' }}
              >
                <span>Continue →</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

