import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  BedDouble,
  Check,
  AlertCircle,
  Sparkles,
  Wrench,
  Users,
  Building
} from "lucide-react";
import { Room, RoomStatus, RoomType, rooms as initialRooms } from "@/lib/mock-data";

export const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // New/Edit Room Form State
  const [formRoomNumber, setFormRoomNumber] = useState("");
  const [formType, setFormType] = useState<RoomType>("Standard");
  const [formFloor, setFormFloor] = useState<number>(1);
  const [formCapacity, setFormCapacity] = useState<number>(2);
  const [formRate, setFormRate] = useState<number>(3500);
  const [formStatus, setFormStatus] = useState<RoomStatus>("Available");
  const [formDesc, setFormDesc] = useState("");
  const [formAmenities, setFormAmenities] = useState<string>("WiFi, TV, AC");

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormRoomNumber("");
    setFormType("Standard");
    setFormFloor(1);
    setFormCapacity(2);
    setFormRate(3500);
    setFormStatus("Available");
    setFormDesc("");
    setFormAmenities("WiFi, TV, AC");
    setShowAddModal(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormRoomNumber(room.roomNumber);
    setFormType(room.type);
    setFormFloor(room.floor);
    setFormCapacity(room.capacity);
    setFormRate(room.ratePerNight);
    setFormStatus(room.status);
    setFormDesc(room.description);
    setFormAmenities(room.amenities.join(", "));
    setShowAddModal(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm("Are you sure you want to remove this room from inventory?")) {
      setRooms(rooms.filter((r) => r.id !== id));
      if (selectedRoom?.id === id) {
        setSelectedRoom(null);
      }
    }
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArr = formAmenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingRoom) {
      // Update
      setRooms(
        rooms.map((r) =>
          r.id === editingRoom.id
            ? {
                ...r,
                roomNumber: formRoomNumber,
                type: formType,
                floor: Number(formFloor),
                capacity: Number(formCapacity),
                ratePerNight: Number(formRate),
                status: formStatus,
                description: formDesc,
                amenities: amenitiesArr,
              }
            : r
        )
      );
      if (selectedRoom?.id === editingRoom.id) {
        setSelectedRoom({
          ...selectedRoom,
          roomNumber: formRoomNumber,
          type: formType,
          floor: Number(formFloor),
          capacity: Number(formCapacity),
          ratePerNight: Number(formRate),
          status: formStatus,
          description: formDesc,
          amenities: amenitiesArr,
        });
      }
    } else {
      // Create
      const newRoom: Room = {
        id: `r_${Date.now()}`,
        roomNumber: formRoomNumber,
        type: formType,
        floor: Number(formFloor),
        capacity: Number(formCapacity),
        ratePerNight: Number(formRate),
        status: formStatus,
        description: formDesc || `${formType} room on floor ${formFloor}`,
        amenities: amenitiesArr,
      };
      setRooms([...rooms, newRoom]);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Room Inventory & Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure rooms, rates, maintenance flags, and monitor live room occupancy.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room #, type, description..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 outline-none text-slate-800 placeholder:text-slate-400 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Executive">Executive</option>
              <option value="Presidential">Presidential</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Rooms Table */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all ${selectedRoom ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Room #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Rate / Night</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No rooms found matching the current search & filters.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedRoom?.id === room.id ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {room.roomNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {room.type}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        Floor {room.floor}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {room.capacity} Guests
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatCurrency(room.ratePerNight)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                            room.status
                          )}`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                            title="Edit room"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                            title="Delete room"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Showing {filteredRooms.length} of {rooms.length} total rooms</span>
            <span>Tip: Click any row to view full room details and management actions</span>
          </div>
        </div>

        {/* Room Details Drawer Panel */}
        {selectedRoom && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Room Inspector
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Room {selectedRoom.roomNumber}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedRoom.type}
                </span>
              </div>
            </div>

            {/* Room Image Placeholder Card */}
            <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 flex flex-col justify-end p-3 text-white shadow-xs relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium">
                Floor {selectedRoom.floor} • Capacity: {selectedRoom.capacity} Guests
              </div>
              <div className="flex items-center justify-between z-10">
                <span className="text-lg font-bold">
                  {formatCurrency(selectedRoom.ratePerNight)}
                  <span className="text-xs font-normal text-slate-300"> / night</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold border ${getStatusBadge(
                    selectedRoom.status
                  )} bg-white`}
                >
                  {selectedRoom.status}
                </span>
              </div>
            </div>

            {/* Room Description */}
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">Description</p>
              <p>{selectedRoom.description}</p>
            </div>

            {/* Amenities */}
            <div className="text-xs">
              <p className="font-semibold text-slate-900 mb-1.5">Amenities Included</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Maintenance Warning if applicable */}
            {selectedRoom.maintenanceNote && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Maintenance Active:</span>
                  <p className="text-[11px] mt-0.5">{selectedRoom.maintenanceNote}</p>
                </div>
              </div>
            )}

            {/* Quick Status Update Buttons */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Quick Status Transition
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(["Available", "Occupied", "Cleaning", "Maintenance"] as RoomStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const updated = { ...selectedRoom, status };
                        setRooms(rooms.map((r) => (r.id === selectedRoom.id ? updated : r)));
                        setSelectedRoom(updated);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition ${
                        selectedRoom.status === status
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Set {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Edit / Close Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleOpenEdit(selectedRoom)}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                Edit Details
              </button>
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : "Add New Room"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    placeholder="e.g. 107"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Room Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RoomType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Floor *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Rate / Night (₹) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={100}
                    required
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Initial Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as RoomStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formAmenities}
                  onChange={(e) => setFormAmenities(e.target.value)}
                  placeholder="WiFi, TV, AC, Mini Bar, Balcony"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Room features, view, and specific highlights..."
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
                  {editingRoom ? "Save Changes" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
