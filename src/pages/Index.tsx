import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Tab, Chat, Message, MOCK_MESSAGES } from "@/components/fluent/types";
import ChatTab from "@/components/fluent/ChatTab";
import VoiceTab from "@/components/fluent/VoiceTab";
import ProfileTab from "@/components/fluent/ProfileTab";
import SettingsTab from "@/components/fluent/SettingsTab";

const AI_CHAT_URL = "https://functions.poehali.dev/4439836c-a584-4b76-b30a-6432ee661613";

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTypingAI, setIsTypingAI] = useState(false);
  const [voicePhase, setVoicePhase] = useState<"idle" | "listening" | "processing" | "speaking">("idle");

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "me",
      timestamp: now,
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsTypingAI(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.sender === "me" ? "user" : "assistant",
        content: m.text,
      }));

      const resp = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText, history: history.slice(0, -1) }),
      });
      const data = await resp.json();
      const replyTime = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.reply,
          sender: "other",
          timestamp: replyTime,
          correction: data.correction ?? undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Oops, something went wrong. Please try again!",
          sender: "other",
          timestamp: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTypingAI(false);
    }
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
        {tab === "chats" && (
          <ChatTab
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            isTypingAI={isTypingAI}
            sendMessage={sendMessage}
          />
        )}
        {tab === "voice" && (
          <VoiceTab voicePhase={voicePhase} handleVoiceToggle={handleVoiceToggle} />
        )}
        {tab === "profile" && <ProfileTab />}
        {tab === "settings" && <SettingsTab />}
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