import { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, VolumeX, Cpu, Activity, Terminal } from 'lucide-react';

export const VirtualLab = () => {
  const [activeTab, setActiveTab] = useState<'logic' | 'arduino' | 'signals'>('logic');

  // ==========================================================================
  // TOOL 1: LOGIC BUILDER STATE (PRD 10.1)
  // ==========================================================================
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'>('AND');

  const computeGateOutput = (gate: string, a: number, b: number): number => {
    switch (gate) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'NOT': return a === 1 ? 0 : 1;
      case 'NAND': return (a & b) === 1 ? 0 : 1;
      case 'NOR': return (a | b) === 1 ? 0 : 1;
      case 'XOR': return a ^ b;
      default: return 0;
    }
  };

  const gateOutput = computeGateOutput(selectedGate, inputA, inputB);

  // ==========================================================================
  // TOOL 2: ARDUINO SIMULATOR STATE (PRD 10.2)
  // ==========================================================================
  const [arduinoRunning, setArduinoRunning] = useState<boolean>(false);
  const [pin13State, setPin13State] = useState<boolean>(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    'Serial Monitor initialized at 9600 baud.',
    'System ready. Click RUN to flash firmware.'
  ]);
  const [arduinoCode, setArduinoCode] = useState<string>(
`// Arduino ATmega328P Blink & Telemetry
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("System Initialized");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("PIN 13: HIGH [5.0V]");
  delay(600);
  digitalWrite(13, LOW);
  Serial.println("PIN 13: LOW [0.0V]");
  delay(600);
}`
  );

  useEffect(() => {
    let interval: any = null;
    if (arduinoRunning) {
      interval = setInterval(() => {
        setPin13State((prev) => {
          const next = !prev;
          setSerialLogs((logs) => [
            ...logs.slice(-6),
            `[${new Date().toLocaleTimeString()}] Pin 13 state: ${next ? 'HIGH (5.0V)' : 'LOW (0.0V)'}`
          ]);
          return next;
        });
      }, 700);
    } else {
      setPin13State(false);
    }
    return () => clearInterval(interval);
  }, [arduinoRunning]);

  // ==========================================================================
  // TOOL 3: SIGNAL PLAYGROUND & WEB AUDIO (PRD 10.3)
  // ==========================================================================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequency, setFrequency] = useState<number>(440); // 440 Hz standard A
  const [amplitude, setAmplitude] = useState<number>(60);
  const [waveType, setWaveType] = useState<'sine' | 'square' | 'triangle'>('sine');
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [lowPassFilter, setLowPassFilter] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Draw Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#07100D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = '#15241f';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw center 0V line
      ctx.strokeStyle = '#24302C';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw signal trace
      ctx.strokeStyle = lowPassFilter ? '#7CFFB2' : (noiseLevel > 15 ? '#FFB84D' : '#7CFFB2');
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerY = canvas.height / 2;
      const freqScale = frequency / 80;

      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * freqScale * Math.PI * 2 + phase;
        let yVal = 0;

        if (waveType === 'sine') {
          yVal = Math.sin(t);
        } else if (waveType === 'square') {
          yVal = Math.sin(t) >= 0 ? 1 : -1;
        } else if (waveType === 'triangle') {
          yVal = (Math.asin(Math.sin(t)) / (Math.PI / 2));
        }

        // Noise addition & filtering
        let effectiveNoise = (Math.random() - 0.5) * (noiseLevel / 50);
        if (lowPassFilter) {
          effectiveNoise *= 0.15; // attenuated by low-pass filter!
        }

        const y = centerY - (yVal + effectiveNoise) * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.05;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [frequency, amplitude, waveType, noiseLevel, lowPassFilter]);

  // Audio synthesis
  const toggleAudio = () => {
    if (isPlayingAudio) {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = waveType === 'sine' ? 'sine' : waveType === 'square' ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime); // Safe low volume cap
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        setIsPlayingAudio(true);
      } catch (err) {
        console.error('Audio synthesis error:', err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Lab Hub Navigation Tabs (PRD Section 10) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--color-line)',
        paddingBottom: '16px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'logic' as const, label: 'Logic Builder & Truth Table', icon: Cpu, badge: 'DIGITAL IC' },
          { id: 'arduino' as const, label: 'Microcontroller Simulator', icon: Terminal, badge: 'EMBEDDED C' },
          { id: 'signals' as const, label: 'Signal Playground & Web Audio', icon: Activity, badge: 'FFT & SCOPE' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? "btn-tactile-signal" : "btn-tactile-surface"}
              style={{ fontSize: '13px' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==========================================================================
         TAB 1: LOGIC BUILDER (PRD 10.1)
         ========================================================================== */}
      {activeTab === 'logic' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left: Interactive Gate Sandbox */}
          <div className="pcb-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="chip-tag chip-tag-signal">GATE SELECTOR</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                TOPOLOGICAL SIMULATOR
              </span>
            </div>

            {/* Gate Palette Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as const).map((gate) => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: selectedGate === gate ? 'var(--color-signal)' : 'var(--color-surface-2)',
                    color: selectedGate === gate ? '#071911' : 'var(--color-muted)',
                    border: selectedGate === gate ? '1px solid var(--color-signal)' : '1px solid var(--color-line)',
                    cursor: 'pointer'
                  }}
                >
                  {gate}
                </button>
              ))}
            </div>

            {/* Visual Schematic Diagram */}
            <div style={{
              background: '#07100D',
              border: '1px solid var(--color-line)',
              borderRadius: '12px',
              padding: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginBottom: '20px'
            }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '13px',
                    background: inputA === 1 ? 'rgba(124, 255, 178, 0.2)' : 'var(--color-surface-2)',
                    color: inputA === 1 ? 'var(--color-signal)' : 'var(--color-muted)',
                    border: `1px solid ${inputA === 1 ? 'var(--color-signal)' : 'var(--color-line)'}`,
                    cursor: 'pointer'
                  }}
                >
                  INPUT A: {inputA}
                </button>

                {selectedGate !== 'NOT' && (
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '13px',
                      background: inputB === 1 ? 'rgba(124, 255, 178, 0.2)' : 'var(--color-surface-2)',
                      color: inputB === 1 ? 'var(--color-signal)' : 'var(--color-muted)',
                      border: `1px solid ${inputB === 1 ? 'var(--color-signal)' : 'var(--color-line)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    INPUT B: {inputB}
                  </button>
                )}
              </div>

              {/* Gate Icon Centerpiece */}
              <div style={{
                padding: '16px 24px',
                background: 'var(--color-surface-2)',
                border: '2px solid var(--color-line)',
                borderRadius: '12px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '18px',
                color: '#ffffff'
              }}>
                <div>[ {selectedGate} ]</div>
                <div style={{ fontSize: '10px', color: 'var(--color-cyan)', marginTop: '4px' }}>IC 7400</div>
              </div>

              {/* Output LED */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: gateOutput === 1 ? 'var(--color-signal)' : '#1a2923',
                  boxShadow: gateOutput === 1 ? '0 0 24px var(--color-signal)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: gateOutput === 1 ? '#071911' : '#455952',
                  margin: '0 auto 8px',
                  fontWeight: 900
                }}>
                  {gateOutput}
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: gateOutput === 1 ? 'var(--color-signal)' : 'var(--color-muted)', fontWeight: 700 }}>
                  OUTPUT: {gateOutput === 1 ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Auto-Generated Truth Table (PRD 10.1) */}
          <div className="pcb-card" style={{ padding: '24px' }}>
            <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '12px' }}>
              AUTO-GENERATED TRUTH TABLE
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              {selectedGate} Gate Logic Matrix
            </h3>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-line)' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: 'var(--color-muted)' }}>Input A</th>
                  {selectedGate !== 'NOT' && (
                    <th style={{ padding: '10px', textAlign: 'left', color: 'var(--color-muted)' }}>Input B</th>
                  )}
                  <th style={{ padding: '10px', textAlign: 'left', color: 'var(--color-signal)' }}>Output Y</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [0, 0],
                  [0, 1],
                  [1, 0],
                  [1, 1],
                ].map(([a, b], idx) => {
                  const out = computeGateOutput(selectedGate, a, b);
                  const isActiveRow = selectedGate === 'NOT' ? inputA === a : (inputA === a && inputB === b);

                  if (selectedGate === 'NOT' && idx > 1) return null;

                  return (
                    <tr
                      key={idx}
                      style={{
                        background: isActiveRow ? 'rgba(124, 255, 178, 0.12)' : 'transparent',
                        borderBottom: '1px solid #1c2723',
                        color: isActiveRow ? 'var(--color-signal)' : '#ffffff',
                        fontWeight: isActiveRow ? 700 : 400
                      }}
                    >
                      <td style={{ padding: '10px' }}>{a}</td>
                      {selectedGate !== 'NOT' && (
                        <td style={{ padding: '10px' }}>{b}</td>
                      )}
                      <td style={{ padding: '10px' }}>
                        {out} {isActiveRow ? '◄ ACTIVE' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================================================
         TAB 2: ARDUINO SIMULATOR (PRD 10.2)
         ========================================================================== */}
      {activeTab === 'arduino' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Code Editor */}
          <div className="pcb-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="chip-tag chip-tag-amber">SKETCH: BLINK.INO</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setArduinoRunning(!arduinoRunning)}
                  className={arduinoRunning ? "btn-tactile-surface" : "btn-tactile-signal"}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  {arduinoRunning ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
                  <span>{arduinoRunning ? 'STOP' : 'RUN'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={arduinoCode}
              onChange={(e) => setArduinoCode(e.target.value)}
              rows={14}
              style={{
                width: '100%',
                background: '#07100D',
                border: '1px solid var(--color-line)',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#ffffff',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Virtual Board & Serial Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Board Hardware Graphic */}
            <div className="pcb-card" style={{ padding: '24px', background: '#0a1713', border: '1px solid #14b3ad' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="chip-tag chip-tag-signal">ATMEGA328P BOARD</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                  PWR: 5.0V // CLK: 16MHz
                </span>
              </div>

              {/* Pin 13 Built-in LED */}
              <div style={{
                background: '#07100D',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: pin13State ? 'var(--color-amber)' : '#261c0a',
                  boxShadow: pin13State ? '0 0 20px var(--color-amber)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '11px'
                }}>
                  L
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff' }}>BUILTIN LED (PIN 13)</div>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: pin13State ? 'var(--color-amber)' : 'var(--color-muted)' }}>
                    STATE: {pin13State ? 'HIGH (5.0V)' : 'LOW (0.0V)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Serial Monitor */}
            <div className="pcb-card" style={{ padding: '20px', flex: 1 }}>
              <span className="chip-tag chip-tag-cyan" style={{ marginBottom: '10px' }}>
                SERIAL MONITOR // 9600 BAUD
              </span>
              <div style={{
                background: '#07100D',
                border: '1px solid var(--color-line)',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-signal)',
                height: '140px',
                overflowY: 'auto',
                lineHeight: 1.6
              }}>
                {serialLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         TAB 3: SIGNAL PLAYGROUND & AUDIO (PRD 10.3)
         ========================================================================== */}
      {activeTab === 'signals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Oscilloscope Screen */}
          <div className="pcb-card" style={{ padding: '24px', background: '#050c0a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="signal-beacon" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  REALTIME TIME-DOMAIN OSCILLOSCOPE
                </span>
              </div>

              <button
                onClick={toggleAudio}
                className={isPlayingAudio ? "btn-tactile-signal" : "btn-tactile-surface"}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                {isPlayingAudio ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{isPlayingAudio ? 'Mute Audio' : 'Hear Waveform (Web Audio)'}</span>
              </button>
            </div>

            {/* Canvas Screen */}
            <canvas
              ref={canvasRef}
              width={800}
              height={260}
              style={{
                width: '100%',
                height: '260px',
                borderRadius: '8px',
                border: '1px solid #1a2c26',
                display: 'block'
              }}
            />
          </div>

          {/* Interactive Waveform Parameters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* Waveform Selector */}
            <div className="pcb-card" style={{ padding: '16px' }}>
              <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>WAVEFORM TYPE</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {(['sine', 'square', 'triangle'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWaveType(w)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: waveType === w ? 'var(--color-signal)' : 'var(--color-surface-2)',
                      color: waveType === w ? '#071911' : 'var(--color-muted)',
                      border: '1px solid var(--color-line)',
                      cursor: 'pointer'
                    }}
                  >
                    {w.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Slider */}
            <div className="pcb-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--color-muted)' }}>FREQUENCY</span>
                <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                style={{ width: '100%', marginTop: '8px', accentColor: 'var(--color-signal)', cursor: 'pointer' }}
              />
            </div>

            {/* Amplitude Slider */}
            <div className="pcb-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--color-muted)' }}>AMPLITUDE</span>
                <span style={{ color: 'var(--color-signal)', fontWeight: 700 }}>{amplitude} px</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                style={{ width: '100%', marginTop: '8px', accentColor: 'var(--color-signal)', cursor: 'pointer' }}
              />
            </div>

            {/* Noise Slider */}
            <div className="pcb-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--color-muted)' }}>NOISE INJECTION</span>
                <span style={{ color: 'var(--color-amber)', fontWeight: 700 }}>{noiseLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(Number(e.target.value))}
                style={{ width: '100%', marginTop: '8px', accentColor: 'var(--color-amber)', cursor: 'pointer' }}
              />
            </div>

            {/* Low-pass Filter Toggle */}
            <div className="pcb-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button
                onClick={() => setLowPassFilter(!lowPassFilter)}
                className={lowPassFilter ? "btn-tactile-signal" : "btn-tactile-surface"}
                style={{ fontSize: '12px' }}
              >
                <span>{lowPassFilter ? 'LOW-PASS FILTER: ON (CLEAN)' : 'LOW-PASS FILTER: OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

