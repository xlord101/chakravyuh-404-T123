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
    <div className="glass-panel" style={{
      padding: '20px',
      position: 'relative',
      width: '100%',
      maxWidth: '460px',
      boxShadow: switchClosed
        ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(124, 255, 178, 0.12)'
        : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.8)',
    }}>
      {/* Circuit Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '10px',
        marginBottom: '14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: '#a1a1aa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={switchClosed ? "signal-beacon" : "streak-flame"} />
          <span className="font-pixel" style={{ color: switchClosed ? '#7CFFB2' : '#71717a', fontWeight: 600, fontSize: '9px' }}>
            {switchClosed ? 'CIRCUIT ENERGIZED // 5.0V DC' : 'OPEN CIRCUIT // NO CURRENT'}
          </span>
        </div>
        <span className="keynote-pill font-pixel" style={{ padding: '3px 8px', fontSize: '9px' }}>
          LIVE SCHEMATIC
        </span>
      </div>

      {/* SVG Circuit Schematic */}
      <div style={{
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.45)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '12px 14px',
        marginBottom: '14px'
      }}>
        <svg viewBox="0 0 400 150" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Wire Loop Base */}
          <line x1="60" y1="36" x2="130" y2="36" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />
          <line x1="170" y1="36" x2="230" y2="36" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />
          <line x1="290" y1="36" x2="340" y2="36" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />

          {/* Right vertical down to LED */}
          <line x1="340" y1="36" x2="340" y2="65" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />
          <line x1="340" y1="95" x2="340" y2="124" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />

          {/* Bottom return rail (GND) */}
          <line x1="340" y1="124" x2="60" y2="124" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />

          {/* Left vertical to Battery */}
          <line x1="60" y1="124" x2="60" y2="90" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />
          <line x1="60" y1="60" x2="60" y2="36" stroke={switchClosed ? '#7CFFB2' : '#27272a'} strokeWidth="3" />

          {/* Battery symbol */}
          <line x1="45" y1="60" x2="75" y2="60" stroke="#7CFFB2" strokeWidth="4" />
          <line x1="52" y1="70" x2="68" y2="70" stroke="#71717a" strokeWidth="2" />
          <line x1="45" y1="80" x2="75" y2="80" stroke="#7CFFB2" strokeWidth="4" />
          <line x1="52" y1="90" x2="68" y2="90" stroke="#71717a" strokeWidth="2" />
          <text x="24" y="66" fill="#7CFFB2" fontSize="10" fontFamily="monospace" fontWeight="bold">+5V</text>
          <text x="32" y="90" fill="#71717a" fontSize="9" fontFamily="monospace">GND</text>

          {/* Switch */}
          <circle cx="130" cy="36" r="4" fill="#7CFFB2" />
          <circle cx="170" cy="36" r="4" fill="#7CFFB2" />
          {switchClosed ? (
            <line x1="130" y1="36" x2="170" y2="36" stroke="#7CFFB2" strokeWidth="3" />
          ) : (
            <line x1="130" y1="36" x2="165" y2="16" stroke="#FFB84D" strokeWidth="3" />
          )}
          <text x="135" y="14" fill={switchClosed ? "#7CFFB2" : "#FFB84D"} fontSize="9" fontFamily="monospace" fontWeight="bold">SW-1</text>

          {/* Resistor */}
          <path
            d="M 230,36 L 236,28 L 244,44 L 252,28 L 260,44 L 268,28 L 276,44 L 284,36 L 290,36"
            fill="none"
            stroke="#5CC8FF"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text x="244" y="22" fill="#5CC8FF" fontSize="10" fontFamily="monospace" fontWeight="bold">{resistorValue}Ω</text>

          {/* LED */}
          <polygon
            points="326,65 354,65 340,86"
            fill={switchClosed ? "#7CFFB2" : "none"}
            stroke={switchClosed ? "#7CFFB2" : "#52525b"}
            strokeWidth="2"
          />
          <line x1="326" y1="86" x2="354" y2="86" stroke={switchClosed ? "#7CFFB2" : "#52525b"} strokeWidth="2" />
          {switchClosed && (
            <>
              <line x1="358" y1="67" x2="370" y2="59" stroke="#7CFFB2" strokeWidth="2" opacity={ledBrightness} />
              <line x1="358" y1="75" x2="372" y2="71" stroke="#7CFFB2" strokeWidth="2" opacity={ledBrightness} />
              <circle cx="340" cy="76" r="14" fill={`rgba(124, 255, 178, ${0.12 + ledBrightness * 0.22})`} />
            </>
          )}
          <text x="350" y="98" fill={switchClosed ? "#7CFFB2" : "#52525b"} fontSize="10" fontFamily="monospace" fontWeight="bold">LED-1</text>
        </svg>

        {switchClosed && (
          <div className="font-pixel" style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            fontSize: '8px',
            color: '#7CFFB2',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.04em'
          }}>
            <Zap size={10} />
            <span>CURRENT FLOWING</span>
          </div>
        )}
      </div>

      {/* Interactive Controls & Telemetry Readouts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px'
      }}>
        {/* Toggle Switch Button */}
        <button
          onClick={() => setSwitchClosed(!switchClosed)}
          className={switchClosed ? "btn-tactile-signal font-pixel" : "btn-tactile-surface font-pixel"}
          style={{ width: '100%', padding: '10px 12px', fontSize: '9px' }}
        >
          <Power size={13} />
          <span>{switchClosed ? 'SW: CLOSED' : 'SW: OPEN'}</span>
        </button>

        {/* Resistor Slider */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-input)',
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#a1a1aa' }} className="font-pixel">
            <span>RESISTOR</span>
            <span style={{ color: '#5CC8FF', fontWeight: 700 }}>{resistorValue} Ω</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="20"
            value={resistorValue}
            onChange={(e) => setResistorValue(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#5CC8FF', marginTop: '2px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Live Readout Bar */}
      <div className="font-pixel" style={{
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '6px',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '9px'
      }}>
        <div>
          <span style={{ color: '#71717a' }}>V_IN: </span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>5.0V</span>
        </div>
        <div>
          <span style={{ color: '#71717a' }}>V_LED: </span>
          <span style={{ color: switchClosed ? '#7CFFB2' : '#71717a', fontWeight: 600 }}>
            {vLedDrop.toFixed(2)}V
          </span>
        </div>
        <div>
          <span style={{ color: '#71717a' }}>I_LOOP: </span>
          <span style={{ color: switchClosed ? '#FFB84D' : '#71717a', fontWeight: 600 }}>
            {currentMa}mA
          </span>
        </div>
      </div>
    </div>
  );
};
