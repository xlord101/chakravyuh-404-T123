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
  RotateCcw,
  Award
} from 'lucide-react';
import { CURRICULUM_TRACKS } from '../../data/curriculumData';
import type { Lesson } from '../../data/curriculumData';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: (lessonId: string) => void;
  onExit: () => void;
  onAskSpark: (prompt?: string) => void;
}

type StepKey = 'discover' | 'experiment' | 'play' | 'debug' | 'master';

const STEPS: { key: StepKey; stepNumber: number; label: string; icon: any }[] = [
  { key: 'discover', stepNumber: 1, label: 'DISCOVER', icon: Eye },
  { key: 'experiment', stepNumber: 2, label: 'EXPERIMENT', icon: Zap },
  { key: 'play', stepNumber: 3, label: 'PLAY', icon: Play },
  { key: 'debug', stepNumber: 4, label: 'BREAK & DEBUG', icon: Wrench },
  { key: 'master', stepNumber: 5, label: 'MASTER & QUIZ', icon: Trophy },
];

interface QuizQuestion {
  id: number;
  archetype: string;
  question: string;
  options: { key: string; text: string; correct: boolean; explanation: string }[];
  weakTopicTag: string;
}

const FIVE_QUESTION_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    archetype: 'MCQ Concept Check',
    question: 'In standard TTL digital logic, what electrical voltage potential corresponds to a binary 1 (HIGH)?',
    options: [
      { key: 'A', text: '0.0 Volts (Ground reference)', correct: false, explanation: '0V represents logic LOW (binary 0).' },
      { key: 'B', text: '+5.0 Volts (Nominal VCC rail)', correct: true, explanation: 'Correct! +5V is the standard TTL logic HIGH threshold representing binary 1.' },
      { key: 'C', text: '-12.0 Volts (Negative rail)', correct: false, explanation: 'Negative voltages are used in RS-232, not standard digital logic gates.' },
      { key: 'D', text: 'Any floating unconnected pin', correct: false, explanation: 'A floating pin has an indeterminate voltage that causes intermittent noise errors.' },
    ],
    weakTopicTag: 'TTL Voltage Thresholds',
  },
  {
    id: 2,
    archetype: 'Deep Concept Understanding',
    question: 'Why is a current-limiting resistor strictly mandatory in series with an LED on a 5V supply?',
    options: [
      { key: 'A', text: 'To convert alternating current into direct current.', correct: false, explanation: 'That is the function of a rectifier diode bridge, not a resistor.' },
      { key: 'B', text: 'An LED has negligible internal resistance when forward-biased, causing destructive overcurrent without a resistor.', correct: true, explanation: 'Spot on! Once the forward voltage threshold (~2V) is crossed, current rises exponentially. A 220Ω resistor limits current to a safe ~13.6mA.' },
      { key: 'C', text: 'To store digital firmware code.', correct: false, explanation: 'Resistors cannot store instructions; that requires flash memory.' },
      { key: 'D', text: 'To invert binary 1 into binary 0.', correct: false, explanation: 'Inversion is performed by a NOT gate, not a passive resistor.' },
    ],
    weakTopicTag: 'Current Limiting & Ohm\'s Law',
  },
  {
    id: 3,
    archetype: 'Output & Waveform Prediction',
    question: 'If an AND gate receives Input A = 1 (+5V) and Input B = 0 (0V), what is the measured output voltage at its pin?',
    options: [
      { key: 'A', text: '0.0 Volts (Logic 0 / LOW)', correct: true, explanation: 'Correct! An AND gate requires ALL inputs to be logic HIGH (1). With Input B at 0, the output stays at 0V.' },
      { key: 'B', text: '+5.0 Volts (Logic 1 / HIGH)', correct: false, explanation: 'An output of 5V only occurs if both inputs are simultaneously 1.' },
      { key: 'C', text: '+2.5 Volts (Average voltage)', correct: false, explanation: 'Digital logic gates output discrete binary rails (0V or 5V), never intermediate averages.' },
      { key: 'D', text: 'High-impedance floating state', correct: false, explanation: 'Standard logic gates drive their outputs actively to 0V or 5V.' },
    ],
    weakTopicTag: 'AND Gate Truth Evaluation',
  },
  {
    id: 4,
    archetype: 'Practical Scenario Diagnostic',
    question: 'An industrial safety switch connects to an Arduino pin. When the button is NOT pressed, the input pin reads erratic fluctuating random 1s and 0s. What is the cause?',
    options: [
      { key: 'A', text: 'The microcontroller clock frequency is too slow.', correct: false, explanation: 'Clock frequency affects execution speed, not pin voltage stability.' },
      { key: 'B', text: 'The input is floating and picking up electromagnetic radio interference; it needs a 10kΩ pull-down resistor to GND.', correct: true, explanation: 'Exact diagnostic! High-impedance input pins act as antennas unless tied to a defined voltage via a pull-up or pull-down resistor.' },
      { key: 'C', text: 'The C++ code has a compiler syntax error.', correct: false, explanation: 'Syntax errors prevent code compilation; they do not cause random hardware fluctuations.' },
      { key: 'D', text: 'The power supply voltage is too stable.', correct: false, explanation: 'Power supply stability is desirable and prevents noise.' },
    ],
    weakTopicTag: 'Floating Inputs & Pull-Down Resistors',
  },
  {
    id: 5,
    archetype: 'Circuit Synthesis',
    question: 'According to Ohm\'s Law (I = V / R), what resistor value is needed to limit current to 15mA from a 5V supply with a 2.0V LED forward drop?',
    options: [
      { key: 'A', text: '10 Ohms', correct: false, explanation: '10Ω would allow 300mA, instantly destroying the diode!' },
      { key: 'B', text: '200 Ohms (R = (5V - 2V) / 0.015A = 200Ω)', correct: true, explanation: 'Precise engineering! Effective voltage is 3.0V. 3.0V / 0.015A = 200Ω. In practice, a standard 220Ω resistor is used.' },
      { key: 'C', text: '10,000 Ohms (10kΩ)', correct: false, explanation: '10kΩ would limit current to 0.3mA, leaving the LED invisibly dim.' },
      { key: 'D', text: '0 Ohms (Direct wire)', correct: false, explanation: '0Ω is a direct short circuit!' },
    ],
    weakTopicTag: 'Ohm\'s Law Component Calculation',
  },
];

export const LessonPlayer = ({
  lessonId,
  onComplete,
  onExit,
  onAskSpark
}: LessonPlayerProps) => {
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

  // STEP 1: DISCOVER
  const [explainMode, setExplainMode] = useState<'standard' | 'simple' | 'analogy' | 'realworld'>('standard');
  const [inspectedComponent, setInspectedComponent] = useState<string | null>('led');

  // STEP 2: EXPERIMENT
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [inputA, setInputA] = useState<number>(1);
  const [resistanceOhms, setResistanceOhms] = useState<number>(220);
  const [voltageSupply, setVoltageSupply] = useState<number>(5.0);
  const [simulatorInsight, setSimulatorInsight] = useState<string | null>(null);

  const ledForwardVoltage = 2.0;
  const effectiveVoltage = Math.max(0, voltageSupply - ledForwardVoltage);
  const currentMilliamps = powerOn && (inputA === 1)
    ? Math.round((effectiveVoltage / resistanceOhms) * 1000 * 10) / 10
    : 0;

  // STEP 3: PLAY (Mini-Game)
  const [playPrediction, setPlayPrediction] = useState<string | null>(null);
  const [playChecked, setPlayChecked] = useState<boolean>(false);

  // STEP 4: BREAK & DEBUG
  const [debugProbePoint, setDebugProbePoint] = useState<'tp1' | 'tp2' | 'tp3' | null>(null);
  const [hintTier, setHintTier] = useState<number>(0);
  const [circuitRepaired, setCircuitRepaired] = useState<boolean>(false);

  // STEP 5: MASTER & 5-QUESTION QUIZ
  const [currentQuizQIndex, setCurrentQuizQIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [identifiedWeakTopics, setIdentifiedWeakTopics] = useState<string[]>([]);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(false);

  const activeQuizQ = FIVE_QUESTION_QUIZ[currentQuizQIndex];

  const handleSelectQuizOption = (key: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [activeQuizQ.id]: key }));
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizQIndex < FIVE_QUESTION_QUIZ.length - 1) {
      setCurrentQuizQIndex((prev) => prev + 1);
    } else {
      // Evaluate quiz results
      const weakTopics: string[] = [];
      FIVE_QUESTION_QUIZ.forEach((q) => {
        const userChoice = quizAnswers[q.id];
        const correctOpt = q.options.find((opt) => opt.correct);
        if (userChoice !== correctOpt?.key) {
          weakTopics.push(q.weakTopicTag);
        }
      });
      setIdentifiedWeakTopics(weakTopics);
      setQuizSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5CDBB5', '#4EA8DE', '#E5A93C'],
      });
    }
  };

  const handlePrevQuizQuestion = () => {
    if (currentQuizQIndex > 0) {
      setCurrentQuizQIndex((prev) => prev - 1);
    }
  };

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
        colors: ['#5CDBB5', '#4EA8DE', '#E5A93C'],
      });
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const componentInfo: Record<string, { title: string; symbol: string; role: string; missingRisk: string }> = {
    led: {
      title: 'Light Emitting Diode (LED)',
      symbol: '►|─',
      role: 'A semiconductor p-n junction that converts electrical energy into photons when forward-biased.',
      missingRisk: 'Without an LED, the circuit has no optical output to confirm logic HIGH.',
    },
    resistor: {
      title: 'Current-Limiting Resistor (220Ω)',
      symbol: '─/\\/\\/\\─',
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

  const quizCorrectCount = FIVE_QUESTION_QUIZ.filter((q) => {
    const chosen = quizAnswers[q.id];
    return q.options.find((opt) => opt.key === chosen)?.correct;
  }).length;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      position: 'relative'
    }}>
      {/* Top Header & 5-Step Rhythm Stepper */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-line)',
        background: '#0F1815',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Exit & Chapter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onExit}
            className="btn-tactile-surface"
            style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
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
          border: '1px solid var(--color-line)',
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
                {isCompleted ? <CheckCircle2 size={12} color="var(--color-signal)" /> : <Icon size={12} />}
                <span>{s.stepNumber}. {s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Spark AI Tutor Button */}
        <button
          onClick={() => onAskSpark(`I'm working on ${lesson.title}. Can you explain the core concept?`)}
          className="btn-tactile-surface"
          style={{
            borderColor: 'var(--color-cyan)',
            color: 'var(--color-cyan)',
            fontSize: '11px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={13} />
          <span>Ask Spark</span>
        </button>
      </div>

      {/* Main Body */}
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
          /* Lesson Completed Screen */
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
              background: 'rgba(92, 219, 181, 0.15)',
              color: 'var(--color-signal)',
              border: '2px solid var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 24px rgba(92, 219, 181, 0.3)'
            }}>
              <Award size={30} />
            </div>

            <span className="chip-tag chip-tag-signal" style={{ marginBottom: '10px' }}>
              LESSON COMPLETED // MASTERY EARNED
            </span>

            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              {lesson.title}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--color-muted)', marginBottom: '28px', maxWidth: '580px', margin: '0 auto 28px' }}>
              You verified the physical theory in the simulator, predicted circuit behavior, repaired the hardware fault, and completed the 5-question evaluation!
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              background: '#0F1815',
              border: '1px solid var(--color-line)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '480px',
              margin: '0 auto 32px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>XP EARNED</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-signal)' }}>+{lesson.xpReward + 15} XP</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>QUIZ ACCURACY</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-cyan)' }}>{Math.round((quizCorrectCount / 5) * 100)}%</div>
              </div>
              <div style={{ borderRight: '1px solid var(--color-line)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>CONCEPT RADAR</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-amber)' }}>+20%</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setIsLessonFinished(false);
                  setActiveStepIndex(0);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  setCurrentQuizQIndex(0);
                }}
                className="btn-tactile-surface"
              >
                <RotateCcw size={14} />
                <span>Repeat Lesson & Quiz</span>
              </button>
              <button onClick={onExit} className="btn-tactile-signal" style={{ fontSize: '14px', padding: '12px 24px' }}>
                <span>Continue on Journey Map →</span>
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
              {/* Header Badge & Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="chip-tag chip-tag-signal" style={{ fontSize: '10px' }}>
                    STEP {currentStep.stepNumber} OF 5 // {currentStep.label}
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                    {currentStep.key === 'discover' && 'Under 90s Concept Intake & Industrial Scope'}
                    {currentStep.key === 'experiment' && 'Interactive Circuit Sandbox'}
                    {currentStep.key === 'play' && 'Quick Concept Mini-Game'}
                    {currentStep.key === 'debug' && '3-Level Fault Forensics'}
                    {currentStep.key === 'master' && '5-Question Adaptive Quiz & Evaluation'}
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                  {currentStep.key === 'discover' && `1. Discover: Why Electronics Needs Binary`}
                  {currentStep.key === 'experiment' && `2. Experiment: Live Circuit Simulator`}
                  {currentStep.key === 'play' && `3. Play: Concept Prediction Challenge`}
                  {currentStep.key === 'debug' && `4. Break & Debug: The Dark LED Fault`}
                  {currentStep.key === 'master' && `5. Master: 5-Question Evaluation & Cheat Sheet`}
                </h2>
              </div>

              {/* STEP 1: DISCOVER */}
              {currentStep.key === 'discover' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                      Water Pipeline Analogy
                    </button>
                    <button
                      onClick={() => setExplainMode('realworld')}
                      className={explainMode === 'realworld' ? 'btn-tactile-signal' : 'btn-tactile-surface'}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Real-World & Industry Scope
                    </button>
                  </div>

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
                        Imagine a closed loop of water pipes. <strong style={{ color: 'var(--color-cyan)' }}>Voltage (5V)</strong> is water pressure from a pump.
                        <strong style={{ color: 'var(--color-amber)' }}> Current (mA)</strong> is the speed of flowing water.
                        The <strong style={{ color: '#ffffff' }}>Resistor</strong> is a narrow pipe that restricts the flow so the pipe doesn't burst.
                        The <strong style={{ color: 'var(--color-signal)' }}>LED</strong> is a water wheel that spins and emits light whenever water rushes through!
                      </p>
                    )}

                    {explainMode === 'realworld' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#d4d4d8' }}>
                        <div>
                          <strong style={{ color: 'var(--color-signal)' }}>Where This Is Implemented in Real Life:</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                            Every modern smartphone, electric vehicle ECU, and satellite communication transceiver relies on these exact 5V / 3.3V logic thresholds. Status LEDs provide instant visual telemetry for hard disk activity, network link states, and battery management systems (BMS).
                          </p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--color-amber)' }}>Practical Mini-Project:</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                            Automotive Fault Indicator: Build a dual-LED interlock circuit that warns drivers when door latches are open while the engine is running.
                          </p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--color-cyan)' }}>Future Scope:</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                            Edge AI microchips (like Google Coral and ARM Cortex-M55) use nano-volt logic levels (0.8V) to process neural networks directly on edge sensors with microwatt power budgets!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Component Exploration */}
                  <div className="pcb-card" style={{ padding: '20px', background: '#0F1815' }}>
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
                              background: isSelected ? 'rgba(92, 219, 181, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid',
                              borderColor: isSelected ? 'var(--color-signal)' : 'var(--color-line)',
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
                        background: '#080D0B',
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

              {/* STEP 2: EXPERIMENT */}
              {currentStep.key === 'experiment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px', background: '#080D0B' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                      <span className="font-pixel" style={{ fontSize: '12px', color: 'var(--color-signal)' }}>
                        LIVE CIRCUIT SANDBOX &amp; TELEMETRY
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

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      padding: '32px 20px',
                      background: '#040806',
                      borderRadius: '12px',
                      border: '1px solid #1a2822',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}>
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
                      </div>

                      <div style={{
                        fontSize: '18px',
                        color: powerOn && inputA === 1 ? 'var(--color-signal)' : 'var(--color-line)',
                        fontWeight: 700
                      }}>
                        ──► {voltageSupply}V ──►
                      </div>

                      <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--color-line)',
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

                    {/* Sliders */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      <div style={{ background: '#0F1815', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-line)' }}>
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
                      </div>

                      <div style={{ background: '#0F1815', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-line)' }}>
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
                      </div>
                    </div>

                    {simulatorInsight && (
                      <div style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(78, 168, 222, 0.08)',
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

              {/* STEP 3: PLAY */}
              {currentStep.key === 'play' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="font-pixel" style={{ fontSize: '11px', color: 'var(--color-signal)' }}>
                        MINI-GAME: GATE &amp; VOLTAGE PREDICTOR
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
                                : 'var(--color-line)',
                              background: isSelected ? 'rgba(255, 255, 255, 0.05)' : '#0F1815',
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
                        background: playPrediction === 'B' ? 'rgba(92, 219, 181, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        border: `1px solid ${playPrediction === 'B' ? 'var(--color-signal)' : 'var(--color-fault)'}`,
                        color: playPrediction === 'B' ? 'var(--color-signal)' : 'var(--color-fault)',
                        fontSize: '13px'
                      }}>
                        <strong>{playPrediction === 'B' ? 'Success! +10 XP earned.' : 'Take Note:'}</strong>{' '}
                        Without a resistor, the diode receives full unconstrained current and burns out instantly. This is why a 220Ω or 330Ω resistor is standard practice!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: BREAK & DEBUG */}
              {currentStep.key === 'debug' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="pcb-card" style={{ padding: '24px', background: '#0F1815' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <AlertCircle size={18} color="var(--color-fault)" />
                      <span className="font-pixel" style={{ color: 'var(--color-fault)', fontSize: '12px' }}>
                        SYMPTOM REPORT: THE UNLIT LED ANOMALY
                      </span>
                    </div>

                    <p style={{ fontSize: '15px', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
                      The switch is in the ON position and 5V is supplied, but the LED remains dark.
                      Inspect the circuit using the virtual multimeter probe to isolate the fault.
                    </p>

                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      background: '#080D0B',
                      borderRadius: '10px',
                      border: '1px solid var(--color-line)'
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

                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#080D0B',
                      borderRadius: '8px',
                      border: '1px solid var(--color-line)'
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

                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      background: '#080D0B',
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
                          ? 'FAULT REPAIRED: GROUND JUMPER SECURED. LED GLOWING'
                          : 'FAULT ACTIVE: FLOATING CATHODE (OPEN GROUND BREAK)'}
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
                        <span>{circuitRepaired ? 'Jumper Connected' : 'Solder & Connect Ground Jumper Wire'}</span>
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

              {/* STEP 5: MASTER & 5-QUESTION ADAPTIVE QUIZ */}
              {currentStep.key === 'master' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {!quizSubmitted ? (
                    /* The 5-Question Adaptive Quiz Container */
                    <div className="pcb-card" style={{ padding: '28px', background: '#0F1815' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-pixel chip-tag chip-tag-signal" style={{ fontSize: '9px' }}>
                            QUESTION {currentQuizQIndex + 1} OF 5
                          </span>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                            // {activeQuizQ.archetype.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', fontWeight: 700 }}>
                          +5 XP EACH
                        </span>
                      </div>

                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '18px', lineHeight: 1.4 }}>
                        {activeQuizQ.question}
                      </h3>

                      {/* 4 Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {activeQuizQ.options.map((opt) => {
                          const isSelected = quizAnswers[activeQuizQ.id] === opt.key;

                          return (
                            <div
                              key={opt.key}
                              onClick={() => handleSelectQuizOption(opt.key)}
                              style={{
                                padding: '14px 18px',
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: isSelected ? 'var(--color-signal)' : 'var(--color-line)',
                                background: isSelected ? 'rgba(92, 219, 181, 0.1)' : '#080D0B',
                                cursor: 'pointer',
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
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '6px',
                                    background: isSelected ? 'var(--color-signal)' : 'rgba(255, 255, 255, 0.05)',
                                    color: isSelected ? '#071911' : '#a1a1aa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 700
                                  }}
                                >
                                  {opt.key}
                                </span>
                                <span style={{ fontSize: '14px', color: isSelected ? '#ffffff' : '#d4d4d8' }}>
                                  {opt.text}
                                </span>
                              </div>

                              {isSelected && <CheckCircle2 size={18} color="var(--color-signal)" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz Pager Controls */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--color-line)'
                      }}>
                        <button
                          onClick={handlePrevQuizQuestion}
                          disabled={currentQuizQIndex === 0}
                          className="btn-tactile-surface"
                          style={{
                            fontSize: '12px',
                            padding: '8px 16px',
                            opacity: currentQuizQIndex === 0 ? 0.35 : 1,
                            cursor: currentQuizQIndex === 0 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <ArrowLeft size={13} />
                          <span>Previous Question</span>
                        </button>

                        <button
                          onClick={handleNextQuizQuestion}
                          disabled={!quizAnswers[activeQuizQ.id]}
                          className="btn-tactile-signal"
                          style={{
                            fontSize: '12px',
                            padding: '8px 20px',
                            opacity: !quizAnswers[activeQuizQ.id] ? 0.4 : 1,
                            cursor: !quizAnswers[activeQuizQ.id] ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <span>{currentQuizQIndex === FIVE_QUESTION_QUIZ.length - 1 ? 'Submit & Review Quiz' : 'Next Question →'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Quiz Summary & Evaluation Breakdown */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="pcb-card" style={{ padding: '28px', background: '#0F1815' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span className="font-pixel chip-tag chip-tag-signal">
                            QUIZ EVALUATION REPORT
                          </span>
                          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-signal)', fontWeight: 700 }}>
                            SCORE: {quizCorrectCount} / 5 ({Math.round((quizCorrectCount / 5) * 100)}%)
                          </span>
                        </div>

                        {/* Weak Topics Analysis */}
                        {identifiedWeakTopics.length > 0 ? (
                          <div style={{
                            padding: '16px',
                            borderRadius: '8px',
                            background: 'rgba(248, 113, 113, 0.08)',
                            border: '1px solid var(--color-fault)',
                            marginBottom: '20px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <AlertCircle size={16} color="var(--color-fault)" />
                              <strong style={{ color: 'var(--color-fault)', fontSize: '13px' }}>
                                Concepts to Reinforce:
                              </strong>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {identifiedWeakTopics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="chip-tag"
                                  style={{ background: 'rgba(248, 113, 113, 0.15)', borderColor: 'var(--color-fault)', color: '#ffffff', fontSize: '11px' }}
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => onAskSpark(`I struggled with these topics: ${identifiedWeakTopics.join(', ')}. Can you give me a clear breakdown?`)}
                              className="btn-tactile-surface"
                              style={{ marginTop: '12px', fontSize: '11px', padding: '6px 12px', gap: '6px' }}
                            >
                              <Sparkles size={12} color="var(--color-cyan)" />
                              <span>Review Weak Topics with Spark AI</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            padding: '16px',
                            borderRadius: '8px',
                            background: 'rgba(92, 219, 181, 0.08)',
                            border: '1px solid var(--color-signal)',
                            color: 'var(--color-signal)',
                            fontSize: '13px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <CheckCircle2 size={18} />
                            <span>Flawless score! All 5 concepts verified with 100% accuracy.</span>
                          </div>
                        )}

                        {/* Detailed Question Review */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {FIVE_QUESTION_QUIZ.map((q) => {
                            const userChoice = quizAnswers[q.id];
                            const correctOpt = q.options.find((opt) => opt.correct);
                            const isCorrect = userChoice === correctOpt?.key;

                            return (
                              <div
                                key={q.id}
                                style={{
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  background: '#080D0B',
                                  border: `1px solid ${isCorrect ? 'var(--color-signal)' : 'var(--color-fault)'}`,
                                  fontSize: '13px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span style={{ fontWeight: 700, color: '#ffffff' }}>Q{q.id}: {q.question}</span>
                                  <span style={{ color: isCorrect ? 'var(--color-signal)' : 'var(--color-fault)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                                  </span>
                                </div>
                                <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                                  Your Answer: {userChoice} • Correct: {correctOpt?.key}
                                </div>
                                <div style={{ color: '#d4d4d8', fontSize: '12px', marginTop: '4px' }}>
                                  {correctOpt?.explanation}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cheat Sheet Saved Card */}
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
                          <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>+20% (Level 1 Ready)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Step Actions */}
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
                  <span>
                    {activeStepIndex === STEPS.length - 1
                      ? 'Complete Lesson & Claim XP'
                      : `Continue to ${STEPS[activeStepIndex + 1].label} →`}
                  </span>
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
