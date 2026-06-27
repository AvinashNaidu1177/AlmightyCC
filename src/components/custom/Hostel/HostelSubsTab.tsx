"use client";

import { Utensils, Shirt, PlaneTakeoff } from "lucide-react";

export default function HostelSubTabs({
 HostelActiveSubTab,
 setHostelActiveSubTab
}) {
 return (
 <div className="flex w-full mb-6 gap-3 px-2">
 <button
 onClick={() => setHostelActiveSubTab("mess")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 HostelActiveSubTab === "mess"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <Utensils className={`w-4 h-4 ${HostelActiveSubTab === "mess" ? "text-purple-400" : "text-gray-500"}`} />
 Mess
 </button>

 <button
 onClick={() => setHostelActiveSubTab("laundry")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 HostelActiveSubTab === "laundry"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <Shirt className={`w-4 h-4 ${HostelActiveSubTab === "laundry" ? "text-purple-400" : "text-gray-500"}`} />
 Laundry
 </button>

 <button
 onClick={() => setHostelActiveSubTab("leave")}
 className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
 HostelActiveSubTab === "leave"
 ? "bg-gradient-to-br from-[#1c0f30]/80 to-black text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-[1.02]"
 : "bg-black text-gray-400 border border-gray-800 hover:border-purple-500/30 hover:text-gray-200 hover:bg-gradient-to-br hover:from-[#1c0f30]/40 hover:to-black"
 }`}
 >
 <PlaneTakeoff className={`w-4 h-4 ${HostelActiveSubTab === "leave" ? "text-purple-400" : "text-gray-500"}`} />
 Leave
 </button>
 </div>
 );
}