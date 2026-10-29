import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Target, Sun, Moon, Zap } from 'lucide-react';
import { REAL_WORLD_MISSIONS } from '../../data/curriculumData';
import type { Mission } from '../../data/curriculumData';

interface MissionsViewProps {
  onMissionCompleted: (missionId: string) => void;
}

export const MissionsView = ({ onMissionCompleted }: MissionsViewProps) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>('mission-night-lamp');

  // Smart Night Lamp Scenario Slider State (PRD Section 13)
  const [ambientLightLux, setAmbientLightLux] = useState<number>(650); // 0 to 1000 lux
  const lightThreshold = 400;
  const isNightLampOn = ambientLightLux < lightThreshold;
  const [missionSolved, setMissionSolved] = useState<boolean>(false);

  const activeMission: Mission = REAL_WORLD_MISSIONS.find((m) => m.id === selectedMissionId) || REAL_WORLD_MISSIONS[0];

  const handleTestScenario = () => {
    if (isNightLampOn) {
      setMissionSolved(true);
      onMissionCompleted(activeMission.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7CFFB2', '#5CC8FF', '#FFB84D']
      });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="chip-tag chip-tag-signal">REAL-WORLD SIMULATIONS // PRD SECTION 13</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>
          Engineering Missions
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>
          Combine multiple ENTC sensors and code logic to solve practical automation problems.
        </p>
      </div>

      {/* Mission Switcher */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px' }}>
        {REAL_WORLD_MISSIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMissionId(m.id);
              setMissionSolved(false);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 700,
              background: selectedMissionId === m.id ? 'var(--color-surface-2)' : 'transparent',
              color: selectedMissionId === m.id ? '#ffffff' : 'var(--color-muted)',
              border: selectedMissionId === m.id ? '1px solid var(--color-signal)' : '1px solid var(--color-line)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Target size={15} color="var(--color-signal)" />
            <span>{m.title}</span>
            <span className="chip-tag" style={{ fontSize: '9px' }}>+{m.xpReward} XP</span>
          </button>
        ))}
      </div>

      {/* Mission Workspace Card */}
      <div className="pcb-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="chip-tag chip-tag-signal">ACTIVE MISSION // {activeMission.status.toUpperCase()}</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-amber)', fontWeight: 700 }}>
            +{activeMission.xpReward} XP
          </span>
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
          {activeMission.title}
        </h3>

        <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
          {activeMission.scenario}
        </p>

        {/* Components Required */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginBottom: '8px' }}>
            HARDWARE BILL OF MATERIALS:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeMission.components.map((c, i) => (
              <span key={i} className="chip-tag chip-tag-cyan">{c}</span>
            ))}
          </div>
        </div>

        {/* Live Scenario Simulator Widget (PRD Section 13) */}
        {selectedMissionId === 'mission-night-lamp' && (
          <div style={{
            background: '#07100D',
            border: '1px solid var(--color-line)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isNightLampOn ? <Moon size={18} color="var(--color-cyan)" /> : <Sun size={18} color="var(--color-amber)" />}
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 700 }}>
                  SCENARIO CONTROLLER: AMBIENT SUNLIGHT
                </span>
              </div>

              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: isNightLampOn ? 'var(--color-signal)' : 'var(--color-amber)', fontWeight: 700 }}>
                {ambientLightLux} LUX ({isNightLampOn ? 'NIGHT TIME' : 'DAYLIGHT'})
              </span>
            </div>

            {/* Sunlight Lux Slider */}
            <input
              type="range"
              min="20"
              max="900"
              step="10"
              value={ambientLightLux}
              onChange={(e) => setAmbientLightLux(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-signal)', cursor: 'pointer', marginBottom: '20px' }}
            />

            {/* Simulation Graphic */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '20px',
              background: '#040807',
              borderRadius: '8px',
              border: '1px solid #1c2723'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>LDR SENSOR (A0)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {Math.round(ambientLightLux * 1.1)} ADC
                </div>
              </div>

              <div style={{ fontSize: '18px', color: 'var(--color-line)' }}>────────►</div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>THRESHOLD LOGIC</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-cyan)', marginTop: '2px' }}>
                  A0 &lt; 400 LUX
                </div>
              </div>

              <div style={{ fontSize: '18px', color: 'var(--color-line)' }}>────────►</div>

              {/* Lamp Output */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isNightLampOn ? 'var(--color-signal)' : '#1a2923',
                  boxShadow: isNightLampOn ? '0 0 20px var(--color-signal)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isNightLampOn ? '#071911' : '#455952',
                  margin: '0 auto 6px'
                }}>
                  <Zap size={18} />
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isNightLampOn ? 'var(--color-signal)' : 'var(--color-muted)', fontWeight: 700 }}>
                  {isNightLampOn ? 'LAMP ON' : 'LAMP OFF'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Verification Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
            {isNightLampOn ? '✓ Condition satisfied: Lamp triggered under dark conditions!' : 'Drag the slider to Night (below 400 Lux) to test lamp ignition.'}
          </div>

          <button
            onClick={handleTestScenario}
            disabled={!isNightLampOn || missionSolved}
            className="btn-tactile-signal"
            style={{ opacity: isNightLampOn ? 1 : 0.5 }}
          >
            <span>{missionSolved ? 'Mission Verified (+80 XP) ✓' : 'Submit & Verify Mission →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

