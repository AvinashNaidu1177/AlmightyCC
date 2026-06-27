"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCcw } from "lucide-react";
import NoContentFound from "../NoContentFound";
import CGPAPredictor from "./CGPAPredictor";

export default function AllGradesDisplay({ data, handleAllGradesFetch, CGPA, attendance }) {
 if (!data || !data.grades) {
 return (
 <div>
 <h1 className="text-xl font-bold mb-4 text-center text-gray-100 ">
 Academic Grades <button onClick={handleAllGradesFetch} className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
 <RefreshCcw className={`w-4 h-4`} />
 </button>
 </h1>
 <NoContentFound />
 </div>
 );
 }

 const semesterKeys = Object.keys(data.grades).filter((sem) => data.grades[sem]);
 if (semesterKeys.length === 0) {
 return (
 <div>
 <h1 className="text-xl font-bold mb-4 text-center text-gray-100 ">
 Academic Grades <button onClick={handleAllGradesFetch} className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
 <RefreshCcw className={`w-4 h-4`} />
 </button>
 </h1>
 <NoContentFound />
 </div>
 );
 }

 const [activeSem, setActiveSem] = useState(semesterKeys[semesterKeys.length - 1]);
 const [openCourse, setOpenCourse] = useState(null);

 const semesterData = data.grades[activeSem];
 const gpa = semesterData?.gpa || null;
 const gradeList = semesterData?.grades || [];

 const formatNumber = (num) => {
 const numericValue = Number(num);
 if (num == null || isNaN(numericValue)) return "-";
 return Number(numericValue.toFixed(2)).toString();
 };

 return (
 <div className="py-2">
 <h1 className="text-xl font-bold mb-4 text-center text-gray-100 ">
 Academic Grades <button onClick={handleAllGradesFetch} className="mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
 <RefreshCcw className={`w-4 h-4`} />
 </button>
 </h1>

 <div
 data-scrollable
 className="flex w-full overflow-x-auto mb-4"
 >
 {semesterKeys.map((sem) => (
 <button
 key={sem}
 onClick={() => {
 setActiveSem(sem);
 setOpenCourse(null);
 }}
 className={`flex-1 min-w-[160px] text-center py-2 text-sm font-medium transition-colors ${activeSem === sem
 ? "bg-purple-600 text-white midnight:bg-purple-700"
 : "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-black/40 border-purple-500/20 dark:text-gray-300 dark:hover:bg-slate-600 midnight:hover:bg-gray-900"
 }`}
 >
 {sem.endsWith("1") ? `FALLSEM` : `WINTERSEM`} {sem.slice(4, -4)}-{sem.slice(6, -2)}
 </button>
 ))}
 <button
 onClick={() => {
 setActiveSem("predict");
 setOpenCourse(null);
 }}
 className={`flex-1 min-w-[160px] text-center py-2 text-sm font-medium transition-colors ${activeSem === "predict"
 ? "bg-purple-600 text-white midnight:bg-purple-700"
 : "bg-[#111111] text-gray-400 hover:bg-gray-800 dark:bg-black/40 border-purple-500/20 dark:text-gray-300 dark:hover:bg-slate-600 midnight:hover:bg-gray-900"
 }`}
 >
 Predict CGPA
 </button>
 </div>

 {gpa && (
 <div className="mt-4 text-center">
 <span className="text-lg font-semibold text-purple-700 dark:text-purple-400">
 GPA: {gpa}
 </span>
 </div>
 )}

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-2">
 {activeSem !== "predict" && gradeList.map((course, idx) => (
 <div
 key={course.courseId || course.courseCode || idx}
 className="p-4 rounded-lg shadow bg-gradient-to-br from-[#1c0f30]/80 to-black border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:-translate-y-[2px] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md cursor-pointer"
 onClick={() => setOpenCourse(course.courseId)}
 >
 <div className="flex justify-between items-start gap-3">
 <div className="flex-1 min-w-0">
 <span className="font-medium text-gray-300 dark:text-gray-200 text-sm sm:text-base break-words block">
 {course.courseCode} - {course.courseTitle}
 </span>

 <div className="px-3 py-1 inline-flex items-center justify-center bg-[#111111] dark:bg-black/40 border-purple-500/20 midnight:bg-gray-900 text-white dark:text-gray-300 text-xs rounded-full outline outline-1 outline-gray-700 dark:outline-gray-500 midnight:outline-gray-700 mt-2">
 {course.courseType}
 </div>
 </div>

 <div className="flex flex-col items-end flex-shrink-0 gap-2 text-sm text-right">
 <div className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium whitespace-nowrap">
 Grade: {course.grade}
 </div>
 <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium whitespace-nowrap">
 Total: {course.grandTotal}
 </div>
 </div>
 </div>

 {openCourse === course.courseId && (
 <div
 data-scrollable
 className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
 >
 <div
 className="bg-gradient-to-br from-[#1c0f30]/80 to-black border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:-translate-y-[2px] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md rounded-xl shadow-lg p-6 max-w-3xl w-[95%] relative max-h-[90vh] overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <h2 className="text-lg font-semibold mb-4 text-gray-100 ">
 {course.courseCode} – {course.courseTitle}
 </h2>
 <p className="mb-1">
 <strong>Course Type:</strong> {course.courseType}
 </p>
 <p className="mb-3">
 <strong>Grade:</strong> {course.grade}
 </p>

 {course.range && (
 <div className="overflow-x-auto mt-2">
 <table className="w-full border border-purple-500/20 ">
 <thead className="bg-gray-800 text-white dark:bg-black/40 border-purple-500/20 midnight:bg-gray-900">
 <tr>
 {Object.keys(course.range as Record<string, string | number>).map((grade) => (
 <th key={grade} className="border p-2 text-center">
 {grade}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 <tr>
 {Object.values(course.range as Record<string, string | number>).map((range, idx) => (
 <td
 key={idx}
 className="border p-2 text-center text-gray-300 dark:text-gray-200 "
 >
 {range}
 </td>
 ))}
 </tr>
 </tbody>
 </table>
 </div>
 )}

 {course.details && course.details.length > 0 ? (
 <div className="overflow-x-auto mt-6">
 <table className="w-full border border-purple-500/20 ">
 <thead className="bg-gray-800 text-white dark:bg-black/40 border-purple-500/20 midnight:bg-gray-900">
 <tr>
 <th className="border p-2 text-left">Component Name</th>
 <th className="border p-2 text-center">Max</th>
 <th className="border p-2 text-center">Scored</th>
 <th className="border p-2 text-center">Weightage</th>
 </tr>
 </thead>
 <tbody>
 {course.details.map((d, idx) => (
 <tr
 key={idx}
 className="border-purple-500/20 "
 >
 <td className="border p-2">{d.component}</td>
 <td className="border p-2 text-center">{formatNumber(d.maxMark)}</td>
 <td className="border p-2 text-center">{formatNumber(d.scoredMark)}</td>
 <td className="border p-2 text-center">{formatNumber(d.weightageMark)}</td>
 </tr>
 ))}

 <tr className="font-bold border-t border-gray-400 dark:border-gray-500 -gray-600">
 <td className="border p-2">
 Total
 </td>
 <td className="border p-2 text-center">
 {formatNumber(
 course.details.reduce((sum, d) => sum + (Number(d.maxMark) || 0), 0)
 )}
 </td>
 <td className="border p-2 text-center">
 {formatNumber(
 course.details.reduce((sum, d) => sum + (Number(d.scoredMark) || 0), 0)
 )}
 </td>
 <td className="border p-2 text-center">
 {formatNumber(
 course.details.reduce((sum, d) => sum + (Number(d.weightageMark) || 0), 0)
 )}
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : (
 <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
 No breakdown data available.
 </p>
 )}


 <Button
 variant="ghost"
 size="icon"
 onClick={() => setOpenCourse(null)}
 className="top-2 right-2 absolute cursor-pointer hover:bg-[#111111] dark:hover:bg-black/40 border-purple-500/20 midnight:hover:bg-gray-900"
 >
 <X
 size={22}
 className="text-gray-600 dark:text-gray-300 "
 />
 </Button>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 {activeSem === "predict" && (
 <CGPAPredictor
 data={data}
 attendance={attendance}
 CGPA={CGPA}
 />
 )}
 </div>
 );
}
