"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Clock } from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useState, useEffect } from "react"

export default function CourseCard({ a, onClick, activeDay, isHoliday, decimalValues }) {
 const [ongoing, setOngoing] = useState(false);
 const lab = a.slotName.split('')[0] === "L";

 const isOngoing = () => {
 if (!a.time || !activeDay) return false;

 const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
 if (!today.startsWith(activeDay.slice(0, 3).toUpperCase())) return false;

 const [startStr, endStr] = a.time.split("-").map(t => t.trim());
 if (!startStr || !endStr) return false;

 const parseTime = (str) => {
 const [hour, minute] = str.split(":").map(Number);
 const d = new Date();
 let h = hour;
 let m = minute || 0;
 if (h < 8) h += 12;
 d.setHours(h, m, 0, 0);
 return d;
 };

 const start = parseTime(startStr);
 const end = parseTime(endStr);
 const now = new Date();

 return now >= start && now <= end;
 };

 useEffect(() => {
 setOngoing(isOngoing());
 }, [a.time, activeDay]);

 return (
  <Card
  onClick={onClick}
  className={`relative overflow-hidden p-5 rounded-2xl cursor-pointer h-full flex flex-col justify-between transition-all duration-300 ease-out
  ${(ongoing && !isHoliday)
  ? "bg-gradient-to-br from-[#1c0f30]/80 to-black border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(234,179,8,0.25)] hover:border-yellow-400/60"
  : "bg-gradient-to-br from-[#1c0f30]/80 to-black border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-purple-500/50"
  }`}
  >
  <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-purple-500/10 blur-[50px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
  <div className="flex justify-between items-center relative z-10">
  <div className="flex flex-col gap-2 flex-grow">
  <CardHeader className="p-0">
  <CardTitle className="text-[15px] font-semibold text-white tracking-wide">
  {a.courseTitle}
  </CardTitle>
  <p className="text-[13px] text-gray-400 mt-1">
  {a.slotName}
  </p>
  </CardHeader>

  <CardContent className="p-0 text-[13px] text-gray-400 space-y-2 mt-2">
  <div className="flex items-center gap-2">
  <Building2 size={14} className="text-purple-400" />
  <span>{a.slotVenue}</span>
  </div>
  <div className="flex items-center gap-2">
  <Clock size={14} className="text-purple-400" />
  <span>{a.time}</span>
  </div>
  <p>
  Faculty: <span className="text-gray-300">{a.faculty}</span>
  </p>
  <p>
  Classes Attended:{" "}
  <span className="text-gray-300">
  {a.attendedClasses}/{a.totalClasses}
  </span>
  </p>
 </CardContent>
 {a.totalClasses > 0 && (() => {
 const attended = a.attendedClasses;
 const total = a.totalClasses;
 const percentage = (attended / total) * 100;

 if (percentage < 75) {
 const needed = Math.ceil((0.75 * total - attended) / (1 - 0.75));
 const neededValue = lab ? Math.ceil(needed / 2) : needed;

 return (
 <p className="text-red-500 dark:text-red-400 midnight:text-red-400 text-sm">
 Need to attend <strong>{neededValue}</strong> more {lab ? "lab" : "class"}
 {neededValue > 1 && (lab ? "s" : "es")} to reach 75%.
 </p>
 );
 } else {
 const canMiss = Math.floor(attended / 0.75 - total);
 const canMissValue = lab ? Math.floor(canMiss / 2) : canMiss;

 if (canMissValue === 0) {
 return (
 <p className="text-yellow-500 dark:text-yellow-400 midnight:text-yellow-400 text-sm">
 You are on the edge! Attend the next {lab ? "lab" : "class"}.
 </p>
 );
 } else {
 return (
 <p className="text-purple-500 dark:text-purple-400 midnight:text-purple-400 text-sm">
 Can miss <strong>{canMissValue}</strong> {lab ? "lab" : "class"}
 {canMissValue !== 1 && (lab ? "s" : "es")} and stay above 75%.
 </p>
 );
 }
 }
 })()}
  </div>

  <div className="w-[100px] h-[100px] flex-shrink-0 flex flex-col items-center justify-center ml-4 relative z-10">
  <CircularProgressbar
  value={a.attendancePercentage}
  text={`${!decimalValues ? a.attendancePercentage : (a.attendedClasses/a.totalClasses * 100).toFixed(1)}%`}
  styles={buildStyles({
  pathColor:
  a.attendancePercentage < 75
  ? "#EF4444"
  : a.attendancePercentage < 85
  ? "#FACC15"
  : "#A855F7",
  textColor: "#ffffff",
  trailColor: "rgba(255,255,255,0.08)",
  strokeLinecap: "round",
  pathTransitionDuration: 0.5,
  textSize: "24px"
  })}
  />
  <p className="text-center text-[11px] font-medium mt-3 text-gray-400 tracking-wide uppercase">
  Attendance
  </p>
  </div>
  </div>
  </Card>
 );
}
