import Icon from "@/components/ui/icon";

type VoicePhase = "idle" | "listening" | "processing" | "speaking";

interface VoiceTabProps {
  voicePhase: VoicePhase;
  handleVoiceToggle: () => void;
}

export default function VoiceTab({ voicePhase, handleVoiceToggle }: VoiceTabProps) {
  return (
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
  );
}
