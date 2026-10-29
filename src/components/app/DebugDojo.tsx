import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Bug, CheckCircle2, Activity, Sparkles } from 'lucide-react';
import { DOJO_CASES } from '../../data/curriculumData';
import type { DojoCase } from '../../data/curriculumData';

interface DebugDojoProps {
  onCaseSolved: (caseId: string) => void;
  onAskSpark: () => void;
}

export const DebugDojo = ({ onCaseSolved, onAskSpark }: DebugDojoProps) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DOJO_CASES[0].id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [probeReadout, setProbeReadout] = useState<string>('Select a node to probe');

  const currentCase: DojoCase = DOJO_CASES.find((c) => c.id === selectedCaseId) || DOJO_CASES[0];

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsFixed(false);
    setProbeReadout('Select a node to probe');
  };

  const handleVerify = () => {
    if (selectedOption === null) return;
    setIsEvaluated(true);
    const chosen = currentCase.options[selectedOption];
    if (chosen.isCorrect) {
      setIsFixed(true);
      onCaseSolved(currentCase.id);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7CFFB2', '#5CC8FF', '#FF5C6C']
      });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="chip-tag chip-tag-fault">HARDWARE FORENSICS // PRD 12.2</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>
          Debug Dojo: Break & Fix
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>
          Real engineering happens when things break. Use the virtual multimeter probe to diagnose faulty circuits.
        </p>
      </div>

      {/* Case Switcher Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px' }}>
        {DOJO_CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCase(c.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              background: selectedCaseId === c.id ? 'var(--color-surface-2)' : 'transparent',
              color: selectedCaseId === c.id ? '#ffffff' : 'var(--color-muted)',
              border: selectedCaseId === c.id ? '1px solid var(--color-fault)' : '1px solid var(--color-line)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Bug size={14} color="var(--color-fault)" />
            <span>{c.title}</span>
            <span className="chip-tag" style={{ fontSize: '9px' }}>{c.difficulty}</span>
          </button>
        ))}
      </div>

      {/* Active Dojo Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Symptom & Virtual Probe Tool */}
        <div className="pcb-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="chip-tag chip-tag-fault">SYMPTOM OBSERVED</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
              +{currentCase.xpReward} XP
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            {currentCase.title}
          </h3>

          <div style={{
            background: 'rgba(255, 92, 108, 0.1)',
            border: '1px solid rgba(255, 92, 108, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'var(--color-fault)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            marginBottom: '18px'
          }}>
            FAULT: {currentCase.symptom}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            {currentCase.description}
          </p>

          {/* Virtual Probe Tool (PRD 12.2) */}
          <div style={{
            background: '#07100D',
            border: '1px solid var(--color-line)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} color="var(--color-signal)" />
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-signal)', fontWeight: 700 }}>
                  VIRTUAL DMM PROBE
                </span>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>
                {probeReadout}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setProbeReadout('Node A (VCC): 5.00V DC (NOMINAL)')}
                className="btn-tactile-surface"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                Probe VCC Rail
              </button>
              <button
                onClick={() => setProbeReadout('Node B (Cathode): 5.00V DC (FAULT: NO GND!)')}
                className="btn-tactile-surface"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                Probe Cathode
              </button>
              <button
                onClick={() => setProbeReadout('Node C (Ground): 0.00V DC (REFERENCE)')}
                className="btn-tactile-surface"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                Probe GND Terminal
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Name & Fix The Fault */}
        <div className="pcb-card" style={{ padding: '24px' }}>
          <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>
            DIAGNOSIS MATRIX
          </span>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
            Identify the Root Cause:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {currentCase.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (!isFixed) setSelectedOption(i);
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? (isEvaluated ? (opt.isCorrect ? 'var(--color-signal)' : 'var(--color-fault)') : 'var(--color-cyan)') : 'var(--color-line)'}`,
                    background: isSelected ? 'var(--color-surface-2)' : '#07100D',
                    cursor: isFixed ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                    {opt.label}
                  </div>
                  {isEvaluated && isSelected && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: opt.isCorrect ? 'var(--color-signal)' : 'var(--color-fault)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {opt.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onAskSpark} className="btn-tactile-surface" style={{ fontSize: '12px' }}>
              <Sparkles size={14} color="var(--color-cyan)" />
              <span>Ask Spark Hint</span>
            </button>

            {!isFixed ? (
              <button
                onClick={handleVerify}
                disabled={selectedOption === null}
                className="btn-tactile-signal"
                style={{ fontSize: '13px' }}
              >
                <span>Verify & Repair Fault →</span>
              </button>
            ) : (
              <div style={{
                color: 'var(--color-signal)',
                fontWeight: 800,
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={16} />
                <span>CASE SOLVED (+{currentCase.xpReward} XP)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

