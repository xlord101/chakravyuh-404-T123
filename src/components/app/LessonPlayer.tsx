import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  ShieldCheck,
  Power,
  RefreshCw,
  Eye,
  Lightbulb,
  Trophy,
  Wrench,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { CURRICULUM_TRACKS } from '../../data/curriculumData';
import type { Lesson } from '../../data/curriculumData';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: (lessonId: string) => void;
  onExit: () => void;
  onAskSpark: () => void;
}

type StepKey = 'discover' | 'experiment' | 'play' | 'debug' | 'master';

const STEPS: { key: StepKey; stepNumber: number; label: string; icon: any }[] = [
  { key: 'discover', stepNumber: 1, label: 'DISCOVER', icon: Eye },
  { key: 'experiment', stepNumber: 2, label: 'EXPERIMENT', icon: Zap },
  { key: 'play', stepNumber: 3, label: 'PLAY', icon: Play },
  { key: 'debug', stepNumber: 4, label: 'BREAK & DEBUG', icon: Wrench },
  { key: 'master', stepNumber: 5, label: 'MASTER', icon: Trophy },
];

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

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentStep = STEPS[activeStepIndex];

  // -------------------------------------------------------------------------
  // STEP 1: DISCOVER STATE
  // -------------------------------------------------------------------------
  const [explainMode, setExplainMode] = useState<'standard' | 'simple' | 'analogy'>('standard');
  const [inspectedComponent, setInspectedComponent] = useState<string | null>('led');

  // -------------------------------------------------------------------------
  // STEP 2: EXPERIMENT STATE (Live Simulator)
  // -------------------------------------------------------------------------
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [inputA, setInputA] = useState<number>(1);
  const [resistanceOhms, setResistanceOhms] = useState<number>(220);
  const [voltageSupply, setVoltageSupply] = useState<number>(5.0);
  const [simulatorInsight, setSimulatorInsight] = useState<string | null>(null);

  // Computed values
  const ledForwardVoltage = 2.0;
  const effectiveVoltage = Math.max(0, voltageSupply - ledForwardVoltage);
  const currentMilliamps = powerOn && (inputA === 1)
    ? Math.round((effectiveVoltage / resistanceOhms) * 1000 * 10) / 10
    : 0;

  // -------------------------------------------------------------------------
  // STEP 3: PLAY STATE (Mini-Game)
  // -------------------------------------------------------------------------
  const [playPrediction, setPlayPrediction] = useState<string | null>(null);
  const [playChecked, setPlayChecked] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STEP 4: BREAK & DEBUG STATE
  // -------------------------------------------------------------------------
  const [debugProbePoint, setDebugProbePoint] = useState<'tp1' | 'tp2' | 'tp3' | null>(null);
  const [hintTier, setHintTier] = useState<number>(0); // 0 = none, 1 = nudge, 2 = hint, 3 = guided
  const [circuitRepaired, setCircuitRepaired] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STEP 5: MASTER STATE
  // -------------------------------------------------------------------------
  const [masterQuestionAnswered, setMasterQuestionAnswered] = useState<number | null>(null);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(false);

  // Navigation handlers
  const handleNextStep = () => {
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLessonFinished(true);
      onComplete(lesson.id);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7CFFB2', '#5CC8FF', '#FFB84D'],
      });
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Component definition for DISCOVER inspection
  const componentInfo: Record<string, { title: string; symbol: string; role: string; missingRisk: string }> = {
    led: {
      title: 'Light Emitting Diode (LED)',
      symbol: '►|─',
      role: 'A semiconductor p-n junction that converts electrical energy into photons when forward-biased.',
      missingRisk: 'Without an LED, the circuit has no optical output to confirm logic HIGH.',
    },
    resistor: {
      title: 'Current-Limiting Resistor (220Ω)',
      symbol: '─/\/\/\─',
      role: 'Limits current to ~13.6mA according to Ohm’s Law (I = (V - Vled) / R).',
      missingRisk: 'Without this resistor, excessive current (>30mA) permanently fries the diode!',
    },
    vcc: {
      title: 'VCC Power Rail (+5.0V)',
      symbol: '┯ +5V',
      role: 'Provides the positive electrical potential energy source representing logic HIGH (1).',
      missingRisk: 'Without a voltage potential, electrons remain static; no work can be performed.',
    },
    gnd: {
      title: 'Ground Return Rail (0V / GND)',
      symbol: '┷ GND',
      role: 'Completes the closed loop, allowing electrons to return to the lowest potential energy state.',
      missingRisk: 'If GND is disconnected, the circuit is open. Current immediately drops to 0.00mA.',
    },
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      color: 'var(--color-text)'
    }}>
      {/* =========================================================================
          TOP OSCILLOSCOPE HEADER & 5-STEP RHYTHM BAR
          ========================================================================= */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-line)',
        background: 'rgba(11, 15, 14, 0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Exit & Lesson Chapter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onExit}
            className="btn-tactile-surface"
            style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Return to Journey Map"
          >
            <X size={14} />
            <span>Map</span>
          </button>

          <div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-signal)', fontWeight: 700 }}>
              {lesson.chapter.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
              {lesson.title}
            </div>
          </div>
        </div>

        {/* 5-Step Rhythm Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflowX: 'auto'
        }}>
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStepIndex === idx;
            const isCompleted = activeStepIndex > idx;

            return (
              <button
                key={s.key}
                onClick={() => setActiveStepIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'var(--color-signal)' : 'transparent',
                  color: isActive ? '#071911' : isCompleted ? '#ffffff' : 'var(--color-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {isCompleted ? <CheckCircle2 size={12} color="#7CFFB2" /> : <Icon size={12} />}
                <span>{s.stepNumber}. {s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ask Spark AI Tutor Button */}
        <button
          onClick={onAskSpark}
          style={{
            background: 'rgba(92, 200, 255, 0.1)',
            border: '1px solid var(--color-cyan)',
            color: 'var(--color-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={14} />
          <span>Ask Spark</span>
        </button>
      </div>

      {/* =========================================================================
          MAIN LESSON CONTAINER
          ========================================================================= */}
      <div style={{
        flex: 1,
        maxWidth: '880px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 20px 80px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isLessonFinished ? (
          /* ==========================================================================
             LESSON COMPLETED SCREEN
             ========================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pcb-card-active"
            style={{ padding: '40px', textAlign: 'center' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(124, 255, 178, 0.2)',
              color: 'var(--color-signal)',
              border: '2px solid var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 24px rgba(124, 255, 178, 0.4)'
            }}>
              <Trophy size={32} />
            </div>

            <span className="chip-tag chip-tag-signal" style={{ marginBottom: '10px' }}>
              LESSON COMPLETED // 5-STEP RHYTHM MASTERED
            </span>

            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              {lesson.title}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--color-muted)', marginBottom: '28px' }}>
              You explored the pinout, experimented in the live sandbox, solved the mini-game, and debugged the hardware fault!
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              background: '#07100D',
              border: '1px solid var(--color-line)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '480px',
              margin: '0 auto 32px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>XP EARNED</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-signal)' }}>+{lesson.xpReward + 10} XP</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>ACCURACY</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cyan)' }}>100%</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>MASTERY</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-amber)' }}>LEVEL 1</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => { setIsLessonFinished(false); setActiveStepIndex(0); }} className="btn-tactile-surface">
                <RotateCcw size={14} />
                <span>Repeat Lesson</span>
              </button>
              <button onClick={onExit} className="btn-tactile-signal" style={{ fontSize: '14px', padding: '12px 24px' }}>
                <span>Continue to Next Lesson on Journey Map →</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Step Badge & Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="chip-tag chip-tag-signal" style={{ fontSize: '10px' }}>
                    STEP {currentStep.stepNumber} OF 5 // {currentStep.label}
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                    {currentStep.key === 'discover' && 'Under 90s Concept Intake'}
                    {currentStep.key === 'experiment' && 'Interactive Circuit Sandbox'}
                    {currentStep.key === 'play' && 'Quick Concept Mini-Game'}
                    {currentStep.key === 'debug' && '3-Level Fault Diagnosis'}
                    {currentStep.key === 'master' && 'Knowledge Verification & XP'}
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                  {currentStep.key === 'discover' && `1. Discover: Why Electronics Needs Binary`}
                  {currentStep.key === 'experiment' && `2. Experiment: Live Circuit Simulator`}
                  {currentStep.key === 'play' && `3. Play: Concept Prediction Challenge`}
                  {currentStep.key === 'debug' && `4. Break & Debug: The Dark LED Fault`}
                  {currentStep.key === 'master' && `5. Master: Summary & Skill Payout`}
                </h2>
              </div>

              {/* ===================================================================
                  STEP 1: DISCOVER
                  =================================================================== */}
              {currentStep.key === 'discover' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Explanation Toggle Modes (Explain Simply / Analogy) */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setExplainMode('standard')}
                      className={explainMode === 'standard' ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Technical Explanation
                    </button>
                    <button
                      onClick={() => setExplainMode('simple')}
                      className={explainMode === 'simple' ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Explain Simply (ELI5)
                    </button>
                    <button
                      onClick={() => setExplainMode('analogy')}
                      className={explainMode === 'analogy' ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Real-World Analogy (Water Pipe)
                    </button>
                  </div>

                  {/* Core Explanation Box */}
                  <div className="pcb-card" style={{ padding: '24px', lineHeight: 1.6, fontSize: '15px' }}>
                    {explainMode === 'standard' && (
                      <p style={{ color: '#d4d4d8', margin: 0 }}>
                        In digital electronics, information is represented using two electrical voltage states:
                        <strong style={{ color: 'var(--color-signal)' }}> HIGH (typically +5.0 Volts, logic 1)</strong> and
                        <strong style={{ color: 'var(--color-muted)' }}> LOW (0.0 Volts / Ground, logic 0)</strong>.
                        When an electrical loop is closed, voltage pushes electrons through a current-limiting resistor into the light-emitting diode (LED), forward-biasing the p-n junction to release photons.
                      </p>
                    )}

                    {explainMode === 'simple' && (
                      <p style={{ color: '#d4d4d8', margin: 0 }}>
                        Think of electricity like a light switch on your wall: it is either <strong style={{ color: 'var(--color-signal)' }}>ON (1)</strong> or <strong style={{ color: 'var(--color-muted)' }}>OFF (0)</strong>.
                        There is no in-between in digital circuits. By using millions of these tiny 1s and 0s very quickly, computers can display videos, run code, and talk to satellites!
                      </p>
                    )}

                    {explainMode === 'analogy' && (
                      <p style={{ color: '#d4d4d8', margin: 0 }}>
                        <strong>The Water Pipeline Analogy:</strong>
                        Imagine a closed loop of water pipes. <strong style={{ color: 'var(--color-cyan)' }}>Voltage (5V)</strong> is water pressure from a water pump.
                        <strong style={{ color: 'var(--color-amber)' }}> Current (mA)</strong> is the speed of flowing water.
                        The <strong style={{ color: '#ffffff' }}>Resistor</strong> is a narrow pipe that restricts the flow so the pipe doesn't burst.
                        The <strong style={{ color: 'var(--color-signal)' }}>LED</strong> is a water wheel that spins and emits light whenever water rushes through!
                      </p>
                    )}
                  </div>

                  {/* Interactive Component Exploration (Click to inspect pinout) */}
                  <div className="pcb-card" style={{ padding: '20px', background: '#07100D', border: '1px solid var(--color-line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="font-pixel" style={{ fontSize: '11px', color: 'var(--color-signal)' }}>
                        CLICK A COMPONENT TO INSPECT ITS FUNCTION:
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                        Active: {componentInfo[inspectedComponent || 'led'].title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {Object.keys(componentInfo).map((key) => {
                        const item = componentInfo[key];
                        const isSelected = inspectedComponent === key;

                        return (
                          <button
                            key={key}
                            onClick={() => setInspectedComponent(key)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: isSelected ? 'rgba(124, 255, 178, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid',
                              borderColor: isSelected ? 'var(--color-signal)' : 'rgba(255, 255, 255, 0.1)',
                              color: isSelected ? 'var(--color-signal)' : '#d4d4d8',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>{item.symbol}</span>
                            <span>{item.title.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {inspectedComponent && (
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--color-line)',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '13px'
                      }}>
                        <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                          {componentInfo[inspectedComponent].title}
                        </div>
                        <div style={{ color: '#d4d4d8', marginBottom: '8px', lineHeight: 1.5 }}>
                          {componentInfo[inspectedComponent].role}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={14} />
                          <span><strong>What if missing?</strong> {componentInfo[inspectedComponent].missingRisk}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===================================================================
                  STEP 2: EXPERIMENT (Live Sandbox)
                  =================================================================== */}
              {currentStep.key === 'experiment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px', background: '#050a08', border: '1px solid var(--color-line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                      <span className="font-pixel" style={{ fontSize: '12px', color: 'var(--color-signal)' }}>
                        LIVE CIRCUIT SANDBOX & TELEMETRY
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setPowerOn(true);
                            setInputA(1);
                            setResistanceOhms(220);
                            setVoltageSupply(5.0);
                            setSimulatorInsight(null);
                          }}
                          className="btn-tactile-surface"
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          <RefreshCw size={12} />
                          <span>Reset</span>
                        </button>

                        <button
                          onClick={() => {
                            setSimulatorInsight(
                              powerOn && inputA === 1
                                ? `Current = (Vsupply - Vled) / R = (${voltageSupply}V - 2.0V) / ${resistanceOhms}Ω = ${currentMilliamps} mA. This is within safe operating range (<20mA).`
                                : `Circuit is open! Current is 0.0 mA because the input switch is LOW (0V).`
                            );
                          }}
                          className="btn-tactile-signal"
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          <Sparkles size={12} />
                          <span>Explain What I'm Seeing</span>
                        </button>
                      </div>
                    </div>

                    {/* Circuit Visual Canvas */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: '32px 20px',
                      background: '#040807',
                      borderRadius: '12px',
                      border: '1px solid #1a2822',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}>
                      {/* Power & Logic Switches */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setPowerOn(!powerOn)}
                          className={powerOn ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                          style={{ padding: '8px 14px', fontSize: '11px' }}
                        >
                          <Power size={14} />
                          <span>{powerOn ? '5V VCC: ON' : '5V VCC: OFF'}</span>
                        </button>
                        <button
                          onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                          className={inputA === 1 ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                        >
                          <span>INPUT A: {inputA === 1 ? '1 (HIGH)' : '0 (LOW)'}</span>
                        </button>
                        <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                          SWITCH / LOGIC PIN
                        </div>
                      </div>

                      {/* Wire Vector Indicator */}
                      <div style={{
                        fontSize: '18px',
                        color: powerOn && inputA === 1 ? 'var(--color-signal)' : 'var(--color-line)',
                        fontWeight: 700
                      }}>
                        ──► {voltageSupply}V ──►
                      </div>

                      {/* Resistor Badge with live Ohm readout */}
                      <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>RESISTOR</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{resistanceOhms} Ω</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                          ΔV = {effectiveVoltage.toFixed(1)}V
                        </div>
                      </div>

                      <div style={{
                        fontSize: '18px',
                        color: powerOn && inputA === 1 ? 'var(--color-signal)' : 'var(--color-line)',
                        fontWeight: 700
                      }}>
                        ──► {currentMilliamps}mA ──►
                      </div>

                      {/* Virtual LED */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: powerOn && inputA === 1 ? 'var(--color-signal)' : '#1a2923',
                          boxShadow: powerOn && inputA === 1 ? `0 0 ${Math.min(40, currentMilliamps * 2)}px var(--color-signal)` : 'none',
                          margin: '0 auto 8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: powerOn && inputA === 1 ? '#071911' : '#455952',
                          transition: 'all 0.2s ease'
                        }}>
                          <Zap size={24} />
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: powerOn && inputA === 1 ? 'var(--color-signal)' : 'var(--color-muted)',
                          fontWeight: 700
                        }}>
                          {powerOn && inputA === 1 ? 'LED EMITTING LIGHT' : 'LED UNLIT (0V)'}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Knobs & Sliders */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      {/* Resistance Slider */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--color-muted)' }}>Resistance (R):</span>
                          <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>{resistanceOhms} Ω</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="10"
                          value={resistanceOhms}
                          onChange={(e) => setResistanceOhms(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-signal)', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-muted)', marginTop: '4px' }}>
                          <span>100Ω (Bright)</span>
                          <span>220Ω (Safe)</span>
                          <span>1kΩ (Dim)</span>
                        </div>
                      </div>

                      {/* Supply Voltage Slider */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--color-muted)' }}>Supply Voltage (V):</span>
                          <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>{voltageSupply.toFixed(1)} V</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="9"
                          step="0.5"
                          value={voltageSupply}
                          onChange={(e) => setVoltageSupply(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-muted)', marginTop: '4px' }}>
                          <span>0V (Off)</span>
                          <span>5V (TTL Logic)</span>
                          <span>9V (Battery)</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Tutor Simulator Insight Banner */}
                    {simulatorInsight && (
                      <div style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(92, 200, 255, 0.08)',
                        border: '1px solid var(--color-cyan)',
                        color: 'var(--color-cyan)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Lightbulb size={18} style={{ flexShrink: 0 }} />
                        <span>{simulatorInsight}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===================================================================
                  STEP 3: PLAY (Concept Mini-Game)
                  =================================================================== */}
              {currentStep.key === 'play' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="font-pixel" style={{ fontSize: '11px', color: 'var(--color-signal)' }}>
                        MINI-GAME: GATE & VOLTAGE PREDICTOR
                      </span>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', fontWeight: 700 }}>
                        +10 XP BONUS
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                      Challenge: What happens if you connect a 5V supply directly to a raw LED without any resistor?
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                      {[
                        { key: 'A', text: 'The LED will glow normally forever.', correct: false, explanation: 'Incorrect! An LED has very low internal resistance when forward-biased.' },
                        { key: 'B', text: 'Excessive current flows, burning out the LED permanently.', correct: true, explanation: 'Spot on! Without a resistor to drop the voltage and limit current, over 100mA rushes through, causing thermal runaway.' },
                        { key: 'C', text: 'The voltage drops to 0V automatically.', correct: false, explanation: 'Incorrect. The power supply maintains 5V unless short-circuit protection kicks in.' },
                        { key: 'D', text: 'The LED switches to emitting blue light instead of green.', correct: false, explanation: 'The color of an LED is fixed by the semiconductor bandgap material.' },
                      ].map((opt) => {
                        const isSelected = playPrediction === opt.key;

                        return (
                          <div
                            key={opt.key}
                            onClick={() => {
                              if (!playChecked) setPlayPrediction(opt.key);
                            }}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isSelected
                                ? (playChecked ? (opt.correct ? 'var(--color-signal)' : 'var(--color-fault)') : 'var(--color-cyan)')
                                : 'rgba(255, 255, 255, 0.08)',
                              background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                              cursor: playChecked ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span
                                className="font-pixel"
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '4px',
                                  background: isSelected ? 'var(--color-signal)' : 'rgba(255, 255, 255, 0.08)',
                                  color: isSelected ? '#07080a' : '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 700
                                }}
                              >
                                {opt.key}
                              </span>
                              <span style={{ fontSize: '14px', color: '#ffffff' }}>{opt.text}</span>
                            </div>

                            {playChecked && isSelected && (
                              opt.correct ? <CheckCircle2 size={18} color="var(--color-signal)" /> : <AlertCircle size={18} color="var(--color-fault)" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!playChecked && playPrediction && (
                      <button
                        onClick={() => {
                          setPlayChecked(true);
                          if (playPrediction === 'B') {
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                          }
                        }}
                        className="btn-tactile-signal"
                        style={{ marginTop: '18px', alignSelf: 'flex-start' }}
                      >
                        Verify Prediction →
                      </button>
                    )}

                    {playChecked && (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        borderRadius: '8px',
                        background: playPrediction === 'B' ? 'rgba(124, 255, 178, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                        border: `1px solid ${playPrediction === 'B' ? 'var(--color-signal)' : 'var(--color-fault)'}`,
                        color: playPrediction === 'B' ? 'var(--color-signal)' : 'var(--color-fault)',
                        fontSize: '13px'
                      }}>
                        <strong>{playPrediction === 'B' ? 'Success! +10 XP earned' : 'Take Note:'}</strong>{' '}
                        Without a resistor, the diode receives full unconstrained current and burns out instantly. This is why a 220Ω or 330Ω resistor is standard practice!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===================================================================
                  STEP 4: BREAK & DEBUG (Hardware Fault Challenge)
                  =================================================================== */}
              {currentStep.key === 'debug' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px', background: '#070a08', border: '1px solid var(--color-line)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <AlertCircle size={18} color="var(--color-fault)" />
                      <span className="font-pixel" style={{ color: 'var(--color-fault)', fontSize: '12px' }}>
                        SYMPTOM REPORT: THE UNLIT LED ANOMALY
                      </span>
                    </div>

                    <p style={{ fontSize: '15px', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
                      The student placed the switch in the ON position and connected the 5V power supply, but the LED remains completely dark.
                      Inspect the circuit using the virtual multimeter probe to isolate the fault.
                    </p>

                    {/* Virtual Multimeter Probe Inspection Tool */}
                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      background: '#040807',
                      borderRadius: '10px',
                      border: '1px solid #1c2723'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                          VIRTUAL MULTIMETER PROBE:
                        </span>
                        {debugProbePoint && (
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: debugProbePoint === 'tp3' && !circuitRepaired ? 'var(--color-fault)' : 'var(--color-signal)'
                          }}>
                            {debugProbePoint === 'tp1' && 'TP1 (VCC IN): 5.00V [NORMAL]'}
                            {debugProbePoint === 'tp2' && 'TP2 (AFTER RESISTOR): 5.00V [NORMAL]'}
                            {debugProbePoint === 'tp3' && (!circuitRepaired ? 'TP3 (GND RETURN): 5.00V [FAULT DETECTED: OPEN RETURN LOOP!]' : 'TP3 (GND RETURN): 0.00V [GROUNDED NORMAL]')}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setDebugProbePoint('tp1')}
                          className="btn-tactile-surface"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Probe TP1 (Power Rail)
                        </button>
                        <button
                          onClick={() => setDebugProbePoint('tp2')}
                          className="btn-tactile-surface"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Probe TP2 (Resistor Out)
                        </button>
                        <button
                          onClick={() => setDebugProbePoint('tp3')}
                          className="btn-tactile-surface"
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderColor: debugProbePoint === 'tp3' ? 'var(--color-fault)' : 'var(--color-line)'
                          }}
                        >
                          Probe TP3 (Cathode to GND)
                        </button>
                      </div>
                    </div>

                    {/* 3-Level Assistance Ladder */}
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <HelpCircle size={14} />
                          <span>Assistance Ladder (Zero Penalty): Tier {hintTier}/3</span>
                        </span>

                        {hintTier < 3 && (
                          <button
                            onClick={() => setHintTier((prev) => prev + 1)}
                            className="btn-tactile-surface"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            {hintTier === 0 ? 'Need a Nudge?' : hintTier === 1 ? 'Show Approach Hint' : 'Show Guided Solution'}
                          </button>
                        )}
                      </div>

                      {hintTier >= 1 && (
                        <div style={{ fontSize: '13px', color: '#ffffff', marginTop: '6px', lineHeight: 1.4 }}>
                          <strong>Level 1 Nudge:</strong> Notice where voltage stops dropping. If TP3 reads 5.0V, current is blocked from completing the loop to Ground (0V).
                        </div>
                      )}
                      {hintTier >= 2 && (
                        <div style={{ fontSize: '13px', color: 'var(--color-amber)', marginTop: '6px', lineHeight: 1.4 }}>
                          <strong>Level 2 Approach:</strong> The cathode pin of the LED is disconnected from the black breadboard Ground rail.
                        </div>
                      )}
                      {hintTier >= 3 && (
                        <div style={{ fontSize: '13px', color: 'var(--color-signal)', marginTop: '6px', lineHeight: 1.4 }}>
                          <strong>Level 3 Guided Solution:</strong> Click the repair button below to insert a jumper wire connecting the cathode directly to GND!
                        </div>
                      )}
                    </div>

                    {/* Interactive Fix Action */}
                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      background: '#040807',
                      borderRadius: '10px',
                      border: `1px dashed ${circuitRepaired ? 'var(--color-signal)' : 'var(--color-fault)'}`,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        color: circuitRepaired ? 'var(--color-signal)' : 'var(--color-fault)',
                        marginBottom: '12px',
                        fontWeight: 700
                      }}>
                        {circuitRepaired
                          ? 'FAULT REPAIRED: GROUND JUMPER SECURED. LED GLOWING ✓'
                          : 'FAULT ACTIVE: FLOATING CATHODE (OPEN GROUND BREAK) ✗'}
                      </div>

                      <button
                        onClick={() => {
                          setCircuitRepaired(true);
                          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                        }}
                        className={circuitRepaired ? 'btn-tactile-signal' : 'btn-tactile-amber'}
                        style={{ padding: '10px 20px', fontSize: '13px' }}
                      >
                        <RefreshCw size={14} />
                        <span>{circuitRepaired ? 'Jumper Connected ✓' : 'Solder & Connect Ground Jumper Wire'}</span>
                      </button>

                      {circuitRepaired && (
                        <div style={{ fontSize: '12px', color: '#d4d4d8', marginTop: '12px', lineHeight: 1.4 }}>
                          <strong>Why this works:</strong> Current requires a closed continuous circuit from +5V to 0V. Connecting the ground wire completed the electron return path!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================================
                  STEP 5: MASTER (Cheat Sheet & Payout)
                  =================================================================== */}
              {currentStep.key === 'master' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Practical Assessment Question */}
                  <div className="pcb-card" style={{ padding: '24px' }}>
                    <span className="font-pixel" style={{ fontSize: '11px', color: 'var(--color-signal)' }}>
                      FINAL MASTERY CHECK
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: '8px', marginBottom: '14px' }}>
                      In high-speed digital communications, what does a logic 0 represent?
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { text: 'A voltage level at or near 0V Ground reference.', correct: true },
                        { text: 'A disconnected wire.', correct: false },
                        { text: 'An infinitely high resistance.', correct: false },
                      ].map((ans, idx) => {
                        const isChosen = masterQuestionAnswered === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => setMasterQuestionAnswered(idx)}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '8px',
                              background: isChosen ? 'rgba(124, 255, 178, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid',
                              borderColor: isChosen ? 'var(--color-signal)' : 'rgba(255, 255, 255, 0.08)',
                              color: isChosen ? 'var(--color-signal)' : '#ffffff',
                              textAlign: 'left',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            {ans.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Concept Saved to Cheat Sheet */}
                  <div className="pcb-card-active" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <ShieldCheck size={18} color="var(--color-signal)" />
                      <span className="font-pixel" style={{ fontSize: '11px', color: 'var(--color-signal)' }}>
                        SAVED TO HARDWARE CHEAT SHEET
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', color: '#ffffff', lineHeight: 1.5, fontWeight: 600 }}>
                      "Digital electronics relies on binary voltage thresholds: HIGH (+5V) and LOW (0V). An LED always requires a current-limiting resistor and a closed path back to Ground."
                    </div>

                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: 'var(--color-muted)'
                    }}>
                      <span>Digital Logic Skill Mastery:</span>
                      <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>+15% (Level 1 Ready)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================================
                  BOTTOM STEP NAVIGATION BUTTONS
                  =================================================================== */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-line)',
                marginTop: '16px'
              }}>
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="btn-tactile-surface"
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    opacity: activeStepIndex === 0 ? 0.3 : 1,
                    cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="btn-tactile-signal"
                  style={{ padding: '10px 24px', fontSize: '13px' }}
                >
                  <span>{activeStepIndex === STEPS.length - 1 ? 'Complete Lesson & Claim XP 🏆' : `Continue to ${STEPS[activeStepIndex + 1].label} →`}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
