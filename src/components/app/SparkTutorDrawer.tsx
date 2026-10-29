import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../store/useSparkStore';

interface SparkTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  currentContextHint?: string;
}

export const SparkTutorDrawer = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  currentContextHint
}: SparkTutorDrawerProps) => {
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const quickPrompts = [
    'Why is my circuit not working?',
    'Give me a hint (Step 1)',
    'Explain like I am new',
    'Quiz me on this concept'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '420px',
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-line)',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface-2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(92, 200, 255, 0.15)',
                border: '1px solid var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-cyan)'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>
                  Spark AI Tutor
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  CONTEXT-AWARE // SEES YOUR CIRCUIT
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label="Close tutor"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Context Pill if available */}
          {currentContextHint && (
            <div style={{
              background: '#07100D',
              borderBottom: '1px solid var(--color-line)',
              padding: '10px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>ATTACHED CONTEXT:</span>
              <span style={{ color: '#ffffff' }}>{currentContextHint}</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: m.sender === 'user' ? 'var(--color-surface-2)' : '#07100D',
                  border: `1px solid ${m.sender === 'user' ? 'var(--color-line)' : 'rgba(92, 200, 255, 0.3)'}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: m.sender === 'user' ? 'var(--color-text)' : '#ffffff'
                }}
              >
                {m.sender === 'spark' && (
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-cyan)',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}>
                    SPARK TUTOR:
                  </div>
                )}
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--color-line)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => onSendMessage(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-line)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted)',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '14px 18px',
              borderTop: '1px solid var(--color-line)',
              display: 'flex',
              gap: '10px',
              background: 'var(--color-surface-2)'
            }}
          >
            <input
              type="text"
              placeholder="Ask Spark about this circuit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-line)',
                background: '#07100D',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn-tactile-signal"
              style={{ padding: '10px 14px' }}
            >
              <Send size={15} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

