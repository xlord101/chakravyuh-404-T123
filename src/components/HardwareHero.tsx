import { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { Cpu, Terminal, Radio, ShieldAlert, ArrowDown, Sparkles, Activity } from 'lucide-react';

const FRAME_COUNT = 240;
const IMAGES_PATH = '/images/ezgif-frame-';

export const HardwareHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(0);

  // Scroll progress for the entire 3D container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll (0 to 1) to frame indices (0 to 239)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Preload all 240 frames
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];
    const promises: Promise<void>[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `${IMAGES_PATH}${paddedIndex}.png`;

      const p = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Keep going if one frame has network hiccup
      }).then(() => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
      });

      imgArray.push(img);
      promises.push(p);
    }

    Promise.all(promises).then(() => {
      setImages(imgArray);
      setIsLoading(false);
    });
  }, []);

  // Frame rendering with DPR and aspect ratio preservation
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext('2d');
    const img = images[index];
    if (!ctx || !img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep oscilloscope black background
    ctx.fillStyle = '#08131d';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const imgRatio = img.width / img.height;
    const canvasRatio = displayWidth / displayHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (canvasRatio > imgRatio) {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgRatio;
    } else {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgRatio;
    }

    const x = (displayWidth - drawWidth) / 2;
    const y = (displayHeight - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    ctx.restore();
  }, [images]);

  // Hook into framer motion value changes
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isLoading && images.length > 0) {
      const index = Math.min(Math.floor(latest), FRAME_COUNT - 1);
      setCurrentFrameNum(index + 1);
      if (images[index]) {
        requestAnimationFrame(() => renderFrame(index));
      }
    }
  });

  // Initial draw once loaded
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      renderFrame(0);
      setCurrentFrameNum(1);
    }
  }, [isLoading, images, renderFrame]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (!isLoading && images.length > 0) {
        renderFrame(Math.max(0, currentFrameNum - 1));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoading, images, currentFrameNum, renderFrame]);

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        background: '#08131d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6fe9e2',
        fontFamily: 'var(--font-mono)',
        padding: '20px',
        position: 'relative',
        zIndex: 90
      }}>
        {/* Subtle grid */}
        <div className="bg-grid-screen" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(12, 35, 52, 0.9)',
          border: '1px solid #1f4763',
          borderRadius: '16px',
          padding: '36px 40px',
          maxWidth: '520px',
          width: '90%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(20, 179, 173, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(20, 179, 173, 0.15)',
              border: '1px solid #14b3ad',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6fe9e2'
            }}>
              <Cpu size={28} />
            </div>
          </div>

          <div className="pixel-badge pixel-badge-teal" style={{ marginBottom: '12px' }}>
            CHAKRAVYUH 2026 // HARDWARE ENGINE
          </div>

          <h3 style={{
            fontSize: '18px',
            color: '#e9f7f3',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '0.04em'
          }}>
            INITIALIZING SILICON TELEMETRY
          </h3>

          <p style={{ fontSize: '13px', color: '#7fa6a8', marginBottom: '24px' }}>
            Buffering 240 high-precision 3D exploded hardware frames...
          </p>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '10px',
            background: '#071622',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid #1f4763',
            marginBottom: '16px'
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #14b3ad, #6fe9e2)',
              boxShadow: '0 0 12px #6fe9e2',
              transition: 'width 0.15s ease'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#7fa6a8'
          }}>
            <span>SYSTEM CALIBRATION</span>
            <span style={{ color: '#f0ac1b', fontWeight: 700 }}>{loadProgress}% COMPLETE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="hardware-hero"
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#08131d',
        minHeight: '480vh',
      }}
    >
      {/* Sticky Canvas Viewport (100vh) */}
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Oscilloscope CRT Scanline Effect */}
        <div className="crt-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Bottom Persistent HUD Status Bar */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 20,
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#7fa6a8'
        }}>
          {/* Left Telemetry readout */}
          <div style={{
            background: 'rgba(12, 35, 52, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #1f4763',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span className="beacon-dot" />
            <span style={{ color: '#e9f7f3', fontWeight: 600 }}>
              DISASSEMBLY FRAME: {String(currentFrameNum).padStart(3, '0')} / {FRAME_COUNT}
            </span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ color: '#6fe9e2' }}>ROTATION: {(currentFrameNum * 1.5).toFixed(0)}°</span>
          </div>

          {/* Center Scroll Prompt */}
          <div style={{
            background: 'rgba(12, 35, 52, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #1f4763',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f0ac1b',
            animation: 'beacon-pulse 2s infinite ease-in-out'
          }}>
            <ArrowDown size={14} />
            <span style={{ fontWeight: 600, letterSpacing: '0.06em' }}>SCROLL TO EXPLODE SILICON</span>
          </div>

          {/* Right Power status */}
          <div style={{
            background: 'rgba(12, 35, 52, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #1f4763',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'none',
            alignItems: 'center',
            gap: '10px'
          }} className="sm:flex">
            <Activity size={14} color="#14b3ad" />
            <span>CORE VDD: 3.3V</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ color: '#6fe9e2' }}>FREQ: 480 MHz</span>
          </div>
        </div>
      </div>

      {/* Narrative Scroll Layers Overlaying the Canvas */}
      <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh' }}>

        {/* Phase 1: 0% - Hero Introduction */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 6%',
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.4 }}
            style={{
              maxWidth: '680px',
              background: 'rgba(12, 35, 52, 0.82)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #1f4763',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(20, 179, 173, 0.15)',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span className="pixel-badge pixel-badge-teal">
                ENTC FLAGSHIP SYMPOSIUM
              </span>
              <span className="pixel-badge pixel-badge-gold">
                OCT 29–31, 2026
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              CHAKRAVYUH <span style={{ color: '#14b3ad' }}>2026</span>
            </h1>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: '#6fe9e2',
              letterSpacing: '0.06em',
              marginBottom: '18px',
              borderLeft: '2px solid #14b3ad',
              paddingLeft: '12px'
            }}>
              DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING
            </div>

            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: '#c5e0d7',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              Enter the national technical battleground where theoretical silicon meets physical mastery. Disassemble the ordinary, break through the maze, and compete for ₹1,00,000+ in prizes.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <a href="#events" className="btn-tactile-primary">
                <Cpu size={16} />
                <span>EXPLORE 12+ EVENTS</span>
              </a>
              <a href="#passes" className="btn-tactile-gold">
                <Sparkles size={16} />
                <span>GET DELEGATE PASS</span>
              </a>
            </div>
          </motion.div>
        </section>

        <div style={{ height: '35vh' }} />

        {/* Phase 2: 30% - RF & Telecommunications */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 6%',
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.4 }}
            style={{
              maxWidth: '620px',
              background: 'rgba(12, 35, 52, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #1f4763',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              pointerEvents: 'auto'
            }}
          >
            <div className="pixel-badge pixel-badge-teal" style={{ marginBottom: '14px' }}>
              PHASE 02 // RF TELECOMMUNICATIONS
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '14px'
            }}>
              SILICON DISASSEMBLY & SIGNAL FORENSICS
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#c5e0d7',
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              Peeling back electromagnetic shielding to reveal gigahertz high-frequency transceivers, microstrip patch antennas, and signal processing pipelines.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '22px'
            }}>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>BANDWIDTH</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#6fe9e2' }}>2.4 - 5.8 GHz</div>
              </div>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>TRANSCEIVER</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0ac1b' }}>SDR MIMO 4x4</div>
              </div>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>ADC RESOLUTION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#6fe9e2' }}>16-Bit Sigma</div>
              </div>
            </div>

            <a href="#events" className="btn-tactile-dark" style={{ width: '100%', justifyContent: 'center' }}>
              <Radio size={16} />
              <span>VIEW CIRCUIT & VLSI TRACKS</span>
            </a>
          </motion.div>
        </section>

        <div style={{ height: '35vh' }} />

        {/* Phase 3: 65% - Tactile Hardware & Robotics */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 6%',
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.4 }}
            style={{
              maxWidth: '620px',
              background: 'rgba(12, 35, 52, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #1f4763',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              pointerEvents: 'auto'
            }}
          >
            <div className="pixel-badge pixel-badge-gold" style={{ marginBottom: '14px' }}>
              PHASE 03 // TACTILE HARDWARE
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '14px'
            }}>
              PRECISION SENSORS & AUTONOMOUS ROBOTICS
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#c5e0d7',
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              Rotary optical encoders, brushless motor drivers, infrared sensor arrays, and sub-millisecond PID control loops navigating the Robo-Kshethra arena.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '22px'
            }}>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>ROBOT SPEED</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0ac1b' }}>3.2 m/s Max</div>
              </div>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>CONTROL LOOP</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#6fe9e2' }}>1 kHz Realtime</div>
              </div>
              <div className="telemetry-chip-screen">
                <div style={{ fontSize: '10px', color: '#7fa6a8' }}>TELEMETRY</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef5f5f' }}>CAN / UART / SPI</div>
              </div>
            </div>

            <a href="#events" className="btn-tactile-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <ShieldAlert size={16} />
              <span>EXPLORE ROBO-KSHETHRA CHALLENGE</span>
            </a>
          </motion.div>
        </section>

        <div style={{ height: '35vh' }} />

        {/* Phase 4: 95% - The Chakravyuh Finale */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6%',
          pointerEvents: 'none',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.4 }}
            style={{
              maxWidth: '760px',
              width: '100%',
              background: 'rgba(12, 35, 52, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #14b3ad',
              borderRadius: '24px',
              padding: '48px 36px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(20, 179, 173, 0.25)',
              pointerEvents: 'auto'
            }}
          >
            <div className="pixel-badge pixel-badge-teal" style={{ marginBottom: '16px' }}>
              ARENA UNLOCKED // OCTOBER 29–31, 2026
            </div>

            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '16px'
            }}>
              BREAK THROUGH THE <span style={{ color: '#f0ac1b' }}>CHAKRAVYUH</span>
            </h2>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#c5e0d7',
              maxWidth: '620px',
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}>
              12+ National Competitions · ₹1,00,000+ Prize Pool · 24-Hour AI Vibe Hackathon · IEEE Indexed Paper Conference · Hands-on Edge AI Masterclass.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <a href="#passes" className="btn-tactile-gold" style={{ fontSize: '15px', padding: '14px 28px' }}>
                <Sparkles size={18} />
                <span>REGISTER NOW & GET PASS</span>
              </a>
              <a href="#events" className="btn-tactile-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                <Terminal size={18} />
                <span>BROWSE EVENT CATALOG</span>
              </a>
            </div>
          </motion.div>
        </section>

        <div style={{ height: '20vh' }} />

      </div>
    </div>
  );
};

