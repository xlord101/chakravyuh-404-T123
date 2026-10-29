export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  category: 'robotics' | 'circuits' | 'hackathon' | 'paper' | 'nontech';
  categoryLabel: string;
  prizePool: string;
  firstPrize: string;
  secondPrize: string;
  teamSize: string;
  entryFee: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  rounds: { title: string; desc: string }[];
  rules: string[];
  coordinators: { name: string; phone: string; role: string }[];
  accentColor: string;
  badge: string;
}

export interface ScheduleItem {
  id: string;
  day: 1 | 2;
  time: string;
  title: string;
  track: 'Keynote' | 'Robotics' | 'Circuits' | 'Coding' | 'Paper' | 'Non-Tech';
  venue: string;
  speakerOrJudge?: string;
  description: string;
  status: 'UPCOMING' | 'LIVE' | 'STANDBY';
}

export interface PassType {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'vip';
  price: number;
  badge: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const SYMPOSIUM_CONFIG = {
  name: "CHAKRAVYUH 2026",
  edition: "Annual National Level Technical Symposium",
  department: "Department of Electronics & Telecommunication Engineering",
  college: "Faculty of Engineering & Technology",
  dates: "October 29 - 31, 2026",
  targetDate: "2026-10-29T09:00:00",
  venue: "E&TC Academic Complex, Campus Arena",
  totalPrizePool: "₹1,00,000+",
  contactEmail: "chakravyuh.entc@engineering.edu",
  helpdesk: "+91 98234 56789 / +91 91234 56780",
};

export const SYMPOSIUM_EVENTS: EventItem[] = [
  {
    id: "robo-kshethra",
    title: "Robo-Kshethra: Autonomous Arena",
    tagline: "High-speed line followers & dynamic obstacle traversal showdown",
    category: "robotics",
    categoryLabel: "Robotics & Automation",
    prizePool: "₹25,000",
    firstPrize: "₹15,000",
    secondPrize: "₹10,000",
    teamSize: "2 - 4 Members",
    entryFee: "₹400 / Team",
    date: "Day 1 (Oct 29, 2026)",
    time: "10:30 AM - 03:30 PM",
    venue: "Central Robotics Arena, Ground Floor",
    description: "Design and program an autonomous ground robot capable of navigating complex line tracks with acute turns, dynamic grid intersections, and ultrasonic obstacle avoidance zones under strict timing constraints.",
    rounds: [
      { title: "Round 1: Qualifying Time Trial", desc: "Standard 8-loop high speed track traversal. Top 8 fastest bots without manual interventions qualify." },
      { title: "Round 2: The Chakravyuh Maze", desc: "Dynamic track with pop-up obstacles, black/white line inversions, and steep gradient bridge ramps." },
      { title: "Round 3: Head-to-Head Duel", desc: "Parallel speed sprint and precision payload drop at target coordinate." }
    ],
    rules: [
      "Maximum robot dimensions: 25cm x 25cm x 20cm.",
      "Max weight: 3.5 kg. Onboard battery max 12V DC.",
      "No ready-made RC toy chassis allowed; custom or standard chassis kits permissible.",
      "Lego Mindstorms or pre-programmed black-box proprietary controllers not allowed."
    ],
    coordinators: [
      { name: "Aditya Patil", phone: "+91 98765 43210", role: "Student Lead" },
      { name: "Dr. S. K. Kulkarni", phone: "+91 94230 11223", role: "Faculty In-Charge" }
    ],
    accentColor: "#14b3ad",
    badge: "FLAGSHIP"
  },
  {
    id: "silicon-matrix",
    title: "Silicon Matrix: Circuit Debugging",
    tagline: "Oscilloscopes, analog forensics & precision breadboard engineering",
    category: "circuits",
    categoryLabel: "Circuits & VLSI",
    prizePool: "₹18,000",
    firstPrize: "₹11,000",
    secondPrize: "₹7,000",
    teamSize: "1 - 2 Members",
    entryFee: "₹250 / Team",
    date: "Day 1 (Oct 29, 2026)",
    time: "11:00 AM - 02:00 PM",
    venue: "Analog & Digital Electronics Lab (ADL-204)",
    description: "Test your hardware troubleshooting instinct. Diagnose faulty op-amp filters, logic gate hazards, timer 555 astable circuits, and signal discrepancies using digital storage oscilloscopes and multimeters.",
    rounds: [
      { title: "Round 1: Component Forensic Quiz", desc: "Identify obscure SMD packages, decode color bands, and compute equivalent impedance in 20 mins." },
      { title: "Round 2: Hardware Bug Hunt", desc: "Fix intentionally sabotaged circuits on breadboards and restore clean square/sine waveforms on the DSO." },
      { title: "Round 3: Rapid Circuit Scaffolding", desc: "Implement a given state-machine or active bandpass filter from schematic to verified hardware in 45 mins." }
    ],
    rules: [
      "All test instruments (DSO, function generators, multimeters, power supplies) provided in lab.",
      "Short circuits causing blown ICs will incur point penalties.",
      "Datasheet handbooks provided on offline terminal stations."
    ],
    coordinators: [
      { name: "Snehal Deshmukh", phone: "+91 97654 32109", role: "Lead Coordinator" },
      { name: "Prof. M. R. Joshi", phone: "+91 98221 44556", role: "Faculty Mentor" }
    ],
    accentColor: "#f0ac1b",
    badge: "ENTC CORE"
  },
  {
    id: "vibe-hackathon",
    title: "AI Vibe Coding: 24h Hackathon",
    tagline: "Build Next-Gen ENTC IoT & Intelligent Telemetry Tools",
    category: "hackathon",
    categoryLabel: "AI & Software",
    prizePool: "₹30,000",
    firstPrize: "₹18,000",
    secondPrize: "₹12,000",
    teamSize: "2 - 4 Members",
    entryFee: "₹500 / Team",
    date: "Day 1 to Day 2 (Oct 29-30)",
    time: "Starts 01:00 PM (24 Hours)",
    venue: "Advanced Computing Centre, Hall 3",
    description: "An overnight sprint combining AI models, edge computing, and web engineering. Build intelligent platforms such as SparkPath (interactive ENTC hardware simulators), remote SDR signal monitors, or smart campus telemetry dashboards.",
    rounds: [
      { title: "Checkpoint 1: Problem Statement & Architecture", desc: "Submission of GitHub repo, system architecture diagram, and tech stack validation at 07:00 PM." },
      { title: "Checkpoint 2: Midnight Code Sprint & Mentor Review", desc: "Live code evaluation and sanity check by industry mentors at 01:00 AM." },
      { title: "Grand Finale: Working Prototype Pitch", desc: "Live 8-minute demo + 4-minute Q&A before senior tech founders and faculty jury." }
    ],
    rules: [
      "Fresh repositories only; all code must be written during the 24-hour hackathon window.",
      "APIs and open-source packages welcome; proper attribution required.",
      "High-speed campus Wi-Fi, snacks, coffee, and sleeping bays provided."
    ],
    coordinators: [
      { name: "Rugved Shelke", phone: "+91 99887 76655", role: "Tech Lead" },
      { name: "Prof. P. V. Sharma", phone: "+91 94220 77889", role: "Faculty Convener" }
    ],
    accentColor: "#6fe9e2",
    badge: "HIGH BOUNTY"
  },
  {
    id: "electro-spectrum",
    title: "Electro-Spectrum: Paper & Project Expo",
    tagline: "Present breakthrough research in 5G/6G, Embedded IoT & VLSI",
    category: "paper",
    categoryLabel: "Research & Innovation",
    prizePool: "₹20,000",
    firstPrize: "₹12,000",
    secondPrize: "₹8,000",
    teamSize: "1 - 3 Members",
    entryFee: "₹300 / Team",
    date: "Day 2 (Oct 30, 2026)",
    time: "09:30 AM - 01:30 PM",
    venue: "Seminar Hall A & B, E&TC Wing",
    description: "National platform for undergraduate and postgraduate researchers to present technical papers and working hardware prototypes across Telecommunications, Satellite Links, Bio-Medical Instrumentation, and TinyML.",
    rounds: [
      { title: "Stage 1: Abstract & Poster Review", desc: "Peer panel evaluation of IEEE-format paper submission and hardware display poster." },
      { title: "Stage 2: Technical Defense", desc: "10-minute slide presentation followed by rigorous jury cross-examination." }
    ],
    rules: [
      "Paper format: standard IEEE double-column (max 6 pages).",
      "Plagiarism must be under 15% (Turnitin verified).",
      "Selected papers will be indexed in Symposium Proceedings with ISBN."
    ],
    coordinators: [
      { name: "Tanvi Kulkarni", phone: "+91 96543 21098", role: "Academic Coordinator" },
      { name: "Dr. A. N. Gaikwad", phone: "+91 98901 23456", role: "Department Head" }
    ],
    accentColor: "#ef5f5f",
    badge: "IEEE SPONSORED"
  },
  {
    id: "web-app-pulse",
    title: "Web-App Pulse: Engineering UI Challenge",
    tagline: "Retro-tactile interfaces, canvas animations & high-performance frontend",
    category: "hackathon",
    categoryLabel: "Frontend & Design",
    prizePool: "₹15,000",
    firstPrize: "₹10,000",
    secondPrize: "₹5,000",
    teamSize: "1 - 3 Members",
    entryFee: "₹250 / Team",
    date: "Day 2 (Oct 30, 2026)",
    time: "10:00 AM - 02:00 PM",
    venue: "CAD / Simulation Lab, 3rd Floor",
    description: "Craft hyper-polished, student-friendly engineering user interfaces inspired by ditto.site, tactile retro synthesizers, and real-time canvas visualizations. Evaluated on aesthetics, responsiveness, and micro-interactions.",
    rounds: [
      { title: "Phase 1: Design Brief Drop", desc: "A surprise engineering product prompt (e.g., SDR spectrum visualizer UI) is revealed." },
      { title: "Phase 2: Live Build & Responsive Audit", desc: "4 hours to build and deploy to Vercel/Netlify with 100% Lighthouse targets." }
    ],
    rules: [
      "Must use modern web frameworks (React, Vite, Next.js, Vue, or Svelte).",
      "Accessibility (WCAG AA) and responsive mobile viewport test are mandatory."
    ],
    coordinators: [
      { name: "Omkar Shinde", phone: "+91 95432 10987", role: "UI Lead" },
      { name: "Prof. R. T. Patil", phone: "+91 98231 66778", role: "Faculty In-Charge" }
    ],
    accentColor: "#8c73ff",
    badge: "CREATIVE TECH"
  },
  {
    id: "lan-escape-maze",
    title: "Glitch Arena & Escape The Maze",
    tagline: "Hardware puzzle room, LAN gaming & crypto-cipher mystery",
    category: "nontech",
    categoryLabel: "Non-Technical & Fun",
    prizePool: "₹12,000",
    firstPrize: "₹7,000",
    secondPrize: "₹5,000",
    teamSize: "2 - 4 Members",
    entryFee: "₹200 / Team",
    date: "Day 2 (Oct 30, 2026)",
    time: "02:00 PM - 06:00 PM",
    venue: "Student Activity Center & Hall 1",
    description: "Enter a locked laboratory where clues are hidden inside seven-segment displays, Morse code beepers, binary puzzle cards, and laser tripwires. Solve your way out before the countdown hits zero!",
    rounds: [
      { title: "Level 1: The Darkroom Laser Tripwire", desc: "Navigate the sensor mesh without triggering the buzzer alarms." },
      { title: "Level 2: The Telegraph Cipher", desc: "Decode raw audio frequencies and assemble the physical unlock key." },
      { title: "Level 3: LAN Showdown", desc: "Speedrun tactical deathmatch rounds against top campus players." }
    ],
    rules: [
      "Physical tampering with fixtures will lead to immediate disqualification.",
      "Fair play in LAN tournament strictly enforced with anti-cheat monitoring."
    ],
    coordinators: [
      { name: "Kunal Bansal", phone: "+91 94321 09876", role: "Arena Lead" },
      { name: "Prof. V. B. Jadhav", phone: "+91 98811 22334", role: "Faculty Advisor" }
    ],
    accentColor: "#f0ac1b",
    badge: "FAN FAVORITE"
  }
];

export const SCHEDULE_DAYS: ScheduleItem[] = [
  // Day 1
  {
    id: "d1-1",
    day: 1,
    time: "09:00 AM - 10:15 AM",
    title: "Grand Inauguration & Keynote Address",
    track: "Keynote",
    venue: "Main University Auditorium",
    speakerOrJudge: "Chief Guest: Senior Director, Qualcomm India",
    description: "Opening lamp lighting, keynote on 'Next-Generation RF & AI-Driven Silicon', and symposium kickoff.",
    status: "UPCOMING"
  },
  {
    id: "d1-2",
    day: 1,
    time: "10:30 AM - 03:30 PM",
    title: "Robo-Kshethra: Qualifying & Arena Rounds",
    track: "Robotics",
    venue: "Central Robotics Arena",
    speakerOrJudge: "Jury from Robotics Automation Society",
    description: "High speed time trials, maze navigation, and dynamic obstacle traversal showdown.",
    status: "UPCOMING"
  },
  {
    id: "d1-3",
    day: 1,
    time: "11:00 AM - 02:00 PM",
    title: "Silicon Matrix: Circuit Debugging Challenge",
    track: "Circuits",
    venue: "ADL-204 Hardware Lab",
    speakerOrJudge: "Texas Instruments Technical Mentors",
    description: "Oscilloscope signal debugging, op-amp fault forensics, and breadboard speedrun.",
    status: "UPCOMING"
  },
  {
    id: "d1-4",
    day: 1,
    time: "01:00 PM - Continuous",
    title: "24-Hour AI Vibe Hackathon Kickoff",
    track: "Coding",
    venue: "Advanced Computing Centre, Hall 3",
    speakerOrJudge: "Engineering Leaders from Top Tech Startups",
    description: "Problem statement drop, repository registration, team hacking stations powered up for 24 hours.",
    status: "UPCOMING"
  },
  {
    id: "d1-5",
    day: 1,
    time: "04:00 PM - 05:30 PM",
    title: "Industry Masterclass: TinyML on ESP32 & Edge AI",
    track: "Keynote",
    venue: "Audi-2 Audio Visual Hall",
    speakerOrJudge: "Edge Impulse Certified Instructors",
    description: "Live hands-on tutorial on training gesture recognition and anomaly detection models on microcontrollers.",
    status: "UPCOMING"
  },

  // Day 2
  {
    id: "d2-1",
    day: 2,
    time: "09:30 AM - 01:30 PM",
    title: "Electro-Spectrum: Paper & Project Expo",
    track: "Paper",
    venue: "Seminar Halls A & B",
    speakerOrJudge: "IEEE Bombay Section Reviewers",
    description: "Research presentations in 5G/6G, VLSI architectures, satellite links, and working IoT prototypes.",
    status: "UPCOMING"
  },
  {
    id: "d2-2",
    day: 2,
    time: "10:00 AM - 02:00 PM",
    title: "Web-App Pulse: Engineering UI Showdown",
    track: "Coding",
    venue: "CAD / Simulation Lab",
    speakerOrJudge: "Senior Frontend Architects",
    description: "Designing tactile, high-performance web dashboards for engineering telemetry in 4 hours.",
    status: "UPCOMING"
  },
  {
    id: "d2-3",
    day: 2,
    time: "01:00 PM - 02:30 PM",
    title: "AI Hackathon: Grand Jury Pitches & Code Audit",
    track: "Coding",
    venue: "Innovation Hub Stage",
    speakerOrJudge: "Venture Partners & Department Alumni",
    description: "Top 8 hackathon finalist teams deliver 8-minute live code pitches before the judging panel.",
    status: "UPCOMING"
  },
  {
    id: "d2-4",
    day: 2,
    time: "02:30 PM - 05:00 PM",
    title: "Glitch Arena & Escape The Maze Finale",
    track: "Non-Tech",
    venue: "Student Activity Centre",
    speakerOrJudge: "Team 404 Event Crew",
    description: "Hardware escape puzzle rooms, laser tripwire speed trials, and LAN tournament finals.",
    status: "UPCOMING"
  },
  {
    id: "d2-5",
    day: 2,
    time: "05:30 PM - 07:00 PM",
    title: "Grand Valedictory & Prize Distribution Ceremony",
    track: "Keynote",
    venue: "Main University Auditorium",
    speakerOrJudge: "Dean of Engineering, HOD E&TC, Industry Guests",
    description: "Awarding ₹1,00,000+ prize money, trophies, certificates of excellence, and cultural evening wrap-up.",
    status: "UPCOMING"
  }
];

export const PASS_TIERS: PassType[] = [
  {
    id: "pass-bronze",
    name: "Bronze Explorer",
    tier: "bronze",
    price: 150,
    badge: "VISITOR PASS",
    description: "Ideal for first-time visitors wanting to attend keynotes, research expos, and experience the tech fest atmosphere.",
    features: [
      "Access to all Keynote Lectures & Tech Talks",
      "Entry to Electro-Spectrum Project Expo gallery",
      "Symposium Welcome Kit & Badge",
      "Digital Certificate of Participation",
      "Live 3D Hardware Canvas demo access"
    ]
  },
  {
    id: "pass-silver",
    name: "Silver Competitor",
    tier: "silver",
    price: 350,
    badge: "COMPETITOR PASS",
    description: "For active engineering participants competing in core technical events, circuit forensics, or design sprints.",
    features: [
      "1 Technical Event Entry (Robotics, Circuits, or UI)",
      "Free Entry to TinyML on Edge AI Masterclass",
      "Official Physical Participation Certificate",
      "Custom Circuit Breadboard Keychain & Kit",
      "Discount voucher for Department tech fests",
      "Complimentary Tea & Refreshment vouchers"
    ],
    recommended: true
  },
  {
    id: "pass-gold",
    name: "Gold Hacker Squad",
    tier: "gold",
    price: 600,
    badge: "TEAM PASS (UP TO 4)",
    description: "Complete team access for the 24-Hour AI Vibe Hackathon or Robo-Kshethra Autonomous Arena.",
    features: [
      "Full Team Registration (up to 4 members)",
      "Dedicated hackathon workstation with high-speed LAN",
      "Overnight energy drinks, dinner, and breakfast",
      "1-on-1 Mentorship from industry engineers",
      "Priority eligibility for ₹30,000 Hackathon Bounty",
      "Certificates of Excellence for all 4 team members"
    ]
  },
  {
    id: "pass-vip",
    name: "All-Access VIP Delegate",
    tier: "vip",
    price: 999,
    badge: "ALL-ACCESS VIP",
    description: "Premium all-inclusive pass for ambitious delegates wanting unlimited competition access, dinners, and kits.",
    features: [
      "Unlimited Event Access across all 6 competitions",
      "VIP front-row seating at Inaugural & Keynotes",
      "Exclusive Networking Dinner with Industry Heads",
      "Official Chakravyuh 2026 Embroidered Hoodie",
      "Hardware Component Care Pack (Sensors + ESP32 dev board)",
      "Lifetime SparkPath ENTC Learning Portal access"
    ]
  }
];

export const FAQS = [
  {
    question: "Who is eligible to participate in Chakravyuh 2026?",
    answer: "Chakravyuh 2026 is a National Level Symposium open to all bona fide undergraduate and postgraduate engineering, polytechnic, and science students across India. Cross-college and inter-branch teams are warmly welcomed!"
  },
  {
    question: "Do I need to bring my own hardware for circuit and robotics events?",
    answer: "For Silicon Matrix (Circuit Debugging), all lab instruments, DSOs, power supplies, breadboards, and ICs are provided. For Robo-Kshethra, teams must bring their own autonomous robot and battery packs. For the Hackathon, power sockets and Wi-Fi are provided; bring your laptops and microcontrollers."
  },
  {
    question: "Is accommodation provided for outstation participants?",
    answer: "Yes! Subsidized hostel accommodation is available on campus for verified outstation participants from October 28 evening to October 31 morning. You can opt for accommodation during registration for a nominal fee of ₹200/night including breakfast."
  },
  {
    question: "Will every participant receive a verified certificate?",
    answer: "Absolutely. All registered delegates who participate in events or attend workshops will receive a government-recognized Certificate of Participation signed by the Head of Department and the Principal. Winners receive cash prizes, trophies, and Certificates of Merit."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Yes! The schedule has been optimized so events do not conflict. For instance, you can participate in Robo-Kshethra on Day 1 and Electro-Spectrum or Web-App Pulse on Day 2. The All-Access VIP Pass covers unlimited event entries."
  },
  {
    question: "What is SparkPath and how is it related to Chakravyuh?",
    answer: "SparkPath is our flagship open-innovation initiative under the E&TC department—an interactive, hands-on learning platform for circuits, logic, and telemetry. It serves as one of the key challenge tracks in the 24h AI Vibe Hackathon!"
  }
];

export const SPONSORS = [
  { name: "Texas Instruments", role: "Silicon Partner", logo: "TI" },
  { name: "Intel", role: "Compute & AI Sponsor", logo: "INTEL" },
  { name: "Qualcomm", role: "Wireless Innovation Partner", logo: "QCOM" },
  { name: "IEEE Bombay Section", role: "Technical Co-Sponsor", logo: "IEEE" },
  { name: "IETE", role: "Institutional Partner", logo: "IETE" },
  { name: "MathWorks", role: "Simulation Partner", logo: "MATLAB" },
  { name: "Cadence Design", role: "VLSI Software Partner", logo: "CADENCE" },
  { name: "Team 404 Labs", role: "Engineering & Dev Crew", logo: "404" },
];

