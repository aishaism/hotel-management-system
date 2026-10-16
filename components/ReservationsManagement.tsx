import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  CreditCard,
  FileText,
  ChevronRight
} from "lucide-react";
import {
  Reservation,
  ReservationStatus,
  reservations as initialReservations,
  rooms,
  guests
} from "@/lib/mock-data";

interface ReservationsManagementProps {
  initialOpenCreate?: boolean;
}

export const ReservationsManagement: React.FC<ReservationsManagementProps> = ({
  initialOpenCreate = false,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(initialOpenCreate);

  // Form State
  const [guestId, setGuestId] = useState(guests[0].id);
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [checkInDate, setCheckInDate] = useState("2026-10-17");
  const [checkOutDate, setCheckOutDate] = useState("2026-10-20");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Checked In":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Checked Out":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "No Show":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesDate = !dateFilter || r.checkIn === dateFilter || r.checkOut === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate pricing & validate date conflict
  const selectedRoomObj = rooms.find((r) => r.id === roomId);
  const calculateNights = () => {
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };
  const nights = calculateNights();
  const estimatedTotal = (selectedRoomObj ? selectedRoomObj.ratePerNight : 3500) * nights;

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation 1: Check-in before Check-out
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setValidationError("Check-out date must be strictly after the check-in date.");
      return;
    }

    // Validation 2: Date conflict check with existing active reservations for same room
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (!targetRoom) return;

    const conflict = reservations.some((res) => {
      if (res.roomId !== roomId) return false;
      if (res.status === "Cancelled" || res.status === "Checked Out") return false;

      const existingStart = new Date(res.checkIn).getTime();
      const existingEnd = new Date(res.checkOut).getTime();
      const newStart = new Date(checkInDate).getTime();
      const newEnd = new Date(checkOutDate).getTime();

      // Overlap condition
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflict) {
      setValidationError(
        `Conflict detected: Room ${targetRoom.roomNumber} is already booked or occupied for the selected date range. Please select another room or alternate dates.`
      );
      return;
    }

    const selectedGuest = guests.find((g) => g.id === guestId);

    const newBooking: Reservation = {
      id: `res_${Date.now()}`,
      bookingId: `VNX-2025-0${reservations.length + 13}`,
      guestId,
      guestName: selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : "Walk-in Guest",
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      roomType: targetRoom.type,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      adults,
      children,
      ratePerNight: targetRoom.ratePerNight,
      totalAmount: estimatedTotal,
      paidAmount: 0,
      status: "Confirmed",
      paymentStatus: "Pending",
      specialRequests: specialRequests || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setReservations([newBooking, ...reservations]);
    setShowCreateModal(false);
    setSelectedBooking(newBooking);
  };

  const handleUpdateStatus = (bookingId: string, newStatus: ReservationStatus) => {
    setReservations(
      reservations.map((r) => (r.id === bookingId ? { ...r, status: newStatus } : r))
    );
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Reservations & Bookings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage guest reservations, verify availability conflicts, and record room stays.
          </p>
        </div>
        <button
          onClick={() => {
            setValidationError(null);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, guest name, or room #..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 outline-none text-slate-800 placeholder:text-slate-400 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-blue-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Reservations Table & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all ${selectedBooking ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No reservations match your search or date criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => (
                    <tr
                      key={res.id}
                      onClick={() => setSelectedBooking(res)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedBooking?.id === res.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {res.bookingId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">
                          {res.guestName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {res.adults} Adults {res.children > 0 ? `• ${res.children} Child` : ""}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900">
                          Room {res.roomNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {res.roomType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium">
                          {res.checkIn} → {res.checkOut}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {res.nights} {res.nights === 1 ? "night" : "nights"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">
                          {formatCurrency(res.totalAmount)}
                        </span>
                        <span className={`text-[10px] font-medium ${res.paymentStatus === "Paid" ? "text-emerald-600" : res.paymentStatus === "Partial" ? "text-amber-600" : "text-rose-600"}`}>
                          {res.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                            res.status
                          )}`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(res);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-medium transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reservation Details Drawer */}
        {selectedBooking && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Booking Details
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedBooking.bookingId}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Booked on {selectedBooking.createdAt}
              </p>
            </div>

            {/* Status card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Booking Status:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedBooking.status}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                  selectedBooking.status
                )}`}
              >
                {selectedBooking.status}
              </span>
            </div>

            {/* Guest & Room summary */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Guest Name</span>
                <span className="font-semibold text-slate-900">{selectedBooking.guestName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Allocated Room</span>
                <span className="font-semibold text-slate-900">
                  Room {selectedBooking.roomNumber} ({selectedBooking.roomType})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Stay Duration</span>
                <span className="font-medium text-slate-900">
                  {selectedBooking.checkIn} to {selectedBooking.checkOut} ({selectedBooking.nights} nights)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Occupants</span>
                <span className="font-medium text-slate-900">
                  {selectedBooking.adults} Adults, {selectedBooking.children} Children
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nightly Rate</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(selectedBooking.ratePerNight)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Billed</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-semibold text-blue-600">
                  {selectedBooking.paymentStatus} ({formatCurrency(selectedBooking.paidAmount)} paid)
                </span>
              </div>
            </div>

            {selectedBooking.specialRequests && (
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-blue-900 text-xs">
                <span className="font-semibold block mb-0.5">Special Requests:</span>
                <p className="text-[11px]">{selectedBooking.specialRequests}</p>
              </div>
            )}

            {/* Quick Actions: Confirm / Cancel / Check-In */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Manage Booking Status
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Confirmed")}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Set Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Checked In")}
                  className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                >
                  Check In Guest
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Checked Out")}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Check Out
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel this reservation?")) {
                      handleUpdateStatus(selectedBooking.id, "Cancelled");
                    }
                  }}
                  className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium transition"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Reservation Modal with Date Conflict Detection */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create New Reservation
                </h3>
                <p className="text-xs text-slate-500">
                  Book a room with automated conflict & validation checking
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Booking Error:</span>
                  <p className="mt-0.5 leading-relaxed">{validationError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateReservation} className="space-y-3.5 text-xs">
              {/* Guest Selector */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Select Guest *
                </label>
                <select
                  value={guestId}
                  onChange={(e) => setGuestId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.firstName} {g.lastName} ({g.phone} • {g.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Selector */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Select Room *
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNumber} — {r.type} (Floor {r.floor}, {r.capacity} Guests) — {formatCurrency(r.ratePerNight)}/night [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Early check-in, extra bed, airport transfer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Pricing Preview Box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px] block">
                    Estimated Charges ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Taxes (12% GST) included at checkout</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Confirm & Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
