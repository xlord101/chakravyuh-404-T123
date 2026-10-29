import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { FAQS, SYMPOSIUM_CONFIG } from '../data/symposiumData';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      style={{
        padding: '100px 24px',
        background: 'var(--bg-page)',
        position: 'relative'
      }}
    >
      <div className="bg-grid-light" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="beacon-dot" />
            <span className="pixel-badge pixel-badge-teal">
              KNOWLEDGE BASE // FIELD MANUAL
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
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'var(--ink-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Everything you need to know regarding participation criteria, hardware kits, campus accommodations, and verified certificates.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="ditto-card"
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1px solid var(--color-teal)' : '1px solid var(--line-soft)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                    background: isOpen ? 'var(--bg-surface-2)' : 'transparent',
                    cursor: 'pointer'
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: 'var(--ink-primary)',
                    letterSpacing: '-0.01em'
                  }}>
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color: isOpen ? 'var(--color-teal-deep)' : 'var(--ink-faint)',
                      flexShrink: 0
                    }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{
                        padding: '16px 24px 24px',
                        borderTop: '1px solid var(--line-soft)',
                        fontSize: '15px',
                        color: 'var(--ink-secondary)',
                        lineHeight: 1.6
                      }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div style={{
          marginTop: '40px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--line-soft)',
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare size={20} color="#14b3ad" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                Have a specific question not covered here?
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                Our Student Coordination Crew is online 24/7 on WhatsApp & Call.
              </div>
            </div>
          </div>

          <a
            href={`tel:${SYMPOSIUM_CONFIG.helpdesk.split('/')[0].trim()}`}
            className="btn-tactile-dark"
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            <span>CALL HELPDESK →</span>
          </a>
        </div>
      </div>
    </section>
  );
};
