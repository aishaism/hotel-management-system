import React, { useState } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User,
  Edit2,
  X,
  History,
  MapPin,
  FileBadge
} from "lucide-react";
import { Guest, guests as initialGuests, reservations } from "@/lib/mock-data";

export const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [idType, setIdType] = useState("Passport");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredGuests = guests.filter((g) => {
    const term = searchQuery.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(term) ||
      g.lastName.toLowerCase().includes(term) ||
      g.email.toLowerCase().includes(term) ||
      g.phone.includes(term) ||
      g.idNumber.toLowerCase().includes(term)
    );
  });

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNationality("Indian");
    setIdType("Passport");
    setIdNumber("");
    setAddress("");
    setNotes("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFirstName(guest.firstName);
    setLastName(guest.lastName);
    setEmail(guest.email);
    setPhone(guest.phone);
    setNationality(guest.nationality);
    setIdType(guest.idType);
    setIdNumber(guest.idNumber);
    setAddress(guest.address);
    setNotes(guest.notes || "");
    setShowAddModal(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuest) {
      setGuests(
        guests.map((g) =>
          g.id === editingGuest.id
            ? {
                ...g,
                firstName,
                lastName,
                email,
                phone,
                nationality,
                idType,
                idNumber,
                address,
                notes,
              }
            : g
        )
      );
      if (selectedGuest?.id === editingGuest.id) {
        setSelectedGuest({
          ...selectedGuest,
          firstName,
          lastName,
          email,
          phone,
          nationality,
          idType,
          idNumber,
          address,
          notes,
        });
      }
    } else {
      const newGuest: Guest = {
        id: `g_${Date.now()}`,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        idType,
        idNumber,
        address,
        notes,
        totalBookings: 1,
        totalSpent: 0,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setGuests([newGuest, ...guests]);
      setSelectedGuest(newGuest);
    }
    setShowAddModal(false);
  };

  const guestBookings = selectedGuest
    ? reservations.filter((r) => r.guestId === selectedGuest.id || r.guestName.includes(selectedGuest.firstName))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Guest Directory & Profiles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer records, contact preferences, identity verification, and booking history.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Guest</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guests by name, email, phone number, or ID document..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs outline-none text-slate-800 placeholder:text-slate-400 transition"
          />
        </div>
      </div>

      {/* Grid: Guest List & Profile Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Guest Table */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all ${selectedGuest ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Nationality & ID</th>
                  <th className="py-3 px-4">Total Bookings</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No guests match your query.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedGuest?.id === guest.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {guest.firstName[0]}{guest.lastName[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {guest.firstName} {guest.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Member since {guest.joinedDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium block">
                          {guest.email}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {guest.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-medium block">
                          {guest.nationality}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {guest.idType}: {guest.idNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {guest.totalBookings} Stays
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatCurrency(guest.totalSpent)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(guest);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest Profile Drawer */}
        {selectedGuest && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedGuest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedGuest.firstName} {selectedGuest.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedGuest.nationality} • Guest ID: {selectedGuest.id}
                </p>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Total Stays</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedGuest.totalBookings} Bookings</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Lifetime Value</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">{formatCurrency(selectedGuest.totalSpent)}</p>
              </div>
            </div>

            {/* Contact & ID Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedGuest.email}</span>
              </div>
              <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedGuest.phone}</span>
              </div>
              <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 text-slate-700">
                <FileBadge className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedGuest.idType}: {selectedGuest.idNumber}</span>
              </div>
              <div className="flex items-start gap-2 py-1.5 border-b border-slate-100 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{selectedGuest.address}</span>
              </div>
            </div>

            {selectedGuest.notes && (
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                <span className="font-semibold block mb-0.5">Guest Notes / Preferences:</span>
                <p className="text-[11px] leading-relaxed">{selectedGuest.notes}</p>
              </div>
            )}

            {/* Booking History with this guest */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-blue-600" /> Booking History
                </span>
                <span className="text-[11px] text-slate-400">{guestBookings.length} records</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {guestBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No prior reservations recorded.</p>
                ) : (
                  guestBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{b.bookingId}</span>
                        <span className="text-slate-500 block">
                          Room {b.roomNumber} ({b.roomType})
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {b.checkIn} → {b.checkOut}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          {formatCurrency(b.totalAmount)}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-600">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Edit Profile Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(selectedGuest)}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                Edit Guest Information
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingGuest ? "Edit Guest Profile" : "Register New Guest"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Verma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ID Document</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Passport">Passport</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Driving License">Driving License</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ID Number *</label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. P1234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, Country"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Guest Preferences & Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. VIP guest, vegetarian, quiet room requested..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  {editingGuest ? "Update Guest" : "Save Guest Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
