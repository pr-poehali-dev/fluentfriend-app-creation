export type Tab = "chats" | "voice" | "profile" | "settings";
export type ChatType = "ai" | "user";

export interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  correction?: { original: string; fixed: string; explanation: string };
  timestamp: string;
}

export interface Chat {
  id: number;
  name: string;
  type: ChatType;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  level?: string;
}

export const CHATS: Chat[] = [
  { id: 1, name: "AI Tutor", type: "ai", avatar: "🤖", lastMessage: "Great job! Let's practice conditionals.", time: "сейчас", unread: 2, level: "B2" },
  { id: 2, name: "Maria Santos", type: "user", avatar: "🇧🇷", lastMessage: "Can we practice tomorrow?", time: "5м", level: "B1" },
  { id: 3, name: "Yuki Tanaka", type: "user", avatar: "🇯🇵", lastMessage: "How do you say 'serendipity'?", time: "1ч" },
  { id: 4, name: "Ahmed Hassan", type: "user", avatar: "🇪🇬", lastMessage: "I learned 10 new words!", time: "2ч" },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 1, text: "Hello! I want to practice my English today.", sender: "me", timestamp: "10:30" },
  { id: 2, text: "Great! Let's start with some conversation practice. How was your weekend?", sender: "other", timestamp: "10:30" },
  {
    id: 3,
    text: "I goed to the park with my friends and we have a lot of fun.",
    sender: "me",
    correction: {
      original: "I goed to the park",
      fixed: "I went to the park",
      explanation: "«Went» — неправильная форма прошедшего времени глагола «go». Правильно: went, not goed.",
    },
    timestamp: "10:31",
  },
  { id: 4, text: "That sounds wonderful! I noticed a small correction — check below. Great sentence structure overall! 🌟", sender: "other", timestamp: "10:31" },
];

export const STATS = [
  { label: "Дней подряд", value: "12", icon: "Flame", color: "text-orange-500" },
  { label: "Слов изучено", value: "348", icon: "BookOpen", color: "text-blue-500" },
  { label: "Минут практики", value: "64", icon: "Clock", color: "text-green-500" },
  { label: "Исправлений", value: "27", icon: "CheckCircle", color: "text-purple-500" },
];

export const ACHIEVEMENTS = [
  { icon: "🔥", name: "На огне", desc: "12 дней подряд" },
  { icon: "🗣️", name: "Говорун", desc: "10 голосовых сессий" },
  { icon: "📚", name: "Читатель", desc: "100 слов изучено" },
];
