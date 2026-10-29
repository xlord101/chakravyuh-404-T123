export interface LessonStep {
  type: 'read' | 'widget' | 'choice' | 'code' | 'circuit' | 'debug' | 'recap';
  title: string;
  content?: string;
  hook?: string;
  task?: string;
  options?: { text: string; correct: boolean; explanation: string }[];
  initialCircuitState?: any;
  targetState?: any;
  conceptSummary?: string;
}

export interface Lesson {
  id: string;
  trackId: 'logic' | 'arduino' | 'signals';
  chapter: string;
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  summary: string;
  steps: LessonStep[];
}

export interface Track {
  id: 'logic' | 'arduino' | 'signals' | 'comms' | 'iot';
  title: string;
  badge: string;
  description: string;
  status: 'available' | 'coming_soon';
  lessons: Lesson[];
}

export interface DojoCase {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  symptom: string;
  faultCategory: 'wiring' | 'resistor' | 'floating' | 'logic' | 'code';
  description: string;
  clues: string[];
  options: { label: string; isCorrect: boolean; feedback: string }[];
  xpReward: number;
  solutionHint: string;
}

export interface Mission {
  id: string;
  title: string;
  scenario: string;
  components: string[];
  requirements: string[];
  status: 'Full' | 'Outlined';
  xpReward: number;
}

export const CURRICULUM_TRACKS: Track[] = [
  {
    id: 'logic',
    title: 'Track 1: Digital Logic',
    badge: 'CORE FOUNDATION',
    description: 'Master binary, logic gates, truth tables, and combinatorial circuits from first principles.',
    status: 'available',
    lessons: [
      {
        id: 'logic-1',
        trackId: 'logic',
        chapter: 'Chapter 1: The Binary Switch',
        title: 'Bits, Voltage & The Virtual LED',
        estimatedMinutes: 3,
        xpReward: 30,
        summary: 'Understand HIGH (5V) vs LOW (0V) and light your very first virtual circuit.',
        steps: [
          {
            type: 'read',
            title: '1. Why Electronics Needs Binary',
            hook: 'Every phone, satellite, and supercomputer runs on one simple trick: voltage high or low.',
            content: 'In digital electronics, information is represented using two electrical states: HIGH (typically 5 Volts, representing binary 1) and LOW (0 Volts or Ground, representing binary 0). When a switch is closed, current flows from the voltage rail through the resistor into the LED, causing it to emit light.'
          },
          {
            type: 'widget',
            title: '2. Try It: Light the LED',
            task: 'Toggle the physical switch to close the circuit and send 5 Volts (HIGH) to the LED.',
            targetState: { switchClosed: true }
          },
          {
            type: 'choice',
            title: '3. Quick Check',
            task: 'What binary digit corresponds to 5 Volts (HIGH) in standard digital logic?',
            options: [
              { text: 'Binary 0', correct: false, explanation: '0 Volts (Ground) corresponds to binary 0.' },
              { text: 'Binary 1', correct: true, explanation: 'Correct! 5V represents logic HIGH or binary 1.' },
              { text: 'Binary 2', correct: false, explanation: 'Binary systems only have digits 0 and 1.' }
            ]
          },
          {
            type: 'debug',
            title: '4. Break & Fix: The Disconnected Wire',
            task: 'The switch is ON but current cannot reach the LED because of an open break. Click the terminal to connect the wire.',
            content: 'In physical breadboards, loose jumper wires are the #1 reason circuits fail to power up.'
          },
          {
            type: 'recap',
            title: '5. Mastery Recap',
            conceptSummary: 'Binary 1 = HIGH (5V). Binary 0 = LOW (0V). An electrical circuit requires a complete closed loop from VCC to GND for current to flow.'
          }
        ]
      },
      {
        id: 'logic-2',
        trackId: 'logic',
        chapter: 'Chapter 1: Logic Gates',
        title: 'AND, OR & NOT Gates',
        estimatedMinutes: 4,
        xpReward: 35,
        summary: 'Learn how silicon chips make decisions using fundamental logic gates.',
        steps: [
          {
            type: 'read',
            title: '1. Logic as Silicon Decisions',
            hook: 'Computers do not "think"; they funnel electrons through logic gates that follow strict mathematical rules.',
            content: 'An AND gate only outputs 1 when BOTH Input A AND Input B are 1. An OR gate outputs 1 if AT LEAST ONE input is 1. A NOT gate inverts its single input (1 becomes 0, 0 becomes 1).'
          },
          {
            type: 'widget',
            title: '2. Build an AND Gate',
            task: 'Turn both Input A and Input B to 1 to illuminate the output signal LED.',
            targetState: { a: 1, b: 1 }
          },
          {
            type: 'choice',
            title: '3. Truth Table Challenge',
            task: 'If Input A is 1 and Input B is 0, what is the output of an OR gate?',
            options: [
              { text: '0 (LOW)', correct: false, explanation: 'An OR gate only outputs 0 when ALL inputs are 0.' },
              { text: '1 (HIGH)', correct: true, explanation: 'Correct! Because at least one input is 1, the OR gate outputs 1.' }
            ]
          },
          {
            type: 'debug',
            title: '4. Break & Fix: Inverted Security Alarm',
            task: 'An alarm is supposed to sound when the door is OPEN (1) AND the motion sensor detects motion (1). Currently an OR gate was installed by mistake. Swap it for an AND gate.',
            content: 'Using an OR gate caused the alarm to trigger even when nobody opened the door!'
          },
          {
            type: 'recap',
            title: '5. Mastery Recap',
            conceptSummary: 'AND: Output 1 only if all inputs are 1. OR: Output 1 if any input is 1. NOT: Inverts state.'
          }
        ]
      },
      {
        id: 'logic-3',
        trackId: 'logic',
        chapter: 'Chapter 2: Universal Gates',
        title: 'NAND, NOR & XOR Secrets',
        estimatedMinutes: 5,
        xpReward: 40,
        summary: 'Explore why NAND is called the universal gate capable of building any computer circuit.',
        steps: [
          {
            type: 'read',
            title: '1. The Universal Gate',
            hook: 'Apollo 11’s guidance computer was built entirely from 5,600 identical 3-input NOR chips.',
            content: 'A NAND gate is an AND gate followed by a NOT gate. It outputs 0 only when both inputs are 1. Any Boolean function (AND, OR, NOT, XOR) can be constructed using only NAND gates.'
          },
          {
            type: 'widget',
            title: '2. XOR (Exclusive OR) Explorer',
            task: 'Toggle the inputs to see when XOR lights up. Notice it outputs 1 when inputs are DIFFERENT.',
            targetState: { a: 1, b: 0 }
          },
          {
            type: 'choice',
            title: '3. Test Your Intuition',
            task: 'What does a NAND gate output when both inputs are 0?',
            options: [
              { text: '1 (HIGH)', correct: true, explanation: 'Correct! AND(0,0)=0, and inverting 0 yields 1.' },
              { text: '0 (LOW)', correct: false, explanation: 'NAND only outputs 0 when both inputs are 1.' }
            ]
          },
          {
            type: 'recap',
            title: '4. Mastery Recap',
            conceptSummary: 'XOR outputs 1 when inputs are unequal (ideal for binary adders). NAND is universal.'
          }
        ]
      },
      {
        id: 'logic-4',
        trackId: 'logic',
        chapter: 'Chapter 2: Boolean Algebra',
        title: 'Truth Tables & Circuit Simplification',
        estimatedMinutes: 5,
        xpReward: 40,
        summary: 'Simplify complex circuits to save silicon area, power, and propagation delay.',
        steps: [
          {
            type: 'read',
            title: '1. Minimizing Gates',
            content: 'In hardware design, fewer gates means lower manufacturing cost and less heat. We use Boolean laws (De Morgan’s theorems) to minimize logic expressions.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'De Morgan: NOT(A AND B) = (NOT A) OR (NOT B).'
          }
        ]
      },
      {
        id: 'logic-5',
        trackId: 'logic',
        chapter: 'Chapter 3: Arithmetic Units',
        title: 'The Half Adder & Silicon Math',
        estimatedMinutes: 6,
        xpReward: 45,
        summary: 'Build the fundamental circuit that allows CPUs to calculate 1 + 1.',
        steps: [
          {
            type: 'read',
            title: '1. How Chips Add Numbers',
            content: 'A Half Adder takes two bits A and B. The Sum bit is computed with an XOR gate (A ⊕ B). The Carry bit is computed with an AND gate (A · B).'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'Half Adder: Sum = A XOR B, Carry = A AND B.'
          }
        ]
      },
      {
        id: 'logic-6',
        trackId: 'logic',
        chapter: 'Chapter 3: Sequential Logic',
        title: 'Memory Latches & Clock Pulses',
        estimatedMinutes: 6,
        xpReward: 50,
        summary: 'Discover how feedback loops allow logic gates to store a 1-bit memory.',
        steps: [
          {
            type: 'read',
            title: '1. Storing State in Silicon',
            content: 'By feeding the output of a NOR gate back into the input of another NOR gate, we create an SR Latch that remembers whether Set or Reset was triggered.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'Feedback creates memory. Sequential circuits depend on current inputs AND past state.'
          }
        ]
      }
    ]
  },
  {
    id: 'arduino',
    title: 'Track 2: Arduino Basics',
    badge: 'EMBEDDED C',
    description: 'Program microcontrollers, control digital GPIO pins, read analog sensors, and master PWM.',
    status: 'available',
    lessons: [
      {
        id: 'ard-1',
        trackId: 'arduino',
        chapter: 'Chapter 1: Silicon Brains',
        title: 'Microcontrollers & The Blink Sketch',
        estimatedMinutes: 4,
        xpReward: 35,
        summary: 'Understand the difference between a CPU and a microcontroller and write your first Blink sketch.',
        steps: [
          {
            type: 'read',
            title: '1. What is a Microcontroller?',
            hook: 'Unlike your laptop CPU, an Arduino microcontroller has RAM, flash memory, timers, and GPIO pins packed inside one chip.',
            content: 'Every Arduino program has two main functions: setup() which runs once at power-up to configure pin modes, and loop() which repeats forever until powered down.'
          },
          {
            type: 'widget',
            title: '2. Run the Virtual Blink',
            task: 'Click RUN to flash the program into the virtual ATmega328P and watch the built-in Pin 13 LED blink.',
            targetState: { running: true }
          },
          {
            type: 'choice',
            title: '3. Code Anatomy Check',
            task: 'Which function runs continuously in an infinite loop on the microcontroller?',
            options: [
              { text: 'setup()', correct: false, explanation: 'setup() only executes once when powered on.' },
              { text: 'loop()', correct: true, explanation: 'Correct! loop() executes repeatedly until power is removed.' }
            ]
          },
          {
            type: 'recap',
            title: '4. Mastery Recap',
            conceptSummary: 'pinMode(pin, OUTPUT) configures the pin driver. digitalWrite(pin, HIGH) sends 5V.'
          }
        ]
      },
      {
        id: 'ard-2',
        trackId: 'arduino',
        chapter: 'Chapter 1: Circuit Physics',
        title: 'Ohm’s Law & The Current-Limiting Resistor',
        estimatedMinutes: 4,
        xpReward: 35,
        summary: 'Learn why connecting an LED directly to 5V will instantly destroy it.',
        steps: [
          {
            type: 'read',
            title: '1. Voltage, Current & Resistance',
            hook: 'V = I · R. Ohm’s Law is the universal equation of electrical engineering.',
            content: 'An LED has almost zero internal resistance when conducting. Without a resistor in series, huge current (>100mA) will surge through, causing thermal breakdown. A 220Ω resistor limits the current to a safe 15–20mA.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'Resistor R = (V_supply - V_led) / I_target. Always use 220Ω–330Ω with standard LEDs on 5V.'
          }
        ]
      },
      {
        id: 'ard-3',
        trackId: 'arduino',
        chapter: 'Chapter 2: Inputs',
        title: 'Pushbuttons & The Floating Pin Trap',
        estimatedMinutes: 5,
        xpReward: 40,
        summary: 'Master digital inputs and discover why pull-up / pull-down resistors are required.',
        steps: [
          {
            type: 'read',
            title: '1. The Floating Input Problem',
            content: 'When an input pin is not connected to anything, electromagnetic noise in the air causes it to randomly fluctuate between 0 and 1. A pull-down resistor securely ties the pin to GND when the button is open.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'digitalRead(pin) returns HIGH or LOW. Use INPUT_PULLUP to enable the internal 20kΩ resistor.'
          }
        ]
      },
      {
        id: 'ard-4',
        trackId: 'arduino',
        chapter: 'Chapter 2: Analog World',
        title: 'Analog Input & Potentiometers',
        estimatedMinutes: 5,
        xpReward: 40,
        summary: 'Convert real-world continuous voltages into digital numbers using the 10-bit ADC.',
        steps: [
          {
            type: 'read',
            title: '1. The Analog-to-Digital Converter (ADC)',
            content: 'Analog voltages range continuously from 0V to 5V. Arduino’s 10-bit ADC divides this range into 1024 discrete steps (0 to 1023). 2.5V reads as ~512.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'analogRead(A0) measures 0–5V as integers 0–1023 with ~4.9mV resolution.'
          }
        ]
      },
      {
        id: 'ard-5',
        trackId: 'arduino',
        chapter: 'Chapter 3: Output Modulation',
        title: 'PWM (Pulse Width Modulation) & Dimming',
        estimatedMinutes: 5,
        xpReward: 45,
        summary: 'Simulate analog voltage output on digital pins using high-speed duty cycles.',
        steps: [
          {
            type: 'read',
            title: '1. Simulating Analog Output',
            content: 'Digital pins can only output 0V or 5V. By switching between 5V and 0V hundreds of times per second, the duty cycle controls the perceived brightness or motor speed.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'analogWrite(pin, 128) outputs a 50% duty cycle (~2.5V effective voltage).'
          }
        ]
      },
      {
        id: 'ard-6',
        trackId: 'arduino',
        chapter: 'Chapter 3: Telemetry',
        title: 'Serial Communication & Sensor Logging',
        estimatedMinutes: 5,
        xpReward: 45,
        summary: 'Transmit sensor readings from the microcontroller to your computer terminal via UART.',
        steps: [
          {
            type: 'read',
            title: '1. The UART Serial Bridge',
            content: 'Serial communication sends data bit-by-bit over TX and RX pins. Serial.begin(9600) sets the baud rate (9600 bits per second).'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'Serial.print() logs telemetry for debugging and AI analysis.'
          }
        ]
      }
    ]
  },
  {
    id: 'signals',
    title: 'Track 3: Signals & Telecom',
    badge: 'WAVES & SPECTRA',
    description: 'Explore frequency, amplitude, noise filtering, and amplitude modulation (AM).',
    status: 'available',
    lessons: [
      {
        id: 'sig-1',
        trackId: 'signals',
        chapter: 'Chapter 1: Continuous Waves',
        title: 'Sine Waves: Frequency & Amplitude',
        estimatedMinutes: 4,
        xpReward: 35,
        summary: 'Visualize and listen to periodic waveforms in both time and frequency domains.',
        steps: [
          {
            type: 'read',
            title: '1. What is a Signal?',
            content: 'A signal is voltage varying over time. Amplitude represents power or loudness, while frequency (measured in Hertz) represents cycles per second.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'Time domain shows waveform shape; Frequency domain (FFT) shows spectral peaks.'
          }
        ]
      },
      {
        id: 'sig-2',
        trackId: 'signals',
        chapter: 'Chapter 1: Signal Integrity',
        title: 'Noise & Low-Pass Filtering',
        estimatedMinutes: 5,
        xpReward: 40,
        summary: 'Clean corrupted sensor signals using RC low-pass filters.',
        steps: [
          {
            type: 'read',
            title: '1. Filtering Out the Hiss',
            content: 'High-frequency noise corrupts sensitive signals. A low-pass filter lets low frequencies pass while attenuating high-frequency spikes.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'RC Cutoff frequency f_c = 1 / (2π · R · C).'
          }
        ]
      },
      {
        id: 'sig-3',
        trackId: 'signals',
        chapter: 'Chapter 2: Telecommunications',
        title: 'Amplitude Modulation (AM)',
        estimatedMinutes: 6,
        xpReward: 50,
        summary: 'Encode an audio message onto a high-frequency radio carrier wave for long-distance broadcast.',
        steps: [
          {
            type: 'read',
            title: '1. Why Modulate?',
            content: 'Audio signals cannot travel through the air efficiently. By varying the amplitude of a high-frequency radio carrier wave proportionally to the audio signal, we can transmit over kilometers.'
          },
          {
            type: 'recap',
            title: '2. Mastery Recap',
            conceptSummary: 'AM signal s(t) = [A + m(t)] · cos(2π f_c t).'
          }
        ]
      }
    ]
  },
  {
    id: 'comms',
    title: 'Track 4: Communication Systems',
    badge: 'COMING SOON',
    description: 'Digital modulation (FSK, PSK), antennas, and wireless protocols.',
    status: 'coming_soon',
    lessons: []
  },
  {
    id: 'iot',
    title: 'Track 5: IoT & Embedded Edge AI',
    badge: 'COMING SOON',
    description: 'MQTT, ESP32 Wi-Fi telemetry, and TinyML on microcontrollers.',
    status: 'coming_soon',
    lessons: []
  }
];

export const DOJO_CASES: DojoCase[] = [
  {
    id: 'dojo-1',
    title: 'The Dead LED Mystery',
    difficulty: 'Easy',
    symptom: 'Switch is CLOSED, power supply is at 5V, but LED emits zero light.',
    faultCategory: 'wiring',
    description: 'A student set up an LED circuit on a breadboard. The power rail is live, but the LED refuses to turn on.',
    clues: [
      'Virtual probe at anode reads 5.0V.',
      'Virtual probe at cathode reads 5.0V as well! There is no ground return.'
    ],
    options: [
      { label: 'The LED is burned out', isCorrect: false, feedback: 'The LED is rated for 20mA and is brand new.' },
      { label: 'The cathode is disconnected from Ground (GND)', isCorrect: true, feedback: 'Spot on! The circuit had no complete return path to 0V ground.' },
      { label: 'The resistor value is too small', isCorrect: false, feedback: 'A smaller resistor would make the LED brighter, not dead.' }
    ],
    xpReward: 25,
    solutionHint: 'Check if the negative leg (cathode) of the LED has a wire returning to GND.'
  },
  {
    id: 'dojo-2',
    title: 'The Ghost Button (Floating Pin)',
    difficulty: 'Medium',
    symptom: 'Arduino detects random button presses even when nobody is touching it!',
    faultCategory: 'floating',
    description: 'In the code, digitalRead(2) keeps toggling erratically between 0 and 1.',
    clues: [
      'When button is pressed, Pin 2 reads stable 5V.',
      'When button is released, the pin is connected to nothing in mid-air.'
    ],
    options: [
      { label: 'Missing pull-down resistor on Pin 2', isCorrect: true, feedback: 'Correct! The input was floating, acting like an antenna picking up room 50Hz noise.' },
      { label: 'Arduino clock speed is too fast', isCorrect: false, feedback: 'Clock speed does not cause random voltage induction on floating pins.' },
      { label: 'The pushbutton is physically jammed', isCorrect: false, feedback: 'The pushbutton opens and closes normally.' }
    ],
    xpReward: 25,
    solutionHint: 'When a digital input pin is left unconnected, it floats. Connect a 10kΩ pull-down resistor to Ground.'
  },
  {
    id: 'dojo-3',
    title: 'The Blown 555 Timer IC',
    difficulty: 'Hard',
    symptom: 'Excess current draw (>400mA), chip becomes hot to touch.',
    faultCategory: 'resistor',
    description: 'A pulse generator circuit draws massive current immediately upon powering on.',
    clues: [
      'Discharge Pin 7 is tied directly to VCC without a pull-up resistor.',
      'When the internal transistor discharges to GND, it causes a dead short circuit between 5V and GND.'
    ],
    options: [
      { label: 'Capacitor polarity is reversed', isCorrect: false, feedback: 'The capacitor is a ceramic unpolarized type.' },
      { label: 'Pin 7 discharge is missing resistor R1', isCorrect: true, feedback: 'Excellent diagnosis! Directly connecting Pin 7 to VCC shorts the supply whenever the internal transistor turns on.' },
      { label: 'Supply voltage should be 120V AC', isCorrect: false, feedback: 'Standard 555 timers operate on 4.5V to 15V DC.' }
    ],
    xpReward: 25,
    solutionHint: 'Look at the resistor between Pin 7 and VCC. Without R1, the internal transistor shorts the power supply.'
  }
];

export const REAL_WORLD_MISSIONS: Mission[] = [
  {
    id: 'mission-night-lamp',
    title: 'Smart Night Lamp',
    scenario: 'Design an automated street/room lighting controller that turns an LED ON automatically when ambient light levels drop below a calibrated threshold.',
    components: ['Photoresistor (LDR)', '10kΩ Voltage Divider Resistor', 'Arduino ADC Pin A0', 'LED Driver Pin 9 (PWM)'],
    requirements: [
      'Read ambient sunlight using LDR voltage divider on Pin A0',
      'Compute threshold: If reading < 400 (Dark), turn LED ON',
      'If reading >= 400 (Daylight), turn LED OFF to conserve power'
    ],
    status: 'Full',
    xpReward: 80
  },
  {
    id: 'mission-gas-alarm',
    title: 'Industrial Gas Leak Detector',
    scenario: 'Equip a chemical laboratory with an early-warning telemetry sensor. Trigger audible buzzer pulses and red alert beacons if gas levels exceed 300 PPM.',
    components: ['Gas Sensor MQ-2', 'Buzzer on Pin 8', 'Status LEDs (Green / Red)'],
    requirements: [
      'Sample sensor continuous PPM level',
      'Normal status: Green LED ON, Buzzer silent',
      'Hazard status: Pulsing 2 kHz buzzer alarm + Red alert beacon'
    ],
    status: 'Outlined',
    xpReward: 80
  },
  {
    id: 'mission-parking-sensor',
    title: 'Ultrasonic Parking Distance Beeper',
    scenario: 'Replicate an automotive reversing radar. Emit rapid audio beeps as an obstacle gets closer to the vehicle bumper.',
    components: ['HC-SR04 Ultrasonic Sensor', 'Piezo Speaker on Pin 6'],
    requirements: [
      'Send 10 microsecond trigger pulse',
      'Calculate echo duration: Distance = (Duration * 0.034) / 2',
      'Scale beep frequency inversely with distance'
    ],
    status: 'Outlined',
    xpReward: 80
  }
];

