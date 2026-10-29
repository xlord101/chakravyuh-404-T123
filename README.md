# SparkPath: Smart ENTC Learning and Innovation Platform
> **Context:** CHAKRAVYUH AI Vibe Coding Challenge  
> **Problem Statement:** *Smart ENTC Learning and Innovation Platform*  
> **PRD Source:** `SparkPath PRD - ENTC Learning Platform.md`  
> **Repository:** [https://github.com/xlord101/chakravyuh-404-T123](https://github.com/xlord101/chakravyuh-404-T123)

---

## ⚡ Overview
**SparkPath** is a gamified, mobile-friendly web application engineered to teach beginner to intermediate **Electronics and Telecommunication (ENTC)** concepts through a guided hands-on path where **every single lesson contains a live experiment**. 

Instead of memorizing static circuit diagrams on paper, students read a 90-second concept, play with live simulations, write and flash microcontroller code, diagnose intentional hardware bugs in the **Debug Dojo**, and receive real-time hints from **Spark**—an AI tutor that sees their circuit state and code.

---

## 🔁 The Core Loop (PRD Section 1.3)
1. **Learn:** A concise, visual explanation under 90 seconds.
2. **Build:** A live interactive circuit, logic gate, or code editor tried immediately.
3. **Break:** A deliberately sabotaged circuit (open wire, reversed diode, floating input) to diagnose.
4. **Fix:** The student repairs the fault and earns XP, advancing their learning path.

---

## 🚀 Key Modules & Implemented Features

### 1. Landing Page (PRD Section 5)
- **Live Interactive Circuit Centerpiece (S2):** Real schematic featuring battery, toggle switch, 220Ω resistor, and LED with live voltage (5.00V) and current (14–20mA) readouts. Toggling the switch powers the LED and animates electron flow.
- **Persistent Background Scrub Canvas (S2 & 5.4):** 240-frame exploded hardware sequence scrubbed smoothly on scroll at 15–35% opacity behind a dark vignette.
- **The Problem (S3):** Animated stats highlighting 120+ lab hours missed, ₹15,000+ hardware kit costs, and 4.2 hours lost in blind debugging.
- **Signature 4-Beat Scroll Story (S4):** Theory → Simulate → Code → Understand.
- **Bento Grid Showcase (S5):** Virtual Lab, AI Tutor, Debug Dojo, Real-World Missions, Signal Playground, Progress & Streaks.
- **Learning Path Preview (S6):** Vertical copper PCB trace powering up node by node.
- **Gamification Interactive Widget (S8):** Live simulation of lesson completion with instant XP fill, streak LED ignition, and badge unlocking.
- **FAQ Accordion & Field Manual (S10).**

### 2. Journey Map & Learning Tracks (`/learn` - PRD Section 8 & 17)
- **Track 1: Digital Logic (6 Lessons):** Bits and voltage, AND/OR/NOT decisions, Universal NAND/NOR/XOR, Boolean Algebra, Half Adder math, Sequential latches.
- **Track 2: Arduino Basics (6 Lessons):** Microcontrollers vs CPUs, Blink sketch, Ohm's Law (V=IR), digitalRead & floating inputs, analogRead (10-bit ADC), PWM duty cycles.
- **Track 3: Signals & Telecom (3 Lessons):** Continuous waveforms, noise & RC low-pass filters, Amplitude Modulation (AM).
- **Tracks 4 & 5:** Wireless Communication Systems & IoT Edge AI (labeled *Coming Soon*).

### 3. Lesson Player (`/lesson/[id]` - PRD Section 9)
- **Standard 5-Beat Rhythm:**
  - Beat 1: Hook (Why this concept matters in real hardware).
  - Beat 2: Idea (Under 90s visual theory).
  - Beat 3: Try It (Live interactive circuit / gate / switch).
  - Beat 4: Check (Multiple-choice check with instant feedback).
  - Beat 5: Break & Fix (Troubleshoot & solder/reconnect broken jumpers).
  - Recap: Concept card saved to Cheat Sheet with celebration confetti and XP reward.

### 4. Virtual Lab Hub (`/lab` - PRD Section 10)
- **Logic Builder (10.1):** Drag and toggle inputs, gates (AND, OR, NOT, NAND, NOR, XOR), glowing phosphor green wires (HIGH/LOW), and an **auto-generated live truth table** with active row highlights.
- **Microcontroller Simulator (10.2):** Virtual ATmega328P board with built-in Pin 13 LED, editable code editor, Run/Stop controls, and real-time **Serial Monitor telemetry (9600 baud)**.
- **Signal Playground & Web Audio (10.3):** Real-time HTML5 Canvas oscilloscope drawing sine, square, and triangle waves. Sliders for Frequency (Hz), Amplitude, Noise injection, and a **Low-Pass Filter toggle** demonstrating noise reduction. Features a safe **Web Audio synthesizer** ("Hear Waveform").

### 5. Debug Dojo (`/dojo` - PRD Section 12.2)
- Library of hardware faults:
  - *The Dead LED Mystery* (ground lead disconnection).
  - *The Ghost Button* (floating input picking up 50Hz environmental hum).
  - *The Blown 555 Timer* (missing current limiter on discharge pin).
- **Virtual DMM Test Probe:** Tap any circuit node to read live DC voltage levels (5.0V vs 0.0V).
- Identify root cause, repair circuit, and earn +25 XP.

### 6. Real-World Missions (`/missions` - PRD Section 13)
- Practical scenario simulations including **Smart Night Lamp** (photoresistor + threshold logic). Drag the ambient sunlight slider from Day (700 Lux) to Night (below 400 Lux) to watch the lamp automatically ignite.

### 7. Profile & Skill Mastery Map (`/profile` - PRD Section 15 & 16)
- Level progression (Spark → Pulse → Wave → Beam → Spectrum).
- Streak Calendar: 28-day LED matrix reflecting student daily learning consistency.
- Skill Mastery Bars: Digital Logic (85%), Circuit Forensics (70%), Embedded Firmware (55%), Signal Analysis (40%).
- Earned Silicon Badges: *First Light, Gate Keeper, Bug Hunter, Night Owl*.
- "Export Progress (JSON)" one-click data backup.

### 8. Spark AI Tutor (`SparkTutorDrawer.tsx` - PRD Section 14)
- Floating button accessible on every screen.
- Context-aware assistance: reads current circuit state, lesson step, and error.
- Implements the **3-step hint ladder** (nudge → approach → partial answer) without giving away solutions.

---

## 🎨 Design System Tokens (PRD Section 2.2)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0B0F0E` | Deep oscilloscope ink background |
| `--color-surface` | `#111816` | Card background |
| `--color-surface-2` | `#17201D` | Raised surfaces & inputs |
| `--color-line` | `#24302C` | PCB copper trace borders (inactive) |
| `--color-signal` | `#7CFFB2` | Phosphor green active signal & CTA |
| `--color-amber` | `#FFB84D` | Streak flame & warnings |
| `--color-cyan` | `#5CC8FF` | Spark AI Tutor & technical info |
| `--color-fault` | `#FF5C6C` | Hardware errors & Debug Dojo faults |

---

## 💻 Local Quickstart

```bash
# Clone the repository
git clone https://github.com/xlord101/chakravyuh-404-T123.git
cd chakravyuh-404-T123

# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build & type check
npm run build
```

---

## 👥 Credits
- **Problem Statement:** *Smart ENTC Learning and Innovation Platform*
- **Competition:** CHAKRAVYUH AI Vibe Coding Challenge
- **Engineering Crew:** **Team 404**
