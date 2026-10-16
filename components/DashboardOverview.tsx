import React from "react";
import {
  BedDouble,
  CheckCircle,
  KeyRound,
  Wrench,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronRight,
  PlusCircle,
  CheckIn,
  Users
} from "lucide-react";
import {
  dashboardStats,
  rooms,
  reservations,
  activityLog,
  weeklyRevenueData,
  bookingStatusData,
  RoomStatus
} from "@/lib/mock-data";
import {
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

interface DashboardProps {
  onNavigate: (tab: any) => void;
  onOpenNewBooking: () => void;
  onSelectReservation?: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewBooking,
  onSelectReservation,
}) => {
  // Format Indian Rupee currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Occupied":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Reserved":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cleaning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Maintenance":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const todayArrivals = reservations.filter(
    (r) => r.checkIn === "2026-10-16" || r.status === "Checked In"
  ).slice(0, 4);

  const todayDepartures = reservations.filter(
    (r) => r.checkOut === "2026-10-16" || r.status === "Checked Out"
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hotel Operations Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of rooms, guests, bookings, and revenue for Velnovax Grand Hotel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewBooking}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Reservation</span>
          </button>
          <button
            onClick={() => onNavigate("checkin-checkout")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Check-in Desk</span>
          </button>
          <button
            onClick={() => onNavigate("housekeeping")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Housekeeping</span>
          </button>
        </div>
      </div>

      {/* Primary Summary Metrics Grid (7 KPI cards as specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Rooms */}
        <div
          onClick={() => onNavigate("rooms")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Rooms</span>
            <BedDouble className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dashboardStats.totalRooms}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Across 4 floors</span>
          </div>
        </div>

        {/* Available Rooms */}
        <div
          onClick={() => onNavigate("rooms")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Available</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {dashboardStats.availableRooms}
          </div>
          <div className="text-[11px] text-emerald-600/90 mt-1 font-medium">
            Ready for check-in
          </div>
        </div>

        {/* Occupied Rooms */}
        <div
          onClick={() => onNavigate("rooms")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Occupied</span>
            <KeyRound className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dashboardStats.occupiedRooms}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {dashboardStats.occupancyRate}% occupancy
          </div>
        </div>

        {/* Under Maintenance */}
        <div
          onClick={() => onNavigate("rooms")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Maintenance</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {dashboardStats.maintenanceRooms}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">
            Rooms 301, 106
          </div>
        </div>

        {/* Today's Arrivals */}
        <div
          onClick={() => onNavigate("checkin-checkout")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Arrivals</span>
            <ArrowDownLeft className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dashboardStats.todayArrivals}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Expected today
          </div>
        </div>

        {/* Today's Departures */}
        <div
          onClick={() => onNavigate("checkin-checkout")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Departures</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dashboardStats.todayDepartures}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            2 processed
          </div>
        </div>

        {/* Revenue (Weekly / Current) */}
        <div
          onClick={() => onNavigate("payments")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition cursor-pointer shadow-2xs col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Revenue (Wk)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {formatCurrency(dashboardStats.weekRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs last week</span>
          </div>
        </div>
      </div>

      {/* Analytics Row: Weekly Revenue Chart & Room Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Occupancy Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Weekly Revenue & Occupancy Trend
              </h3>
              <p className="text-xs text-slate-500">
                Daily earnings (INR) and room occupancy percentages this week
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                <span>Revenue (₹)</span>
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
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
                  itemStyle={{ color: "#38bdf8" }}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Status Distribution Pie */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Room Status Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Live breakdown of all {dashboardStats.totalRooms} inventory units
            </p>
          </div>

          <div className="h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Available", value: dashboardStats.availableRooms, color: "#10b981" },
                    { name: "Occupied", value: dashboardStats.occupiedRooms, color: "#f43f5e" },
                    { name: "Reserved", value: dashboardStats.reservedRooms, color: "#3b82f6" },
                    { name: "Cleaning", value: dashboardStats.cleaningRooms, color: "#f59e0b" },
                    { name: "Maintenance", value: dashboardStats.maintenanceRooms, color: "#64748b" },
                  ]}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#64748b" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Available: <strong>{dashboardStats.availableRooms}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Occupied: <strong>{dashboardStats.occupiedRooms}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Reserved: <strong>{dashboardStats.reservedRooms}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Cleaning: <strong>{dashboardStats.cleaningRooms}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Sections: Arrivals/Departures & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (Arrivals & Departures) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Today's Front Desk Movements
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled check-ins and check-outs for October 16, 2026
              </p>
            </div>
            <button
              onClick={() => onNavigate("checkin-checkout")}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>Manage Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arrivals column */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b border-slate-100 mb-2">
                <span className="flex items-center gap-1 text-blue-600">
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Expected Arrivals ({todayArrivals.length})
                </span>
              </div>
              <div className="space-y-2">
                {todayArrivals.map((arr) => (
                  <div
                    key={arr.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{arr.guestName}</p>
                      <p className="text-[11px] text-slate-500">
                        Room {arr.roomNumber} • {arr.roomType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${arr.status === "Checked In" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                        {arr.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatCurrency(arr.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departures column */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b border-slate-100 mb-2">
                <span className="flex items-center gap-1 text-slate-600">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Expected Departures ({todayDepartures.length})
                </span>
              </div>
              <div className="space-y-2">
                {todayDepartures.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{dep.guestName}</p>
                      <p className="text-[11px] text-slate-500">
                        Room {dep.roomNumber} • {dep.roomType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${dep.status === "Checked Out" ? "bg-slate-100 text-slate-700 border-slate-300" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {dep.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Paid: {dep.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Log */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Live Operations Feed
            </h3>
            <p className="text-xs text-slate-500">
              Latest system events and staff updates
            </p>
          </div>

          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {activityLog.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 leading-snug">
                    {log.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{log.user}</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate("staff-settings")}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
