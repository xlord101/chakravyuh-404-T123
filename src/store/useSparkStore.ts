import { useState, useEffect } from 'react';

export type AppView = 'landing' | 'learn' | 'lesson' | 'lab' | 'challenges' | 'quiz' | 'dojo' | 'missions' | 'profile';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'spark';
  text: string;
  hintLevel?: number;
  timestamp: string;
}

export interface SparkUserState {
  name: string;
  level: string;
  xp: number;
  streak: number;
  streakActive: boolean;
  dailyGoalMin: number;
  completedLessons: string[];
  unlockedBadges: string[];
  completedDojoCases: string[];
}

const STORAGE_KEY = 'sparkpath_state_v1';

const DEFAULT_USER: SparkUserState = {
  name: 'Riya (Guest)',
  level: 'Spark',
  xp: 45,
  streak: 3,
  streakActive: true,
  dailyGoalMin: 10,
  completedLessons: [],
  unlockedBadges: ['First Light'],
  completedDojoCases: []
};

export const useSparkStore = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeLessonId, setActiveLessonId] = useState<string>('logic-1');
  const [activeLessonStep, setActiveLessonStep] = useState<number>(0);
  const [user, setUser] = useState<SparkUserState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [sparkTutorOpen, setSparkTutorOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'spark',
      text: 'Hi, I’m Spark! I can see your circuit and code in real time. Stuck or need a hint? Just ask!',
      timestamp: 'Now'
    }
  ]);

  // Persist user state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore in incognito or blocked storage
    }
  }, [user]);

  // Dynamic Level computation based on XP (PRD 16.2)
  const computeLevel = (xp: number) => {
    if (xp >= 1000) return 'Spectrum';
    if (xp >= 500) return 'Beam';
    if (xp >= 250) return 'Wave';
    if (xp >= 100) return 'Pulse';
    return 'Spark';
  };

  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      return {
        ...prev,
        xp: newXp,
        level: computeLevel(newXp)
      };
    });
  };

  const completeLesson = (lessonId: string) => {
    setUser((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newCompleted = [...prev.completedLessons, lessonId];
      const newBadges = [...prev.unlockedBadges];
      if (lessonId === 'logic-1' && !newBadges.includes('First Light')) {
        newBadges.push('First Light');
      }
      if (newCompleted.filter((id) => id.startsWith('logic')).length >= 3 && !newBadges.includes('Gate Keeper')) {
        newBadges.push('Gate Keeper');
      }
      const newXp = prev.xp + 30;
      return {
        ...prev,
        completedLessons: newCompleted,
        unlockedBadges: newBadges,
        xp: newXp,
        level: computeLevel(newXp)
      };
    });
  };

  const completeDojoCase = (caseId: string) => {
    setUser((prev) => {
      if (prev.completedDojoCases.includes(caseId)) return prev;
      const newCases = [...prev.completedDojoCases, caseId];
      const newBadges = [...prev.unlockedBadges];
      if (newCases.length >= 1 && !newBadges.includes('Bug Hunter')) {
        newBadges.push('Bug Hunter');
      }
      const newXp = prev.xp + 25;
      return {
        ...prev,
        completedDojoCases: newCases,
        unlockedBadges: newBadges,
        xp: newXp,
        level: computeLevel(newXp)
      };
    });
  };

  const navigateTo = (view: AppView, lessonId?: string) => {
    setCurrentView(view);
    if (lessonId) {
      setActiveLessonId(lessonId);
      setActiveLessonStep(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendSparkMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);

    // Contextual AI Tutor response generator (PRD 14.2 & 14.4)
    setTimeout(() => {
      let reply = "I'm analyzing your circuit state. Remember that electrical current always requires a closed path from VCC (5V) down to GND (0V).";
      const lower = text.toLowerCase();
      if (lower.includes('led') || lower.includes('light') || lower.includes('not working')) {
        reply = "Looking at your circuit: check whether the LED anode (longer leg) is facing the 5V positive rail and the cathode is tied to Ground through a 220Ω resistor. If reversed, the diode blocks current!";
      } else if (lower.includes('and') || lower.includes('gate') || lower.includes('logic')) {
        reply = "In an AND gate, both inputs MUST be logic HIGH (1) for the output to be 1. If even one input is 0, the output stays clamped to 0V.";
      } else if (lower.includes('hint')) {
        reply = "Hint (Step 1 of 3): Observe where the voltage stops. If pin A is 5V but pin B is 0V, current cannot jump the gap without a physical jumper connection.";
      } else if (lower.includes('floating') || lower.includes('button')) {
        reply = "When an input pin isn't connected to either 5V or GND, it acts as an antenna picking up electromagnetic hum. Add a 10kΩ pull-down resistor to Ground!";
      } else if (lower.includes('quiz') || lower.includes('test')) {
        reply = "Quick Check: If an OR gate has Input A=0 and Input B=1, what is the output? (Answer: 1, because at least one input is TRUE!)";
      }

      const sparkReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'spark',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, sparkReply]);
    }, 600);
  };

  return {
    currentView,
    activeLessonId,
    activeLessonStep,
    user,
    sparkTutorOpen,
    messages,
    navigateTo,
    setActiveLessonStep,
    addXp,
    completeLesson,
    completeDojoCase,
    setSparkTutorOpen,
    sendSparkMessage
  };
};

