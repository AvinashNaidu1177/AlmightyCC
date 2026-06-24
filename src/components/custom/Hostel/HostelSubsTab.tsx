"use client";

export default function HostelSubTabs({
 HostelActiveSubTab,
 setHostelActiveSubTab
}) {
 return (
 <div className="flex w-full mb-4">
 <button
 onClick={() => setHostelActiveSubTab("mess")}
 className={`flex-1 py-2 text-sm font-medium transition-colors ${HostelActiveSubTab === "mess"
 ? "bg-purple-600 text-white"
 : "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 midnight:hover:bg-gray-900"
 }`}
 >
 Mess
 </button>

 <button
 onClick={() => setHostelActiveSubTab("laundry")}
 className={`flex-1 py-2 text-sm font-medium transition-colors ${HostelActiveSubTab === "laundry"
 ? "bg-purple-600 text-white"
 : "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 midnight:hover:bg-gray-900"
 }`}
 >
 Laundry
 </button>
 <button
 onClick={() => setHostelActiveSubTab("leave")}
 className={`flex-1 py-2 text-sm font-medium transition-colors ${HostelActiveSubTab === "leave"
 ? "bg-purple-600 text-white"
 : "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 midnight:hover:bg-gray-900"
 }`}
 >
 Leave
 </button>
 </div>
 );
}