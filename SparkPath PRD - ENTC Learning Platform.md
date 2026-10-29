# SparkPath: Product Requirements Document

Working title: SparkPath (rename freely). Version 0.1, 29 Oct 2026. Context: CHAKRAVYUH AI Vibe Coding Challenge, problem statement 'Smart ENTC Learning and Innovation Platform'.

## 1. Overview

### 1.1 Summary

SparkPath is a gamified, mobile-friendly web app that teaches beginner to intermediate Electronics and Telecommunication (ENTC) concepts through a guided path where every lesson contains a live experiment. Students read a short idea, play with a simulation, write or fix code, and get help from an AI tutor that can see what they built.

### 1.2 Problem

- ENTC concepts (logic gates, circuits, sensors, microcontrollers, signals, communication) are taught mostly on paper, so students memorise instead of understanding.
- Hardware is costly, easy to damage and not available to everyone at home.
- Existing tools split the experience: coding platforms have gamification but no hardware, and simulators have hardware but no structured learning path or motivation loop.
- Beginners get stuck on errors (a dead LED, a wrong wire, a syntax error) and have nobody to ask.

### 1.3 Core loop

Learn, Build, Break, Fix.

1. Learn: a short explanation (under 90 seconds of reading).
2. Build: a live widget, simulation or code editor where the idea is tried at once.
3. Break: a deliberately faulty circuit or buggy program to diagnose.
4. Fix: the student repairs it and earns XP, which advances the path.

### 1.4 Goals

- G1: A student with no ENTC background lights a virtual LED within 2 minutes of landing on the app.
- G2: Cover two complete tracks (Digital Logic, Arduino Basics) with real simulations, plus a smaller third (Signals).
- G3: AI assistance that is context-aware (knows the lesson, the circuit and the code) and teaches by hinting before answering.
- G4: A landing page and app UI that look premium and original, with smooth, meaningful motion.
- G5: Works well on a mid-range phone, installable as a PWA.

### 1.5 Non-goals (for this version)

- Not a full university course replacement or an exam-prep content library.
- No real hardware integration, no teacher or classroom dashboard, no payments.
- No high-fidelity analog simulation (SPICE-level accuracy). Simple, correct-enough models only.
- No social features beyond a simple leaderboard (stretch).

### 1.6 Target users

- Persona A, Riya, first-year ENTC student. Knows basic programming, has never touched a breadboard. Wants to understand lab concepts before practicals. Uses her phone most of the time.
- Persona B, Arjun, second-year student. Knows the basics, wants to practise Arduino-style programming and debug faster. Wants challenges and projects for his portfolio.
- Secondary: school-level hobbyists curious about electronics.

### 1.7 Success metrics (demo and judging)

- Time to first working LED under 2 minutes.
- A judge can finish one full lesson (learn, build, break, fix) in under 5 minutes without help.
- Lighthouse performance 85+ on the landing page (mobile), 90+ on app pages.
- All core flows work on a 375px wide screen.
- AI tutor answers reference the user's current circuit or code in at least 8 of 10 test prompts.

## 2. Design system

### 2.1 Visual direction

A dark oscilloscope and PCB aesthetic: deep ink backgrounds, thin trace lines, a phosphor-style signal colour, monospace labels and tactile controls. The theme is ENTC, not generic education. Avoid purple-blue gradients, glassmorphism on everything, emoji icons and stock illustrations.

### 2.2 Colour tokens (proposal, finalise in design pass)

| Token | Value | Use |
| --- | --- | --- |
| bg | #0B0F0E | page background |
| surface | #111816 | cards |
| surface-2 | #17201D | raised cards, inputs |
| line | #24302C | borders, traces (inactive) |
| text | #E8EFEA | primary text |
| muted | #8A9A93 | secondary text |
| signal | #7CFFB2 | primary accent, active traces, success, CTA |
| amber | #FFB84D | streak, warnings |
| cyan | #5CC8FF | info, AI tutor |
| fault | #FF5C6C | errors, Debug Dojo faults |

Rules: signal green is reserved for 'active' and 'correct' states, so it keeps meaning. Check contrast (WCAG AA) for text on every surface.

### 2.3 Typography (proposal)

- Display: a characterful grotesque such as Bricolage Grotesque (or similar), used for headings only.
- Body: DM Sans or similar clean sans.
- Mono: JetBrains Mono for labels, values, code, component names.
- Scale: 12, 14, 16, 20, 28, 40, 64 px, with fluid sizing for hero text on mobile.

### 2.4 Shape, spacing and components

- 8px spacing grid. Radius: 12px cards, 8px inputs, 999px pills.
- Buttons: tactile, with a 3px offset 'pressed' depth and a quick press animation. Primary uses signal green with dark text.
- Cards: 1px line border, subtle inner highlight, no heavy shadows.
- Icons: a single consistent outline icon set (for example Lucide) plus custom ENTC component icons (resistor, LED, gate, antenna, chip) drawn as simple SVG.

### 2.5 Motion principles

1. Motion carries meaning: signals travel along wires, gates light when true, XP bars fill, traces power up.
2. Fast in the app (150 to 250 ms, easing out), more cinematic on the landing page (400 to 900 ms).
3. One hero motion moment per screen, not many small ones competing.
4. Respect prefers-reduced-motion: replace scroll-driven and looping animation with static or simple fades.
5. Never block input on an animation.

### 2.6 Mascot and brand

No cartoon mascot copied from other platforms. A small abstract character, 'Spark' (a glowing dot with a trace tail), appears in the AI tutor, empty states and celebrations. It is optional for v1.

## 3. Technical approach

| Area | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js (App Router), TypeScript | Route groups for marketing and app |
| Styling | Tailwind CSS plus CSS variables for tokens | Shared tokens for both parts |
| UI base | shadcn/ui primitives | Restyle heavily, do not ship defaults |
| Landing motion | GSAP + ScrollTrigger, Lenis smooth scroll | Landing route group only |
| App motion | Framer Motion | Transitions, XP, streak, micro-interactions |
| Library effects | A few pieces from Skiper UI, Magic UI or Aceternity UI | Max 2 or 3, restyled |
| Code editor | Monaco | Lazy loaded in the lab and challenges |
| Arduino simulation | avr8js plus wokwi-elements (open source) | Runs real compiled AVR code, see 3.2 |
| Logic simulator | Custom engine plus React Flow or canvas | Pure functions, unit tested |
| Signal playground | HTML Canvas plus Web Audio API | Sliders for frequency, amplitude, noise |
| AI tutor | LLM API through a Next.js route handler | Key stays server side, rate limited |
| State | Zustand for UI and progress | Persist to localStorage first |
| Data | localStorage for demo, Supabase optional | Same data shapes either way |
| PWA | Web manifest plus service worker (for example Serwist) | Offline for lessons already opened |
| Hosting | Vercel | Preview URLs for the demo |

### 3.1 Repo structure

```
app/
  (marketing)/page.tsx        landing
  (auth)/login, signup, onboarding
  (app)/learn, lesson/[id], lab, challenges, quiz, dojo, missions, profile, settings
  api/tutor/route.ts          AI tutor endpoint
components/ (ui, marketing, app, sim)
lib/ (sim engines, xp, content loaders)
content/ (lessons as MDX or JSON)
```

### 3.2 Arduino simulation: needs a decision

Running Arduino code in the browser requires compiling C++ to AVR machine code. Options: (a) a hosted compile service (adds a server dependency), (b) pre-compiled hex files for fixed challenges (simple, but students cannot change the code freely), (c) a simplified interpreter for a small Arduino-style subset (pinMode, digitalWrite, delay, analogRead, if/else, loops). Recommendation for the hackathon: start with (c) for guided lessons so that it always works offline, and treat full avr8js compilation as a stretch. This is an open question, see section 18.

## 4. Sitemap and routes

| Route | Page | Access |
| --- | --- | --- |
| / | Landing page | Public |
| /login, /signup | Auth | Public |
| /onboarding | Welcome survey | After signup |
| /learn | Journey (home) | Signed in |
| /lesson/\[id\] | Lesson player | Signed in |
| /lab | Virtual Lab hub (Logic Builder, Arduino Sim, Signal Playground) | Signed in |
| /challenges | Coding and circuit challenges | Signed in |
| /quiz | Quiz Arena | Signed in |
| /dojo | Debug Dojo | Signed in |
| /missions | Real-world missions | Signed in |
| /profile | Progress, badges, streak | Signed in |
| /settings | Preferences | Signed in |
| /404 | Friendly not-found page | Public |

For the demo, a 'Continue as guest' option skips signup and keeps progress locally.

## 5. Landing page

### 5.1 Goals

- Within 5 seconds a visitor understands: learn ENTC by touching it, not reading it.
- Convert to 'Start learning' (guest or signup) with one clear primary action.
- Be memorable: one signature scroll experience and one live interactive element above the fold.

### 5.2 Global behaviour

- Smooth scrolling through Lenis, with ScrollTrigger synced to it.
- Persistent background: a fixed canvas that plays the image sequence from the old R1-3D project, scrubbed by scroll progress, drawn at low opacity (see 5.4). Foreground sections sit above it.
- Sticky navigation that hides on scroll down and returns on scroll up.
- Custom cursor is optional and desktop only. No cursor effects on touch.
- Page load: a short preloader (about 1 second) draws a signal trace while the first frames of the sequence load.

### 5.3 Sections

**S1. Navigation.** Logo, links (Features, Path, Lab, FAQ), primary button 'Start free'. On mobile, a full-screen menu with a staggered reveal. Acceptance: reachable by keyboard, closes on route change.

**S2. Hero.**

- Headline (draft): 'Touch the circuit. Break it. Fix it.' Subhead: 'Learn electronics and telecom with live simulations, code challenges and an AI tutor that sees what you build.'
- Buttons: 'Start in 2 minutes' (primary, goes to guest first lesson) and 'Try the lab' (secondary).
- Interactive centrepiece: a small live circuit (battery, switch, resistor, LED). Clicking the switch lights the LED, animates current along the trace and shows the voltage reading change. This proves the product in the first screen.
- Background: sequence frame 0 at about 35% opacity with a dark vignette. Headline words reveal on load.
- Mobile: the circuit sits under the text, and the tap target for the switch is at least 48px.

**S3. The problem.** Heading: 'ENTC is taught on paper. You should be able to touch it.' Three cards with animated counters (for example the number of lab hours missed, cost of kits, time stuck on one bug). Use placeholder numbers until real, sourced data is available, and label placeholders clearly in code so they do not reach production. Background opacity lowers to about 15% for readability.

**S4. Pinned scroll story (signature section).** One pinned panel, four steps that change as the user scrolls:

1. Theory: a diagram of an LED circuit with a short explanation.
2. Simulate: the diagram becomes a live circuit with a slider for resistance and a brightness readout.
3. Code: an Arduino snippet appears and the LED blinks in sync with it.
4. Understand: the AI tutor chip appears with a hint about what happens if resistance is too low. The background sequence advances with this section. Mobile: same story but unpinned, with each step stacked and animated as it enters view.

**S5. Feature showcase (bento grid).** Six tiles: Virtual Lab, AI Tutor, Debug Dojo, Real-world Missions, Signal Playground, Progress and Streaks. Each tile shows a small looping preview and expands a short description on hover or tap. Tiles are links to the matching app route (which redirects to guest start).

**S6. Learning path preview.** A vertical PCB trace with five track nodes (Digital Logic, Circuits, Arduino, Signals, IoT). As the user scrolls, the trace powers up node by node and each node shows a one-line promise. Tracks not in v1 show a 'Coming soon' tag.

**S7. AI tutor demo.** A scripted chat that types itself when scrolled into view. It shows a student asking why an LED is not lighting, the tutor noticing that the LED is wired backwards, and a three-step hint ladder (nudge, hint, answer). A 'Replay' button resets it.

**S8. Gamification preview.** An interactive widget: the visitor presses 'Complete lesson' and sees XP fill, the streak LED power on, and a badge unlock. Copy emphasises mastery (skill map), not just points.

**S9. What you will learn.** A two-row marquee of topic chips (Logic gates, Ohm's law, Sensors, PWM, Serial communication, Sampling, Modulation, Noise, IoT, and so on). Include a note that topics follow typical first and second year ENTC courses, without claiming any specific university syllabus.

**S10. FAQ.** Accordion with 5 or 6 questions: Do I need hardware? (No.) Do I need to know ENTC already? (No.) Is it free? Does it work on my phone? What is the AI tutor allowed to do? Is my progress saved?

**S11. Final call to action and footer.** Large headline, one button, small links (GitHub, team, contact). Background sequence reaches its last frame.

### 5.4 Background scroll sequence (integration spec)

- Source: the images folder from the cloned R1-3D\_web repo (to be wired in later; frame count, format and size are not yet confirmed).
- Implementation: a single fixed full-screen canvas, drawing the frame that matches smoothed scroll progress (0 to 1) across the page. Draw with requestAnimationFrame only when the frame index changes.
- Opacity and treatment: base 12 to 35% depending on section, a dark gradient overlay for text legibility, and a tint or blend to match the signal colour.
- Loading: load the first 10 frames immediately, then the rest in the background in batches. Show the static first frame as a poster until ready.
- Budget: under 5 MB on mobile and under 15 MB on desktop for the total sequence. If larger, reduce frame count and resolution, convert to WebP, and serve fewer frames to small screens.
- Fallbacks: if reduced motion is on or the device is low-powered, show a single static frame. If the sequence fails to load, the page must still look finished (solid background plus subtle grid).
- Scope: landing page only. It is never loaded inside the app route group.

### 5.5 Landing acceptance criteria

- Hero interactive circuit works with mouse, touch and keyboard.
- No layout shift when fonts or canvas load.
- Scroll story works at 375px and 1440px widths.
- Lighthouse mobile performance 85 or higher, accessibility 95 or higher.
- All text readable over the background at every scroll position.

## 6. Authentication and onboarding

### 6.1 Entry options

- Continue as guest (default for judges): progress saved locally, with a gentle prompt to create an account later.
- Email sign up and Google sign in (if Supabase is used).

### 6.2 Onboarding survey (3 short screens, skippable)

1. Your level: 'New to electronics', 'I know some basics', 'I code but never did hardware'.
2. Your goal: pass practicals, build projects, prepare for placements, curiosity.
3. Daily time: 5, 10 or 20 minutes (sets the daily XP goal). Result: the user is placed at a suitable starting point on the path (new users start with Track 1, Lesson 1, and the Logic and Arduino tracks are recommended based on goal). Screens slide with Framer Motion. Ends by launching the first lesson directly, not a dashboard, to hit the 2-minute LED goal.

## 7. App shell and navigation

- Desktop: a slim left icon rail (Learn, Lab, Practice, Missions, Profile), a top stats bar (streak LED, XP, level) and an optional right panel (level progress, daily goal, today's mission, a concept-of-the-day card).
- Mobile: a bottom tab bar (Learn, Lab, Practice, Missions, Profile) and a compact stats header. No horizontal scrolling anywhere.
- Practice groups Challenges, Quiz Arena and Debug Dojo behind one tab with a segmented switch.
- Command palette (Ctrl+K on desktop, search icon on mobile): search concepts, lessons and cheat sheet entries, for example 'pull-up resistor'.
- Cheat sheet drawer: concept cards the student has unlocked, available from any lesson.
- Spark (AI tutor) button: a floating button on every app screen that opens the tutor as a side panel (desktop) or bottom sheet (mobile) with the current context attached.
- Page transitions: 200 ms fade and slide, with shared layout animation between the path node and the lesson screen.

## 8. Learn (Journey) page, route /learn

### 8.1 Purpose

Answer one question instantly: what should I do next? This is the home screen after onboarding.

### 8.2 Layout and content

- Header card: track name, chapter, 'Step 2 of 6', and a segmented progress bar for the current chapter.
- Path: a winding vertical PCB trace. Nodes are components, not generic circles. Node types: Lesson (chip), Practice (resistor), Debug (warning triangle), Checkpoint (flag), Mission (antenna).
- Node states: locked (dim), available (outlined), current (glowing, with a 'Continue' bubble), complete (filled, signal green). The trace between nodes fills with a light pulse when the previous node is completed.
- Tapping a node opens a bottom sheet or popover: title, one-line summary, estimated time, XP reward, and a Start button. Locked nodes show what unlocks them.
- Track switcher at the top (Digital Logic, Arduino Basics, Signals, plus 'Coming soon' tracks).
- Right panel (desktop) or collapsible strip (mobile): level and XP, daily goal ring, today's mission, concept card.

### 8.3 Behaviour

- Auto-scroll to the current node on load, with smooth easing.
- Completing a lesson plays a short sequence: the node fills, a pulse runs down the trace and the next node unlocks, then the view scrolls to it.
- A learner can skip ahead through a 'Test out' option on a chapter, which runs a short quiz and unlocks the chapter when passed.

### 8.4 Acceptance

- The current node is visible without scrolling after load.
- A first-time user can reach their first lesson in one tap.
- Path renders smoothly (60 fps scroll on a mid-range phone).

## 9. Lesson player, route /lesson/\[id\]

### 9.1 Lesson template

Every lesson follows the same five beats, so students learn the rhythm: (1) Hook, one sentence on why this matters; (2) Idea, a short explanation with a visual; (3) Try it, a live widget or editor; (4) Check, 1 to 3 quick questions; (5) Break and fix, a faulty circuit or buggy code. Then a recap card that is saved to the cheat sheet.

### 9.2 Step types

| Type | Description |
| --- | --- |
| Read card | Short text, one diagram, maximum about 90 words |
| Live widget | Embedded interactive (switch and LED, gate, slider) with a goal such as 'make the LED turn on' |
| Multiple choice | Instant feedback with an explanation |
| Code | Editor with starter code and a goal checked by the simulator |
| Circuit build | Logic Builder with a target behaviour |
| Debug | A faulty circuit or code to repair |
| Recap | Summary and concept card |

### 9.3 Layout

- Desktop: left column for text and questions, right column for the live widget or editor. The Spark panel slides over the left column when opened.
- Mobile: three tabs, Learn, Build and Ask. The tab for the active step is highlighted, and finishing a text step auto-switches to Build when a task is waiting.
- Top bar: close button, segmented progress bar, hearts are not used. Bottom bar: Hint, Check and Continue buttons.

### 9.4 Feedback rules

- Correct: green flash, short explanation, +XP tick.
- Wrong: fault red outline, gentle message, and a hint option. No punishment such as losing lives.
- Stuck for 45 seconds with no action: Spark offers a nudge (never auto-opens fully).
- Completion screen: XP gained, accuracy, streak status, new concept cards, and a button to the next lesson.

### 9.5 Acceptance

- Progress is saved after every step, so a refresh resumes at the same step.
- Every lesson has at least one live interaction and one break-and-fix step.

## 10. Virtual Lab, route /lab

The lab hub shows tool cards and recent projects. Each tool is also embedded inside lessons with a restricted toolset.

### 10.1 Logic Builder

- Palette: input switch, constant 0 and 1, LED output, AND, OR, NOT, NAND, NOR, XOR, and (stretch) flip-flops with a clock.
- Interaction: place by drag (desktop) or tap-to-place (mobile), connect by tapping an output pin then an input pin, delete by long-press or the trash button, undo and redo.
- Simulation: evaluates the graph in real time using a topological order, with loop detection that shows a clear message instead of freezing.
- Visuals: wires glow signal green when carrying 1 and stay dim for 0, with a short travelling pulse when a value changes.
- Truth table panel: auto-generates a truth table for the current inputs and outputs, and highlights the active row.
- Challenge mode: the target truth table is given and the builder checks the student's circuit against all rows.
- Save and load circuits locally. Circuits serialise as JSON (see section 17).

### 10.2 Arduino Simulator

- Layout: code editor (Monaco) on one side and a virtual board on the other, with components such as LED, push button, potentiometer, buzzer, light sensor and temperature sensor. Mobile uses tabs.
- Controls: Run, Stop, Reset, speed (0.5x, 1x, 2x), and a serial monitor panel.
- Supported code (v1 subset): setup and loop, pinMode, digitalWrite, digitalRead, analogRead, analogWrite (PWM), delay, Serial.begin and Serial.println, variables, if and else, for and while loops.
- Friendly errors: syntax and runtime errors are shown in plain language with a line highlight and an 'Explain this' button that sends the error to Spark.
- Starter templates: Blink, Button LED, Potentiometer dimmer, Light-controlled lamp.
- The execution approach is an open decision (see 3.2 and section 18).

### 10.3 Signal Playground

- Generates sine, square and triangle waves with sliders for frequency and amplitude.
- Adds noise with a slider, and offers a simple low-pass filter toggle to show noise being reduced.
- Shows the time-domain waveform and a spectrum (FFT) side by side.
- 'Hear it' button plays the signal through Web Audio at a safe volume, with a volume cap and a warning before first playback.
- AM mode: a carrier plus message signal shows modulation visually.

### 10.4 Acceptance

- Logic Builder handles at least 30 gates without lag on a mid-range phone.
- Every tool has an 'Explain what I'm seeing' action that sends the state to Spark.
- Tools work with touch, mouse and keyboard.

## 11. Challenges, route /challenges

- List view: cards with title, type (Logic, Code, Circuit), difficulty (Easy, Medium, Hard), XP, and status. Filters by type and difficulty, plus search.
- Challenge screen: problem statement, constraints, the editor or builder, a test panel that shows results per test case, and a Run and a Submit button.
- Hints: three levels (nudge, approach, partial solution). The full solution unlocks after 3 failed submits or when the student gives up, and then gives reduced XP.
- XP: Easy 15, Medium 30, Hard 50. First-try without hints earns a bonus of 10.
- Example challenges (v1): 'Build an XOR from NAND gates', 'Alarm if door is open AND it is night', 'Blink an LED three times then stop', 'Make an LED fade in with PWM', 'Print temperature in Celsius from a sensor value'.

## 12. Practice modes

### 12.1 Quiz Arena, route /quiz

- Timed Quiz: 10 questions, 60 seconds, with combo multiplier for consecutive correct answers.
- Component ID: show a symbol or photo, pick the name (resistor, capacitor, diode, LED, transistor, and so on).
- Logic Duel: predict the output of a small circuit before running it, then the sim confirms.
- Circuit Puzzle: a circuit with one missing component or wire, choose or place the right one.
- Results screen: score, accuracy by topic, mistakes to review, and a 'Practise weak topics' button that builds a mini quiz from those topics.

### 12.2 Debug Dojo, route /dojo

- A library of broken circuits and programs, grouped by fault type: wrong wiring, missing resistor, floating input, inverted logic, off-by-one in code, wrong pin number.
- Tools: a virtual probe (tap any node to see its voltage or logic level), a 'swap component' action, and a code diff-free editor.
- Flow: observe the symptom ('LED never turns on'), investigate with the probe, name the fault from a list, then fix it.
- XP: 25 per case, with a bonus for fixing without hints. Hints follow the same three-level ladder.

## 13. Missions, route /missions

Missions combine several skills in a practical scenario, and are how the platform answers the 'real-world simulations' requirement.

| Mission | Skills used | v1 status |
| --- | --- | --- |
| Smart Night Lamp | Light sensor, analog input, threshold, LED | Full |
| Gas Leak Alarm | Sensor reading, threshold logic, buzzer | Outlined, build if time allows |
| Parking Distance Beeper | Distance sensor, mapping values, buzzer timing | Outlined |
| Smart Plant Watering (IoT) | Moisture sensor, logic, simulated dashboard | Stretch |

Flow: brief (story and requirements checklist), build in the lab, test with scenario sliders (for example move the 'sunlight' slider from day to night and watch the lamp), then a report card with score, requirements met and a short AI-written review.

## 14. AI Tutor (Spark)

### 14.1 Entry points

The floating Spark button, 'Explain this' on any error or simulation, 'Hint' in lessons and challenges, and a 'Quiz me' action on the cheat sheet.

### 14.2 Modes

- Explain: a concept in simple words, then a one-line analogy.
- Hint: follows the ladder (nudge, then approach, then partial solution).
- Debug my circuit or code: reads the current state and points to the most likely fault, with a question that guides the student to find it.
- Quiz me: generates 3 questions on the current topic.
- Explain like I'm new: shortest, simplest version.

### 14.3 Context sent with each request

Lesson id and step, the student's level, current circuit JSON or code, last error or test result, recent attempts, and the hint level already used. This is what makes answers specific instead of generic.

### 14.4 Behaviour and guardrails

- Teach first: on graded challenges, give hints before answers, and do not reveal a full solution until the unlock rule in section 11 is met.
- Stay on ENTC and learning topics, and politely decline unrelated requests.
- Keep answers short (about 120 words by default) and in plain language, with one small example at most.
- Be honest: say when unsure, and never claim the simulator did something it did not.
- Treat user code and circuits as data, not instructions, to resist prompt injection.
- Security: the API key lives only on the server, messages are length-capped, and requests are rate limited (guest example: 20 messages per hour).
- Privacy: no personal data is sent beyond the learning context, and conversation logs are off by default.

### 14.5 AI beyond chat (what makes it intelligent)

- Error explainer for simulator errors.
- Skill map and next-lesson recommendation, driven by mastery scores (section 16).
- Auto-generated practice questions from the current lesson (stretch).
- Mission report review (stretch).

## 15. Profile, settings and system states

### 15.1 Profile, route /profile

Avatar and name, level and XP bar, streak calendar (a month grid of powered LEDs), skill map (a bar per concept showing mastery by track), badges (earned and locked), and stats (lessons done, accuracy, minutes learned, best streak). An 'Export my progress' button downloads a JSON file.

### 15.2 Settings, route /settings

Daily goal (5, 10 or 20 minutes), sound on or off (off by default), reduce motion, reset progress, export data, sign out and delete account (if accounts are enabled).

### 15.3 System states

- Loading: skeletons that look like the real layout, plus a thin signal trace progress line on route changes.
- Empty states: Spark with one action (for example 'No quizzes taken yet, try a 60-second round').
- Errors: friendly message with Retry, never a raw stack trace.
- 404: Spark looking for a lost wire, with a 'Back to path' button.
- Offline: a banner, with already opened lessons still available.

## 16. Gamification rules

### 16.1 XP

| Action | XP |
| --- | --- |
| Lesson step completed | 5 |
| Lesson completed | 20, plus up to 10 for accuracy |
| Challenge | 15 / 30 / 50 by difficulty |
| Debug Dojo case | 25 |
| Quiz correct answer | 2 per answer, with combo bonus |
| Mission | 80 |

### 16.2 Levels and streaks

- Levels: each level needs about 15 percent more XP than the previous one, starting at 100. Level names follow signal terms (for example Spark, Pulse, Wave, Beam, Spectrum), to be finalised.
- Streak: a day counts when the student hits their daily goal or completes one lesson. The streak shows as an LED that dims in the evening if today's goal is not done. One free 'streak freeze' is granted every 7 days.
- Daily goal ring: fills as XP is earned toward the chosen goal.

### 16.3 Badges (v1 set)

First Light (first LED), Gate Keeper (finish the logic track), Bug Hunter (10 Dojo cases), No Hints Needed (5 clean solves), Night Owl and Early Bird (time-based), Week Streak, Signal Sage (finish the signals track).

### 16.4 Mastery

Each concept has a mastery score from 0 to 100, updated from quiz answers, challenge results and Dojo outcomes (a simple weighted moving average). The score drives the skill map and 'recommended next' on the Learn page.

### 16.5 Principles

No lives or hearts, no pay-to-win, celebrations under 1.5 seconds and skippable, sound off by default. Rewards should reflect understanding, so retrying a lesson for XP gives diminishing returns.

## 17. Curriculum v1 and data model

### 17.1 Tracks

**Track 1, Digital Logic (6 lessons):** bits and binary; AND, OR, NOT; NAND, NOR, XOR; truth tables and Boolean expressions; combining gates (half adder); memory with a simple latch (stretch).

**Track 2, Arduino Basics (6 lessons):** what a microcontroller is; blink an LED; resistors, current and Ohm's law; buttons and digital input; analog input and sensors; PWM and the serial monitor.

**Track 3, Signals (3 lessons, stretch):** what a signal is (frequency and amplitude); noise and filtering; modulation (AM).

**Tracks 4 and 5 (Communication Systems, IoT):** shown as 'Coming soon' on the path.

Content accuracy: every lesson must be reviewed by someone with ENTC knowledge (a senior student or faculty member) before the demo.

### 17.2 Data model (shape, storage can be localStorage or Supabase)

```
User { id, name, level, xp, streak { count, lastActiveDate, freezes }, dailyGoalMin, settings }
Progress { userId, lessonId, status, stepIndex, accuracy, completedAt }
Skill { userId, conceptId, mastery }
Activity { userId, date, xpEarned, minutes }
Badge { id, userId, earnedAt }
Lesson { id, trackId, title, xp, steps[ { type, content, task, checks } ] }
Circuit { nodes[ { id, type, x, y, props } ], wires[ { from, to } ] }
```

## 18. Open questions and risks

### 18.1 Open questions

1. Arduino execution: guided interpreter subset, hosted compile service, or avr8js with precompiled programs?
2. Final product name and visual identity.
3. AI provider, model and budget for the demo, and whether guests get AI access.
4. Accounts: guest only, or Supabase sign up?
5. Background sequence: what the frames show, frame count and total size (to be checked once the repo path is added).
6. Team size, deadline and who owns landing page, app core, simulators and content.
7. Who reviews lesson accuracy?

### 18.2 Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Scope too large for the time | Incomplete demo | Build in the phases in section 20, cut stretch items first |
| Simulator performance on phones | Laggy or crashing | Test early on a real mid-range phone, cap component counts |
| Wrong ENTC content | Loss of credibility | Subject review, keep v1 content to well-known basics |
| Heavy background sequence | Slow landing page | Budgets and fallbacks in 5.4 |
| Lenis, GSAP and Framer conflicts | Janky scrolling | Wire Lenis and ScrollTrigger once, keep GSAP out of the app routes |
| AI gives wrong or overlong answers | Confusion | Context-rich prompts, short-answer rule, hint ladder, test prompt set |
| AI cost or abuse | Budget burn | Server-side key, rate limits, length caps |

## 19. Non-functional requirements

- Performance: landing LCP under 2.5 s on 4G mobile, app route transitions under 300 ms, Monaco and simulators lazy loaded.
- Accessibility: WCAG AA contrast, full keyboard use in the builder and lessons, ARIA labels on simulation controls, state never conveyed by colour alone (use icons and labels too), reduced-motion support.
- Responsive: designed for 375, 768 and 1280 px and above, touch targets at least 44 px.
- Browsers: latest Chrome, Edge, Safari and Firefox.
- PWA: installable, offline for opened lessons, app icon and splash screen.
- Security and privacy: no secrets in client code, input validation on the tutor endpoint, minimal data stored, clear delete and export options.

## 20. Build phases and demo plan

| Phase | Scope | Priority |
| --- | --- | --- |
| 0. Foundation | Next.js project, design tokens, app shell, routing, content loader, state store | Must |
| 1. Core loop | Journey map, lesson player, Logic Builder, Track 1 lessons 1 to 3, XP, streak, progress saving | Must |
| 2. Intelligence | Spark tutor with context, Arduino simulator (guided subset), Track 2 lessons, quizzes | Must |
| 3. Landing page | Hero with live circuit, scroll story, background sequence, feature grid, FAQ, final call to action | Must |
| 4. Depth | Debug Dojo, one mission, Signal Playground, badges, skill map | Should |
| 5. Polish | PWA, accessibility pass, performance pass, empty and error states, demo data | Should |
| 6. Stretch | Leaderboard, more missions, auto-generated quizzes, extra tracks | Could |

### 20.1 Three-minute demo script

1. Land on the page, toggle the hero switch to light the LED (15 s).
2. Scroll the pinned story to show theory, simulation, code and AI (30 s).
3. Click 'Start in 2 minutes' as a guest, finish the first lesson and watch XP and the streak update (60 s).
4. Ask Spark about a broken circuit in the Debug Dojo and show the hint ladder (45 s).
5. Show the Journey map, profile skill map and the mobile install (30 s).
