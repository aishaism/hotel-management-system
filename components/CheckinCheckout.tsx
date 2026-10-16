import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  FileText,
  AlertCircle,
  Receipt,
  X,
  Printer
} from "lucide-react";
import {
  Reservation,
  reservations as initialReservations,
  rooms,
  guests
} from "@/lib/mock-data";

export const CheckinCheckout: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [activeTab, setActiveTab] = useState<"arrivals" | "inhouse" | "departures">("arrivals");
  const [selectedForCheckin, setSelectedForCheckin] = useState<Reservation | null>(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState<Reservation | null>(null);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Upcoming arrivals (status == 'Confirmed' or checkIn today)
  const upcomingArrivals = reservations.filter(
    (r) => r.status === "Confirmed" || (r.checkIn === "2026-10-16" && r.status !== "Checked In" && r.status !== "Checked Out")
  );

  // In-house guests currently staying
  const inHouseGuests = reservations.filter((r) => r.status === "Checked In");

  // Expected departures today
  const expectedDepartures = reservations.filter(
    (r) => r.status === "Checked In" || r.checkOut === "2026-10-16"
  );

  // Perform Check-in
  const handleConfirmCheckin = () => {
    if (!selectedForCheckin) return;
    setReservations(
      reservations.map((r) =>
        r.id === selectedForCheckin.id
          ? { ...r, status: "Checked In", updatedAt: "2026-10-16" }
          : r
      )
    );
    setSelectedForCheckin(null);
    alert(`Guest ${selectedForCheckin.guestName} successfully checked into Room ${selectedForCheckin.roomNumber}. Keycard issued.`);
  };

  // Perform Check-out with billing calculation
  const handleConfirmCheckout = () => {
    if (!selectedForCheckout) return;
    setReservations(
      reservations.map((r) =>
        r.id === selectedForCheckout.id
          ? { ...r, status: "Checked Out", paymentStatus: "Paid", paidAmount: r.totalAmount }
          : r
      )
    );
    setShowCheckoutSuccess(true);
  };

  // Calculate billing breakdown for checkout
  const getCheckoutBill = (res: Reservation) => {
    const roomCharges = res.totalAmount;
    const taxes = Math.round(roomCharges * 0.12); // 12% GST
    const discount = 0;
    const grandTotal = roomCharges + taxes - discount;
    const balanceDue = grandTotal - res.paidAmount;

    return {
      roomCharges,
      taxes,
      discount,
      grandTotal,
      balanceDue: balanceDue > 0 ? balanceDue : 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Front Desk Check-in & Check-out
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Expedite guest arrivals, manage active room occupancies, and generate billing checkout statements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium border border-slate-200">
            Live Front Desk Operations
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 rounded-t-xl gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("arrivals")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "arrivals"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Expected Arrivals ({upcomingArrivals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("inhouse")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "inhouse"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>In-House Guests ({inHouseGuests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("departures")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "departures"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Expected Departures ({expectedDepartures.length})</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs p-5">
        {/* Arrivals Tab */}
        {activeTab === "arrivals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>Guests arriving today or with confirmed upcoming reservations</span>
              <span>Sorted by arrival date</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingArrivals.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{res.bookingId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {res.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{res.guestName}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Room {res.roomNumber} • {res.roomType} (Floor {res.roomNumber[0]})
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Stay Duration:</span>
                      <span className="font-medium">{res.checkIn} → {res.checkOut} ({res.nights}n)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Guests:</span>
                      <span className="font-medium">{res.adults} Adults {res.children > 0 ? `, ${res.children} Child` : ""}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Amount:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(res.totalAmount)}</span>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <p className="text-[11px] text-blue-800 bg-blue-50 p-2 rounded border border-blue-100">
                      Note: {res.specialRequests}
                    </p>
                  )}

                  <button
                    onClick={() => setSelectedForCheckin(res)}
                    className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Proceed to Check-in</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In-House Tab */}
        {activeTab === "inhouse" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>Guests currently staying on the property</span>
              <span>{inHouseGuests.length} active rooms occupied</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inHouseGuests.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{res.bookingId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active In-House
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{res.guestName}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Room {res.roomNumber} • {res.roomType}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Checked in:</span>
                      <span className="font-medium text-emerald-700">{res.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Departure date:</span>
                      <span className="font-medium">{res.checkOut}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Status:</span>
                      <span className="font-semibold text-blue-600">{res.paymentStatus} ({formatCurrency(res.paidAmount)})</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedForCheckout(res)}
                      className="flex-1 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition"
                    >
                      Checkout Bill
                    </button>
                    <button
                      onClick={() => alert(`Room service request dispatched to Room ${res.roomNumber}`)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                    >
                      Room Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departures Tab */}
        {activeTab === "departures" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>Rooms due for departure and checkout settlement</span>
              <span>Generate final invoices and trigger housekeeping</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expectedDepartures.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{res.bookingId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${res.status === "Checked Out" ? "bg-slate-100 text-slate-600 border-slate-300" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {res.status === "Checked Out" ? "Checked Out" : "Departing Today"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{res.guestName}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Room {res.roomNumber} ({res.roomType})
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Billed:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(res.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payment:</span>
                      <span className={`font-semibold ${res.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                        {res.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {res.status !== "Checked Out" ? (
                    <button
                      onClick={() => setSelectedForCheckout(res)}
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Process Check-out & Bill</span>
                    </button>
                  ) : (
                    <div className="p-2 text-center text-slate-400 font-medium bg-slate-100 rounded-lg">
                      Checkout Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Check-in Confirmation Dialog */}
      {selectedForCheckin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Guest Check-in
              </h3>
              <button
                onClick={() => setSelectedForCheckin(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-900">
              <p className="font-semibold text-sm">{selectedForCheckin.guestName}</p>
              <p className="text-[11px] mt-0.5">Booking ID: {selectedForCheckin.bookingId}</p>
            </div>

            <div className="space-y-2 py-2 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Room:</span>
                <span className="font-bold text-slate-900">Room {selectedForCheckin.roomNumber} ({selectedForCheckin.roomType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Check-out:</span>
                <span className="font-semibold text-slate-800">{selectedForCheckin.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Key Card:</span>
                <span className="font-semibold text-emerald-600">Card #KC-{selectedForCheckin.roomNumber} Programmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Government ID Verified:</span>
                <span className="font-semibold text-slate-900">Yes (Verified at Desk)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedForCheckin(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckin}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                Confirm & Issue Keycard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-out Summary & Billing Invoice Dialog */}
      {selectedForCheckout && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Guest Checkout & Invoice Settlement
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Folio statement for {selectedForCheckout.guestName} • Room {selectedForCheckout.roomNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedForCheckout(null);
                  setShowCheckoutSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showCheckoutSuccess ? (
              <>
                {/* Invoice Breakdown */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Room Charges ({selectedForCheckout.nights} nights @ {formatCurrency(selectedForCheckout.ratePerNight)})</span>
                    <span>{formatCurrency(getCheckoutBill(selectedForCheckout).roomCharges)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Goods & Services Tax (GST 12%)</span>
                    <span>{formatCurrency(getCheckoutBill(selectedForCheckout).taxes)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Complimentary / Discount</span>
                    <span>- {formatCurrency(getCheckoutBill(selectedForCheckout).discount)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Grand Total Billed</span>
                    <span>{formatCurrency(getCheckoutBill(selectedForCheckout).grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                    <span>Deposit / Paid in advance</span>
                    <span>{formatCurrency(selectedForCheckout.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-700 text-sm pt-1 border-t border-slate-200">
                    <span>Net Balance Due at Desk</span>
                    <span>{formatCurrency(getCheckoutBill(selectedForCheckout).balanceDue)}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
                  <span>Action Notice:</span> Once checkout is confirmed, Room {selectedForCheckout.roomNumber} will automatically transition to <strong>Cleaning</strong> in the Housekeeping taskboard.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedForCheckout(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCheckout}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirm Settlement & Check Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Check-out Completed Successfully!
                  </h4>
                  <p className="text-slate-500 text-xs mt-1">
                    Invoice INV-2025-0{Math.floor(Math.random() * 900 + 100)} generated. Room {selectedForCheckout.roomNumber} notified to Housekeeping.
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedForCheckout(null);
                      setShowCheckoutSuccess(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
