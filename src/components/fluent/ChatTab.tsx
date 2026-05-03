import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Chat, Message, CHATS } from "./types";

interface ChatTabProps {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  isTypingAI: boolean;
  sendMessage: () => void;
}

export default function ChatTab({
  activeChat,
  setActiveChat,
  messages,
  inputText,
  setInputText,
  isRecording,
  setIsRecording,
  isTypingAI,
  sendMessage,
}: ChatTabProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingAI]);

  if (activeChat) {
    return (
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
              className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
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
    );
  }

  return (
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
  );
}