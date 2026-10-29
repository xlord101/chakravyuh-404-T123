import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, VolumeX, Sparkles, Lightbulb, HelpCircle, Wrench, BookOpen } from 'lucide-react';
import type { SparkUserState } from '../../store/useSparkStore';

interface SparkMascotProps {
  user: SparkUserState;
  currentLessonId?: string;
  onOpenSparkTutor: (prompt?: string) => void;
}

export const SparkMascot = ({
  user,
  currentLessonId,
  onOpenSparkTutor
}: SparkMascotProps) => {
  const [bubbleVisible, setBubbleVisible] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [blinking, setBlinking] = useState<boolean>(false);
  const [speechText, setSpeechText] = useState<string>("Hi! I'm Spark. Ready to explore live circuits?");

  // Determine contextual message based on user state & current lesson
  useEffect(() => {
    if (isMuted) return;

    if (user.completedLessons.length === 0) {
      setSpeechText("Hi! I'm Spark. Ready to explore live circuits?");
    } else if (user.streak > 1) {
      setSpeechText(`Welcome back! Your ${user.streak}-day streak is alive. Ready to continue?`);
    } else if (user.completedLessons.length > 2) {
      setSpeechText("Great job! You're getting the hang of it!");
    } else if (currentLessonId) {
      setSpeechText("Need a little help with this circuit? Ask Spark anytime!");
    } else {
      setSpeechText("Your next lesson is waiting on the journey map. Let's go!");
    }

    setBubbleVisible(true);
  }, [user.completedLessons.length, user.streak, currentLessonId, isMuted]);

  // Periodic eye blink effect for lively personality
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (prompt: string) => {
    onOpenSparkTutor(prompt);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {/* Contextual Speech Bubble */}
      <AnimatePresence>
        {bubbleVisible && !isMuted && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              pointerEvents: 'auto',
              maxWidth: '310px',
              background: '#0F1815',
              border: '1px solid #23352E',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65), 0 0 16px rgba(92, 219, 181, 0.1)',
              position: 'relative',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header controls inside bubble: Mute & Dismiss */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-signal)',
                    boxShadow: '0 0 6px var(--color-signal)',
                  }}
                />
                <span
                  className="font-pixel"
                  style={{ fontSize: '9px', color: 'var(--color-signal)', fontWeight: 700 }}
                >
                  SPARK TELEMETRY
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setIsMuted(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                  title="Mute automatic hints"
                >
                  <VolumeX size={13} />
                </button>
                <button
                  onClick={() => setBubbleVisible(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                  title="Dismiss message"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <p
              style={{
                fontSize: '13px',
                color: '#E2E8E5',
                lineHeight: 1.45,
                margin: '0 0 12px 0',
                fontWeight: 500,
              }}
            >
              "{speechText}"
            </p>

            {/* Quick Action Chips that open Spark AI with context */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={() => handleQuickAction('Explain this concept simply with a real-world analogy')}
                className="btn-tactile-surface"
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', gap: '4px' }}
              >
                <Lightbulb size={11} color="var(--color-amber)" />
                <span>Explain simply</span>
              </button>

              <button
                onClick={() => handleQuickAction('Give me a step-1 hint for this circuit')}
                className="btn-tactile-surface"
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', gap: '4px' }}
              >
                <HelpCircle size={11} color="var(--color-cyan)" />
                <span>Get a hint</span>
              </button>

              <button
                onClick={() => handleQuickAction('Debug my circuit: check if voltage is flowing to ground')}
                className="btn-tactile-surface"
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', gap: '4px' }}
              >
                <Wrench size={11} color="var(--color-fault)" />
                <span>Debug circuit</span>
              </button>

              <button
                onClick={() => handleQuickAction('Quiz me on this concept with a quick question')}
                className="btn-tactile-surface"
                style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', gap: '4px' }}
              >
                <BookOpen size={11} color="var(--color-signal)" />
                <span>Quiz me</span>
              </button>
            </div>

            {/* Speech bubble beak/pointer */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '26px',
                width: '12px',
                height: '12px',
                background: '#0F1815',
                borderRight: '1px solid #23352E',
                borderBottom: '1px solid #23352E',
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Spark Mascot Avatar Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenSparkTutor()}
        style={{
          pointerEvents: 'auto',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #13201B 0%, #09120E 100%)',
          border: '1.5px solid var(--color-signal)',
          borderRadius: '999px',
          padding: '6px 14px 6px 8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(92, 219, 181, 0.25)',
          userSelect: 'none',
        }}
        title="Click to chat with Spark AI Tutor"
      >
        {/* Retro Mini-CRT Oscilloscope Head */}
        <div
          style={{
            width: '38px',
            height: '32px',
            background: '#040806',
            border: '1.5px solid #23352E',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Dual Antenna Solder Pins */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '8px',
              width: '2px',
              height: '4px',
              background: 'var(--color-amber)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '8px',
              width: '2px',
              height: '4px',
              background: 'var(--color-amber)',
            }}
          />

          {/* CRT Screen with Scanline & Phosphor Eyes */}
          <div
            style={{
              width: '28px',
              height: '20px',
              background: '#081410',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 4px',
              boxShadow: 'inset 0 0 6px rgba(92, 219, 181, 0.3)',
            }}
          >
            {/* Left Eye */}
            <div
              style={{
                width: '5px',
                height: blinking ? '1px' : '7px',
                background: 'var(--color-signal)',
                borderRadius: '1px',
                boxShadow: '0 0 6px var(--color-signal)',
                transition: 'height 0.08s ease',
              }}
            />
            {/* Right Eye */}
            <div
              style={{
                width: '5px',
                height: blinking ? '1px' : '7px',
                background: 'var(--color-signal)',
                borderRadius: '1px',
                boxShadow: '0 0 6px var(--color-signal)',
                transition: 'height 0.08s ease',
              }}
            />
          </div>
        </div>

        {/* Wordmark & Sparkles */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              className="font-pixel"
              style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}
            >
              SPARK AI
            </span>
            <Sparkles size={11} color="var(--color-signal)" />
          </div>
          <span style={{ fontSize: '9px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
            ONLINE // MENTOR
          </span>
        </div>
      </motion.div>
    </div>
  );
};
