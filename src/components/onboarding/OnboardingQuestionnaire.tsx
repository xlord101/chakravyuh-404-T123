import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Compass, Cpu } from 'lucide-react';

interface OnboardingQuestionnaireProps {
  onComplete: (
    answers: Record<string, string>,
    conceptScore: number,
    experienceScore: number,
    level: 'beginner' | 'intermediate',
    startingLessonId: string
  ) => void;
  onSkip: () => void;
}

interface Question {
  id: string;
  category: 'experience' | 'concept';
  question: string;
  options: { key: string; text: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'experience',
    question: 'Have you studied Electronics or ENTC before?',
    options: [
      { key: 'A', text: 'No, I am completely new.' },
      { key: 'B', text: 'I have heard of a few concepts.' },
      { key: 'C', text: 'I have studied basic electronics in class.' },
      { key: 'D', text: 'I have already built or experimented with circuits.' },
    ],
  },
  {
    id: 'q2',
    category: 'concept',
    question: 'What does a resistor mainly do in a circuit?',
    options: [
      { key: 'A', text: 'Limits the flow of electric current.' },
      { key: 'B', text: 'Stores a program.' },
      { key: 'C', text: 'Produces sound.' },
      { key: 'D', text: 'I am not sure.' },
    ],
  },
  {
    id: 'q3',
    category: 'concept',
    question: 'What is the output of an AND gate when both inputs are 1?',
    options: [
      { key: 'A', text: '0' },
      { key: 'B', text: '1' },
      { key: 'C', text: 'It always changes.' },
      { key: 'D', text: 'I am not sure.' },
    ],
  },
  {
    id: 'q4',
    category: 'experience',
    question: 'Have you ever used an Arduino or a similar microcontroller board?',
    options: [
      { key: 'A', text: 'Never used one.' },
      { key: 'B', text: 'I have seen one but not used it.' },
      { key: 'C', text: 'I have followed a basic tutorial.' },
      { key: 'D', text: 'I have written code and controlled components with one.' },
    ],
  },
  {
    id: 'q5',
    category: 'concept',
    question: 'What happens when an LED circuit is connected incorrectly?',
    options: [
      { key: 'A', text: 'It will always work normally.' },
      { key: 'B', text: 'It may not light up or may be damaged.' },
      { key: 'C', text: 'The circuit automatically repairs itself.' },
      { key: 'D', text: 'I am not sure.' },
    ],
  },
  {
    id: 'q6',
    category: 'experience',
    question: 'How comfortable are you with simple programming concepts such as variables and if/else?',
    options: [
      { key: 'A', text: 'I have never programmed.' },
      { key: 'B', text: 'I understand a few basics.' },
      { key: 'C', text: 'I can write simple programs.' },
      { key: 'D', text: 'I can write and debug programs independently.' },
    ],
  },
];

export const OnboardingQuestionnaire = ({ onComplete, onSkip }: OnboardingQuestionnaireProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [selectedLevelOverride, setSelectedLevelOverride] = useState<'beginner' | 'intermediate' | null>(null);

  const currentQ = QUESTIONS[currentQuestionIndex];
  const selectedAnswer = answers[currentQ?.id];

  const handleSelectOption = (key: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Evaluate transparent scores according to PRD Section 3.4
  const computeScores = () => {
    let conceptScore = 0;
    let experienceScore = 0;

    // Q2: A is correct (+2)
    if (answers['q2'] === 'A') conceptScore += 2;
    // Q3: B is correct (+2)
    if (answers['q3'] === 'B') conceptScore += 2;
    // Q5: B is correct (+2)
    if (answers['q5'] === 'B') conceptScore += 2;

    // Experience: Q1, Q4, Q6 (A=0, B=1, C=2, D=3)
    const expWeights: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    if (answers['q1']) experienceScore += expWeights[answers['q1']] || 0;
    if (answers['q4']) experienceScore += expWeights[answers['q4']] || 0;
    if (answers['q6']) experienceScore += expWeights[answers['q6']] || 0;

    const classifiedLevel: 'beginner' | 'intermediate' =
      conceptScore >= 4 && experienceScore >= 4 ? 'intermediate' : 'beginner';

    return {
      conceptScore,
      experienceScore,
      classifiedLevel,
    };
  };

  const { conceptScore, experienceScore, classifiedLevel } = computeScores();
  const effectiveLevel = selectedLevelOverride || classifiedLevel;
  const startingLessonId = effectiveLevel === 'intermediate' ? 'ard-1' : 'logic-1';

  const handleStartLearning = () => {
    onComplete(answers, conceptScore, experienceScore, effectiveLevel, startingLessonId);
  };

  // ---------------------------------------------------------------------------
  // RESULT SCREEN
  // ---------------------------------------------------------------------------
  if (isFinished) {
    const isBeginner = effectiveLevel === 'beginner';

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'transparent',
          color: '#f4f4f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '620px',
            width: '100%',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.28), 0 32px 64px -16px rgba(0, 0, 0, 0.9)',
          }}
        >
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="keynote-pill">
              <Sparkles size={12} color="#7CFFB2" />
              DIAGNOSTIC COMPLETE
            </span>
          </div>

          <h2
            className="font-pixel"
            style={{
              fontSize: 'clamp(20px, 3.2vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '14px',
              letterSpacing: '0.04em',
            }}
          >
            {isBeginner
              ? 'Your journey starts here: Beginner Explorer'
              : 'Your journey starts here: Circuit Explorer'}
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#a1a1aa',
              lineHeight: 1.6,
              maxWidth: '500px',
              margin: '0 auto 28px',
            }}
          >
            {isBeginner
              ? "You don't need to know everything already. ENIGMA will help you learn by experimenting with live circuits and guided feedback."
              : 'Let’s put your knowledge to work through hands-on simulations, microcontroller code challenges, and fault debugging.'}
          </p>

          {/* Diagnostic Score Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '28px',
              textAlign: 'left',
            }}
          >
            <div>
              <div className="font-pixel" style={{ fontSize: '9px', color: '#71717a', marginBottom: '4px' }}>
                CONCEPT SCORE
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#7CFFB2' }}>
                {conceptScore} / 6 PTS
              </div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Circuit & logic familiarity</div>
            </div>

            <div>
              <div className="font-pixel" style={{ fontSize: '9px', color: '#71717a', marginBottom: '4px' }}>
                EXPERIENCE SCORE
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#5CC8FF' }}>
                {experienceScore} / 9 PTS
              </div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Hardware & code comfort</div>
            </div>
          </div>

          {/* Recommended Starting Point Card */}
          <div
            style={{
              background: 'rgba(124, 255, 178, 0.05)',
              border: '1px solid rgba(124, 255, 178, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(124, 255, 178, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7CFFB2',
                flexShrink: 0,
              }}
            >
              {isBeginner ? <Compass size={22} /> : <Cpu size={22} />}
            </div>
            <div>
              <div className="font-pixel" style={{ fontSize: '9px', color: '#7CFFB2', marginBottom: '2px' }}>
                RECOMMENDED FIRST STEP
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                {isBeginner
                  ? 'Track 1: Bits, Voltage & The Virtual LED'
                  : 'Track 2: Arduino Microcontrollers & Blink Firmware'}
              </div>
              <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                {isBeginner
                  ? 'Step-by-step guided circuit with visual component pinout discovery.'
                  : 'Embedded C++ syntax, digital I/O pins, and real-time serial monitor.'}
              </div>
            </div>
          </div>

          {/* Level Switcher Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
              fontSize: '12px',
              color: '#a1a1aa',
            }}
          >
            <span>Preference:</span>
            <button
              onClick={() => setSelectedLevelOverride('beginner')}
              style={{
                background: effectiveLevel === 'beginner' ? 'rgba(124, 255, 178, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: effectiveLevel === 'beginner' ? '#7CFFB2' : 'rgba(255, 255, 255, 0.1)',
                color: effectiveLevel === 'beginner' ? '#7CFFB2' : '#a1a1aa',
                padding: '4px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Beginner Explorer
            </button>
            <button
              onClick={() => setSelectedLevelOverride('intermediate')}
              style={{
                background: effectiveLevel === 'intermediate' ? 'rgba(92, 200, 255, 0.15)' : 'transparent',
                border: '1px solid',
                borderColor: effectiveLevel === 'intermediate' ? '#5CC8FF' : 'rgba(255, 255, 255, 0.1)',
                color: effectiveLevel === 'intermediate' ? '#5CC8FF' : '#a1a1aa',
                padding: '4px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Circuit Explorer
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleStartLearning}
            className="btn-tactile-signal"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '15px',
              borderRadius: '999px',
              gap: '10px',
            }}
          >
            <span>Start My Learning Journey</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // QUESTIONNAIRE QUESTIONS FLOW
  // ---------------------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        maxWidth: '680px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Navigation & Skip Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="font-pixel" style={{ fontSize: '13px', color: '#ffffff', letterSpacing: '0.08em' }}>
            ENIGMA
          </span>
          <span className="font-pixel" style={{ fontSize: '8px', color: '#71717a' }}>
            // ONBOARDING
          </span>
        </div>

        <button
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#a1a1aa',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            padding: '6px 10px',
          }}
          className="hover:text-white"
        >
          Skip to Learning →
        </button>
      </div>

      {/* Main Question Card Area */}
      <div style={{ padding: '36px 0' }}>
        {/* Header Copy */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '8px',
            }}
          >
            Let's find your starting point.
          </h1>
          <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.5 }}>
            A few quick questions will help us personalise your learning journey.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#71717a',
              marginBottom: '8px',
            }}
          >
            <span className="font-pixel" style={{ fontSize: '9px', color: '#7CFFB2' }}>
              QUESTION {currentQuestionIndex + 1} OF {QUESTIONS.length}
            </span>
            <span>{Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
                height: '100%',
                background: '#7CFFB2',
                transition: 'width 0.25s ease-out',
              }}
            />
          </div>
        </div>

        {/* Active Question Box */}
        <div
          className="glass-panel"
          style={{
            padding: '28px 24px',
            marginBottom: '28px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            {currentQ.question}
          </h3>

          {/* 4 Multiple Choice Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswer === opt.key;

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  style={{
                    background: isSelected ? 'rgba(124, 255, 178, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: isSelected ? '#7CFFB2' : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:border-zinc-500"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      className="font-pixel"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: isSelected ? '#7CFFB2' : 'rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#07080a' : '#a1a1aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {opt.key}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: isSelected ? '#ffffff' : '#d4d4d8',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {opt.text}
                    </span>
                  </div>

                  {isSelected && <CheckCircle2 size={18} color="#7CFFB2" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls: Back & Next Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="btn-tactile-surface"
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            opacity: currentQuestionIndex === 0 ? 0.35 : 1,
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="btn-tactile-signal"
          style={{
            padding: '10px 22px',
            fontSize: '13px',
            opacity: !selectedAnswer ? 0.4 : 1,
            cursor: !selectedAnswer ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{currentQuestionIndex === QUESTIONS.length - 1 ? 'See Results →' : 'Next Question'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
