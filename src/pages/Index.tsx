import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type Tab = "chats" | "voice" | "profile" | "settings";
type ChatType = "ai" | "user";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  correction?: { original: string; fixed: string; explanation: string };
  timestamp: string;
}

interface Chat {
  id: number;
  name: string;
  type: ChatType;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  level?: string;
}

const CHATS: Chat[] = [
  { id: 1, name: "AI Tutor", type: "ai", avatar: "🤖", lastMessage: "Great job! Let's practice conditionals.", time: "сейчас", unread: 2, level: "B2" },
  { id: 2, name: "Maria Santos", type: "user", avatar: "🇧🇷", lastMessage: "Can we practice tomorrow?", time: "5м", level: "B1" },
  { id: 3, name: "Yuki Tanaka", type: "user", avatar: "🇯🇵", lastMessage: "How do you say 'serendipity'?", time: "1ч" },
  { id: 4, name: "Ahmed Hassan", type: "user", avatar: "🇪🇬", lastMessage: "I learned 10 new words!", time: "2ч" },
];

const MOCK_MESSAGES: Message[] = [
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

const STATS = [
  { label: "Дней подряд", value: "12", icon: "Flame", color: "text-orange-500" },
  { label: "Слов изучено", value: "348", icon: "BookOpen", color: "text-blue-500" },
  { label: "Минут практики", value: "64", icon: "Clock", color: "text-green-500" },
  { label: "Исправлений", value: "27", icon: "CheckCircle", color: "text-purple-500" },
];

const ACHIEVEMENTS = [
  { icon: "🔥", name: "На огне", desc: "12 дней подряд" },
  { icon: "🗣️", name: "Говорун", desc: "10 голосовых сессий" },
  { icon: "📚", name: "Читатель", desc: "100 слов изучено" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTypingAI, setIsTypingAI] = useState(false);
  const [voicePhase, setVoicePhase] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingAI]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTypingAI(true);
    setTimeout(() => {
      setIsTypingAI(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "That's a great point! Keep going — your English is improving every day.",
          sender: "other",
          timestamp: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    if (voicePhase === "idle") {
      setVoicePhase("listening");
      setTimeout(() => setVoicePhase("processing"), 3000);
      setTimeout(() => setVoicePhase("speaking"), 4500);
      setTimeout(() => setVoicePhase("idle"), 7000);
    } else {
      setVoicePhase("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-20 px-5 py-4">
        {activeChat ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChat(null)}
              className="p-1 -ml-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <Icon name="ChevronLeft" size={22} />
            </button>
            <div className="text-2xl">{activeChat.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm leading-tight">{activeChat.name}</div>
              <div className="text-xs text-muted-foreground">
                {activeChat.type === "ai" ? "ИИ-репетитор" : `Уровень ${activeChat.level}`}
              </div>
            </div>
            {activeChat.type === "ai" && (
              <div className="flex items-center gap-1 bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                онлайн
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-2xl font-semibold text-foreground italic">FluentFriend</div>
              <div className="text-xs text-muted-foreground">Практикуй английский каждый день</div>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm px-3 py-1.5 rounded-full font-medium">
              <Icon name="Flame" size={14} />
              12
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden flex flex-col">

        {/* CHATS LIST */}
        {tab === "chats" && !activeChat && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 animate-fade-in">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Активные чаты
            </div>
            {CHATS.map((chat, i) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-border hover:border-primary/30 hover:shadow-sm transition-all text-left animate-fade-in"
                style={{ animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
                    {chat.avatar}
                  </div>
                  {chat.type === "ai" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Sparkles" size={9} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{chat.lastMessage}</div>
                  {chat.level && (
                    <div className="mt-1">
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {chat.level}
                      </span>
                    </div>
                  )}
                </div>
                {chat.unread && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}

            <div className="pt-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Найти партнёра
              </div>
              <button className="w-full flex items-center gap-3 border-2 border-dashed border-border rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <Icon name="UserPlus" size={20} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Найти собеседника</div>
                  <div className="text-xs">Практикуй с людьми со всего мира</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* CHAT MESSAGES */}
        {tab === "chats" && activeChat && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"} message-appear`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "me"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
                  {msg.correction && (
                    <div className="max-w-[85%] mt-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs animate-fade-in">
                      <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1.5">
                        <Icon name="Lightbulb" size={13} />
                        Исправление
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="line-through text-red-400">{msg.correction.original}</span>
                        <Icon name="ArrowRight" size={11} className="text-muted-foreground" />
                        <span className="text-green-600 font-medium">{msg.correction.fixed}</span>
                      </div>
                      <p className="text-muted-foreground leading-snug">{msg.correction.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
              {isTypingAI && (
                <div className="flex items-start animate-fade-in">
                  <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground pulse-dot" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border bg-white/90 backdrop-blur-md px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isRecording ? "bg-red-100 text-red-500" : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon name={isRecording ? "MicOff" : "Mic"} size={18} />
                </button>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Напиши по-английски..."
                  className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-30 hover:bg-primary/90 transition-all"
                >
                  <Icon name="Send" size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VOICE TAB */}
        {tab === "voice" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl italic font-semibold text-foreground mb-2">Голосовая практика</h2>
              <p className="text-sm text-muted-foreground">Тренируй произношение с мгновенной обратной связью</p>
            </div>

            <div className="w-full bg-white rounded-3xl border border-border p-6 mb-8 text-center shadow-sm">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Произнеси фразу</div>
              <p className="text-xl font-semibold text-foreground mb-3 leading-snug">
                "The weather is lovely today, isn't it?"
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Present Simple</span>
                <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">Лёгко</span>
              </div>
            </div>

            <div className="relative mb-8">
              {voicePhase === "listening" && (
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
              <button
                onClick={handleVoiceToggle}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  voicePhase === "idle"
                    ? "bg-primary hover:bg-primary/90"
                    : voicePhase === "listening"
                    ? "bg-red-500 scale-110"
                    : voicePhase === "processing"
                    ? "bg-amber-400 scale-105"
                    : "bg-green-500 scale-105"
                }`}
              >
                {voicePhase === "speaking" ? (
                  <div className="flex items-end gap-0.5 h-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="waveform-bar w-1.5 bg-white rounded-full"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <Icon
                    name={voicePhase === "processing" ? "Loader" : "Mic"}
                    size={32}
                    className={`text-white ${voicePhase === "processing" ? "animate-spin" : ""}`}
                  />
                )}
              </button>
            </div>

            <div className="text-sm font-medium text-muted-foreground mb-8">
              {voicePhase === "idle" && "Нажми, чтобы начать"}
              {voicePhase === "listening" && "Слушаю..."}
              {voicePhase === "processing" && "Анализирую произношение..."}
              {voicePhase === "speaking" && "ИИ отвечает..."}
            </div>

            {voicePhase === "idle" && (
              <div className="w-full grid grid-cols-3 gap-3 animate-slide-up">
                {[
                  { label: "Произношение", value: "86%", color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Темп речи", value: "92%", color: "text-green-500", bg: "bg-green-50" },
                  { label: "Интонация", value: "78%", color: "text-purple-500", bg: "bg-purple-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-border p-5">
              <div className="flex items-center gap-4 mb-5">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-2xl">👤</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-bold text-lg">Александр К.</div>
                  <div className="text-sm text-muted-foreground">Уровень B1 · Intermediate</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-5 h-1.5 rounded-full ${i <= 3 ? "bg-primary" : "bg-secondary"}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">до B2</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className="bg-background rounded-2xl p-3.5 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${s.color}`}>
                      <Icon name={s.icon} size={15} />
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border p-5">
              <div className="font-semibold mb-4">Активность на неделе</div>
              <div className="flex items-end justify-between gap-1 h-20">
                {[
                  { day: "Пн", h: 40 },
                  { day: "Вт", h: 70 },
                  { day: "Ср", h: 55 },
                  { day: "Чт", h: 85 },
                  { day: "Пт", h: 60 },
                  { day: "Сб", h: 90 },
                  { day: "Вс", h: 30 },
                ].map((d, i) => (
                  <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-full rounded-t-lg ${i === 5 ? "bg-primary" : "bg-primary/20"}`}
                      style={{ height: `${d.h}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border p-5">
              <div className="font-semibold mb-4">Достижения</div>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-xl">
                      {a.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.desc}</div>
                    </div>
                    <div className="ml-auto">
                      <Icon name="CheckCircle" size={18} className="text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">До следующего уровня</span>
                <span className="text-sm text-primary font-semibold">740 / 1000 XP</span>
              </div>
              <Progress value={74} className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-2">Осталось 260 XP до уровня B2</p>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 animate-fade-in">
            <div className="font-display text-2xl italic font-semibold mb-1">Настройки</div>

            {[
              {
                section: "Обучение",
                items: [
                  { icon: "Target", label: "Цель на день", value: "15 минут", action: true },
                  { icon: "GraduationCap", label: "Мой уровень", value: "B1 Intermediate", action: true },
                  { icon: "Languages", label: "Родной язык", value: "Русский", action: true },
                ],
              },
              {
                section: "Исправления",
                items: [
                  { icon: "Lightbulb", label: "Автокоррекция текста", value: "toggle-on" },
                  { icon: "Mic", label: "Коррекция произношения", value: "toggle-on" },
                  { icon: "BookOpenCheck", label: "Объяснения ошибок", value: "toggle-on" },
                ],
              },
              {
                section: "Голос",
                items: [
                  { icon: "Volume2", label: "Голос ИИ", value: "Женский (US)", action: true },
                  { icon: "Gauge", label: "Скорость речи", value: "Нормальная", action: true },
                ],
              },
              {
                section: "Уведомления",
                items: [
                  { icon: "Bell", label: "Напоминание о практике", value: "toggle-on" },
                  { icon: "Trophy", label: "Достижения", value: "toggle-off" },
                ],
              },
            ].map((group) => (
              <div key={group.section} className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="px-5 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.section}
                  </span>
                </div>
                {group.items.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                      i < group.items.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon name={item.icon} size={16} className="text-primary" />
                    </div>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.value === "toggle-on" && (
                      <div className="w-10 h-6 bg-primary rounded-full relative flex-shrink-0">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                      </div>
                    )}
                    {item.value === "toggle-off" && (
                      <div className="w-10 h-6 bg-secondary rounded-full relative flex-shrink-0">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                      </div>
                    )}
                    {item.action && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{item.value}</span>
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      {!activeChat && (
        <nav className="bg-white/90 backdrop-blur-md border-t border-border px-2 py-2 sticky bottom-0 z-20">
          <div className="flex items-center">
            {(
              [
                { id: "chats", icon: "MessageCircle", label: "Чаты" },
                { id: "voice", icon: "Mic", label: "Голос" },
                { id: "profile", icon: "BarChart2", label: "Прогресс" },
                { id: "settings", icon: "Settings", label: "Настройки" },
              ] as { id: Tab; icon: string; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                  tab === item.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}