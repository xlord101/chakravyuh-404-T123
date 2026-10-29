import { useState, useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Zap, Terminal, Activity, BookOpen, Play, Check, Sparkles } from 'lucide-react';
import { InteractiveCircuitHero } from './InteractiveCircuitHero';
import type { AppView } from '../../store/useSparkStore';

interface LandingPageProps {
  onStartLearning: (view?: AppView, lessonId?: string) => void;
}

const FRAME_COUNT = 240;
const IMAGES_PATH = '/images/ezgif-frame-';

export const LandingPage = ({ onStartLearning }: LandingPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [activeStoryTab, setActiveStoryTab] = useState<number>(0);
  const [gamifyXp, setGamifyXp] = useState<number>(45);
  const [gamifyStreak, setGamifyStreak] = useState<boolean>(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);

  // Background Canvas Scroll Scrubbing (PRD 5.4)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];
    const promises: Promise<void>[] = [];

    // Preload frames for smooth background scroll (PRD 5.4)
    for (let i = 1; i <= Math.min(120, FRAME_COUNT); i++) {
      const img = new Image();
      img.src = `${IMAGES_PATH}${i.toString().padStart(3, '0')}.png`;
      const p = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      imgArray.push(img);
      promises.push(p);
    }

    Promise.all(promises).then(() => {
      setImages(imgArray);
    });
  }, []);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext('2d');
    const img = images[index % images.length];
    if (!ctx || !img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#0B0F0E';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const imgRatio = img.width / img.height;
    const canvasRatio = displayWidth / displayHeight;
    let drawWidth, drawHeight;

    if (canvasRatio > imgRatio) {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgRatio;
    } else {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgRatio;
    }

    const x = (displayWidth - drawWidth) / 2;
    const y = (displayHeight - drawHeight) / 2;

    ctx.globalAlpha = 0.22; // PRD 5.4: base 12 to 35% opacity with dark vignette
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    ctx.restore();
  }, [images]);

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (images.length > 0) {
      const idx = Math.min(Math.floor(latest), images.length - 1);
      requestAnimationFrame(() => renderFrame(idx));
    }
  });

  useEffect(() => {
    if (images.length > 0) {
      renderFrame(0);
    }
  }, [images, renderFrame]);

  // Gamification Widget Handler (PRD S8)
  const handleGamifyComplete = () => {
    setGamifyXp((prev) => prev + 25);
    setGamifyStreak(true);
    setBadgeUnlocked(true);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Persistent Background Scrub Canvas (PRD 5.2 & 5.4) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(11, 15, 14, 0.4) 0%, rgba(11, 15, 14, 0.95) 100%)'
        }} />
      </div>

      {/* S1: Sticky Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        background: 'rgba(11, 15, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-line)',
        padding: '14px 28px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo with Glowing Trace Dot (PRD 2.6) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onStartLearning('landing')}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(124, 255, 178, 0.15)',
              border: '1px solid var(--color-signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-signal)'
            }}>
              <Zap size={18} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Spark<span style={{ color: 'var(--color-signal)' }}>Path</span>
              </span>
              <span className="chip-tag chip-tag-signal" style={{ marginLeft: '8px', fontSize: '9px' }}>
                SMART ENTC
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'none', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '13px' }} className="sm:flex">
            <a href="#problem" style={{ color: 'var(--color-muted)' }}>Why SparkPath</a>
            <a href="#story" style={{ color: 'var(--color-muted)' }}>Core Loop</a>
            <a href="#lab" style={{ color: 'var(--color-muted)' }}>Virtual Lab</a>
            <a href="#curriculum" style={{ color: 'var(--color-muted)' }}>Learning Path</a>
            <a href="#faq" style={{ color: 'var(--color-muted)' }}>FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onStartLearning('learn')}
              className="btn-tactile-surface"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <span>Continue as Guest</span>
            </button>
            <button
              onClick={() => onStartLearning('lesson', 'logic-1')}
              className="btn-tactile-signal"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <span>Start in 2 Min →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layers Overlaying Background */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* S2: HERO SECTION */}
        <section style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          padding: '60px 24px 80px',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Left Copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="signal-beacon" />
                <span className="chip-tag chip-tag-signal">
                  CHAKRAVYUH AI VIBE CODING CHALLENGE
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(38px, 5.2vw, 68px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                marginBottom: '20px'
              }}>
                Touch the circuit.<br />
                <span style={{ color: 'var(--color-fault)' }}>Break it.</span> <span style={{ color: 'var(--color-signal)' }}>Fix it.</span>
              </h1>

              <p style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                color: 'var(--color-muted)',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '560px'
              }}>
                Learn electronics and telecommunications with live simulations, code challenges, and an AI tutor that sees what you build.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
                <button
                  onClick={() => onStartLearning('lesson', 'logic-1')}
                  className="btn-tactile-signal"
                  style={{ fontSize: '15px', padding: '14px 26px' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start in 2 minutes (Guest)</span>
                </button>

                <button
                  onClick={() => onStartLearning('lab')}
                  className="btn-tactile-surface"
                  style={{ fontSize: '15px', padding: '14px 24px' }}
                >
                  <Terminal size={16} />
                  <span>Try the Virtual Lab</span>
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-muted)'
              }}>
                <span>✓ No hardware kit required</span>
                <span>•</span>
                <span>✓ Zero setup needed</span>
                <span>•</span>
                <span>✓ Runs offline</span>
              </div>
            </div>

            {/* Right: Live Interactive Circuit Centerpiece (PRD 5.3 S2) */}
            <div>
              <InteractiveCircuitHero />
            </div>
          </div>
        </section>

        {/* S3: THE PROBLEM SECTION (PRD 5.3 S3) */}
        <section id="problem" style={{
          padding: '80px 24px',
          background: 'rgba(17, 24, 22, 0.65)',
          borderTop: '1px solid var(--color-line)',
          borderBottom: '1px solid var(--color-line)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="chip-tag chip-tag-amber" style={{ marginBottom: '12px' }}>
                THE HARDWARE GAP
              </span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                ENTC is taught on paper. You should be able to touch it.
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--color-muted)', maxWidth: '600px', margin: '0 auto' }}>
                Students memorize circuit diagrams for exams instead of understanding how electrons actually behave.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              <div className="pcb-card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-fault)', fontFamily: 'var(--font-mono)' }}>
                  120+ Hrs
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  Lab Access Bottleneck
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  College labs are limited to 2 hours a week with 3 students crowding around a single oscilloscope and breadboard.
                </p>
              </div>

              <div className="pcb-card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
                  ₹15,000+
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  Hardware Kit Cost
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  Buying components, multimeters, Arduinos and sensor packs independently is expensive and prone to accidental burnout.
                </p>
              </div>

              <div className="pcb-card" style={{ padding: '28px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  4.2 Hours
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  Lost in Blind Debugging
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  A dead LED from one backwards polarity leg or loose wire leaves students stuck with no one around to explain why.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S4: SIGNATURE PINNED SCROLL STORY (PRD 5.3 S4) */}
        <section id="story" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>
              SIGNATURE LEARNING RHYTHM
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
              The Four Beats of True Understanding
            </h2>
          </div>

          {/* Interactive Story Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {[
              { label: '1. Theory (90s)', icon: BookOpen },
              { label: '2. Simulate (Live)', icon: Activity },
              { label: '3. Code (Embedded C)', icon: Terminal },
              { label: '4. Understand (Spark AI)', icon: Sparkles },
            ].map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveStoryTab(idx)}
                  className={activeStoryTab === idx ? "btn-tactile-signal" : "btn-tactile-surface"}
                  style={{ fontSize: '13px', padding: '10px 18px' }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Story Card */}
          <div className="pcb-card-active" style={{ padding: '36px', maxWidth: '840px', margin: '0 auto' }}>
            {activeStoryTab === 0 && (
              <div>
                <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>STEP 1: THEORY</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                  Short, high-impact concepts under 90 seconds
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  No 40-page textbook PDFs. Every lesson opens with a visual concept card: how voltage acts as electrical pressure, how resistors resist electron flow, and why diodes conduct in one direction only.
                </p>
                <div style={{ background: '#07100D', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-line)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-signal)' }}>
                  Ohm's Law: Current (I) = Voltage (V) / Resistance (R)
                </div>
              </div>
            )}

            {activeStoryTab === 1 && (
              <div>
                <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>STEP 2: SIMULATE</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                  Touch the circuit in real-time
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  The schematic instantly becomes a live simulation. Drag the resistance slider to 1000Ω and see the LED dim as current drops to 3mA; slide to 220Ω and watch the LED glow brightly.
                </p>
                <button onClick={() => onStartLearning('lab')} className="btn-tactile-signal">
                  <span>Open Interactive Circuit in Lab →</span>
                </button>
              </div>
            )}

            {activeStoryTab === 2 && (
              <div>
                <span className="chip-tag chip-tag-amber" style={{ marginBottom: '12px' }}>STEP 3: CODE</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                  Write real microcontroller firmware
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Switch to the embedded code editor. Call <code>digitalWrite(13, HIGH)</code> and <code>delay(500)</code>. Run the program and watch the virtual Arduino board execute your code in real-time.
                </p>
                <div style={{ background: '#07100D', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-line)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ffffff' }}>
                  void loop() &#123; digitalWrite(13, HIGH); delay(500); digitalWrite(13, LOW); delay(500); &#125;
                </div>
              </div>
            )}

            {activeStoryTab === 3 && (
              <div>
                <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>STEP 4: UNDERSTAND</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                  Spark AI Tutor hints before answering
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Spark doesn't give away the solution. If your circuit is dead, Spark probes the nodes: "Notice pin A has 5V but pin B has 0V. Is the circuit completing its path to Ground?"
                </p>
                <button onClick={() => onStartLearning('dojo')} className="btn-tactile-signal">
                  <span>Try Debug Dojo with Spark AI →</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* S5: BENTO GRID FEATURE SHOWCASE (PRD 5.3 S5) */}
        <section id="lab" style={{ padding: '80px 24px', background: 'rgba(17, 24, 22, 0.4)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>
                PRODUCT ARCHITECTURE // PRD SECTION 10-13
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
                Engineered for Hands-on Mastery
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {/* Tile 1: Logic Builder */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('lab')}
              >
                <div className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>VIRTUAL LAB</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Logic Builder & Truth Tables
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Drag and connect AND, OR, NOT, NAND, NOR, XOR gates. Wires glow phosphor green when carrying 1. Auto-generates truth tables with active row highlights.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-signal)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Launch Logic Builder →
                </span>
              </div>

              {/* Tile 2: Arduino Simulator */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('lab')}
              >
                <div className="chip-tag chip-tag-amber" style={{ marginBottom: '12px' }}>EMBEDDED SIM</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Microcontroller Simulator
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Interactive virtual ATmega board. Test Blink, pushbutton inputs, analog potentiometers, and Serial.print() telemetry without buying a physical board.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-amber)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Open Arduino Lab →
                </span>
              </div>

              {/* Tile 3: Debug Dojo */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('dojo')}
              >
                <div className="chip-tag chip-tag-fault" style={{ marginBottom: '12px' }}>FORENSICS</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Debug Dojo: Break & Fix
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Diagnose intentionally sabotaged circuits: floating inputs, blown LEDs, missing pull-down resistors. Use virtual test probes to find and repair bugs.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-fault)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Enter Debug Dojo →
                </span>
              </div>

              {/* Tile 4: Signal Playground */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('lab')}
              >
                <div className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>AUDIO & TELECOM</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Signal Playground & Web Audio
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Generate sine, square, and triangle waves. Adjust frequency and amplitude sliders. Add noise, test low-pass filters, and listen through Web Audio.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Listen to Signals →
                </span>
              </div>

              {/* Tile 5: Real-World Missions */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('missions')}
              >
                <div className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>PROJECT MISSIONS</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Smart Night Lamp & Gas Alarms
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Apply concepts to real-world scenarios. Build automated streetlights using photoresistors and gas leak detector alarms with threshold logic.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-signal)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  View All Missions →
                </span>
              </div>

              {/* Tile 6: AI Tutor Spark */}
              <div
                className="pcb-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => onStartLearning('learn')}
              >
                <div className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>CONTEXT-AWARE AI</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Spark: The Intelligent Companion
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  Reads your current circuit schematic JSON and code. Provides 3-step hint ladders (nudge, approach, partial answer) without spoiling solutions.
                </p>
                <span style={{ fontSize: '13px', color: 'var(--color-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Meet Spark AI →
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* S6: LEARNING PATH PREVIEW (PRD 5.3 S6) */}
        <section id="curriculum" style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="chip-tag chip-tag-signal" style={{ marginBottom: '12px' }}>
              CURRICULUM ARCHITECTURE // PRD SECTION 17
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
              Structured ENTC Learning Track
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-muted)', marginTop: '8px' }}>
              Designed around first and second year engineering practicals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pcb-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="chip-tag chip-tag-signal" style={{ marginBottom: '6px' }}>TRACK 1 // 6 LESSONS</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Digital Logic & Combinatorial Circuits</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '2px' }}>Bits, Voltage, AND/OR/NOT, Universal NAND, Boolean Algebra, Half Adder.</p>
              </div>
              <button onClick={() => onStartLearning('lesson', 'logic-1')} className="btn-tactile-signal">
                <span>Start Track 1 →</span>
              </button>
            </div>

            <div className="pcb-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="chip-tag chip-tag-amber" style={{ marginBottom: '6px' }}>TRACK 2 // 6 LESSONS</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Arduino Microcontroller Basics</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '2px' }}>Blink sketch, Ohm's law, digitalRead & pull-down resistors, analogRead ADC, PWM.</p>
              </div>
              <button onClick={() => onStartLearning('lesson', 'ard-1')} className="btn-tactile-amber">
                <span>Start Track 2 →</span>
              </button>
            </div>

            <div className="pcb-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '6px' }}>TRACK 3 // 3 LESSONS</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Signals & Telecommunications</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '2px' }}>Waveforms, time vs frequency domain, noise filtering, and Amplitude Modulation (AM).</p>
              </div>
              <button onClick={() => onStartLearning('lesson', 'sig-1')} className="btn-tactile-surface">
                <span>Start Track 3 →</span>
              </button>
            </div>

            <div className="pcb-card" style={{ padding: '20px 24px', opacity: 0.65 }}>
              <span className="chip-tag" style={{ marginBottom: '6px' }}>TRACKS 4 & 5 // COMING SOON</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Wireless Communication Systems & IoT Edge AI</h4>
            </div>
          </div>
        </section>

        {/* S8: GAMIFICATION INTERACTIVE PREVIEW WIDGET (PRD 5.3 S8) */}
        <section style={{ padding: '60px 24px', background: 'rgba(17, 24, 22, 0.7)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span className="chip-tag chip-tag-amber" style={{ marginBottom: '12px' }}>
              TRY THE MOTIVATION LOOP (PRD S8)
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Mastery, XP & Streak Motivation
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', marginBottom: '24px' }}>
              Click below to simulate completing a lesson step:
            </p>

            <div className="pcb-card-active" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>CURRENT XP</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-signal)' }}>{gamifyXp} XP</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>STREAK LED</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: gamifyStreak ? 'var(--color-amber)' : 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span className={gamifyStreak ? "streak-flame" : "chip-tag"} />
                    <span>{gamifyStreak ? '4 DAYS ACTIVE' : '3 DAYS'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>BADGE UNLOCKED</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: badgeUnlocked ? '#ffffff' : 'var(--color-muted)', marginTop: '4px' }}>
                    {badgeUnlocked ? '🎖️ First Light (Unlocked!)' : '🔒 First Light'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGamifyComplete}
                className="btn-tactile-signal"
                style={{ padding: '12px 28px' }}
              >
                <Check size={16} />
                <span>Simulate "Complete Lesson" (+25 XP)</span>
              </button>
            </div>
          </div>
        </section>

        {/* S9: TOPIC MARQUEE (PRD 5.3 S9) */}
        <div style={{
          padding: '24px 0',
          background: '#07100D',
          borderTop: '1px solid var(--color-line)',
          borderBottom: '1px solid var(--color-line)',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <div style={{
            display: 'inline-flex',
            gap: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--color-muted)'
          }}>
            {['LOGIC GATES', 'OHM\'S LAW', 'PULL-UP RESISTORS', 'PWM DIMMING', '10-BIT ADC', 'UART SERIAL', 'FOURIER FFT', 'RC FILTERS', 'AM MODULATION', 'DE MORGAN', 'HALF ADDER', 'SPI / I2C'].map((topic, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-signal)' }}>⚡</span>
                <span style={{ color: '#ffffff' }}>{topic}</span>
              </span>
            ))}
          </div>
        </div>

        {/* S10: FAQ ACCORDION (PRD 5.3 S10) */}
        <section id="faq" style={{ padding: '90px 24px', maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>FIELD MANUAL</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { q: 'Do I need real hardware to use SparkPath?', a: 'No! All circuits, microcontrollers, and signal generators run fully in your browser with live interactive simulations.' },
              { q: 'Do I need to know electronics beforehand?', a: 'Not at all. SparkPath starts from absolute ground zero: lighting a virtual LED with voltage HIGH (5V) and LOW (0V).' },
              { q: 'Is it free and can I continue as a guest?', a: 'Yes. Judges and students can click "Continue as Guest" to test lessons, simulators, and challenges instantly with zero signup hurdles.' },
              { q: 'Does it work on mobile phones?', a: 'Yes! Every circuit, logic builder, and lesson is tested to work responsively on standard mobile viewports.' },
              { q: 'What is the AI tutor (Spark) allowed to do?', a: 'Spark observes your current circuit schematic JSON and code. It uses a 3-step hint ladder to help you diagnose faults without spoiling answers.' },
              { q: 'Is my learning progress saved?', a: 'Yes, all XP, streak counts, completed lessons, and unlocked badges are saved automatically to your local browser storage.' }
            ].map((faq, i) => (
              <div key={i} className="pcb-card" style={{ padding: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff', marginBottom: '8px' }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* S11: FINAL CALL TO ACTION & FOOTER (PRD 5.3 S11) */}
        <section style={{
          padding: '80px 24px 60px',
          background: '#07100D',
          borderTop: '1px solid var(--color-line)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '14px' }}>
              Ready to touch real circuits?
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-muted)', marginBottom: '24px' }}>
              Light your first virtual LED in under 2 minutes. No soldering iron required.
            </p>
            <button
              onClick={() => onStartLearning('lesson', 'logic-1')}
              className="btn-tactile-signal"
              style={{ fontSize: '16px', padding: '16px 36px' }}
            >
              <span>Launch Lesson 1 Now (Free) →</span>
            </button>
          </div>

          <div style={{
            borderTop: '1px solid var(--color-line)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-muted)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div>SparkPath // CHAKRAVYUH AI VIBE CODING CHALLENGE</div>
            <div>Built with Precision by Team 404</div>
          </div>
        </section>

      </div>
    </div>
  );
};

