"use client";

import { useEffect, useState } from "react";

export default function StatsCards({
 attendancePercentage,
 ODhoursData,
 setODhoursIsOpen,
 marksData,
 feedbackStatus,
 setGradesDisplayIsOpen,
 CGPAHidden,
 setCGPAHidden,
 attendancePercentageOrString,
 setAttendancePercentageOrString,
}) {
 const totalODHours =
 ODhoursData && ODhoursData.length > 0 && ODhoursData[0].courses
 ? ODhoursData.reduce((sum, day) => sum + day.total, 0)
 : 0;

  const cardBase =
  "relative overflow-hidden cursor-pointer p-5 rounded-xl bg-gradient-to-br from-[#1c0f30]/80 to-black border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:-translate-y-[3px] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/40 transition-all duration-300 ease-out flex-shrink-0 snap-start w-[calc(50%-8px)] md:w-[calc(25%-12px)] flex flex-col justify-between text-left min-h-[120px]";

  return (
  <div data-scrollable className="overflow-x-auto snap-x snap-mandatory ml-4 mr-4">
  <div className="flex gap-4 py-4 px-2">
  {/* Card 1 */}
  <div
  className={`${cardBase}`}
  onClick={() => setAttendancePercentageOrString(attendancePercentageOrString === "percentage" ? "str" : "percentage")}
  >
  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
  <div className="flex items-center gap-2 relative z-10">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  <h2 className="text-[13px] font-medium text-gray-400">Attendance</h2>
  </div>
  <p className="text-3xl font-bold text-white mt-4 relative z-10">
  {attendancePercentage[attendancePercentageOrString] || 0}
  </p>
  </div>

  {/* Card 2 */}
  <div
  className={`${cardBase}`}
  onClick={() => setODhoursIsOpen(true)}
  >
  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
  <div className="flex items-center gap-2 relative z-10">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  <h2 className="text-[13px] font-medium text-gray-400">OD hours</h2>
  </div>
  <p className="text-3xl font-bold text-white mt-4 relative z-10">
  {totalODHours}/40
  </p>
  </div>

  {/* Card 3 - Feedback Status */}
  {feedbackStatus && <div
  className={`${cardBase}`}
  onClick={() => console.log("Feedback Status was clicked")}
  >
  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
  <div className="flex items-center gap-2 relative z-10">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  <h2 className="text-[13px] font-medium text-gray-400">Feedback</h2>
  </div>

  <div className="flex items-center gap-6 mt-4 relative z-10">
  <div className="flex flex-col">
  <span className="text-[11px] text-gray-500 mb-1">
  Mid Sem
  </span>
  <span
  className={`text-sm font-semibold ${feedbackStatus?.MidSem?.Curriculum && feedbackStatus?.MidSem?.Course
  ? "text-purple-400"
  : "text-red-500"
  }`}
  >
  {feedbackStatus?.MidSem?.Curriculum && feedbackStatus?.MidSem?.Course
  ? "Given"
  : "Not Given"}
  </span>
  </div>

  <div className="flex flex-col">
  <span className="text-[11px] text-gray-500 mb-1">
  End Sem
  </span>
  <span
  className={`text-sm font-semibold ${feedbackStatus?.EndSem?.Curriculum && feedbackStatus?.EndSem?.Course
  ? "text-purple-400"
  : "text-red-500"
  }`}
  >
  {feedbackStatus?.EndSem?.Curriculum && feedbackStatus?.EndSem?.Course
  ? "Given"
  : "Not Given"}
  </span>
  </div>
  </div>
  </div>}

  {/* Card 4 - CGPA (or Credits) */}
  {marksData.cgpa ? <div
  className={`${cardBase}`}
  onClick={() => setCGPAHidden(!CGPAHidden)}
  >
  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
  <div className="flex items-center gap-2 relative z-10">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  <h2 className="text-[13px] font-medium text-gray-400">
  CGPA
  </h2>
  </div>
  <p className="text-3xl font-bold text-white mt-4 relative z-10 select-none">
  {CGPAHidden ? "###" : marksData?.cgpa?.cgpa}
  </p>
  </div> : <div
  className={`${cardBase}`}
  onClick={() => setGradesDisplayIsOpen(true)}
  >
  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
  <div className="flex items-center gap-2 relative z-10">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  <h2 className="text-[13px] font-medium text-gray-400">Credits Earned</h2>
  </div>
  <p className="text-3xl font-bold text-white mt-4 relative z-10">
  {Number(marksData?.cgpa?.creditsEarned) + Number(marksData?.cgpa?.nonGradedRequirement || 0)}
  </p>
  </div>}
  </div>
 </div>
 );
}
