"use client";

import { GraduationCap, CalendarClock, Award } from "lucide-react";

export default function ExamsSubTabs({ activeSubTab, setActiveSubTab }) {
 return (
 <div className="flex w-full mb-6 gap-3 px-2">
 <button
 onClick={() => setActiveSubTab("marks")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 activeSubTab === "marks"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <GraduationCap className={`w-4 h-4 ${activeSubTab === "marks" ? "text-purple-400" : "text-gray-500"}`} />
 Marks
 </button>

 <button
 onClick={() => setActiveSubTab("schedule")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 activeSubTab === "schedule"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <CalendarClock className={`w-4 h-4 ${activeSubTab === "schedule" ? "text-purple-400" : "text-gray-500"}`} />
 Schedule
 </button>

 <button
 onClick={() => setActiveSubTab("grades")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 activeSubTab === "grades"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <Award className={`w-4 h-4 ${activeSubTab === "grades" ? "text-purple-400" : "text-gray-500"}`} />
 Grades
 </button>
 </div>
 );
}
