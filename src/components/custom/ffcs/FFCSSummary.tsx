import React from "react";
import { Course, recalcConflicts } from "./FFCSTimetableGrid";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function FFCSSummary({ courses }: { courses: Course[] }) {
 if (!courses.length) {
 return (
 <div className="flex flex-col items-center justify-center p-12 border border-gray-800 rounded-lg">
 <p className="text-gray-500 font-mono text-sm">NO_COURSES_FOUND</p>
 </div>
 );
 }

 const calculatedCourses = recalcConflicts(courses);
 const totalCr = calculatedCourses.reduce((s, c) => s + (c.credits || 0), 0);
 const nConflict = calculatedCourses.filter((c) => c.hasConflict).length;
 const nLabs = calculatedCourses.filter((c) => c.slots.some((s) => s.startsWith("L"))).length;

 return (
 <div className="space-y-6">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
 <div className="text-3xl font-bold text-purple-400 font-mono">{courses.length}</div>
 <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Courses</div>
 </div>
 <div className={`p-4 rounded-lg border text-center ${totalCr > 30 ? "bg-red-900/20 border-red-800" : totalCr > 25 ? "bg-orange-900/20 border-orange-800" : "border-gray-800 bg-gray-900"}`}>
 <div className={`text-3xl font-bold font-mono ${totalCr > 30 ? "text-red-400" : totalCr > 25 ? "text-orange-400" : "text-purple-400"}`}>{totalCr}</div>
 <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Credits</div>
 </div>
 <div className={`p-4 rounded-lg border text-center ${nConflict > 0 ? "bg-red-900/20 border-red-800" : "border-gray-800 bg-gray-900"}`}>
 <div className={`text-3xl font-bold font-mono ${nConflict > 0 ? "text-red-400" : "text-purple-400"}`}>{nConflict}</div>
 <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Conflicts</div>
 </div>
 <div className="p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
 <div className="text-3xl font-bold text-pink-400 font-mono">{nLabs}</div>
 <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Labs</div>
 </div>
 </div>

 <div className="overflow-x-auto rounded-lg border border-gray-800">
 <table className="w-full text-sm text-left">
 <thead className="bg-gray-900 text-purple-400 font-mono text-xs uppercase">
 <tr>
 <th className="px-4 py-3 border-b dark:border-gray-800">#</th>
 <th className="px-4 py-3 border-b dark:border-gray-800">Code</th>
 <th className="px-4 py-3 border-b dark:border-gray-800">Name</th>
 <th className="px-4 py-3 border-b dark:border-gray-800">Faculty</th>
 <th className="px-4 py-3 border-b dark:border-gray-800">Room</th>
 <th className="px-4 py-3 border-b dark:border-gray-800">Slots</th>
 <th className="px-4 py-3 border-b dark:border-gray-800 text-right">Cr</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-800 bg-[#111827]">
 {calculatedCourses.map((c, i) => (
 <tr key={c.id} className={c.hasConflict ? "bg-red-900/10 border-l-4 border-l-red-500" : "hover:bg-gray-800/50"}>
 <td className="px-4 py-3 font-mono text-gray-500">{i + 1}</td>
 <td className="px-4 py-3 font-bold font-mono text-purple-400">{c.code}</td>
 <td className="px-4 py-3">{c.name || "—"}</td>
 <td className="px-4 py-3 text-gray-400">{c.faculty || "—"}</td>
 <td className="px-4 py-3 text-gray-400">{c.room || "—"}</td>
 <td className="px-4 py-3">
 <span className={`px-2 py-1 rounded-full text-xs font-mono border ${c.hasConflict ? "bg-red-900/30 text-red-400 border-red-800" : "bg-purple-900/30 text-purple-400 border-purple-800"}`}>
 {c.slots.join("+")}
 </span>
 </td>
 <td className="px-4 py-3 text-right font-bold font-mono">{c.credits || "—"}</td>
 </tr>
 ))}
 </tbody>
 <tfoot className="bg-gray-900 font-bold border-t-2 border-gray-800">
 <tr>
 <td colSpan={6} className="px-4 py-3 text-right text-xs font-mono text-gray-500">TOTAL CREDITS</td>
 <td className={`px-4 py-3 text-right font-mono ${totalCr > 30 ? "text-red-400" : "text-purple-400"}`}>{totalCr}</td>
 </tr>
 </tfoot>
 </table>
 </div>

 <div className="space-y-2">
 {totalCr > 30 && (
 <div className="flex items-center gap-3 p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-700 dark:text-red-400 text-sm">
 <ShieldAlert className="w-5 h-5 flex-shrink-0" />
 <div><strong>CREDIT OVERLOAD:</strong> {totalCr} credits exceeds the 30-credit cap. Drop a course.</div>
 </div>
 )}
 {totalCr > 25 && totalCr <= 30 && (
 <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-900/20 border border-orange-800 text-orange-700 dark:text-orange-400 text-sm">
 <AlertCircle className="w-5 h-5 flex-shrink-0" />
 <div><strong>WARNING:</strong> High credit load — {totalCr}/30 credits.</div>
 </div>
 )}
 {nConflict > 0 && (
 <div className="flex items-center gap-3 p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-700 dark:text-red-400 text-sm">
 <ShieldAlert className="w-5 h-5 flex-shrink-0" />
 <div><strong>{nConflict} CONFLICT{nConflict > 1 ? "S" : ""} DETECTED:</strong> Red rows = duplicate slots or Theory/Lab time clash. Check Timetable tab for markers.</div>
 </div>
 )}
 {nConflict === 0 && totalCr <= 30 && courses.length > 0 && (
 <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-sm">
 <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
 <div><strong>STATUS OK:</strong> No conflicts. Credits within limit. Your timetable is ready.</div>
 </div>
 )}
 </div>
 </div>
 );
}
