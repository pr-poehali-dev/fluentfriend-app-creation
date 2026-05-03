import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PHRASES = [
  { text: "The weather is lovely today, isn't it?", tag: "Present Simple", level: "Лёгко", levelColor: "text-green-600", levelBg: "bg-green-50" },
  { text: "I have been studying English for three years.", tag: "Present Perfect", level: "Средне", levelColor: "text-amber-600", levelBg: "bg-amber-50" },
  { text: "If I had more time, I would travel the world.", tag: "Conditional", level: "Сложно", levelColor: "text-red-600", levelBg: "bg-red-50" },
  { text: "She suggested going to the cinema last night.", tag: "Gerund", level: "Средне", levelColor: "text-amber-600", levelBg: "bg-amber-50" },
  { text: "Could you please pass me the salt?", tag: "Politeness", level: "Лёгко", levelColor: "text-green-600", levelBg: "bg-green-50" },
];

type Phase = "idle" | "listening" | "result";

interface Result {
  heard: string;
  score: number;
  words: { word: string; ok: boolean }[];
}

function calcScore(expected: string, heard: string): Result {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  const expWords = normalize(expected).split(/\s+/);
  const heardWords = normalize(heard).split(/\s+/);

  const words = expWords.map((word) => ({
    word,
    ok: heardWords.includes(word),
  }));

  const score = Math.round((words.filter((w) => w.ok).length / words.length) * 100);
  return { heard, score, words };
}

export default function VoiceTab() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const phrase = PHRASES[phraseIdx];

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = () => {
    setError(null);
    setResult(null);

    type SpeechRecognitionCtor = new () => SpeechRecognition;
    const SpeechRecognition: SpeechRecognitionCtor =
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Твой браузер не поддерживает распознавание речи. Используй Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setPhase("listening");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const heard = event.results[0][0].transcript;
      setResult(calcScore(phrase.text, heard));
      setPhase("result");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Нет доступа к микрофону. Разреши доступ в браузере.");
      } else if (event.error === "no-speech") {
        setError("Речь не распознана. Попробуй ещё раз.");
      } else {
        setError(`Ошибка: ${event.error}`);
      }
      setPhase("idle");
    };

    recognition.onend = () => {
      if (phase === "listening") setPhase("idle");
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setPhase("idle");
  };

  const nextPhrase = () => {
    setResult(null);
    setError(null);
    setPhase("idle");
    setPhraseIdx((i) => (i + 1) % PHRASES.length);
  };

  const retry = () => {
    setResult(null);
    setError(null);
    setPhase("idle");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl italic font-semibold text-foreground mb-1">Голосовая практика</h2>
        <p className="text-sm text-muted-foreground">Произнеси фразу — я оценю точность</p>
      </div>

      {/* Фраза */}
      <div className="w-full bg-white rounded-3xl border border-border p-6 mb-6 shadow-sm">
        <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider text-center">Произнеси фразу</div>

        {/* Подсветка слов после результата */}
        {result ? (
          <p className="text-lg font-semibold text-foreground mb-3 leading-snug text-center">
            {result.words.map((w, i) => (
              <span key={i} className={w.ok ? "text-green-600" : "text-red-400"}>
                {w.word}{i < result.words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-xl font-semibold text-foreground mb-3 leading-snug text-center">
            "{phrase.text}"
          </p>
        )}

        <div className="flex items-center justify-center gap-2">
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{phrase.tag}</span>
          <span className={`${phrase.levelBg} ${phrase.levelColor} text-xs px-2 py-0.5 rounded-full`}>{phrase.level}</span>
        </div>
      </div>

      {/* Результат */}
      {result && (
        <div className="w-full bg-white rounded-3xl border border-border p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Результат</span>
            <span className={`text-2xl font-bold ${result.score >= 80 ? "text-green-500" : result.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
              {result.score}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${result.score >= 80 ? "bg-green-500" : result.score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ты сказал: <span className="text-foreground font-medium">"{result.heard}"</span>
          </p>
          {result.score === 100 && (
            <p className="text-xs text-green-600 font-medium mt-1">Отлично! Идеальное произношение 🎉</p>
          )}
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-red-600 animate-fade-in">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            {error}
          </div>
        </div>
      )}

      {/* Кнопка микрофона */}
      <div className="relative mb-6">
        {phase === "listening" && (
          <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
        )}
        <button
          onClick={phase === "listening" ? stopListening : startListening}
          disabled={phase === "result"}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-50 ${
            phase === "idle" || phase === "result"
              ? "bg-primary hover:bg-primary/90"
              : "bg-red-500 scale-110"
          }`}
        >
          <Icon
            name={phase === "listening" ? "MicOff" : "Mic"}
            size={32}
            className="text-white"
          />
        </button>
      </div>

      <div className="text-sm font-medium text-muted-foreground mb-6">
        {phase === "idle" && "Нажми и говори"}
        {phase === "listening" && "Слушаю... нажми чтобы остановить"}
        {phase === "result" && "Готово!"}
      </div>

      {/* Кнопки после результата */}
      {(result || error) && (
        <div className="flex gap-3 w-full animate-fade-in">
          <button
            onClick={retry}
            className="flex-1 py-3 rounded-2xl border border-border bg-white text-sm font-medium hover:bg-secondary transition-colors"
          >
            Повторить
          </button>
          <button
            onClick={nextPhrase}
            className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Следующая фраза
          </button>
        </div>
      )}

      {/* Счётчик фраз */}
      <div className="flex gap-1.5 mt-6">
        {PHRASES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === phraseIdx ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}