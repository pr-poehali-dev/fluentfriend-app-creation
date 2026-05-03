import Icon from "@/components/ui/icon";
import { Settings } from "./useStats";

const DAILY_GOALS = [5, 10, 15, 20, 30];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface SettingsTabProps {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200 ${value ? "bg-primary" : "bg-secondary"}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-200 ${value ? "right-1" : "left-1"}`} />
    </button>
  );
}

export default function SettingsTab({ settings, updateSetting }: SettingsTabProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 animate-fade-in">
      <div className="font-display text-2xl italic font-semibold mb-1">Настройки</div>

      {/* Обучение */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Обучение</span>
        </div>

        {/* Цель на день */}
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Target" size={16} className="text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium">Цель на день</span>
            <span className="text-xs text-muted-foreground font-semibold">{settings.dailyGoal} мин</span>
          </div>
          <div className="flex gap-2">
            {DAILY_GOALS.map((g) => (
              <button
                key={g}
                onClick={() => updateSetting("dailyGoal", g)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  settings.dailyGoal === g
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {g}м
              </button>
            ))}
          </div>
        </div>

        {/* Мой уровень */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="GraduationCap" size={16} className="text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium">Мой уровень</span>
            <span className="text-xs text-muted-foreground font-semibold">{settings.level}</span>
          </div>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => updateSetting("level", l)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  settings.level === l
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Исправления */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Исправления</span>
        </div>
        {[
          { key: "autoCorrect" as const, icon: "Lightbulb", label: "Автокоррекция текста" },
          { key: "pronunciationCorrect" as const, icon: "Mic", label: "Коррекция произношения" },
          { key: "explanations" as const, icon: "BookOpenCheck", label: "Объяснения ошибок" },
        ].map((item, i, arr) => (
          <div
            key={item.key}
            className={`flex items-center gap-3 px-5 py-4 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name={item.icon} size={16} className="text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <Toggle value={settings[item.key]} onChange={(v) => updateSetting(item.key, v)} />
          </div>
        ))}
      </div>

      {/* Уведомления */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Уведомления</span>
        </div>
        {[
          { key: "reminders" as const, icon: "Bell", label: "Напоминание о практике" },
          { key: "achievements" as const, icon: "Trophy", label: "Достижения" },
        ].map((item, i, arr) => (
          <div
            key={item.key}
            className={`flex items-center gap-3 px-5 py-4 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name={item.icon} size={16} className="text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <Toggle value={settings[item.key]} onChange={(v) => updateSetting(item.key, v)} />
          </div>
        ))}
      </div>

      {/* Сброс прогресса */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Данные</span>
        </div>
        <button
          onClick={() => {
            if (confirm("Сбросить весь прогресс и статистику?")) {
              localStorage.removeItem("ff_stats");
              localStorage.removeItem("ff_settings");
              localStorage.removeItem("fluentfriend_messages");
              window.location.reload();
            }
          }}
          className="flex items-center gap-3 px-5 py-4 w-full hover:bg-red-50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <Icon name="Trash2" size={16} className="text-red-500" />
          </div>
          <span className="flex-1 text-sm font-medium text-red-500">Сбросить прогресс</span>
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
