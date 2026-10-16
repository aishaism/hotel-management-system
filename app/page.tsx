"use client";

import React, { useState } from "react";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { RoomManagement } from "@/components/RoomManagement";
import { ReservationsManagement } from "@/components/ReservationsManagement";
import { GuestManagement } from "@/components/GuestManagement";
import { CheckinCheckout } from "@/components/CheckinCheckout";
import { Housekeeping } from "@/components/Housekeeping";
import { PaymentsBilling } from "@/components/PaymentsBilling";
import { ReportsAnalytics } from "@/components/ReportsAnalytics";
import { StaffSettings } from "@/components/StaffSettings";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openNewBookingModal, setOpenNewBookingModal] = useState(false);

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case "overview":
        return "Executive Overview";
      case "rooms":
        return "Room Inventory & Rates";
      case "reservations":
        return "Reservations & Bookings";
      case "guests":
        return "Guest Directory & Profiles";
      case "checkin-checkout":
        return "Front Desk Check-in / Check-out";
      case "housekeeping":
        return "Housekeeping & Cleanliness Board";
      case "payments":
        return "Payments, Invoices & Billing";
      case "reports":
        return "Reports & Revenue Analytics";
      case "staff-settings":
        return "Staff & Property Settings";
      default:
        return "Dashboard";
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === "new-reservation") {
      setCurrentTab("reservations");
    } else if (action === "view-profile" || action === "system-logs") {
      setCurrentTab("staff-settings");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop & Collapsible Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative z-50 w-64 h-full bg-white flex flex-col shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
              }}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          pageTitle={getPageTitle(currentTab)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onQuickAction={handleQuickAction}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === "overview" && (
            <DashboardOverview
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNewBooking={() => setCurrentTab("reservations")}
            />
          )}

          {currentTab === "rooms" && <RoomManagement />}

          {currentTab === "reservations" && (
            <ReservationsManagement initialOpenCreate={openNewBookingModal} />
          )}

          {currentTab === "guests" && <GuestManagement />}

          {currentTab === "checkin-checkout" && <CheckinCheckout />}

          {currentTab === "housekeeping" && <Housekeeping />}

          {currentTab === "payments" && <PaymentsBilling />}

          {currentTab === "reports" && <ReportsAnalytics />}

          {currentTab === "staff-settings" && <StaffSettings />}
        </main>
      </div>
    </div>
  );
}
