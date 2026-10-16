import React, { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  Plus,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  Receipt
} from "lucide-react";
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  payments as initialPayments,
  reservations
} from "@/lib/mock-data";

export const PaymentsBilling: React.FC = () => {
  const [paymentsList, setPaymentsList] = useState<Payment[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  // Record payment form
  const [formBookingId, setFormBookingId] = useState("VNX-2025-005");
  const [formGuestName, setFormGuestName] = useState("Rahul Gupta");
  const [formAmount, setFormAmount] = useState(16500);
  const [formMethod, setFormMethod] = useState<PaymentMethod>("Credit Card");
  const [formStatus, setFormStatus] = useState<PaymentStatus>("Paid");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // KPI calculations
  const totalRevenue = paymentsList.reduce((acc, curr) => acc + curr.amount, 0);
  const paidTotal = paymentsList.filter((p) => p.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const partialTotal = paymentsList.filter((p) => p.status === "Partial").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTotal = reservations.filter((r) => r.paymentStatus === "Pending").reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filteredPayments = paymentsList.filter((p) => {
    const matchesSearch =
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Partial":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Refunded":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      bookingId: formBookingId,
      reservationId: `res_${Date.now()}`,
      guestName: formGuestName,
      amount: Number(formAmount),
      method: formMethod,
      date: new Date().toISOString().split("T")[0],
      status: formStatus,
      invoiceNumber: `INV-2025-0${paymentsList.length + 15}`,
    };
    setPaymentsList([newPayment, ...paymentsList]);
    setShowRecordPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Payments, Invoices & Billing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track transactions, record payment receipts, and preview tax invoices.
          </p>
        </div>
        <button
          onClick={() => setShowRecordPaymentModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary KPI Cards: Total, Paid, Partial, Pending */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Total Billed</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
          <span className="text-[11px] text-slate-400">Recorded transactions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Settled (Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(paidTotal)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Fully collected</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Partial Deposits</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(partialTotal)}</p>
          <span className="text-[11px] text-amber-600 font-medium">Balance due on checkout</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Pending Receivables</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(pendingTotal)}</p>
          <span className="text-[11px] text-slate-400">Uncollected reservations</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number, booking ID, or guest name..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 outline-none text-slate-800 placeholder:text-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table & Invoice Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Payments Table */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all ${selectedInvoice ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedInvoice(p)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedInvoice?.id === p.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {p.bookingId}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {p.guestName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.method}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {p.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(p);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Preview Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Preview Drawer */}
        {selectedInvoice && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 relative animate-in fade-in duration-150 text-xs">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Invoice Header */}
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Velnovax Grand Hotel
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Tax Invoice: {selectedInvoice.invoiceNumber}
              </h3>
              <p className="text-[11px] text-slate-500">
                GSTIN: 27AABCV1234F1Z8 • Date: {selectedInvoice.date}
              </p>
            </div>

            {/* Bill To */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Billed To
              </span>
              <p className="font-bold text-slate-900 text-sm">{selectedInvoice.guestName}</p>
              <p className="text-slate-500 text-[11px]">Booking Reference: {selectedInvoice.bookingId}</p>
              <p className="text-slate-500 text-[11px]">Payment Mode: {selectedInvoice.method}</p>
            </div>

            {/* Charges Breakdown */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(Math.round(selectedInvoice.amount * 0.893))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST 6%):</span>
                <span className="font-medium text-slate-900">{formatCurrency(Math.round(selectedInvoice.amount * 0.0535))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST 6%):</span>
                <span className="font-medium text-slate-900">{formatCurrency(Math.round(selectedInvoice.amount * 0.0535))}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount Paid:</span>
                <span>{formatCurrency(selectedInvoice.amount)}</span>
              </div>
            </div>

            {selectedInvoice.description && (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded">
                Note: {selectedInvoice.description}
              </p>
            )}

            {/* Print action */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Record Payment Transaction
              </h3>
              <button
                onClick={() => setShowRecordPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Booking ID *</label>
                <select
                  value={formBookingId}
                  onChange={(e) => {
                    setFormBookingId(e.target.value);
                    const b = reservations.find((r) => r.bookingId === e.target.value);
                    if (b) {
                      setFormGuestName(b.guestName);
                      setFormAmount(b.totalAmount - b.paidAmount || b.totalAmount);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  {reservations.map((r) => (
                    <option key={r.id} value={r.bookingId}>
                      {r.bookingId} — {r.guestName} (Room {r.roomNumber}, {formatCurrency(r.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={formGuestName}
                  onChange={(e) => setFormGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Payment Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Settlement Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="Paid">Paid (Full Settlement)</option>
                  <option value="Partial">Partial (Advance Deposit)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecordPaymentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Save & Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
