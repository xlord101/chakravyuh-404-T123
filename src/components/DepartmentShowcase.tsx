import { Zap } from 'lucide-react';

export const DepartmentShowcase = () => {
  const labs = [
    {
      name: "RF, Microwave & Antennas Lab",
      equipment: "Keysight 20GHz Vector Network Analyzers, Anechoic Chamber, Microstrip Patch Scaffolds",
      focus: "5G/6G beamforming, satellite telemetry, radar cross-section characterization.",
      badge: "RF LAB-01"
    },
    {
      name: "VLSI & Embedded Systems Suite",
      equipment: "Cadence Virtuoso, Synopsys EDA Tools, Xilinx Artix-7 & Zynq Ultrascale+ FPGAs",
      focus: "ASIC layout design, RISC-V core synthesis, hardware security cryptographic modules.",
      badge: "VLSI LAB-02"
    },
    {
      name: "Autonomous Robotics & TinyML Center",
      equipment: "NVIDIA Jetson Orin Nano, STM32 Nucleo, OptiTrack Motion Capture, 9-DOF IMU arrays",
      focus: "Autonomous line tracking, SLAM navigation, edge neural network inference on microcontrollers.",
      badge: "ROBO LAB-03"
    },
    {
      name: "Digital Signal & Image Processing Lab",
      equipment: "Texas Instruments TMS320C6748 DSP starter kits, MATLAB Simulink, Real-time Audio DSOs",
      focus: "Biomedical telemetry (ECG/EEG filtering), speech recognition, SDR modulation pipelines.",
      badge: "DSP LAB-04"
    }
  ];

  return (
    <section
      id="department"
      style={{
        padding: '100px 24px',
        background: 'var(--screen-bg)',
        color: '#ffffff',
        position: 'relative'
      }}
    >
      <div className="bg-grid-screen" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="beacon-dot" />
            <span className="pixel-badge pixel-badge-teal">
              ACADEMIC PATRONAGE & INFRASTRUCTURE
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '16px',
            color: '#ffffff'
          }}>
            DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'var(--screen-dim)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Pioneering engineering excellence, patent innovation, and hands-on silicon prototyping. The beating heart behind Chakravyuh 2026.
          </p>
        </div>

        {/* Department Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '56px'
        }}>
          <div className="ditto-card-screen" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#14b3ad', fontFamily: 'var(--font-mono)' }}>35+</div>
            <div style={{ fontSize: '13px', color: '#e9f7f3', fontWeight: 700, marginTop: '4px' }}>Years of Excellence</div>
            <div style={{ fontSize: '12px', color: '#7fa6a8', marginTop: '2px' }}>NBA & NAAC A++ Accredited</div>
          </div>

          <div className="ditto-card-screen" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#f0ac1b', fontFamily: 'var(--font-mono)' }}>₹2.5 Cr+</div>
            <div style={{ fontSize: '13px', color: '#e9f7f3', fontWeight: 700, marginTop: '4px' }}>Research Grants</div>
            <div style={{ fontSize: '12px', color: '#7fa6a8', marginTop: '2px' }}>Funded by DST, ISRO & AICTE</div>
          </div>

          <div className="ditto-card-screen" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#6fe9e2', fontFamily: 'var(--font-mono)' }}>18+</div>
            <div style={{ fontSize: '13px', color: '#e9f7f3', fontWeight: 700, marginTop: '4px' }}>Patents Published</div>
            <div style={{ fontSize: '12px', color: '#7fa6a8', marginTop: '2px' }}>Across IoT, VLSI & Antenna tech</div>
          </div>

          <div className="ditto-card-screen" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#ef5f5f', fontFamily: 'var(--font-mono)' }}>4,500+</div>
            <div style={{ fontSize: '13px', color: '#e9f7f3', fontWeight: 700, marginTop: '4px' }}>Global Alumni</div>
            <div style={{ fontSize: '12px', color: '#7fa6a8', marginTop: '2px' }}>At Intel, Qualcomm, Apple, TI</div>
          </div>
        </div>

        {/* Research Labs Grid */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Zap size={18} color="#14b3ad" />
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
              State-of-the-Art Department Laboratories
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '20px'
          }}>
            {labs.map((lab) => (
              <div
                key={lab.name}
                className="ditto-card-screen"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px' }}>
                      {lab.badge}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                    {lab.name}
                  </h4>

                  <p style={{ fontSize: '13px', color: '#c5e0d7', lineHeight: 1.5, marginBottom: '16px' }}>
                    {lab.focus}
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--line-screen)',
                  borderRadius: '8px',
                  padding: '10px 14px'
                }}>
                  <div style={{ fontSize: '10px', color: '#7fa6a8', fontFamily: 'var(--font-mono)' }}>KEY INSTRUMENTS</div>
                  <div style={{ fontSize: '12px', color: '#e9f7f3', marginTop: '3px', lineHeight: 1.4 }}>
                    {lab.equipment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Initiative Banner: SparkPath */}
        <div style={{
          background: 'linear-gradient(135deg, #0e2a3d 0%, #133951 100%)',
          border: '1px solid #14b3ad',
          borderRadius: '20px',
          padding: '36px 40px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 24px rgba(20, 179, 173, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="pixel-badge pixel-badge-gold">
                DEPARTMENT OPEN INNOVATION
              </span>
              <span className="pixel-badge pixel-badge-teal">
                VIBE CODING CHALLENGE
              </span>
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              SparkPath: The Smart ENTC Learning Platform
            </h3>

            <p style={{ fontSize: '15px', color: '#c5e0d7', lineHeight: 1.6 }}>
              A department-engineered platform where every lesson contains a live experiment. Students read a concept in 90 seconds, run an interactive circuit simulation, diagnose intentionally planted breadboard bugs in the Debug Dojo, and build working hardware intuition.
            </p>
          </div>

          <div>
            <a
              href="#events"
              className="btn-tactile-gold"
              style={{ fontSize: '14px', padding: '12px 24px' }}
            >
              <span>EXPLORE HACKATHON TRACK →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
