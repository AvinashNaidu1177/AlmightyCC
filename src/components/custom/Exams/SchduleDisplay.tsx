"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NoContentFound from "../NoContentFound";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExamSchedule({ data, handleScheduleFetch }) {
 if (Object.keys(data.Schedule).length === 0) {
 return (
 <div>
 <h1 className="text-xl font-bold mb-4 text-center text-gray-100 ">
 Exam Schedule <button onClick={handleScheduleFetch} className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
 <RefreshCcw className={`w-4 h-4`} />
 </button>
 </h1>
 <NoContentFound />
 </div>
 );
 };

 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const [isIOS, setIsIOS] = useState(false);

 useEffect(() => {
 setIsIOS(
 /iPad|iPhone|iPod/.test(navigator.userAgent) &&
 !window.MSStream
 );
 }, []);


 const parseExamDate = (dateStr) => {
 if (!dateStr) return null;
 const parts = dateStr.split(/[-/]/);
 if (parts.length === 3) {
 let [d, m, y] = parts;
 d = parseInt(d);
 if (isNaN(d)) return null;

 if (isNaN(m)) {
 const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
 const mIndex = monthNames.findIndex((x) => x === m.toLowerCase().slice(0, 3));
 if (mIndex === -1) return null;
 return new Date(y, mIndex, d);
 } else {
 return new Date(y, m - 1, d);
 }
 }
 return new Date(dateStr);
 };

 function computeExamTimes(reportingTimeStr, examDateStr, examType) {
 if (!reportingTimeStr || !examDateStr) return {};

 const [day, monthStr, year] = examDateStr.split(/[-/]/);
 const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
 const month = monthNames.findIndex(m => monthStr.toLowerCase().startsWith(m));

 const [hours, minutes, meridian] = reportingTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
 let h = parseInt(hours);
 let m = parseInt(minutes);
 if (meridian.toUpperCase() === "PM" && h !== 12) h += 12;
 if (meridian.toUpperCase() === "AM" && h === 12) h = 0;

 const start = new Date(year, month, day, h, m);

 const duration =
 examType.toUpperCase().includes("CAT") ? 1 * 60 + 45 :
 examType.toUpperCase().includes("FAT") ? 3 * 60 + 30 :
 0;

 const end = new Date(start.getTime() + duration * 60000);

 const fmt = (d) =>
 d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

 return {
 startUTC: fmt(start),
 endUTC: fmt(end),
 };
 }


 const generateICSFile = (subjects, examType) => {
 const events = subjects
 .filter((s) => s.reportingTime && s.examSession)
 .map((subj) => {
 const { startUTC, endUTC } = computeExamTimes(subj.reportingTime, subj.examDate, examType);
 const uid = crypto.randomUUID();
 const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

 return [
 "BEGIN:VEVENT",
 `SUMMARY:${subj.courseTitle} (${examType})`,
 `DESCRIPTION:${subj.courseCode} — ${subj.reportingTime} @ ${subj.venue == "-" ? "TBA" : subj.venue}`,
 `LOCATION:${subj.venue == "-" ? "TBA" : subj.venue}`,
 `UID:${uid}`,
 `DTSTAMP:${dtstamp}`,
 `DTSTART:${startUTC}`,
 `DTEND:${endUTC}`,
 "END:VEVENT",
 ].join("\n");
 })
 .join("\n\n");

 const ics = [
 "BEGIN:VCALENDAR",
 "VERSION:2.0",
 "PRODID:-//AlmightyCC//Schedule Export//EN",
 events,
 "END:VCALENDAR",
 ].join("\n");


 const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
 return URL.createObjectURL(blob);
 };

 const todayExams = Object.entries(data.Schedule)
 .flatMap(([examType, subjects]) =>
 subjects.filter((subj) => {
 const examDate = parseExamDate(subj.examDate);
 return examDate && examDate.getTime() === today.getTime();
 }).map((subj) => ({ ...subj, examType }))
 );

 const compareExamDates = (left, right) => {
 const leftDate = parseExamDate(left.examDate);
 const rightDate = parseExamDate(right.examDate);

 if (!leftDate && !rightDate) return 0;
 if (!leftDate) return 1;
 if (!rightDate) return -1;

 const dateDiff = leftDate.getTime() - rightDate.getTime();
 if (dateDiff !== 0) return dateDiff;

 return `${left.examTime ?? ""} ${left.courseCode ?? ""}`.localeCompare(
 `${right.examTime ?? ""} ${right.courseCode ?? ""}`
 );
 };

 const sortedTodayExams = [...todayExams].sort(compareExamDates);


 return (
 <div className="space-y-6 p-2">
 <h1 className="text-xl font-bold mb-4 text-center text-gray-100 ">
 Exam Schedule <button onClick={handleScheduleFetch} className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
 <RefreshCcw className={`w-4 h-4`} />
 </button>
 </h1>

 {sortedTodayExams.length > 0 && (
 <div className="bg-purple-100 dark:bg-purple-700/40 midnight:bg-purple-800/40 
 rounded-xl p-4 shadow mb-6 border border-purple-300 
 dark:border-purple-600 -purple-700">

 <div className="space-y-6">
 {sortedTodayExams.map((exam, i) => (
 <div
 key={i}
 className="grid grid-cols-2 lg:grid-cols-3 gap-4
 bg-[#111827]/40 dark:bg-black/20 /20
 p-4 rounded-lg border border-purple-200 
 dark:border-purple-600/40 -purple-700/40"
 >
 <div>
 <p className="font-semibold">Course:</p>
 <p>{exam.courseCode} — {exam.courseTitle}</p>
 </div>

 <div>
 <p className="font-semibold">Exam Time:</p>
 <p>{exam.examTime}</p>
 </div>

 <div>
 <p className="font-semibold">Session:</p>
 <p>{exam.examSession}</p>
 </div>

 <div>
 <p className="font-semibold">Reporting Time:</p>
 <p>{exam.reportingTime}</p>
 </div>

 <div>
 <p className="font-semibold">Venue:</p>
 <p>{exam.venue}</p>
 </div>

 <div>
 <p className="font-semibold">Seat:</p>
 <p>{exam.seatLocation === "-" && exam.seatNo && exam.seatNo !== "-"
 ? calculateSeatLocation(exam.seatNo, exam.courseTitle)
 : exam.seatLocation}, #{exam.seatNo}</p>
 </div>

 </div>
 ))}
 </div>
 </div>
 )}

 {Object.entries(data.Schedule).map(([examType, subjects]) => {
 const sortedSubjects = [...subjects].sort(compareExamDates);
 const hasCalendarData = sortedSubjects.some((s) => s.examSession && s.reportingTime);
 const icsUrl = hasCalendarData ? generateICSFile(sortedSubjects, examType) : null;

 return (
 <div
 key={examType}
 className="bg-slate-800 shadow rounded-2xl p-4 "
 >
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 midnight:text-white">
 {examType}
 </h2>

 {hasCalendarData && isIOS && (
 <div className="flex gap-2">
 <a
 href={icsUrl}
 download={`${examType}_Schedule_iOS.ics`}
 className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-medium"
 >
 Add to Calendar
 </a>
 </div>
 )}
 </div>

 <div data-scrollable className="overflow-x-auto">
 <Table className="bg-transparent">
 <TableHeader>
 <TableRow>
 <TableHead className="">Course Code</TableHead>
 <TableHead className="">Course Title</TableHead>
 <TableHead className="">Exam Time</TableHead>
 <TableHead className="">Venue</TableHead>
 <TableHead className="">Seat Location</TableHead>
 <TableHead className="">Slot</TableHead>
 <TableHead className="">Exam Date</TableHead>
 <TableHead className="">Session</TableHead>
 <TableHead className="">Reporting Time</TableHead>
 <TableHead className="">Seat No</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {sortedSubjects.map((subj, idx) => {
 const examDate = parseExamDate(subj.examDate);
 const isPast = examDate && examDate < today;
 const isToday =
 examDate && examDate.getTime() === today.getTime();

 let rowClass =
 "odd:bg-slate-100 even:bg-slate-200 dark:odd:bg-slate-700 dark:even:bg-slate-800 midnight:odd:bg-gray-900 midnight:even:bg-gray-800";

 if (isPast)
 rowClass +=
 " opacity-40 line-through hover:opacity-50 cursor-not-allowed";
 else if (isToday)
 rowClass +=
 " !bg-purple-100 dark:!bg-purple-600/40 midnight:!bg-purple-700/50 !text-purple-900 dark:!text-purple-200";

 return (
 <TableRow key={idx} className={rowClass}>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.courseCode}
 </TableCell>
 <TableCell className="text-slate-900 dark:text-slate-200 ">
 {subj.courseTitle}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.examTime}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.venue}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.seatLocation === "-" && subj.seatNo && subj.seatNo !== "-"
 ? calculateSeatLocation(subj.seatNo, subj.courseTitle)
 : subj.seatLocation}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.slot}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.examDate}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.examSession}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.reportingTime}
 </TableCell>
 <TableCell className="text-center text-slate-900 dark:text-slate-200 ">
 {subj.seatNo}
 </TableCell>
 </TableRow>
 );
 })}
 </TableBody>
 </Table>
 </div>
 </div>
 );
 })}
 </div>
 );
}

function calculateSeatLocation(seatNo: string, courseTitle: string): string {
 const n = Number(seatNo);
 if (isNaN(n) || n <= 0) return "-";
 if (courseTitle.startsWith("Qualitative") || courseTitle.startsWith("Quantitative") || courseTitle.startsWith("French") || courseTitle.startsWith("German") || courseTitle.startsWith("Spanish") || courseTitle.startsWith("Japanese")) {
 return "-";
 }

 const groupIndex = Math.floor((n - 1) / 18);
 const C1 = groupIndex * 2 + 1;
 const C2 = C1 + 1;

 const pos = (n - 1) % 18;
 const row = Math.floor(pos / 2) + 1;

 const col = (pos % 2 === 0) ? C1 : C2;

 return `R${row}C${col}`;
}