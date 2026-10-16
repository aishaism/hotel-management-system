import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  Building,
  RefreshCw,
  Plus,
  X
} from "lucide-react";
import {
  HousekeepingTask,
  HousekeepingStatus,
  Priority,
  housekeepingTasks as initialTasks,
  rooms,
  staff
} from "@/lib/mock-data";

export const Housekeeping: React.FC = () => {
  const [tasks, setTasks] = useState<HousekeepingTask[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [selectedTask, setSelectedTask] = useState<HousekeepingTask | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Form states
  const [formRoomNumber, setFormRoomNumber] = useState("101");
  const [formStatus, setFormStatus] = useState<HousekeepingStatus>("Dirty");
  const [formStaff, setFormStaff] = useState("Meena Devi");
  const [formPriority, setFormPriority] = useState<Priority>("Medium");
  const [formNotes, setFormNotes] = useState("");

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: HousekeepingStatus) => {
    switch (status) {
      case "Clean":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Ready":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Dirty":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      case "Medium":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Low":
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: HousekeepingStatus) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            }
          : t
      )
    );
    if (selectedTask?.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const r = rooms.find((room) => room.roomNumber === formRoomNumber);
    const newTask: HousekeepingTask = {
      id: `hk_${Date.now()}`,
      roomId: r ? r.id : "r1",
      roomNumber: formRoomNumber,
      floor: r ? r.floor : 1,
      status: formStatus,
      assignedStaff: formStaff,
      priority: formPriority,
      lastUpdated: new Date().toISOString(),
      notes: formNotes || undefined,
    };
    setTasks([newTask, ...tasks]);
    setShowNewTaskModal(false);
  };

  const counts = {
    dirty: tasks.filter((t) => t.status === "Dirty").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    ready: tasks.filter((t) => t.status === "Ready").length,
    clean: tasks.filter((t) => t.status === "Clean").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Housekeeping & Cleanliness Board
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track room sanitation, dispatch cleaning staff, and inspect rooms before guest arrivals.
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign Cleaning Task</span>
        </button>
      </div>

      {/* KPI Cards for Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setStatusFilter("Dirty")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Dirty / Turnover</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{counts.dirty}</p>
          <span className="text-[11px] text-rose-600 font-medium">Pending cleaning</span>
        </div>

        <div
          onClick={() => setStatusFilter("In Progress")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">In Progress</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{counts.inProgress}</p>
          <span className="text-[11px] text-amber-600 font-medium">Staff currently inside</span>
        </div>

        <div
          onClick={() => setStatusFilter("Ready")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Ready / Inspected</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{counts.ready}</p>
          <span className="text-[11px] text-blue-600 font-medium">Verified by supervisor</span>
        </div>

        <div
          onClick={() => setStatusFilter("Clean")}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition cursor-pointer shadow-2xs"
        >
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-600">Clean & Stocked</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{counts.clean}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Available for booking</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter Status:</span>
          <div className="flex flex-wrap gap-1.5">
            {["All", "Dirty", "In Progress", "Ready", "Clean"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List Table & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tasks Table */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all ${selectedTask ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Room #</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Assigned Housekeeper</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Quick Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No housekeeping tasks match the active filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedTask?.id === t.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Room {t.roomNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        Floor {t.floor}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {t.assignedStaff}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(t.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value as HousekeepingStatus)}
                          className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-700 font-medium"
                        >
                          <option value="Dirty">Dirty</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Ready">Ready</option>
                          <option value="Clean">Clean</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Details Panel */}
        {selectedTask && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 relative animate-in fade-in duration-150 text-xs">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Task Details
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Room {selectedTask.roomNumber} Sanitation
              </h3>
              <p className="text-[11px] text-slate-500">Floor {selectedTask.floor}</p>
            </div>

            <div className="space-y-2 py-2 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                    selectedTask.status
                  )}`}
                >
                  {selectedTask.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Staff:</span>
                <span className="font-semibold text-slate-900">{selectedTask.assignedStaff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority Level:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated:</span>
                <span className="text-slate-700">{new Date(selectedTask.lastUpdated).toLocaleString()}</span>
              </div>
            </div>

            {selectedTask.notes ? (
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900">
                <span className="font-semibold block mb-0.5">Maintenance / Cleaning Instructions:</span>
                <p className="text-[11px] leading-relaxed">{selectedTask.notes}</p>
              </div>
            ) : (
              <p className="text-slate-400 italic">No special instructions recorded for this room.</p>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Update Status
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(["Dirty", "In Progress", "Ready", "Clean"] as HousekeepingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedTask.id, st)}
                    className={`py-1.5 px-2 rounded-md font-semibold text-[11px] border transition ${
                      selectedTask.status === st
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Assign Cleaning / Inspection Task
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Room # *</label>
                  <select
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as HousekeepingStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Dirty">Dirty</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Clean">Clean</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assign Staff</label>
                  <select
                    value={formStaff}
                    onChange={(e) => setFormStaff(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Meena Devi">Meena Devi (Senior)</option>
                    <option value="Rajan Kumar">Rajan Kumar</option>
                    <option value="Sunita Rao">Sunita Rao</option>
                    <option value="Pradeep Singh">Pradeep Singh (Supervisor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Task Notes / Maintenance Alerts</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. VIP arrival at 2pm, replace bed linens and restock mini bar..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
