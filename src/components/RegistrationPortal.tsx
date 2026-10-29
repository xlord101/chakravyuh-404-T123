import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Printer, Layers } from 'lucide-react';
import { PASS_TIERS } from '../data/symposiumData';
import type { PassType } from '../data/symposiumData';

interface RegistrationPortalProps {
  preselectedEventId?: string;
}

export const RegistrationPortal = ({ preselectedEventId }: RegistrationPortalProps) => {
  const [selectedPass, setSelectedPass] = useState<PassType>(PASS_TIERS[1]); // Default Silver Competitor
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    hardwareKit: false,
    hoodie: false,
    lunch: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    prn: '',
    department: 'Electronics & Telecommunication (E&TC)',
    year: '3rd Year (TE)',
    teamName: '',
    member2: '',
    member3: '',
    member4: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passNumber, setPassNumber] = useState('');

  const addonPrices = {
    hardwareKit: 250,
    hoodie: 450,
    lunch: 150,
  };

  const calculateTotal = () => {
    let total = selectedPass.price;
    if (addons.hardwareKit) total += addonPrices.hardwareKit;
    if (addons.hoodie) total += addonPrices.hoodie;
    if (addons.lunch) total += addonPrices.lunch;
    return total;
  };

  const handleAddonToggle = (key: string) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.college) {
      alert('Please fill out all required fields.');
      return;
    }

    const uniqueCode = `CKR26-ENTC-${Math.floor(1000 + Math.random() * 9000)}`;
    setPassNumber(uniqueCode);
    setFormSubmitted(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#14b3ad', '#6fe9e2', '#f0ac1b', '#0c8a86']
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="passes"
      style={{
        padding: '100px 24px',
        background: 'var(--bg-page)',
        position: 'relative'
      }}
    >
      <div className="bg-grid-light" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="beacon-dot-gold" />
            <span className="pixel-badge pixel-badge-gold">
              REGISTRATION PORTAL // INSTANT PASS
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            color: 'var(--ink-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            SECURE YOUR SYMPOSIUM PASS
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'var(--ink-secondary)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Select your participation tier, customize your symposium kit add-ons, and instantly generate your verified digital delegate pass.
          </p>

          {preselectedEventId && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              background: '#eef7f1',
              border: '1px solid #14b3ad',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: '#0c8a86',
              fontWeight: 600
            }}>
              <span>REGISTERING FOR: <strong>{preselectedEventId.toUpperCase()}</strong></span>
            </div>
          )}
        </div>

        {formSubmitted ? (
          /* ==========================================================================
             DIGITAL DELEGATE PASS (SUCCESS VIEW)
             ========================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              background: '#ffffff',
              border: '2px solid #14b3ad',
              borderRadius: '24px',
              boxShadow: '0 25px 60px rgba(12, 35, 52, 0.25)',
              overflow: 'hidden'
            }}
          >
            {/* Top Pass Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0c2334 0%, #0e2a3d 100%)',
              color: '#ffffff',
              padding: '24px 32px',
              borderBottom: '2px dashed #1f4763',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px' }}>
                    OFFICIAL DELEGATE PASS
                  </span>
                  <span className="pixel-badge pixel-badge-gold" style={{ fontSize: '8px' }}>
                    {selectedPass.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                  CHAKRAVYUH 2026
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#7fa6a8' }}>
                  DEPT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#7fa6a8', fontFamily: 'var(--font-mono)' }}>PASS CODE</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f0ac1b', fontFamily: 'var(--font-mono)' }}>
                  {passNumber}
                </div>
                <div style={{ fontSize: '10px', color: '#6fe9e2', marginTop: '2px' }}>STATUS: VERIFIED</div>
              </div>
            </div>

            {/* Pass Body Content */}
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '28px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>DELEGATE NAME</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0e2a3d' }}>{formData.fullName}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>COLLEGE / INSTITUTION</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0e2a3d' }}>{formData.college}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>BRANCH & YEAR</div>
                  <div style={{ fontSize: '15px', color: '#3c5b6a' }}>{formData.department} ({formData.year})</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>CONTACT EMAIL / PHONE</div>
                  <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: '#3c5b6a' }}>
                    {formData.email} • {formData.phone}
                  </div>
                </div>
              </div>

              {/* Team Members if applicable */}
              {formData.teamName && (
                <div style={{
                  background: '#eef7f1',
                  border: '1px solid #c5e0d7',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0c8a86', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                    SQUAD DETAILS // TEAM: {formData.teamName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#0e2a3d' }}>
                    Leader: {formData.fullName} | Members: {[formData.member2, formData.member3, formData.member4].filter(Boolean).join(', ') || 'Registered Team'}
                  </div>
                </div>
              )}

              {/* Pass Tier Breakdown & QR Simulation */}
              <div style={{
                background: '#f8fcfa',
                border: '1px solid #c5e0d7',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '28px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#5e7d8c', fontFamily: 'var(--font-mono)' }}>TIER INCLUSIONS</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0e2a3d', marginTop: '2px' }}>
                    {selectedPass.name} (₹{calculateTotal()})
                  </div>
                  <div style={{ fontSize: '13px', color: '#3c5b6a', marginTop: '4px' }}>
                    Includes: Welcome Kit, Certificate, Lab entry, {addons.hardwareKit ? 'Hardware Kit, ' : ''}{addons.hoodie ? 'Official Hoodie, ' : ''}{addons.lunch ? 'Lunch Pass' : ''}
                  </div>
                </div>

                {/* SVG QR Code Simulation */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #0c2334',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                }}>
                  <svg width="76" height="76" viewBox="0 0 100 100" fill="#0c2334">
                    {/* Retro QR Pattern Matrix */}
                    <rect x="0" y="0" width="30" height="30" rx="4" />
                    <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="10" y="10" width="10" height="10" />

                    <rect x="70" y="0" width="30" height="30" rx="4" />
                    <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="80" y="10" width="10" height="10" />

                    <rect x="0" y="70" width="30" height="30" rx="4" />
                    <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="10" y="80" width="10" height="10" />

                    <rect x="36" y="8" width="8" height="8" />
                    <rect x="48" y="16" width="8" height="8" />
                    <rect x="36" y="36" width="12" height="12" />
                    <rect x="54" y="44" width="8" height="8" />
                    <rect x="16" y="44" width="8" height="8" />
                    <rect x="74" y="48" width="14" height="14" />
                    <rect x="42" y="68" width="14" height="8" />
                    <rect x="68" y="76" width="12" height="12" />
                  </svg>
                  <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#0c2334', fontWeight: 700, marginTop: '4px' }}>
                    SCAN AT GATE
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                <button onClick={handlePrint} className="btn-tactile-primary">
                  <Printer size={16} />
                  <span>PRINT / SAVE DELEGATE PASS</span>
                </button>
                <button
                  onClick={() => setFormSubmitted(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    background: '#eef7f1',
                    border: '1px solid #c5e0d7',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0e2a3d'
                  }}
                >
                  Register Another Participant
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ==========================================================================
             REGISTRATION PASS SELECTION & FORM
             ========================================================================== */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Step 1: Pass Selection Cards Grid */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-teal)',
                  color: '#0c2334',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  1
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  Select Your Participation Pass Tier
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '20px'
              }}>
                {PASS_TIERS.map((tier) => {
                  const isSelected = selectedPass.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedPass(tier)}
                      className="ditto-card"
                      style={{
                        padding: '24px',
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--color-teal)' : 'var(--line-soft)',
                        background: isSelected ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
                        boxShadow: isSelected ? '0 8px 30px rgba(20, 179, 173, 0.2)' : 'none',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {tier.recommended && (
                        <div style={{
                          position: 'absolute',
                          top: '-12px',
                          right: '20px',
                          background: 'var(--color-gold)',
                          color: '#000',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          boxShadow: '0 2px 8px rgba(240, 172, 27, 0.4)'
                        }}>
                          MOST POPULAR
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span className="pixel-badge pixel-badge-teal" style={{ fontSize: '8px' }}>
                            {tier.badge}
                          </span>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--color-teal)' : '#a8cfc4'}`,
                            background: isSelected ? 'var(--color-teal)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0c2334'
                          }}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>

                        <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                          {tier.name}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                          <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-teal-deep)', lineHeight: 1 }}>
                            ₹{tier.price}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
                            / delegate
                          </span>
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                          {tier.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          {tier.features.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <Check size={14} color="#14b3ad" style={{ marginTop: '3px', flexShrink: 0 }} />
                              <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: isSelected ? 'var(--color-teal)' : 'var(--bg-surface-2)',
                          color: isSelected ? '#0c2334' : 'var(--ink-secondary)',
                          border: `1px solid ${isSelected ? 'var(--color-teal-deep)' : 'var(--line-soft)'}`,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected ? 'SELECTED TIER ✓' : 'SELECT PASS'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add-ons & Hardware Kits */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(12, 35, 52, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-teal)',
                  color: '#0c2334',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  2
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  Optional Symposium Hardware Kits & Extras
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {/* Addon 1 */}
                <div
                  onClick={() => handleAddonToggle('hardwareKit')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${addons.hardwareKit ? 'var(--color-teal)' : 'var(--line-soft)'}`,
                    background: addons.hardwareKit ? 'var(--bg-surface-2)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addons.hardwareKit}
                    onChange={() => {}}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                        Hardware IoT Kit
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-teal-deep)' }}>
                        +₹250
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                      Includes breadboard, jumper leads, ESP32 dev board, ultrasonic sensor & LED pack.
                    </p>
                  </div>
                </div>

                {/* Addon 2 */}
                <div
                  onClick={() => handleAddonToggle('hoodie')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${addons.hoodie ? 'var(--color-teal)' : 'var(--line-soft)'}`,
                    background: addons.hoodie ? 'var(--bg-surface-2)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addons.hoodie}
                    onChange={() => {}}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                        Official Symposium Hoodie
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-teal-deep)' }}>
                        +₹450
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                      Heavyweight premium fleece hoodie with embroidered Chakravyuh 2026 silicone patch.
                    </p>
                  </div>
                </div>

                {/* Addon 3 */}
                <div
                  onClick={() => handleAddonToggle('lunch')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${addons.lunch ? 'var(--color-teal)' : 'var(--line-soft)'}`,
                    background: addons.lunch ? 'var(--bg-surface-2)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addons.lunch}
                    onChange={() => {}}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-primary)' }}>
                        2-Day Buffet Lunch Pass
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-teal-deep)' }}>
                        +₹150
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                      Executive dining passes for Day 1 and Day 2 lunch buffet plus morning high-tea.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Participant Information Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line-soft)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(12, 35, 52, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-teal)',
                  color: '#0c2334',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  3
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  Delegate & Contact Credentials
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '18px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@engg.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MIT Pune / COEP / VJTI"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    PRN / Roll Number / USN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 72109482J"
                    value={formData.prn}
                    onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '6px' }}>
                    Department / Major
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      background: 'var(--bg-surface-2)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--ink-primary)',
                      outline: 'none'
                    }}
                  >
                    <option>Electronics & Telecommunication (E&TC)</option>
                    <option>Electronics & Communication (ECE)</option>
                    <option>Computer Science & Engineering (CSE)</option>
                    <option>Information Technology (IT)</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Instrumentation & Control</option>
                    <option>Mechanical / Mechatronics</option>
                    <option>Electrical Engineering</option>
                  </select>
                </div>
              </div>

              {/* If Team Pass selected, show team member fields */}
              {selectedPass.id === 'pass-gold' && (
                <div style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Layers size={18} color="#0c8a86" />
                    <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink-primary)' }}>
                      Team Squad Details (Up to 4 Members Covered)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-primary)' }}>Team Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Circuit Breakers"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line-soft)', background: '#fff', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-primary)' }}>Member 2 Name</label>
                      <input
                        type="text"
                        placeholder="Member 2 Full Name"
                        value={formData.member2}
                        onChange={(e) => setFormData({ ...formData, member2: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line-soft)', background: '#fff', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-primary)' }}>Member 3 Name</label>
                      <input
                        type="text"
                        placeholder="Member 3 Full Name"
                        value={formData.member3}
                        onChange={(e) => setFormData({ ...formData, member3: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line-soft)', background: '#fff', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-primary)' }}>Member 4 Name</label>
                      <input
                        type="text"
                        placeholder="Member 4 Full Name"
                        value={formData.member4}
                        onChange={(e) => setFormData({ ...formData, member4: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line-soft)', background: '#fff', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary & Submit Button */}
              <div style={{
                background: 'var(--screen-bg)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#7fa6a8', fontFamily: 'var(--font-mono)' }}>TOTAL REGISTRATION FEE</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#f0ac1b', lineHeight: 1, marginTop: '4px' }}>
                    ₹{calculateTotal()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6fe9e2', marginTop: '4px' }}>
                    {selectedPass.name} {addons.hardwareKit || addons.hoodie || addons.lunch ? '+ Custom Addons' : ''}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-tactile-gold"
                  style={{
                    fontSize: '15px',
                    padding: '14px 28px'
                  }}
                >
                  <Sparkles size={18} />
                  <span>COMPLETE REGISTRATION & ISSUE PASS →</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
