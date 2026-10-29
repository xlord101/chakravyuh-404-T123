import { useState, useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import {
  Cpu,
  Bug,
  Activity,
  Terminal,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { InteractiveCircuitHero } from './InteractiveCircuitHero';
import type { AppView } from '../../store/useSparkStore';

interface LandingPageProps {
  onStartLearning: (view?: AppView, lessonId?: string) => void;
}

const TOTAL_FRAMES = 240;
const FRAME_BASE_URL = '/images/ezgif-frame-';

export const LandingPage = ({ onStartLearning }: LandingPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(1);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Framer Motion Scroll Progress across the 520vh presentation container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameProgress = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload frames progressively: first frame immediately, then fast pass, then full sequence
  useEffect(() => {
    let isCancelled = false;

    // Load Frame 1 immediately for instant crisp visual
    const firstImg = new Image();
    firstImg.src = `${FRAME_BASE_URL}001.png`;
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      setLoadedCount((prev) => Math.max(prev, 1));
      renderFrame(1);
    };

    // Fast pass: load every 4th frame (1, 5, 9, 13...) for immediate 60fps scrub
    const fastPassIndices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 4) {
      if (i !== 1) fastPassIndices.push(i);
    }

    const loadIndices = async (indices: number[]) => {
      for (const idx of indices) {
        if (isCancelled) return;
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.src = `${FRAME_BASE_URL}${idx.toString().padStart(3, '0')}.png`;
          img.onload = () => {
            if (!isCancelled) {
              imagesRef.current[idx - 1] = img;
              setLoadedCount((prev) => prev + 1);
            }
            resolve();
          };
          img.onerror = () => resolve();
        });
      }
    };

    // Run fast pass, then load all remaining frames in background
    loadIndices(fastPassIndices).then(() => {
      if (isCancelled) return;
      const remaining: number[] = [];
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i - 1]) {
          remaining.push(i);
        }
      }
      loadIndices(remaining);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Crisp High-DPI Canvas Rendering
  const renderFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame or nearest available loaded frame
    let targetImg: HTMLImageElement | null = imagesRef.current[frameNum - 1];
    if (!targetImg) {
      for (let offset = 1; offset < 30; offset++) {
        if (frameNum - 1 - offset >= 0 && imagesRef.current[frameNum - 1 - offset]) {
          targetImg = imagesRef.current[frameNum - 1 - offset];
          break;
        }
        if (frameNum - 1 + offset < TOTAL_FRAMES && imagesRef.current[frameNum - 1 + offset]) {
          targetImg = imagesRef.current[frameNum - 1 + offset];
          break;
        }
      }
    }

    if (!targetImg) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep modern dark background
    ctx.fillStyle = '#07080a';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Maintain aspect ratio with crisp framing
    const imgRatio = targetImg.width / targetImg.height;
    const canvasRatio = displayWidth / displayHeight;
    let drawWidth: number;
    let drawHeight: number;

    if (canvasRatio > imgRatio) {
      drawHeight = displayHeight * 0.92;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = displayWidth * 0.92;
      drawHeight = drawWidth / imgRatio;
    }

    const x = (displayWidth - drawWidth) / 2;
    const y = (displayHeight - drawHeight) / 2;

    // 100% Full Opacity for vivid, crisp hardware inspection
    ctx.globalAlpha = 1.0;
    ctx.drawImage(targetImg, x, y, drawWidth, drawHeight);

    // Subtle edge vignette that keeps the center hardware completely unhindered
    const vignette = ctx.createRadialGradient(
      displayWidth / 2,
      displayHeight / 2,
      Math.min(displayWidth, displayHeight) * 0.35,
      displayWidth / 2,
      displayHeight / 2,
      Math.max(displayWidth, displayHeight) * 0.75
    );
    vignette.addColorStop(0, 'rgba(7, 8, 10, 0)');
    vignette.addColorStop(1, 'rgba(7, 8, 10, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    ctx.restore();
  }, []);

  // Update canvas on scroll
  useEffect(() => {
    const unsubscribe = frameProgress.on('change', (latest) => {
      const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latest)));
      setCurrentFrameDisplay(clamped);
      renderFrame(clamped);

      // Determine active slide milestone based on scroll progress
      const p = (clamped - 1) / (TOTAL_FRAMES - 1);
      if (p < 0.20) setActiveSlideIndex(0);
      else if (p < 0.42) setActiveSlideIndex(1);
      else if (p < 0.64) setActiveSlideIndex(2);
      else if (p < 0.84) setActiveSlideIndex(3);
      else setActiveSlideIndex(4);
    });

    return () => unsubscribe();
  }, [frameProgress, renderFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameDisplay);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameDisplay, renderFrame]);

  // Jump to specific slide milestone
  const scrollToSlide = (slideIndex: number) => {
    if (!containerRef.current) return;
    const targets = [0, 0.25, 0.50, 0.75, 0.98];
    const targetProgress = targets[slideIndex] ?? 0;
    const maxScroll = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetProgress,
      behavior: 'smooth',
    });
  };

  const slides = [
    { id: '01', title: 'Silicon', label: '01 // Overview' },
    { id: '02', title: 'The Problem', label: '02 // Paradox' },
    { id: '03', title: 'Architecture', label: '03 // Engine' },
    { id: '04', title: 'Pedagogy', label: '04 // 5-Step Loop' },
    { id: '05', title: 'Live Workspace', label: '05 // Evaluation' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#07080a',
        color: '#f4f4f5',
        minHeight: '520vh',
      }}
    >
      {/* =========================================================================
          PERSISTENT 3D HARDWARE CANVAS (Prominent, Center-Stage, Full-DPI)
          ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>

      {/* =========================================================================
          TOP FLOATING KEYNOTE NAVIGATION BAR (Portfolio Glass Style)
          ========================================================================= */}
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1240px',
          zIndex: 50,
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '999px',
          }}
        >
          {/* Brand Wordmark (Logo removed per user instruction) */}
          <div
            onClick={() => scrollToSlide(0)}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span
              className="font-pixel"
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.08em',
              }}
            >
              ENIGMA
            </span>
            <span
              className="font-pixel hidden sm:inline"
              style={{
                fontSize: '8px',
                color: '#71717a',
                letterSpacing: '0.1em',
              }}
            >
              // SMART ENTC
            </span>
          </div>

          {/* Keynote Slide Jump Pills */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
            }}
            className="md:flex"
          >
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => scrollToSlide(idx)}
                className="font-pixel"
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: activeSlideIndex === idx ? 'rgba(124, 255, 178, 0.4)' : 'transparent',
                  background: activeSlideIndex === idx ? 'rgba(124, 255, 178, 0.08)' : 'transparent',
                  color: activeSlideIndex === idx ? '#7CFFB2' : '#a1a1aa',
                  fontSize: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Launch Workspace CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onStartLearning('learn')}
              className="btn-tactile-signal"
              style={{
                padding: '8px 18px',
                fontSize: '12px',
                borderRadius: '999px',
              }}
            >
              <span>Launch Workspace →</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          BOTTOM HARDWARE TELEMETRY SCRUBBER HUD
          ========================================================================= */}
      <footer
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          pointerEvents: 'none',
          width: 'calc(100% - 40px)',
          maxWidth: '720px',
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '8px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '999px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#a1a1aa',
            letterSpacing: '0.04em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#7CFFB2',
                boxShadow: '0 0 8px #7CFFB2',
              }}
            />
            <span className="font-pixel" style={{ color: '#ffffff', fontWeight: 600, fontSize: '9px' }}>
              DISASSEMBLY FRAME {currentFrameDisplay.toString().padStart(3, '0')} / {TOTAL_FRAMES} • {loadedCount >= TOTAL_FRAMES ? '100% CACHED' : `${Math.round((loadedCount / TOTAL_FRAMES) * 100)}% BUFFERED`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="font-pixel hidden sm:inline" style={{ color: '#71717a', fontSize: '9px' }}>
              CHAKRAVYUH 2026 // KEYNOTE
            </span>
            <div
              style={{
                width: '70px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(currentFrameDisplay / TOTAL_FRAMES) * 100}%`,
                  height: '100%',
                  background: '#7CFFB2',
                  transition: 'width 0.1s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          KEYNOTE PRESENTATION SLIDES (Strategic Floating Glass Overlays)
          ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* -----------------------------------------------------------------------
            SLIDE 01: HERO & ASSEMBLED HARDWARE (0% - 20% Scroll)
            ----------------------------------------------------------------------- */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '110px 24px 80px',
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Left Column: Big Editorial Hero Title */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="keynote-pill">
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#7CFFB2',
                    }}
                  />
                  CHAKRAVYUH 2026 // KEYNOTE
                </span>
              </div>

              {/* Editorial Pixelated Staggered Title (ditto.site aesthetic) */}
              <h1
                className="font-pixel text-[clamp(36px,5.8vw,78px)] font-bold text-white leading-[1.0] mb-5 select-none tracking-[0.06em]"
              >
                {Array.from('ENIGMA').map((char, i) => (
                  <span
                    key={`char-hero-${i}`}
                    className="inline-block animate-char-in"
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              <p
                style={{
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  color: '#a1a1aa',
                  lineHeight: 1.5,
                  maxWidth: '520px',
                  marginBottom: '28px',
                }}
              >
                The interactive Electronics & Telecommunication engine. Touch circuits, disassemble silicon, simulate logic gates, compile embedded C++, and trace RF signals in real time.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
                <button
                  onClick={() => onStartLearning('learn')}
                  className="btn-tactile-signal"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => scrollToSlide(1)}
                  className="btn-tactile-surface"
                  style={{ padding: '12px 20px', fontSize: '14px' }}
                >
                  <span>Inspect Disassembly ↓</span>
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#71717a',
                }}
              >
                <span>✓ Zero hardware kit cost</span>
                <span>•</span>
                <span>✓ In-browser simulation</span>
                <span>•</span>
                <span>✓ Instant guest access</span>
              </div>
            </div>

            {/* Right Column: Live Interactive Circuit Centerpiece */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <InteractiveCircuitHero />
            </div>
          </div>

          {/* Floating Scroll Indicator */}
          <div
            onClick={() => scrollToSlide(1)}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: '#71717a',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.06em',
            }}
          >
            <span>SCROLL TO DISASSEMBLE SILICON</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SLIDE 02: THE HARDWARE PARADOX (THE PROBLEM) (20% - 40% Scroll)
            Positioned on the LEFT so the central rotating hardware is unblocked!
            ----------------------------------------------------------------------- */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '80px 24px',
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              padding: '36px',
              marginLeft: '0',
            }}
          >
            <span className="keynote-pill" style={{ marginBottom: '14px' }}>
              01 // THE HARDWARE PARADOX
            </span>

            <h2
              style={{
                fontSize: 'clamp(26px, 3.2vw, 38px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Electronics is taught on dead paper. Real silicon is alive.
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              Engineering students spend 4 years memorizing ideal textbook circuit schematics for 2-hour exams. When they face real hardware, components burn, pins float, and intuition fails.
            </p>

            {/* 3 Key Problem Metric Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div className="font-pixel" style={{ fontSize: '18px', fontWeight: 700, color: '#FF5C6C' }}>
                  2 HRS
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Lab Bottleneck</div>
                  <div style={{ fontSize: '12px', color: '#71717a' }}>3 students fighting over 1 faulty vintage oscilloscope.</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div className="font-pixel" style={{ fontSize: '18px', fontWeight: 700, color: '#FFB84D' }}>
                  ₹15K
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Hardware Cost Barrier</div>
                  <div style={{ fontSize: '12px', color: '#71717a' }}>Costly starter kits prone to instant accidental burnout.</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div className="font-pixel" style={{ fontSize: '18px', fontWeight: 700, color: '#5CC8FF' }}>
                  78%
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Schematic-to-Silicon Gap</div>
                  <div style={{ fontSize: '12px', color: '#71717a' }}>Students unable to diagnose real unpowered circuit faults.</div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#7CFFB2' }}>
              Enigma's Solution: High-fidelity interactive sandbox where mistakes cost zero dollars.
            </p>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SLIDE 03: DISASSEMBLING THE SILICON (ARCHITECTURE) (40% - 60% Scroll)
            Positioned on the RIGHT so the exploded device center/left is visible!
            ----------------------------------------------------------------------- */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '80px 24px',
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              padding: '36px',
            }}
          >
            <span className="keynote-pill" style={{ marginBottom: '14px' }}>
              02 // THE ENIGMA ENGINE
            </span>

            <h2
              style={{
                fontSize: 'clamp(26px, 3.2vw, 38px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Three Disciplinary Pillars. One Unified Canvas.
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              As the physical device explodes into its constituent subsystems, Enigma's engine simulates the entire stack in real time:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {/* Pillar 1 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Cpu size={16} color="#7CFFB2" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    1. Digital Logic Matrix
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.5 }}>
                  Interactive AND, OR, NOT, NAND, XOR gates. Wires glow phosphor green when energized. Live auto-evaluating truth tables with active row tracking.
                </p>
              </div>

              {/* Pillar 2 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Terminal size={16} color="#FFB84D" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    2. Embedded C++ Runtime
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.5 }}>
                  In-browser ATmega microcontroller emulator. Write real Arduino firmware, manipulate digital I/O pins, and monitor live UART serial transmissions.
                </p>
              </div>

              {/* Pillar 3 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Activity size={16} color="#5CC8FF" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    3. RF & Telecommunication Scope
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.5 }}>
                  Interactive Web Audio oscillator & signal scope. Synthesize sine and square waves, test noise filtration, and hear carrier frequencies live.
                </p>
              </div>
            </div>

            <button
              onClick={() => onStartLearning('lab')}
              className="btn-tactile-surface"
              style={{ width: '100%', fontSize: '13px' }}
            >
              <span>Explore Virtual Lab Sandbox →</span>
            </button>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SLIDE 04: THE 4-BEAT PEDAGOGY (60% - 80% Scroll)
            Positioned on the LEFT so the floating exploded chips are visible!
            ----------------------------------------------------------------------- */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '80px 24px',
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              padding: '36px',
              marginLeft: '0',
            }}
          >
            <span className="keynote-pill" style={{ marginBottom: '14px' }}>
              03 // THE 5-STEP MASTERY LOOP
            </span>

            <h2
              style={{
                fontSize: 'clamp(26px, 3.2vw, 38px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Discover. Experiment. Play. Debug. Master.
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                marginBottom: '20px',
              }}
            >
              Passive reading creates the illusion of competence. Enigma enforces a high-retention 5-step interactive mastery cycle:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="font-pixel" style={{ fontSize: '9px', color: '#5CC8FF', minWidth: '65px' }}>
                  01 DISCOVER
                </span>
                <span style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.3 }}>
                  Visual micro-concepts & clickable component pinouts in under 90s.
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="font-pixel" style={{ fontSize: '9px', color: '#7CFFB2', minWidth: '65px' }}>
                  02 SIMULATE
                </span>
                <span style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.3 }}>
                  Live embedded sandbox: tune resistance, toggle gates & run C++ code.
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="font-pixel" style={{ fontSize: '9px', color: '#FFB84D', minWidth: '65px' }}>
                  03 PLAY
                </span>
                <span style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.3 }}>
                  Mini-games: Gate Predictor, Truth Table Sprint, Component Match.
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="font-pixel" style={{ fontSize: '9px', color: '#FF5C6C', minWidth: '65px' }}>
                  04 DEBUG
                </span>
                <span style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.3 }}>
                  Injected faults (floating inputs, reversed polarity) solved via probe.
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="font-pixel" style={{ fontSize: '9px', color: '#a78bfa', minWidth: '65px' }}>
                  05 MASTER
                </span>
                <span style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.3 }}>
                  Skill radar mastery updates, XP rewards & unlocked cheat-sheet cards.
                </span>
              </div>
            </div>

            <button
              onClick={() => onStartLearning('dojo')}
              className="btn-tactile-signal"
              style={{ width: '100%', fontSize: '13px' }}
            >
              <span>Test Fault Forensics in Debug Dojo →</span>
            </button>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SLIDE 05: THE STUDENT WORKSPACE (INTERACTIVE DEMO FOR JUDGES) (80% - 100%)
            Full Keynote Finale & One-Click Launch Deck
            ----------------------------------------------------------------------- */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '90px 24px 100px',
            maxWidth: '1080px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 32px 64px -16px rgba(0, 0, 0, 0.9)',
            }}
          >
            <span className="keynote-pill" style={{ marginBottom: '16px' }}>
              04 // LIVE EVALUATION DECK
            </span>

            <h2
              style={{
                fontSize: 'clamp(32px, 4.5vw, 54px)',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                color: '#ffffff',
                lineHeight: 1.08,
                marginBottom: '16px',
              }}
            >
              Enter the Enigma Workspace
            </h2>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: '#a1a1aa',
                maxWidth: '680px',
                margin: '0 auto 36px',
                lineHeight: 1.6,
              }}
            >
              Designed and verified for Chakravyuh AI Vibe Coding Challenge 2026. Zero setup required. Test the interactive tools below:
            </p>

            {/* 4 Direct Interactive Modules for Judges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '36px',
                textAlign: 'left',
              }}
            >
              {/* Module 1 */}
              <div
                onClick={() => onStartLearning('lab')}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-[#7CFFB2] hover:bg-[rgba(124,255,178,0.04)]"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Cpu size={20} color="#7CFFB2" />
                  <span className="font-pixel" style={{ fontSize: '9px', color: '#7CFFB2' }}>LIVE</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Logic Gate Builder
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.4 }}>
                  Connect XOR & Half Adders with live phosphor signal flow & truth tables.
                </div>
              </div>

              {/* Module 2 */}
              <div
                onClick={() => onStartLearning('lab')}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-[#FFB84D] hover:bg-[rgba(255,184,77,0.04)]"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Terminal size={20} color="#FFB84D" />
                  <span className="font-pixel" style={{ fontSize: '9px', color: '#FFB84D' }}>AVR C++</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Arduino IDE & Telemetry
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.4 }}>
                  Run Blink & PWM sketches with real-time Serial Monitor readouts.
                </div>
              </div>

              {/* Module 3 */}
              <div
                onClick={() => onStartLearning('dojo')}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-[#FF5C6C] hover:bg-[rgba(255,92,108,0.04)]"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Bug size={20} color="#FF5C6C" />
                  <span className="font-pixel" style={{ fontSize: '9px', color: '#FF5C6C' }}>FORENSICS</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Debug Dojo Forensics
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.4 }}>
                  Diagnose sabotaged circuits using the virtual multimeter probe.
                </div>
              </div>

              {/* Module 4 */}
              <div
                onClick={() => onStartLearning('lab')}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-[#5CC8FF] hover:bg-[rgba(92,200,255,0.04)]"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Activity size={20} color="#5CC8FF" />
                  <span className="font-pixel" style={{ fontSize: '9px', color: '#5CC8FF' }}>WEB AUDIO</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Signal Scope & Audio
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.4 }}>
                  Generate sine/square waveforms and test noise filters via Web Audio.
                </div>
              </div>
            </div>

            {/* Big Launch Workspace Call-to-Action */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onStartLearning('learn')}
                className="btn-tactile-signal"
                style={{
                  fontSize: '16px',
                  padding: '16px 36px',
                  borderRadius: '999px',
                }}
              >
                <span>Launch Full Enigma Workspace →</span>
              </button>

              <button
                onClick={() => onStartLearning('lesson', 'logic-1')}
                className="btn-tactile-surface"
                style={{
                  fontSize: '16px',
                  padding: '16px 28px',
                  borderRadius: '999px',
                }}
              >
                <span>Start Lesson 1 (2 Min)</span>
              </button>
            </div>

            {/* Judges' Evaluation Footer Note */}
            <div
              style={{
                marginTop: '36px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#71717a',
              }}
            >
              <div>ENIGMA // Smart ENTC Learning Platform</div>
              <div>Chakravyuh AI Vibe Coding Challenge 2026 • Team 404</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
