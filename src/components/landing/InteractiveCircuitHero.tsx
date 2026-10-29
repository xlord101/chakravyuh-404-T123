import { useState } from 'react';
import { Zap, Power } from 'lucide-react';

export const InteractiveCircuitHero = () => {
  const [switchClosed, setSwitchClosed] = useState(true);
  const [resistorValue, setResistorValue] = useState(220); // Ohms

  // Current I = (V_supply - V_led) / R = (5.0 - 2.0) / R
  const vSupply = 5.0;
  const vLedDrop = switchClosed ? 2.0 : 0.0;
  const currentMa = switchClosed ? Math.round(((vSupply - vLedDrop) / resistorValue) * 1000) : 0;
  const ledBrightness = switchClosed ? Math.min(1, Math.max(0.2, currentMa / 20)) : 0;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-line)',
      borderRadius: 'var(--radius-card)',
      padding: '24px',
      boxShadow: switchClosed ? '0 12px 36px rgba(0,0,0,0.6), 0 0 30px rgba(124, 255, 178, 0.12)' : '0 12px 30px rgba(0,0,0,0.6)',
      position: 'relative',
      maxWidth: '520px',
      width: '100%',
      margin: '0 auto',
      transition: 'box-shadow 0.3s ease'
    }}>
      {/* Circuit Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-line)',
        paddingBottom: '12px',
        marginBottom: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--color-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={switchClosed ? "signal-beacon" : "streak-flame"} />
          <span style={{ color: switchClosed ? 'var(--color-signal)' : 'var(--color-muted)', fontWeight: 700 }}>
            {switchClosed ? 'CIRCUIT ENERGIZED // 5.0V DC' : 'OPEN CIRCUIT // NO CURRENT'}
          </span>
        </div>
        <span className="chip-tag chip-tag-signal">LIVE SCHEMATIC</span>
      </div>

      {/* SVG Circuit Schematic */}
      <div style={{
        position: 'relative',
        background: '#07100D',
        borderRadius: '8px',
        border: '1px solid #1c2723',
        padding: '16px',
        marginBottom: '18px'
      }}>
        <svg viewBox="0 0 400 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Wire Loop Base */}
          {/* Top rail: 5V Rail from Battery to Switch to Resistor to LED */}
          <line x1="60" y1="40" x2="130" y2="40" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />
          <line x1="170" y1="40" x2="230" y2="40" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />
          <line x1="290" y1="40" x2="340" y2="40" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />

          {/* Right vertical down to LED */}
          <line x1="340" y1="40" x2="340" y2="70" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />
          <line x1="340" y1="100" x2="340" y2="130" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />

          {/* Bottom return rail (GND) */}
          <line x1="340" y1="130" x2="60" y2="130" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />

          {/* Left vertical to Battery */}
          <line x1="60" y1="130" x2="60" y2="95" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />
          <line x1="60" y1="65" x2="60" y2="40" stroke={switchClosed ? '#7CFFB2' : '#24302C'} strokeWidth="3" />

          {/* Battery symbol at (60, 80) */}
          <line x1="45" y1="65" x2="75" y2="65" stroke="#7CFFB2" strokeWidth="4" />
          <line x1="52" y1="75" x2="68" y2="75" stroke="#8A9A93" strokeWidth="2" />
          <line x1="45" y1="85" x2="75" y2="85" stroke="#7CFFB2" strokeWidth="4" />
          <line x1="52" y1="95" x2="68" y2="95" stroke="#8A9A93" strokeWidth="2" />
          <text x="25" y="72" fill="#7CFFB2" fontSize="11" fontFamily="monospace" fontWeight="bold">+5V</text>
          <text x="32" y="96" fill="#8A9A93" fontSize="10" fontFamily="monospace">GND</text>

          {/* Switch at (150, 40) */}
          <circle cx="130" cy="40" r="4" fill="#7CFFB2" />
          <circle cx="170" cy="40" r="4" fill="#7CFFB2" />
          {switchClosed ? (
            <line x1="130" y1="40" x2="170" y2="40" stroke="#7CFFB2" strokeWidth="3" />
          ) : (
            <line x1="130" y1="40" x2="165" y2="20" stroke="#FFB84D" strokeWidth="3" />
          )}
          <text x="135" y="16" fill={switchClosed ? "#7CFFB2" : "#FFB84D"} fontSize="10" fontFamily="monospace" fontWeight="bold">SW-1</text>

          {/* Resistor at (260, 40) */}
          <path
            d="M 230,40 L 236,32 L 244,48 L 252,32 L 260,48 L 268,32 L 276,48 L 284,40 L 290,40"
            fill="none"
            stroke="#5CC8FF"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text x="240" y="24" fill="#5CC8FF" fontSize="10" fontFamily="monospace" fontWeight="bold">{resistorValue}Ω</text>

          {/* LED symbol at (340, 85) */}
          <polygon
            points="326,70 354,70 340,92"
            fill={switchClosed ? "#7CFFB2" : "none"}
            stroke={switchClosed ? "#7CFFB2" : "#8A9A93"}
            strokeWidth="2"
          />
          <line x1="326" y1="92" x2="354" y2="92" stroke={switchClosed ? "#7CFFB2" : "#8A9A93"} strokeWidth="2" />
          {/* Photon light rays when ON */}
          {switchClosed && (
            <>
              <line x1="358" y1="72" x2="370" y2="64" stroke="#7CFFB2" strokeWidth="2" opacity={ledBrightness} />
              <line x1="358" y1="80" x2="372" y2="76" stroke="#7CFFB2" strokeWidth="2" opacity={ledBrightness} />
              <circle cx="340" cy="81" r="14" fill={`rgba(124, 255, 178, ${0.15 + ledBrightness * 0.2})`} />
            </>
          )}
          <text x="350" y="105" fill={switchClosed ? "#7CFFB2" : "#8A9A93"} fontSize="10" fontFamily="monospace" fontWeight="bold">LED-1</text>
        </svg>

        {/* Live animated electron current flow pulse */}
        {switchClosed && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-signal)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Zap size={12} />
            <span>CURRENT FLOWING</span>
          </div>
        )}
      </div>

      {/* Interactive Controls & Telemetry Readouts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Toggle Switch Button */}
        <button
          onClick={() => setSwitchClosed(!switchClosed)}
          className={switchClosed ? "btn-tactile-signal" : "btn-tactile-surface"}
          style={{ width: '100%', padding: '12px' }}
        >
          <Power size={16} />
          <span>{switchClosed ? 'SWITCH: CLOSED (ON)' : 'SWITCH: OPEN (OFF)'}</span>
        </button>

        {/* Resistor Slider */}
        <div style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-line)',
          borderRadius: 'var(--radius-input)',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            <span>RESISTOR</span>
            <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>{resistorValue} Ω</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="20"
            value={resistorValue}
            onChange={(e) => setResistorValue(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-cyan)', marginTop: '4px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Live Oscilloscope Meter Readout */}
      <div style={{
        background: '#07100D',
        border: '1px solid var(--color-line)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px'
      }}>
        <div>
          <span style={{ color: 'var(--color-muted)' }}>V_SUPPLY: </span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>5.00 V</span>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted)' }}>V_LED: </span>
          <span style={{ color: switchClosed ? 'var(--color-signal)' : 'var(--color-muted)', fontWeight: 700 }}>
            {vLedDrop.toFixed(2)} V
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted)' }}>I_LOOP: </span>
          <span style={{ color: switchClosed ? 'var(--color-amber)' : 'var(--color-muted)', fontWeight: 700 }}>
            {currentMa} mA
          </span>
        </div>
      </div>
    </div>
  );
};

