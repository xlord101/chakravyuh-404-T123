import { useState, useEffect } from 'react';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const LiveCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(SYMPOSIUM_CONFIG.targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(12, 35, 52, 0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid #1f4763',
      borderRadius: '12px',
      padding: '8px 16px',
      color: '#e9f7f3',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #1f4763', paddingRight: '12px' }}>
        <span className="beacon-dot" />
        <span style={{ fontSize: '11px', color: '#7fa6a8', letterSpacing: '0.08em', fontWeight: 600 }}>T-MINUS</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#6fe9e2', lineHeight: 1 }}>
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '9px', color: '#7fa6a8', marginTop: '2px' }}>DAYS</div>
        </div>
        <span style={{ color: '#1f4763', fontWeight: 700 }}>:</span>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#6fe9e2', lineHeight: 1 }}>
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '9px', color: '#7fa6a8', marginTop: '2px' }}>HRS</div>
        </div>
        <span style={{ color: '#1f4763', fontWeight: 700 }}>:</span>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#6fe9e2', lineHeight: 1 }}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '9px', color: '#7fa6a8', marginTop: '2px' }}>MIN</div>
        </div>
        <span style={{ color: '#1f4763', fontWeight: 700 }}>:</span>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0ac1b', lineHeight: 1 }}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '9px', color: '#7fa6a8', marginTop: '2px' }}>SEC</div>
        </div>
      </div>
    </div>
  );
};

