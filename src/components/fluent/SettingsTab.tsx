import Icon from "@/components/ui/icon";

const SETTINGS_GROUPS = [
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
];

export default function SettingsTab() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 animate-fade-in">
      <div className="font-display text-2xl italic font-semibold mb-1">Настройки</div>

      {SETTINGS_GROUPS.map((group) => (
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
  );
}
