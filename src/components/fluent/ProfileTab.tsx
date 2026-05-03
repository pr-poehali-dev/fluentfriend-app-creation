import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { STATS, ACHIEVEMENTS } from "./types";

export default function ProfileTab() {
  return (
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
  );
}
