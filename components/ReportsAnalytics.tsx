import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  BedDouble,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import {
  monthlyRevenueData,
  weeklyRevenueData,
  roomTypeData,
  bookingStatusData,
  dashboardStats
} from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const ReportsAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData =
    timeframe === "monthly"
      ? monthlyRevenueData
      : weeklyRevenueData.map((d) => ({ month: d.day, revenue: d.revenue, occupancy: d.occupancy }));

  const handleExport = (format: "csv" | "pdf") => {
    setExportNotice(`Exporting ${timeframe} executive operations report as .${format.toUpperCase()}...`);
    setTimeout(() => {
      setExportNotice(`Report downloaded successfully: Velnovax_Hotel_Report_${timeframe}_${new Date().toISOString().split("T")[0]}.${format}`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Executive Reports & Revenue Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Financial performance, RevPAR metrics, room type yield, and occupancy distributions.
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setTimeframe("daily")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                timeframe === "daily" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                timeframe === "weekly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                timeframe === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export notification demo interaction */}
      {exportNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="font-semibold text-blue-700">Dismiss</button>
        </div>
      )}

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Total Bookings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Total Reservations</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">48 Bookings</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">+8.4% vs prior period</span>
        </div>

        {/* Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Total Revenue ({timeframe})</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {timeframe === "monthly" ? "₹38,90,000" : formatCurrency(dashboardStats.weekRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">+14.2% yield growth</span>
        </div>

        {/* Average Room Rate (ADR) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Avg Daily Rate (ADR)</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(dashboardStats.avgDailyRate)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">RevPAR: {formatCurrency(dashboardStats.revPAR)}</span>
        </div>

        {/* Average Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Average Occupancy</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {dashboardStats.occupancyRate}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Target benchmark: 70%</span>
        </div>
      </div>

      {/* Charts Row 1: Revenue Trends & Occupancy Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Revenue Trajectory ({timeframe.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-500">Gross accommodation revenue across operational cycles</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${val / 1000}k`}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Occupancy Rate (%)
              </h3>
              <p className="text-xs text-slate-500">Percentage of inventory filled over the period</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Occupancy Rate"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="occupancy" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Room-Type Performance & Booking Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room-type Performance Table & Metrics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Room-Type Category Performance
            </h3>
            <p className="text-xs text-slate-500">
              Inventory share, average rate, occupancy, and yield by room class
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Rooms</th>
                  <th className="py-3 px-4">Avg Rate</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomTypeData.map((rt) => (
                  <tr key={rt.name} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {rt.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {rt.value} Units
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {formatCurrency(rt.avgRate)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{rt.occupancy}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${rt.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(rt.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Reservation Status Share
            </h3>
            <p className="text-xs text-slate-500">Distribution across active booking stages</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {bookingStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-slate-900">{item.value} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
