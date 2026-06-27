"use client";

import { CalendarDays, ClipboardCheck } from "lucide-react";

export default function AttendanceSubTabs({ activeSubTab, setActiveAttendanceSubTab }) {
  const isAttendance = activeSubTab === "attendance";
  const isCalendar = activeSubTab === "calendar";

  return (
  <div className="flex gap-4 w-full mb-6 mt-4 px-4">
  <button
  onClick={() => setActiveAttendanceSubTab("attendance")}
  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-[15px] font-semibold transition-all duration-300 ease-out border hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
  ${isAttendance
  ? "bg-gradient-to-br from-purple-900/40 to-black border-purple-500 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.2),0_0_20px_rgba(168,85,247,0.2)]"
  : "bg-gradient-to-br from-[#1c0f30]/40 to-black border-purple-500/20 text-gray-400 hover:text-purple-300 hover:border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
  }`}
  >
  <ClipboardCheck className={`w-5 h-5 ${isAttendance ? "text-purple-400" : "text-gray-500"}`} />
  Attendance
  </button>

  <button
  onClick={() => setActiveAttendanceSubTab("calendar")}
  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-[15px] font-semibold transition-all duration-300 ease-out border hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
  ${isCalendar
  ? "bg-gradient-to-br from-purple-900/40 to-black border-purple-500 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.2),0_0_20px_rgba(168,85,247,0.2)]"
  : "bg-gradient-to-br from-[#1c0f30]/40 to-black border-purple-500/20 text-gray-400 hover:text-purple-300 hover:border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
  }`}
  >
  <CalendarDays className={`w-5 h-5 ${isCalendar ? "text-purple-400" : "text-gray-500"}`} />
  Calendar
  </button>
  </div>
  );
}
