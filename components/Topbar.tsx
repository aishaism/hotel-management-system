import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  CheckCircle2,
  Calendar,
  ExternalLink,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown
} from "lucide-react";

interface TopbarProps {
  pageTitle: string;
  onToggleMobileSidebar: () => void;
  onSearch?: (query: string) => void;
  onQuickAction?: (action: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  pageTitle,
  onToggleMobileSidebar,
  onQuickAction,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    { id: 1, title: "VIP Arrival Today", text: "Mohammed Al-Rashid arriving at 4:00 PM for Suite 401.", time: "10m ago", unread: true },
    { id: 2, title: "Room Maintenance Alert", text: "Room 301 AC repair scheduled with Suresh Babu.", time: "45m ago", unread: true },
    { id: 3, title: "Check-out Completed", text: "David Chen (Room 204) invoice #INV-2025-004 settled.", time: "2h ago", unread: false },
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left side: mobile toggle & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
            {pageTitle}
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hotel Status: Live & Operational</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 16, 2026 (Day Shift)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, guests, bookings, invoices..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-4 py-2 outline-none transition text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-300">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Quick actions, notifications, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick check-in shortcut */}
        <button
          onClick={() => onQuickAction && onQuickAction("new-reservation")}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
        >
          <span>+ New Booking</span>
        </button>

        {/* Notifications dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${n.unread ? "bg-blue-50/30" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md hover:bg-slate-100 transition text-slate-700"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              VN
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-slate-900 leading-none">Vikram Nair</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Manager</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">Vikram Nair</p>
                <p className="text-[11px] text-slate-500 truncate">vikram.n@velnovax.com</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  Duty Manager • Front Desk
                </span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onQuickAction) onQuickAction("view-profile");
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onQuickAction) onQuickAction("system-logs");
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Audit Log & Security
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert("Sign-out simulated for demo mode.");
                }}
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
