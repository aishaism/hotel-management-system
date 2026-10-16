import React, { useState } from "react";
import {
  Users,
  Settings,
  Shield,
  Hotel,
  Clock,
  Phone,
  Mail,
  Plus,
  Save,
  CheckCircle2,
  Building2,
  Sliders,
  BellRing
} from "lucide-react";
import { Staff, staff as initialStaff } from "@/lib/mock-data";

export const StaffSettings: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [activeTab, setActiveTab] = useState<"staff" | "hotel" | "system">("staff");
  const [hotelName, setHotelName] = useState("Velnovax Grand Hotel & Suites");
  const [hotelAddress, setHotelAddress] = useState("102 Marine Drive, Nariman Point, Mumbai, Maharashtra 400021");
  const [hotelPhone, setHotelPhone] = useState("+91 22 6600 8800");
  const [hotelEmail, setHotelEmail] = useState("concierge@velnovaxhotels.com");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [taxRate, setTaxRate] = useState(12);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Staff Directory & Property Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure hotel property policies, manage staff rosters, and configure system preferences.
          </p>
        </div>
        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-xl gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("staff")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "staff"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Roster ({staffList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("hotel")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "hotel"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Property & Check-in Policies</span>
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "system"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Taxes & Integrations</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-5 shadow-2xs">
        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>Active front desk, housekeeping, and management staff</span>
              <button
                onClick={() => alert("New staff creation modal ready for backend integration.")}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Staff Name</th>
                    <th className="py-3 px-4">Role & Dept</th>
                    <th className="py-3 px-4">Current Shift</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                            {s.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-bold text-slate-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900 block">{s.role}</span>
                        <span className="text-[11px] text-slate-500">{s.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {s.shift} Shift
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 block">{s.email}</span>
                        <span className="text-slate-400 text-[11px]">{s.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">
                        {s.joinedDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotel Property Tab */}
        {activeTab === "hotel" && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Hotel Property Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Registered Address</label>
              <input
                type="text"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Front Desk Phone</label>
                <input
                  type="text"
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Reservations Email</label>
                <input
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Standard Check-In Time</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Standard Check-Out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Property Policies</span>
              </button>
            </div>
          </form>
        )}

        {/* System Settings Tab */}
        {activeTab === "system" && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Goods & Services Tax (GST %)</label>
              <input
                type="number"
                min={0}
                max={28}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">Applied automatically to room night charges at checkout.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Upcoming Backend Integration Readiness</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The frontend architecture is modularized with clean interfaces for <code>Room</code>, <code>Reservation</code>, <code>Guest</code>, <code>Payment</code>, and <code>HousekeepingTask</code>. Ready for Firestore / PostgreSQL / Supabase backend hooks without refactoring.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save System Preferences</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
