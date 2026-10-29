# ENIGMA: Product Requirements Document

**Interactive Electronics & Telecommunication (ENTC) Learning & Innovation Platform**  
*Version 1.0 — 29 October 2026*  
*Hackathon Track: CHAKRAVYUH AI Vibe Coding Challenge — Problem Statement: "Smart ENTC Learning and Innovation Platform"*  
*Team 404*

---

## 1. Executive Overview & Product Vision

### 1.1 Summary
**ENIGMA** is a gamified, mobile-first interactive learning engine that transforms Electronics and Telecommunication (ENTC) education. Instead of memorizing abstract schematics on dead 2D paper, students touch live circuits, disassemble silicon hardware in 3D, simulate digital logic, compile real-time microcontroller firmware, and explore radio frequency waveforms. Every module couples an intuitive micro-concept with live browser simulations, interactive mini-games, intentional fault forensics, and an AI companion (**Spark**) that observes what the student builds.

### 1.2 The Problem
- **Paper-to-Silicon Disconnect:** 78% of engineering students struggle to bridge schematic textbook diagrams to physical electronic behavior, memorizing formulas for 2-hour exams without building circuit intuition.
- **Hardware Access Bottlenecks:** College physical laboratories are restricted to 2 hours per week, with 3 to 4 students crowded around a single vintage oscilloscope or breadboard.
- **Financial & Burnout Risk:** Physical kits (multimeters, microcontrollers, sensor packs) cost upwards of ₹15,000 and easily burn out from reverse polarity or missing current-limiting resistors.
- **Fragmented EdTech Ecosystem:** Coding platforms teach algorithmic syntax without hardware I/O, while industrial CAD/SPICE simulators offer zero pedagogical scaffolding, gamification, or guided feedback.
- **Blind Debugging Frustration:** A single floating input pin or dead LED leaves a beginner stuck with no real-time diagnostics or mentor to explain the underlying physics.

### 1.3 The ENIGMA Pedagogical Rhythm: The 5-Step Mastery Cycle
Every learning module in ENIGMA enforces a consistent, high-retention 5-step rhythm:

$$\mathbf{DISCOVER} \longrightarrow \mathbf{EXPERIMENT} \longrightarrow \mathbf{PLAY} \longrightarrow \mathbf{DEBUG} \longrightarrow \mathbf{MASTER}$$

1. **Step 1 — DISCOVER (< 60–90s):** Atomic visual concept card with animated diagrams, component illustrations, clickable pinouts to inspect functions, an intuitive real-world analogy, and "Explain simply" controls.
2. **Step 2 — EXPERIMENT (Live Sandbox):** Direct embedded simulator where the concept comes alive. Students manipulate live toggles, resistance sliders, and inputs, observing instant visual and electrical readouts with Reset and Undo controls.
3. **Step 3 — PLAY (Concept Mini-Game):** A fast-paced 30-second to 2-minute challenge (gate prediction, component symbol matching, truth table sprint, code ordering) that cements the mental model.
4. **Step 4 — BREAK & DEBUG (Fault Forensics):** A deliberate, understandable fault is injected (floating input, blown diode, inverted polarity). The student inspects symptoms, uses a virtual multimeter probe, and repairs the circuit with progressive 3-tier hints and zero XP penalties.
5. **Step 5 — MASTER (Assessment & Concept Unlock):** Practical synthesis task or micro-quiz updating the student's concept mastery score, awarding XP, unlocking cheat-sheet cards, and recommending the next personalized step.

### 1.4 Goals
- **G1 (2-Minute First Light):** A student with zero electronics knowledge lights a virtual LED and understands current limitation within 2 minutes of opening the app.
- **G2 (Core Curriculum Coverage):** Deliver complete interactive tracks for Digital Logic (Combinatorial Circuits) and Arduino Microcontrollers (Firmware & Embedded I/O), plus a foundational Signals & RF track.
- **G3 (Context-Aware AI Guidance):** Spark AI Tutor reads live schematic JSON, microcontroller code, and error states, teaching via a 3-tier hint ladder before revealing answers.
- **G4 (Hardware Keynote Presentation):** The landing page functions as an interactive keynote for judges, showcasing a 240-frame 3D hardware disassembly sequence scrubbed smoothly via Lenis with frosted glass overlays.
- **G5 (Zero-Friction Client-Side Architecture):** 100% operational on a 375px mobile viewport, installable as an offline-capable PWA, with immediate Guest Mode access.

### 1.5 Non-Goals
- Not a replacement for a 4-year accredited degree or textbook library.
- No physical hardware shipment, commercial payment processing, or institutional LMS admin portal in v1.
- No high-overhead SPICE differential equation simulation; focus is on pedagogically correct, real-time educational models.
- No public competitive leaderboards that encourage toxic score-farming over understanding.

### 1.6 Target User Personas
- **Persona A: Riya (First-Year ENTC Undergrad):** Has completed introductory C programming but has never touched a physical breadboard. Intimidated by lab practicals; wants to understand logic gates, resistor color codes, and voltage dividers on her phone before entering the laboratory.
- **Persona B: Arjun (Second-Year Student & Maker):** Familiar with basic circuits, eager to program microcontrollers (ATmega328P/Arduino), build autonomous projects, and learn rapid hardware debugging for hackathons.
- **Persona C: The Hackathon Judge:** Demands an instant, high-fidelity demo with zero login friction, evaluating pedagogical rigor, simulation smoothness, UI taste, and AI context integration in under 5 minutes.

---

## 2. Design System & Motion Principles

### 2.1 Visual Direction: Retro-Modern Oscilloscope & Tactile PCB
ENIGMA pairs a dark oscilloscope aesthetic (deep ink `#07080a`, circuit copper traces, phosphor signal green `#7CFFB2`) with the tactile frosted glass and typography established in our design library (`C:\Dev-Drive\Portfolio`) and `ditto.site` pixel accents.

### 2.2 Color Tokens

| Token | Hex Value | Purpose & Meaning |
| :--- | :--- | :--- |
| `--color-bg` | `#07080A` | Deep dark page canvas and CRT background |
| `--color-surface` | `#111615` | Baseline container panels and breadboards |
| `--color-surface-2` | `#17201D` | Elevated cards, interactive inputs, terminal bays |
| `--color-line` | `rgba(255, 255, 255, 0.12)` | Inactive copper traces, component outlines, grid dividers |
| `--color-text` | `#F4F4F5` | Primary typographic hierarchy |
| `--color-muted` | `#8A9A93` | Telemetry readouts, secondary annotations, inactive pins |
| `--color-signal` | `#7CFFB2` | Active high voltage (5V), energized wire traces, success, primary CTA |
| `--color-amber` | `#FFB84D` | Microcontroller clock, streak flame, warning conditions |
| `--color-cyan` | `#5CC8FF` | AI Tutor Spark, RF waveforms, information chips |
| `--color-fault` | `#FF5C6C` | Blown components, short circuits, Debug Dojo faults |

### 2.3 Typography System
- **Display / Brand & Badges:** `Silkscreen` & `Press Start 2P` (`--font-pixel`). Used for the `ENIGMA` wordmark, keynote pills, telemetry frame counters, mini-game badges, and retro-tech LCD readouts (matching `ditto.site`).
- **Headings & Body:** `Hanken Grotesk` / modern geometric grotesque (`--font-body`). Clean, legible at small sizes, tracking `[-0.04em]` to `[-0.07em]`.
- **Code & Telemetry:** `JetBrains Mono` (`--font-mono`). Pin numbers, C++ syntax, memory addresses, truth table bits.

### 2.4 Tactile Frosted Glass & Components
- **Glass Panels (`.glass-panel`):** Multi-layered gradient with `-webkit-backdrop-filter: blur(12px) saturate(140%)`, subtle border `rgba(255, 255, 255, 0.14)`, and specular inner highlight `inset 0 1px 0 0 rgba(255, 255, 255, 0.22)`.
- **Tactile 3px Buttons:** 3px offset drop-shadow with instant 0.12s active translation (`transform: translateY(2px)`), mimicking physical tactile microswitches.
- **CRT Oscilloscope Overlay:** Subtle scanline gradient (`background-size: 100% 4px`) at 25% opacity over simulation monitors.

### 2.5 Meaningful Animations & Micro-Interactions
Every motion carries pedagogical meaning:
1. **Signal Travel:** Phosphor green light pulses travel along active wires from positive supply to ground at calibrated speeds matching clock cycles.
2. **Logic Glow:** Gate outputs illuminate with a 150ms phosphor bloom when Boolean expressions evaluate to `1`.
3. **Dynamic LED Radiance:** Virtual LEDs brighten proportionally to computed loop current ($I = \frac{V_{in} - V_{drop}}{R}$) and display realistic smoke/burnout warnings when current exceeds 30mA without a current-limiting resistor.
4. **Live Waveform Modulation:** Real-time canvas oscilloscope updates instantaneously as frequency, amplitude, and filter cutoff sliders move.
5. **Firmware Line Step:** Code execution highlights active C++ statements in sync with virtual hardware pin transitions.
6. **Instantaneous Celebrations:** XP additions and badge unlocks trigger compact, skippable confetti animations under 1.2 seconds, never blocking student clicks.
7. **Accessibility & Reduced Motion:** When `prefers-reduced-motion` is detected, 3D scroll scrub degrades gracefully to static keyframes, pulsing traces become static solid lines, and transitions default to 150ms opacity fades.

---

## 3. Adaptive Six-Question Onboarding Questionnaire

### 3.1 Purpose & Flow
Before beginning the learning path, ENIGMA presents an adaptive, friendly 60-to-90-second onboarding questionnaire. It diagnoses prior background, estimates conceptual electronics familiarity, and recommends an optimal starting level without blocking access to any track.

### 3.2 User Experience Specifications
- **Heading:** *"Let's find your starting point."*
- **Subtitle:** *"A few quick questions will help us personalise your learning journey."*
- **Card-by-Card Flow:** Exactly 6 questions, one per screen, with animated progress indicator (`Question X of 6`), Back, Next, and Skip options.
- **Non-Blocking Architecture:** Skipping immediately assigns the default *Beginner Explorer* level and routes to Lesson 1.
- **Zero Irrelevant Data:** No phone numbers, institutional logins, or invasive tracking.
- **Retakeable Anytime:** Learners can retake the questionnaire or manually change difficulty in `/settings`.

### 3.3 The Six Diagnostic Questions

```
Q1. Have you studied Electronics or ENTC before?
[A] No, I am completely new.
[B] I have heard of a few concepts.
[C] I have studied basic electronics in class.
[D] I have already built or experimented with circuits.

Q2. What does a resistor mainly do in a circuit?
[A] Limits the flow of electric current.  (Correct Concept)
[B] Stores a program.
[C] Produces sound.
[D] I am not sure.

Q3. What is the output of an AND gate when both inputs are 1?
[A] 0
[B] 1  (Correct Concept)
[C] It always changes.
[D] I am not sure.

Q4. Have you ever used an Arduino or a similar microcontroller board?
[A] Never used one.
[B] I have seen one but not used it.
[C] I have followed a basic tutorial.
[D] I have written code and controlled components with one.

Q5. What happens when an LED circuit is connected incorrectly?
[A] It will always work normally.
[B] It may not light up or may be damaged.  (Correct Concept)
[C] The circuit automatically repairs itself.
[D] I am not sure.

Q6. How comfortable are you with simple programming concepts such as variables and if/else?
[A] I have never programmed.
[B] I understand a few basics.
[C] I can write simple programs.
[D] I can write and debug programs independently.
```

### 3.4 Transparent Scoring & Classification Algorithm

Points are scored transparently across two distinct vectors:
- **Concept Familiarity Points ($C$):** Evaluated from Q2, Q3, and Q5.
  - Option A in Q2: $+2$ points.
  - Option B in Q3: $+2$ points.
  - Option B in Q5: $+2$ points.
  - "I am not sure" or incorrect: $0$ points (no negative penalty). Max $C = 6$.
- **Practical Experience Points ($E$):** Evaluated from Q1, Q4, and Q6.
  - Option A: $0$ pts | Option B: $+1$ pt | Option C: $+2$ pts | Option D: $+3$ pts. Max $E = 9$.

#### Classification Thresholds & Fast-Track Test-Out Rules
- **Beginner Explorer ($C \le 2$ or $E \le 3$):**
  - *Recommendation:* Starts on Track 1, Lesson 1 (`logic-1: Voltage & The First Bit`).
  - *Scaffolding:* Step-by-step visual demonstrations, guided explanations, component pinout tooltips, generous AI hint scaffolding, and all lessons in standard sequence.
  - *Result Screen Copy:*  
    *"Your journey starts here: Beginner Explorer"*  
    *"You don't need to know everything already. ENIGMA will help you learn by experimenting."*
- **Circuit Explorer / Intermediate ($C \ge 4$ and $E \ge 4$):**
  - *Fast-Track Test-Out:* Intermediate learners demonstrate mastery of basic binary voltage and Ohm's law fundamentals, allowing them to test out / fast-track past foundational lessons (`logic-1`, `logic-2`) directly into advanced Combinatorial Gates (`logic-3`) or Microcontroller Firmware (`ard-1`).
  - *Scaffolding:* Harder conceptual questions, direct sandbox editing, complex fault-injection puzzles, and embedded C++ challenges with streamlined hints.
  - *Revisit Anytime:* Fast-tracked or skipped lessons remain permanently accessible and can be reviewed, replayed, or completed for full XP at any time.
  - *Result Screen Copy:*  
    *"Your journey starts here: Circuit Explorer"*  
    *"Let's put your knowledge to work through simulations, coding and debugging."*
- **Level Flexibility & Retakes:** Learners can retake the diagnostic questionnaire, change their level preference in settings, or re-run assessments anytime without losing previously unlocked badges or XP.
- **Primary Action Button:** `[ Start My Learning Journey → ]` immediately opens the personalized lesson player.

---

## 4. Redesigned 5-Step Lesson Player Architecture

The lesson player (`/lesson/[id]`) replaces passive reading with a structured, interactive 5-step journey:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENIGMA 5-STEP LESSON PLAYER                     │
├─────────────┬──────────────┬──────────────┬─────────────┬──────────────┤
│ 1. DISCOVER │ 2.EXPERIMENT │   3. PLAY    │  4. DEBUG   │  5. MASTER   │
│ Visual Card │ Live Sandbox │  Mini-Game   │ Break & Fix │ Assessment   │
│   (< 90s)   │  (Simulate)  │  (Challenge) │  (Forensics)│  (XP & Next) │
└─────────────┴──────────────┴──────────────┴─────────────┴──────────────┘
```

### 4.1 Step 1 — DISCOVER
- **Length:** Strict 60–90 second reading budget (maximum 90–120 words).
- **Interactive Component Exploration:** Interactive SVG schematic where learners click symbols (resistor, diode, capacitor, gate) to expand clean 1-line definitions of their physical purpose.
- **Intuitive Physical Analogy:** E.g., for Voltage & Resistance: *"Voltage is the water pressure pushing through a pipe; resistance is a constriction in the pipe that slows the flow of electrons."*
- **Context Actions:** `[ Explain simply ]` and `[ Show real-world example ]` buttons request adapted explanations from Spark AI.

### 4.2 Step 2 — EXPERIMENT
- **Direct Embedded Simulator:** The schematic from Step 1 transitions seamlessly into a live, interactive simulation.
- **Immediate Sensory Feedback:** Learners adjust sliders (e.g. resistance from 100Ω to 1kΩ) or flip input toggles; the virtual LED brightens or dims in real-time, wires glow phosphor green, and live readouts ($V_{drop}$, $I_{mA}$, $P_{mW}$) update synchronously.
- **Controls:** `Reset Circuit`, `Undo Action`, and a dedicated `[ Explain what I'm seeing ]` button that passes the current schematic state directly to Spark AI.

### 4.3 Step 3 — PLAY (Concept Mini-Games)
Every lesson pairs with a focused, 30-second to 2-minute mini-game designed to convert theoretical memory into tactile pattern recognition:
- **Game Types:** Logic gate output prediction, component symbol speed-matching, missing wire puzzles, truth table sprint.
- **Engine Reuse:** Mini-games leverage the core simulation engine (Logic graph evaluator, Web Audio oscillator) rather than external games.
- **Scoring & Safety:** Immediate visual validation; mistakes show where the signal path broke down rather than deducting score.

### 4.4 Step 4 — BREAK & DEBUG
- **Deliberate Educational Faults:** One intentional fault is injected into the circuit or program (e.g., reversed LED polarity, missing pull-down resistor causing a floating input, off-by-one loop in Arduino C++).
- **Symptom First:** The system shows real physical symptoms (*"The LED stays permanently dark even when Switch 1 is closed"*), prompting the student to investigate.
- **Investigation Tools:** Virtual multimeter test probe to measure voltage and logic state at any node.
- **Three-Tier Hint Ladder:**
  1. *Tier 1 (Nudge):* *"Check which side of the LED is connected to the +5V supply rail."*
  2. *Tier 2 (Approach):* *"Current can only flow from anode (long leg) to cathode (flat edge). Look closely at LED-1's orientation."*
  3. *Tier 3 (Guided Solution):* *"LED-1 is backwards. Click the flip orientation tool to allow forward bias."*
- **No Penalty Policy:** Students never lose lives or existing XP for incorrect attempts.

### 4.6 Comprehensive Pedagogical Structure for Every Module
To bridge the gap between classroom theory and real engineering practice, every single lesson in ENIGMA must answer five fundamental engineering questions before mastery is awarded:
1. **What You'll Learn:** Concise learning objectives and core electronic principles (e.g., forward bias, voltage division, Boolean minimization).
2. **Why It Matters:** Why silicon chips, microcontrollers, and communication systems rely on this exact concept.
3. **Real-World Applications & Implementation:** Physical commercial implementations in automotive ECUs, smartphones, aerospace telemetry, robotics, and medical devices.
4. **Practical Experiment or Mini-Project:** A hands-on interactive challenge building a functional virtual sub-circuit or firmware routine.
5. **Future Scope:** How this foundation unlocks advanced domains such as Edge AI, IoT sensor networks, autonomous robotics, quantum logic, and 5G/6G RF telecommunications.

---

## 5. Five-Question Adaptive Post-Lesson Quiz Engine

Following the 5-step learning rhythm, every lesson concludes with an adaptive 5-question evaluation engine to verify true conceptual mastery.

### 5.1 Quiz Mechanics & Question Archetypes
The 5 questions are dynamically balanced across four distinct pedagogical archetypes:
1. **Multiple Choice Concept Check (MCQ):** Verifies recall of fundamental definitions and component behaviors.
2. **Deep Concept Understanding:** Tests understanding of underlying physics (e.g., electron flow, voltage potential drops, diode saturation).
3. **Output / Waveform Prediction:** Shows a circuit diagram or input states and asks the student to predict the output state, voltage readout, or oscilloscope waveform.
4. **Practical Scenario Diagnostic:** Real-world troubleshooting scenario (e.g., *"An automotive brake sensor reads 0V intermittently. Which component is the most probable point of failure?"*).
5. **Code / Circuit Synthesis:** Asks the student to identify the correct firmware statement or wiring configuration needed to achieve a target specification.

### 5.2 Adaptive Difficulty Tuning
- **Beginner Explorer:** Receives foundational questions with visual circuit diagrams and clear distractors that isolate common beginner misconceptions.
- **Circuit Explorer (Intermediate):** Receives higher-order questions involving multi-gate propagation, analog voltage dividers, timing constraints, and register-level microcontroller behavior.
- **Adaptive In-Quiz Branching:** If a student answers Question 1 and 2 correctly on the first attempt, Questions 3 through 5 increase in conceptual rigor; if they struggle, hints and simpler diagnostic checks are presented.

### 5.3 Diagnostic Feedback & Weak-Topic Tracking
- **Instant Detailed Explanations:** Every option (correct or incorrect) provides instant pedagogical feedback explaining *why* it is right or wrong from first principles.
- **Weak-Topic Registry:** Incorrect responses tag the user's profile with targeted weak topics (e.g., `Weak Topic: Pull-Down Resistors`, `Weak Topic: Truth Table De Morgan's Law`).
- **Targeted Revision & Retry:** Students can retry failed quizzes with alternative question permutations. Quizzes never penalize previously earned XP or lock out content.

---

## 6. Lesson Progress & Mastery Dashboard

ENIGMA strictly separates **Lesson Completion** (finishing the steps of a lesson) from **Concept Mastery** (demonstrating durable knowledge across quizzes, simulations, and debugging tasks).

### 6.1 Progress Dashboard Metrics
- **Completed vs. Remaining Lessons:** Track-by-track breakdown with visual segmented copper traces.
- **Concept Mastery Radar:** Multi-axis radar visualization tracking mastery percentages across 5 core ENTC domains:
  1. *Digital Logic & Silicon Architecture*
  2. *Circuit Analysis & Ohm's Law*
  3. *Microcontrollers & Embedded C++*
  4. *Signals, Telecommunications & RF*
  5. *Hardware Debugging & Fault Isolation*
- **Quiz Performance Analytics:** Average quiz score, first-attempt accuracy percentage, and total questions answered.
- **Weak Topics Registry:** Actionable list of flagged weak topics with 1-click **"Review Concept with Spark AI"** buttons.
- **Mini-Games & Dojo Cases Solved:** Count of completed practical challenges and repaired circuit anomalies.
- **Gamification HUD:** Cumulative XP, current rank level (`Spark` $\rightarrow$ `Pulse` $\rightarrow$ `Wave` $\rightarrow$ `Beam` $\rightarrow$ `Spectrum`), active streak calendar, and unlocked hardware achievement badges.
- **Persistent State:** All progress, quiz scores, weak topics, and custom settings persist automatically across browser visits using structured `localStorage`.

---

## 7. Real-World Relevance & Mini-Projects Matrix

Every curriculum track is explicitly mapped to industrial implementation and future technology sectors:

| Module / Track | What You'll Learn | Real-World Application & Industry Usage | Hands-On Mini-Project | Future Scope (IoT, Robotics, Telecom) |
| :--- | :--- | :--- | :--- | :--- |
| **Track 1: Digital Logic** | Binary voltage thresholds, Boolean algebra, logic gates (AND/OR/NOT/NAND/NOR/XOR), adders | Digital CPUs (x86/ARM), ALU arithmetic units, safety interlocks in industrial elevator control systems | Virtual 4-Bit Half Adder & Fault-Tolerant Alarm Interlock | Quantum logic gates, Edge AI neuromorphic computing, asynchronous silicon architectures |
| **Track 2: Arduino & Microcontrollers** | ATmega328P architecture, GPIO pin control, C++ firmware, ADC conversion, PWM duty cycles | Automotive engine control units (ECUs), drone flight controllers, 3D printer stepper drivers | Smart Temperature Fan Controller with PWM Speed Adjustment | Autonomous mobile robotics (ROS), industrial IoT (IIoT) telemetry nodes, smart grid monitoring |
| **Track 3: Signals & Telecommunications** | Sine/Square/Triangle harmonics, RC low-pass filters, AM/FM modulation, signal-to-noise ratio (SNR) | Cellular 4G/5G transceivers, radar distance measurement, audio DSP synthesizers, biomedical ECG monitors | Audio Noise Cancellation Filter & Virtual AM Carrier Tuner | 6G terahertz communication, satellite constellations (Starlink), biomedical neural interfaces |
| **Track 4: Embedded Protocols (Future)** | I2C, SPI, UART serial bus handshakes, baud rates, packet framing, parity bits | Satellite telemetry, avionics CAN bus in aircraft, EV battery management systems (BMS) | Multi-Sensor I2C Bus Scanner & Packet Sniffer | Connected autonomous vehicles (V2X), CubeSat nano-satellite constellations, subsea telemetry |

---

## 8. Interactive Mascot — Spark

**Spark** is the encouraging, electronics-inspired companion that serves as the friendly face and interactive guide of ENIGMA.

### 8.1 Visual Persona & Character Design
- **Character Concept:** A retro-modern CRT oscilloscope display with glowing phosphor-green reactive eyes (`#5cdbb5`), two animated antenna terminals that emit subtle electromagnetic sparks, and a friendly copper trace body matching the dark PCB aesthetic.
- **Design Integrity:** Matches the dark PCB and pixel art ruins palette (`#090e0c`, `#111a17`, `#5cdbb5`, `#e5a93c`). No cartoonish emojis or generic AI robot clichés.
- **Floating Presence:** Spark remains visible as a compact, floating assistant widget in the bottom-right corner throughout the learning workspace, positioned so it never covers breadboards, code editors, or interactive controls.

### 8.2 Contextual Speech Bubbles & Messaging
Spark periodically presents compact, encouraging speech bubbles tailored to learner actions:
- **First Visit:** *"Hi! I'm Spark ⚡ Ready to explore live circuits?"*
- **Returning Learner:** *"Welcome back! Your streak is alive. Ready to continue where you left off?"*
- **Active Lesson Help:** *"Need a little help? Ask Spark anytime!"*
- **Lesson Completed:** *"Great job! You're getting the hang of it!"*
- **Repeated Mistake in Debug / Quiz:** *"Stuck? Let's trace the signal and debug this together."*
- **Encouragement:** *"One more challenge? You've got this!"*
- **Recommended Next Step:** *"Your next lesson is waiting on the journey map. Let's go!"*

### 8.3 Interaction & Anti-Annoyance Controls
- **Dismissable:** Any speech bubble can be dismissed with a single click or tap.
- **Mute Mode:** Learners can toggle `"Mute Automatic Mascot Hints"` in settings or via a quick icon on the mascot bubble.
- **Lightweight Animation:** Smooth 60fps CSS transforms for idle bobbing and eye blinking. Full support for `prefers-reduced-motion` (replaces motion with static friendly posture).
- **Tone Mandate:** Always warm, constructive, and empowering. Never judgmental, shaming, or aggressive regarding low scores or missed streaks.

### 8.4 Spark AI Deep Integration
Clicking the Spark mascot or the **"Ask Spark"** bubble opens the platform's **existing Spark AI assistant** (`SparkTutorDrawer.tsx` powered by `useSparkStore.ts`):
- **Context Injection:** When opened, the mascot automatically passes rich runtime telemetry to the tutor:
  - Active lesson ID and title
  - Current user diagnostic level (`Beginner Explorer` vs `Circuit Explorer`)
  - Active circuit state (component positions, wire connections, probe voltages)
  - Recent quiz mistakes and flagged weak topics
- **Quick Action Triggers:**
  - `[ 💡 Explain this concept ]`: Generates an intuitive, real-world analogy of the active topic.
  - `[ 🔍 Give me a hint ]`: Unlocks Tier 1 of the progressive 3-tier hint ladder without spoiling the answer.
  - `[ 🛠️ Debug my circuit / code ]`: Analyzes open circuits, reversed polarities, or syntax errors.
  - `[ 📝 Quiz me on this ]`: Generates an interactive micro-check on the active topic.

| Track | Lesson ID & Concept | Mini-Game Name | Core Mechanics & Time Limit | Pedagogical Objective |
| :--- | :--- | :--- | :--- | :--- |
| **Digital Logic** | `logic-1`: Bits & Voltage | **Binary Dash** | 45s relaxed quiz: match 5V/0V states to binary 1 and 0 | Internalize TTL high/low voltage logic levels |
| **Digital Logic** | `logic-2`: AND, OR, NOT | **Gate Predictor** | 60s challenge: predict output state before energizing inputs | Understand truth conditions without rote memorization |
| **Digital Logic** | `logic-3`: Universal NAND | **Build the Gate** | Drag-and-drop: build an inverter NOT gate using only 1 NAND gate | Grasp universal logic gate equivalence |
| **Digital Logic** | `logic-4`: Truth Tables | **Truth Table Sprint** | Fill 4 missing cells on an active evaluating truth table grid | Bridge schematic diagrams to Boolean algebra |
| **Digital Logic** | `logic-5`: Half Adder | **Circuit Repair** | Locate 1 misplaced wire connecting XOR and AND gate outputs | Master carry and sum bit generation |
| **Circuits** | `ard-1`: Ohm's Law | **Resistance Tuner** | Adjust resistor slider to keep current between 15mA and 20mA | Prevent component burnout while optimizing brightness |
| **Circuits** | `ard-2`: Components | **Component Match** | Match schematic symbols to physical parts (resistor, capacitor, diode) | Fluency in reading international engineering schematics |
| **Circuits** | `ard-3`: Safe Circuit | **Safe Circuit Fix** | Diagnose why an unresisted LED burns out when exposed to 9V | Understand $V = I \times R$ current limiting |
| **Arduino** | `ard-4`: Blink Firmware | **First Light** | Write & run `digitalWrite(13, HIGH)` and `delay(500)` in C++ | Understand microcontroller pin actuation cycles |
| **Arduino** | `ard-5`: Pushbutton I/O | **Pin Detective** | Find the pin number mismatch between circuit wiring and C++ code | Master embedded pin mapping and input polling |
| **Arduino** | `ard-6`: Analog Read | **Sensor Mission** | Slide virtual potentiometer to cross threshold voltage and fire buzzer | Learn 10-bit Analog-to-Digital Conversion (ADC) |
| **Signals** | `sig-1`: Waveforms | **Waveform Match** | Match audio tone and visual wave to Sine, Square, or Triangle | Distinguish harmonic frequency profiles |
| **Signals** | `sig-2`: Noise Filtering | **Noise Buster** | Slide low-pass filter cutoff frequency to strip high-frequency Gaussian hiss | Understand RC filter frequency response |
| **Signals** | `sig-3`: AM Modulation | **Carrier Tuner** | Modulate carrier wave with audio envelope and observe spectrum | Grasp telecommunication carrier modulation |

---

## 6. Meaningful Motion & Micro-Interactions Specification

### 6.1 Interactive Principles
1. **Zero Uninformative Eye-Candy:** Every animation serves as visual feedback for electronic state changes, current propagation, or code compilation.
2. **Strict Time Budgeting:**
   - Standard UI state transitions: `150ms – 250ms` (cubic-bezier easing).
   - Milestone and XP animations: `< 1200ms` with immediate click-to-skip.
   - 3D Scroll Scrubbing: 60fps Lenis inertial scroll (`duration: 2.0`, `wheelMultiplier: 0.58`).
3. **Accessibility First (`prefers-reduced-motion`):**
   - Automatically disables traveling wire pulses, replaces 3D scrub with static keyframe presentation, and reduces screen transitions to instant opacity cuts.

### 6.2 Micro-Interaction Inventory
- **Tactile Microswitches:** 3px offset with shadow compression upon click.
- **Wire Glow Transition:** Interpolates between `#27272a` (unpowered) and `#7CFFB2` (energized) over 120ms with a localized travelling particle pulse.
- **Multimeter Probe Tip:** Virtual probe crosshair snaps to circuit nodes with a gentle tactile click and displays an instantaneous digital readout overlay (`5.00V DC`).
- **Phosphor Gate Bloom:** Gates illuminating on logic true cast an inner radial glow matching the signal color.
- **Audio Oscilloscope Beam:** Real-time `<canvas>` trace oscillates smoothly with Web Audio AnalyserNode frequency bins.

---

## 7. Gamification, Skill Mastery & Motivation Architecture

### 7.1 XP & Mastery Distribution

| Action | XP Awarded | Mastery Impact | Anti-Farming Safeguard |
| :--- | :--- | :--- | :--- |
| Discover Card Read & Explore | $+5$ XP | $+2\%$ Concept Familiarity | One-time per lesson |
| Experiment Sandbox Manipulation | $+10$ XP | $+5\%$ Sandbox Competence | One-time per lesson |
| Mini-Game Solved (First Try) | $+15$ XP | $+8\%$ Concept Fluency | Diminishes to $+2$ XP on repeat |
| Debug Dojo Fault Solved Cleanly | $+25$ XP | $+12\%$ Forensics Mastery | Hint usage deducts bonus (base preserved) |
| Lesson Complete (All 5 Steps) | $+25$ XP | $+15\%$ Track Mastery | Re-completing gives 0 XP (practice only) |
| Real-World Mission Accomplished | $+80$ XP | $+25\%$ Applied Engineering | Multi-variable verification required |

### 7.2 Transparent Concept Skill Mastery Map
Mastery is measured per conceptual unit on a $0$ to $100\%$ scale derived exclusively from diagnostic challenge accuracy, clean debugging fixes, and assessment performance:
$$\text{Mastery Score} = 0.4 \times (\text{Debug Accuracy}) + 0.35 \times (\text{Challenge Performance}) + 0.25 \times (\text{Assessment Score})$$
- **Zero Idle-Time Credit:** Mastery never increases from leaving the tab open or passively viewing pages.
- **Visible Skill Radar:** The user profile displays live mastery bars across *Digital Logic*, *Microcontrollers*, *Circuit Laws*, and *Signal Processing*.

### 7.3 Encouraging Feedback Copy Architecture
ENIGMA strictly prohibits punitive mechanics, life-counter locks, manipulative countdowns, or shaming messages:
- *On Incorrect Circuit Connection:* *"Not quite yet. Check the return path to Ground (GND) — is the circuit loop complete?"*
- *On Blown LED:* *"The LED drew 45mA and burnt out! Remember, an LED has near-zero resistance when forward biased. What component can limit the flow?"*
- *On Hint Request:* *"Here is a small nudge to point you in the right direction."*
- *On Streak Miss:* *"Welcome back! Your streak freeze protected your progress. Let's power up today's node."*
- *On Mastery Milestone:* *"You've mastered Boolean Half Adders without hints. Ready to test a Full Adder?"*

### 7.4 Badges Catalog
- **First Light:** Complete your first guided LED experiment in under 2 minutes.
- **Gate Keeper:** Complete all 6 lessons of Track 1 (Digital Logic & Combinatorial Circuits).
- **Bug Hunter:** Successfully diagnose and repair 5 faulty circuits in the Debug Dojo.
- **Clean Solve:** Complete 3 consecutive debugging challenges without using Tier 2 or 3 hints.
- **Signal Sage:** Complete the Signals and RF Telecommunication track.

---

## 8. Spark AI Tutor: Context-Aware Intelligence

### 8.1 Architecture & Context Payload
Spark is an embedded AI tutor that observes the student's live workspace state. With every user query, the client dispatches a structured context payload to the server-side API:

```typescript
interface SparkContextPayload {
  lessonId: string;
  stepType: 'discover' | 'experiment' | 'play' | 'debug' | 'master';
  userLevel: 'beginner' | 'intermediate';
  circuitSchematicJson: {
    nodes: Array<{ id: string; type: string; state: any; value?: number }>;
    wires: Array<{ from: string; to: string; active: boolean }>;
  };
  microcontrollerCode?: string;
  compilerError?: string;
  lastProbeReading?: { node: string; voltage: number; logicLevel: number };
  recentAttempts: number;
  hintTierRequested: 1 | 2 | 3;
}
```

### 8.2 Guardrails & Pedagogical Constraints
- **Hint-First Rule:** Spark never outputs complete answers or code solutions on the first prompt. It provides conceptual scaffolding matching the 3-tier ladder.
- **Honesty & Anti-Hallucination:** Spark only references components, voltages, and code lines explicitly present in the provided context payload. If the simulator has not executed, Spark explicitly states it has not seen runtime telemetry.
- **Micro-Practice Hook:** After explaining a concept, Spark concludes with a 1-sentence thought check: *"If we double the resistor from 220Ω to 440Ω, what do you predict happens to the current?"*
- **Offline & Zero-Key Fallback:** If an LLM API key is unconfigured or network is offline, Spark switches automatically to a **deterministic pedagogical rulebook**. Pre-compiled expert diagnostic trees analyze circuit topology and offer accurate hints without failure.

---

## 9. Comprehensive Sitemap & Route Architecture

| Route | View Name | Access | Core Functionality |
| :--- | :--- | :--- | :--- |
| `/` | **Keynote Landing Page** | Public | 240-frame 3D hardware canvas, keynote presentation slides, live 5V LED circuit centerpiece, guest launch CTA. |
| `/onboarding` | **Adaptive Questionnaire** | Public/Guest | 6-question diagnostic survey, transparent scoring, starting level classification. |
| `/learn` | **Journey Hub** | Signed in / Guest | Winding PCB trace path, locked/available/completed nodes, track switcher, daily goal ring. |
| `/lesson/[id]` | **5-Step Lesson Player** | Signed in / Guest | Discover → Experiment → Play → Debug → Master player with embedded simulators. |
| `/lab` | **Virtual Lab Studio** | Signed in / Guest | Standalone Logic Gate Builder, Arduino C++ IDE & Serial Monitor, and Signal Playground. |
| `/dojo` | **Debug Dojo** | Signed in / Guest | Dedicated hardware fault forensics bay with virtual probe and sabotaged circuits library. |
| `/challenges`| **Challenge Arena** | Signed in / Guest | Timed Truth Table sprints, gate construction challenges, and code challenges. |
| `/missions` | **Applied Missions** | Signed in / Guest | Smart Night Lamp, Gas Leak Alarm, Distance Beeper real-world scenarios. |
| `/profile` | **Profile & Skill Map** | Signed in / Guest | Live concept mastery radar, streak LED calendar, badges showcase, JSON export. |
| `/settings` | **Preferences** | Signed in / Guest | Daily time goal, sound toggle, reduced motion toggle, questionnaire retake, progress reset. |

---

## 10. Extended Data Model (TypeScript Specification)

```typescript
export type UserLevel = 'beginner' | 'intermediate';
export type LessonStepType = 'discover' | 'experiment' | 'play' | 'debug' | 'master';

export interface OnboardingState {
  completed: boolean;
  answers: Record<string, string>; // e.g. { q1: 'A', q2: 'A', ... }
  conceptScore: number;            // 0 - 6
  experienceScore: number;         // 0 - 9
  recommendedLevel: UserLevel;
  completedAt?: string;
}

export interface UserPreferences {
  reducedMotion: boolean;
  soundEnabled: boolean;
  dailyGoalMin: number;
}

export interface UserState {
  id: string;
  name: string;
  level: string;
  xp: number;
  streak: number;
  streakActive: boolean;
  onboarding: OnboardingState;
  preferences: UserPreferences;
  completedLessons: string[];
  unlockedBadges: string[];
  completedDojoCases: string[];
  conceptMastery: Record<string, number>; // conceptId -> mastery score 0..100
}

export interface MiniGameDefinition {
  id: string;
  title: string;
  gameType: 'predict_gate' | 'truth_table_sprint' | 'match_component' | 'resistance_tuner' | 'waveform_match' | 'bug_hunter';
  targetState: any;
  timeLimitSec?: number;
  xpReward: number;
}

export interface LessonStep {
  stepType: LessonStepType;
  title: string;
  content: string;
  analogy?: string;
  interactiveGoal?: string;
  miniGame?: MiniGameDefinition;
  faultScenario?: {
    symptom: string;
    injectedFaultId: string;
    hints: [string, string, string]; // Nudge, Approach, Guided
    solutionVerification: (circuitState: any) => boolean;
  };
}

export interface LessonDefinition {
  id: string;
  trackId: 'logic' | 'arduino' | 'signals';
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  steps: LessonStep[];
}
```

---

## 11. Feature Priority Matrix: Hackathon Scope Division

| Feature Component | MVP (Must Deliver for Demo) | Secondary Improvements (Should Deliver) | Future & Stretch (Could Deliver) |
| :--- | :--- | :--- | :--- |
| **Onboarding** | 6-Question flow, scoring algorithm, beginner/intermediate level routing, skip option. | Retake survey from Settings; animated card transitions. | Institutional classroom pre-tests. |
| **Lesson Player** | 5-step rhythm (Discover, Experiment, Play, Debug, Master) for Track 1 & Track 2. | Audio readouts, automated recap cheat-sheet card generation. | Community contributed lesson builder. |
| **Simulators** | Logic Builder (AND, OR, NOT, NAND, NOR, XOR), Arduino ATmega C++ subset runner, Web Audio scope. | Multi-stage flip-flops, PWM color spectrum, AM waveform harmonics. | SPICE transistor physics simulation. |
| **Mini-Games** | Binary Dash, Gate Predictor, Truth Table Sprint, Resistance Challenge. | Audio waveform listening duel, code step order puzzle. | Multiplayer competitive logic duels. |
| **Debug Dojo** | 4 intentional fault cases (reversed LED, floating input, missing resistor, logic mismatch) with probe. | 8 additional forensic cases across analog sensors and serial UART. | Injected compiler assembler faults. |
| **AI Tutor** | Progressive 3-step hint ladder, actual schematic/code state inspection, deterministic offline fallback. | Adaptive micro practice question generation after explanation. | Real-time speech interaction via Live API. |
| **Landing Page** | 3D hardware 240-frame sequence, 5-slide keynote story, live 5V LED circuit centerpiece, guest CTA. | Interactive topic chip marquee, audio sound effects on switch. | Custom WebGL interactive CAD exploded view. |

---

## 12. Measurable Acceptance Criteria

1. **Onboarding Speed:** A first-time user can complete the 6-question questionnaire in under 90 seconds, or bypass it in 1 click via "Skip".
2. **Transparent Classification:** The platform classifies users accurately into Beginner Explorer or Circuit Explorer, explains the recommendation, and permits immediate difficulty switching.
3. **2-Minute Time-to-First-Light:** A new user with no prior background can open the app, reach Lesson 1, and illuminate a virtual LED in under 2 minutes.
4. **5-Step Rhythm Adherence:** Every core curriculum lesson contains all 5 steps (Discover, Experiment, Play, Debug, Master) with zero missing steps.
5. **Mini-Game Real-Time Validation:** Every mini-game evaluates answers within 100ms, providing instant visual feedback and clear explanations of physical causes.
6. **Mobile Viewport Optimization:** Every interactive canvas, logic gate port, resistor slider, and code editor is operable via touch on a 375px mobile viewport without horizontal page overflow.
7. **Client-Side Persistence:** Refreshing the browser preserves current lesson step, earned XP, active streak, questionnaire diagnostics, and solved Dojo cases via `localStorage`.
8. **Mastery Tracking Authenticity:** Concept mastery scores reflect actual assessment and debugging outcomes; passive reading never inflates scores.
9. **No AI Hallucination:** Spark AI answers explicitly quote actual components, voltages, and code lines from the workspace payload.
10. **Accessibility & Motion Safety:** All animations respect `prefers-reduced-motion` and interface celebrations never block user interaction for longer than 1.5 seconds.
11. **Offline Robustness:** The core learning flow, simulations, and deterministic hint system operate without failure when disconnected from the internet or when LLM API keys are unconfigured.
12. **Verified Test Readiness:** No module or lesson is marked complete without end-to-end interactive verification.

---

## 13. Phased Implementation Roadmap

```
PHASE 1: Core Foundation & Data Architecture (Done)
├── App shell, theme tokens, tactile frosted glass system
└── Zustand state store with persistent localStorage schema

PHASE 2: 3D Hardware Keynote Landing Page (Done)
├── 240-frame high-DPI exploded hardware canvas with Lenis scroll scrub
├── Portfolio-style frosted glass keynote overlays (5 slides)
└── Interactive 5V LED circuit centerpiece (battery, switch, resistor slider, LED)

PHASE 3: Adaptive Onboarding Questionnaire (Current)
├── 6-question diagnostic survey UI with progress indicator & skip
├── Transparent scoring engine classifying Beginner vs Circuit Explorer
└── Direct routing into personalized starting lesson

PHASE 4: 5-Step Lesson Player & Mini-Games Matrix (Current)
├── Discover (<90s) → Experiment (Sandbox) → Play (Mini-Game) → Debug (Forensics) → Master (XP)
├── Mini-games: Gate Predictor, Truth Table Sprint, Resistance Tuner, Waveform Match
└── Debug Dojo probe integration for fault repairs

PHASE 5: Spark AI Context Integration & Polish
├── Context-aware payload builder (schematic JSON + code + probe reading)
├── 3-step hint ladder with deterministic offline fallback
└── PWA offline caching and judging presentation rehearsal
```

---

## 14. Synchronizing Landing Page & Learning Modules

- **Hardware Disassembly Narrative:** The 5 slides on the landing page directly mirror the learning journey:
  - *Slide 1 (Silicon Overview)* $\leftrightarrow$ *Lesson 1 (Touch the Circuit & Light First LED)*.
  - *Slide 2 (The Hardware Paradox)* $\leftrightarrow$ *Adaptive Onboarding (Finding Starting Point & Bridging Lab Gaps)*.
  - *Slide 3 (The Enigma Engine)* $\leftrightarrow$ *Virtual Lab Hub (Logic Builder, Embedded IDE, Signal Scope)*.
  - *Slide 4 (The Pedagogical Loop)* $\leftrightarrow$ *5-Step Lesson Player (Discover, Experiment, Play, Debug, Master)*.
  - *Slide 5 (Live Evaluation Deck)* $\leftrightarrow$ *Direct Launchers into Interactive Sandboxes & Debug Dojo*.
- **Consistency Verification:** Any tool, topic, or metric highlighted on the keynote landing page is directly functional and testable in the student workspace.
