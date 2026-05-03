import { useState, useEffect } from "react";

export interface Stats {
  streak: number;
  wordsLearned: number;
  minutesPracticed: number;
  corrections: number;
  xp: number;
  lastActiveDate: string;
  weekActivity: number[];
}

export interface Settings {
  dailyGoal: number;
  level: string;
  autoCorrect: boolean;
  pronunciationCorrect: boolean;
  explanations: boolean;
  reminders: boolean;
  achievements: boolean;
}

const DEFAULT_STATS: Stats = {
  streak: 0,
  wordsLearned: 0,
  minutesPracticed: 0,
  corrections: 0,
  xp: 0,
  lastActiveDate: "",
  weekActivity: [0, 0, 0, 0, 0, 0, 0],
};

const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 15,
  level: "B1",
  autoCorrect: true,
  pronunciationCorrect: true,
  explanations: true,
  reminders: true,
  achievements: false,
};

function load<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    if (s) return { ...fallback, ...JSON.parse(s) };
  } catch (e) {
    console.warn(e);
  }
  return fallback;
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(e);
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => load("ff_stats", DEFAULT_STATS));
  const [settings, setSettings] = useState<Settings>(() => load("ff_settings", DEFAULT_SETTINGS));

  useEffect(() => { save("ff_stats", stats); }, [stats]);
  useEffect(() => { save("ff_settings", settings); }, [settings]);

  const addMessage = (hasCorrection: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const dayOfWeek = new Date().getDay();
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    setStats((prev) => {
      const isNewDay = prev.lastActiveDate !== today;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = prev.lastActiveDate === yesterday.toISOString().split("T")[0];

      const newWeekActivity = [...prev.weekActivity];
      newWeekActivity[idx] = Math.min(100, newWeekActivity[idx] + 10);

      return {
        ...prev,
        streak: isNewDay ? (wasYesterday || prev.streak === 0 ? prev.streak + 1 : 1) : prev.streak,
        minutesPracticed: prev.minutesPracticed + 1,
        corrections: hasCorrection ? prev.corrections + 1 : prev.corrections,
        wordsLearned: prev.wordsLearned + (hasCorrection ? 2 : 1),
        xp: prev.xp + (hasCorrection ? 15 : 10),
        lastActiveDate: today,
        weekActivity: newWeekActivity,
      };
    });
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { stats, settings, addMessage, updateSetting };
}
