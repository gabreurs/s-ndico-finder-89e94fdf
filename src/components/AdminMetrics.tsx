import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface Stats {
  total: number;
  approved: number;
  pending: number;
  thisMonth: number;
  byMonth: { month: string; count: number }[];
}

export function AdminMetrics() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("sindicos").select("status, created_at");
      if (!data) return;

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const byMonthMap = new Map<string, number>();
      // Init last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        byMonthMap.set(key, 0);
      }

      data.forEach((s) => {
        const d = new Date(s.created_at);
        const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (monthsAgo >= 0 && monthsAgo < 6) {
          const key = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
          byMonthMap.set(key, (byMonthMap.get(key) || 0) + 1);
        }
      });

      setStats({
        total: data.length,
        approved: data.filter((s) => s.status === "approved").length,
        pending: data.filter((s) => s.status === "pending").length,
        thisMonth: data.filter((s) => new Date(s.created_at) >= thisMonthStart).length,
        byMonth: Array.from(byMonthMap.entries()).map(([month, count]) => ({ month, count })),
      });
    })();
  }, []);

  if (!stats) return null;

  const cards = [
    { icon: <UserCheck size={16} />, label: "Aprovados (ativos)", value: stats.approved, color: "text-green-500" },
    { icon: <Clock size={16} />, label: "Pendentes", value: stats.pending, color: "text-yellow-500" },
    { icon: <TrendingUp size={16} />, label: "Cadastros este mês", value: stats.thisMonth, color: "text-primary" },
    { icon: <Users size={16} />, label: "Total", value: stats.total, color: "text-foreground" },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-xl border border-border/20 p-4">
            <div className={`${c.color} mb-2`}>{c.icon}</div>
            <p className="text-2xl text-foreground" style={{ fontWeight: 350 }}>{c.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1" style={{ fontWeight: 420 }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border/20 p-4">
        <p className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 450 }}>Cadastros nos últimos 6 meses</p>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
