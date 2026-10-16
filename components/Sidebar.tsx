import React from "react";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  UserCheck,
  Sparkles,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hotel
} from "lucide-react";

export type NavTab =
  | "overview"
  | "rooms"
  | "reservations"
  | "guests"
  | "checkin-checkout"
  | "housekeeping"
  | "payments"
  | "reports"
  | "staff-settings";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "rooms", label: "Rooms", icon: BedDouble, badge: 15 },
    { id: "reservations", label: "Reservations", icon: CalendarCheck, badge: 12 },
    { id: "guests", label: "Guests", icon: Users },
    { id: "checkin-checkout", label: "Check-in / Check-out", icon: UserCheck, badge: 5 },
    { id: "housekeeping", label: "Housekeeping", icon: Sparkles, badge: 4 },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "staff-settings", label: "Staff & Settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out select-none z-30 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-100 gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-white shrink-0 shadow-sm">
          <Hotel className="w-5 h-5 text-sky-400" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-semibold text-sm tracking-tight text-slate-900 truncate">
              Velnovax Grand
            </h1>
            <p className="text-[11px] text-slate-500 font-medium truncate tracking-wide uppercase">
              Operations Hub
            </p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              />
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`ml-auto text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-slate-200 text-slate-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User / Property Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
            VN
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Vikram Nair
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Front Desk Mgr
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-800 shadow-sm transition hover:scale-105 z-40"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
};
