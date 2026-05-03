import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Stats, Settings } from "./useStats";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const LEVEL_XP: Record<string, { next: string; max: number }> = {
  A1: { next: "A2", max: 300 },
  A2: { next: "B1", max: 600 },
  B1: { next: "B2", max: 1000 },
  B2: { next: "C1", max: 1500 },
  C1: { next: "C2", max: 2000 },
  C2: { next: "C2", max: 2000 },
};

const ALL_ACHIEVEMENTS = [
  { icon: "🔥", name: "На огне", desc: "7 дней подряд", check: (s: Stats) => s.streak >= 7 },
  { icon: "🗣️", name: "Говорун", desc: "50 практик", check: (s: Stats) => s.minutesPracticed >= 50 },
  { icon: "📚", name: "Читатель", desc: "100 слов изучено", check: (s: Stats) => s.wordsLearned >= 100 },
  { icon: "⚡", name: "Первый шаг", desc: "Начал практику", check: (s: Stats) => s.xp > 0 },
  { icon: "🎯", name: "Точность", desc: "10 исправлений", check: (s: Stats) => s.corrections >= 10 },
];

interface ProfileTabProps {
  stats: Stats;
  settings: Settings;
}

export default function ProfileTab({ stats, settings }: ProfileTabProps) {
  const levelInfo = LEVEL_XP[settings.level] || LEVEL_XP["B1"];
  const xpProgress = Math.min(100, Math.round((stats.xp / levelInfo.max) * 100));
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const statCards = [
    { label: "Дней подряд", value: String(stats.streak), icon: "Flame", color: "text-orange-500" },
    { label: "Слов изучено", value: String(stats.wordsLearned), icon: "BookOpen", color: "text-blue-500" },
    { label: "Практик", value: String(stats.minutesPracticed), icon: "MessageCircle", color: "text-green-500" },
    { label: "Исправлений", value: String(stats.corrections), icon: "CheckCircle", color: "text-purple-500" },
  ];

  const unlockedAchievements = ALL_ACHIEVEMENTS.filter((a) => a.check(stats));
  const lockedAchievements = ALL_ACHIEVEMENTS.filter((a) => !a.check(stats));

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 animate-fade-in">
      {/* Профиль */}
      <div className="bg-white rounded-3xl border border-border p-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary/10 text-2xl">👤</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-bold text-lg">Мой профиль</div>
            <div className="text-sm text-muted-foreground">Уровень {settings.level}</div>
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full ${i <= Math.min(4, Math.ceil(xpProgress / 25)) ? "bg-primary" : "bg-secondary"}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">до {levelInfo.next}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s, i) => (
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

      {/* Активность */}
      <div className="bg-white rounded-3xl border border-border p-5">
        <div className="font-semibold mb-4">Активность на неделе</div>
        <div className="flex items-end justify-between gap-1 h-20">
          {DAYS.map((day, i) => {
            const h = stats.weekActivity[i] || 0;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${i === todayIdx ? "bg-primary" : "bg-primary/20"}`}
                  style={{ height: `${Math.max(h, 4)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
        {stats.weekActivity.every((v) => v === 0) && (
          <p className="text-xs text-muted-foreground text-center mt-3">Начни практику — здесь появится твоя активность</p>
        )}
      </div>

      {/* Достижения */}
      <div className="bg-white rounded-3xl border border-border p-5">
        <div className="font-semibold mb-4">Достижения</div>
        <div className="space-y-3">
          {unlockedAchievements.map((a) => (
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
          {lockedAchievements.map((a) => (
            <div key={a.name} className="flex items-center gap-3 opacity-40">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-xl grayscale">
                {a.icon}
              </div>
              <div>
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
              <div className="ml-auto">
                <Icon name="Lock" size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP */}
      <div className="bg-white rounded-3xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">До уровня {levelInfo.next}</span>
          <span className="text-sm text-primary font-semibold">{stats.xp} / {levelInfo.max} XP</span>
        </div>
        <Progress value={xpProgress} className="h-2.5" />
        <p className="text-xs text-muted-foreground mt-2">Ещё {Math.max(0, levelInfo.max - stats.xp)} XP до уровня {levelInfo.next}</p>
      </div>
    </div>
  );
}