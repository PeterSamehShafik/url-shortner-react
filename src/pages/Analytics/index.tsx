import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MousePointerClick,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import MainLayout from "@/layouts/MainLayout";
import { useAnalytics } from "@/hooks/useAnalytics";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-zinc-400" />
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
      <span className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function SimpleBar({
  data,
  labelKey,
  valueKey,
}: {
  data: { [key: string]: any }[];
  labelKey: string;
  valueKey: string;
}) {
  if (!data.length)
    return <p className="text-xs text-zinc-400 py-4">No data yet</p>;
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 w-24 truncate shrink-0">
            {row[labelKey] ?? "Direct"}
          </span>
          <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(row[valueKey] / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-zinc-400 w-8 text-right tabular-nums">
            {row[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useAnalytics(id!);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-sm text-zinc-400">Failed to load analytics.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4"
          >
            <ArrowLeft size={12} />
            Back to dashboard
          </button>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">{data.slug}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          <StatCard
            label="Total clicks"
            value={data.totalClicks}
            icon={MousePointerClick}
          />
          <StatCard
            label="Unique visitors"
            value={data.uniqueVisitors}
            icon={Users}
          />
          <StatCard
            label="Last 7 days"
            value={data.clicksLast7Days}
            icon={Calendar}
          />
          <StatCard
            label="Last 30 days"
            value={data.clicksLast30Days}
            icon={TrendingUp}
          />
        </div>

        {/* Clicks by day */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mb-4">
          <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
            Clicks over time
          </h2>
          {data.clicksByDay.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={data.clicksByDay} barSize={8}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-zinc-400"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-zinc-400"
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-zinc-900)",
                    border: "1px solid var(--color-zinc-800)",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                />
                <Bar dataKey="count" radius={0}>
                  {data.clicksByDay.map((_, i) => (
                    <Cell key={i} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
              Referrers
            </h2>
            <SimpleBar
              data={data.topReferers}
              labelKey="referer"
              valueKey="count"
            />
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
              Devices
            </h2>
            <SimpleBar data={data.devices} labelKey="device" valueKey="count" />
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">
              Browsers
            </h2>
            <SimpleBar
              data={data.browsers}
              labelKey="browser"
              valueKey="count"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
