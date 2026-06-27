"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Briefcase, Users, GraduationCap } from "lucide-react";
import { API_BASE } from "@/components/custom/Main";

 type ProctorInfo = {
  facultyId?: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  school?: string;
  cabin?: string;
  facultyDepartment?: string;
 };

type FacultyCourseInfo = {
 facultyName: string;
 courseCode: string;
 courseTitle: string;
 slot: string;
};

 export default function FacultyPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [proctor, setProctor] = useState<ProctorInfo | null>(null);
  const [isProctorLoading, setIsProctorLoading] = useState(true);
  const [proctorError, setProctorError] = useState<string | null>(null);
  const [facultyList, setFacultyList] = useState<FacultyCourseInfo[]>([]);

 useEffect(() => {
    const checkAuth = () => {
        const ids = localStorage.getItem("IDs");
        if (!ids) {
            router.push("/");
        } else {
            setIsAuth(true);
        }
    };
    checkAuth();
 }, [router]);

 useEffect(() => {
 try {
   const loadProctor = () => {
    setIsProctorLoading(true);
    setProctorError(null);
    try {
      const storedProctor = localStorage.getItem("proctor");
      if (storedProctor && storedProctor !== "undefined") {
        setProctor(JSON.parse(storedProctor));
      } else {
        setProctorError("No proctor information found.");
      }
    } catch (err: any) {
      setProctorError(`Failed to load proctor data. ${err.message}`);
    } finally {
      setIsProctorLoading(false);
    }
   };
   
   loadProctor();

 // Load Faculty from Attendance data
 const attRaw = localStorage.getItem("attendance");
 if (attRaw) {
 const parsed = JSON.parse(attRaw);
 if (parsed?.attendance && Array.isArray(parsed.attendance)) {
 const uniqueFacultyMap = new Map<string, FacultyCourseInfo>();
 parsed.attendance.forEach((item: any) => {
 if (item.faculty && item.faculty !== "NIL") {
 // Extract just the name if it has extra details like "- SCOPE"
 const nameParts = item.faculty.split("-");
 const cleanName = nameParts[0].trim();
 
 if (!uniqueFacultyMap.has(cleanName)) {
 uniqueFacultyMap.set(cleanName, {
 facultyName: item.faculty, // Keep full string for details
 courseCode: item.courseCode,
 courseTitle: item.courseTitle,
 slot: item.slotName
 });
 }
 }
 });
 setFacultyList(Array.from(uniqueFacultyMap.values()));
 }
 }
 } catch (e) {
 console.error("Failed to parse faculty data from local storage", e);
 }
 }, []);

 if (isAuth === null) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
 }

 return (
 <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-gray-100 p-4 md:p-8">
 <div className="max-w-7xl mx-auto w-full space-y-8">
 
 <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
 <a href="/" className="px-4 py-2 hover:bg-[#111111] dark:hover:bg-gray-800 rounded-md transition-colors text-sm font-medium">← Back</a>
 <div>
 <h1 className="text-2xl font-bold text-purple-400">Faculty & Proctor Info</h1>
 <p className="text-sm text-gray-500">Contact information for your academic advisors</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Proctor Section */}
 <div className="md:col-span-1 space-y-6">
 <Card className="relative overflow-hidden bg-white/20 dark:bg-[#0a0a0f]/40 bg-gradient-to-br from-white/30 to-transparent dark:from-purple-500/5 dark:to-transparent backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(168,85,247,0.12)] hover:shadow-[0_16px_48px_rgba(168,85,247,0.25)] hover:-translate-y-1.5 hover:backdrop-blur-[32px] transition-all duration-300 ease-out">
 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 dark:via-white/2 dark:to-white/10 pointer-events-none" />
 <CardHeader className="relative z-10 bg-white/30 dark:bg-white/5 border-b border-white/30 dark:border-white/10 p-5 pb-4 backdrop-blur-md">
 <div className="flex flex-col justify-center">
 <CardTitle className="text-purple-400 text-sm font-medium flex items-center gap-2 uppercase tracking-wider mb-3 mt-1">
 <User className="w-4 h-4" />
 My Proctor
 </CardTitle>
 {(!isProctorLoading && !proctorError && proctor?.name) && (
 <div className="flex flex-col justify-center">
 <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 line-clamp-1">{proctor.name}</h3>
 <p className="text-sm text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1.5 mt-1 line-clamp-1">
 <Briefcase className="w-3.5 h-3.5 shrink-0" />
 <span className="truncate">{proctor.designation || "Proctor"}</span>
 </p>
 {proctor.facultyId && (
 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
 <User className="w-3.5 h-3.5 shrink-0" />
 {proctor.facultyId}
 </p>
 )}
 </div>
 )}
 </div>
 </CardHeader>
 <CardContent className="relative z-10 p-5 pt-5">
  {isProctorLoading ? (
  <div className="flex justify-center items-center py-8">
  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
  ) : proctorError ? (
  <div className="text-center py-6 text-red-400">
  <p>{proctorError}</p>
  <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-md transition-colors text-sm">
  Retry
  </button>
  </div>
  ) : proctor?.name ? (
  <div className="space-y-4">
  {proctor.email && (
  <div className="flex items-center gap-4 text-[15px] group">
  <div className="p-2.5 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-sm"><Mail className="w-4 h-4" /></div>
  <a href={`mailto:${proctor.email}`} className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors truncate">{proctor.email}</a>
  </div>
  )}
  {proctor.phone && (
  <div className="flex items-center gap-4 text-[15px] group">
  <div className="p-2.5 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-sm"><Phone className="w-4 h-4" /></div>
  <a href={`tel:${proctor.phone}`} className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">{proctor.phone}</a>
  </div>
  )}
  {proctor.cabin && (
  <div className="flex items-center gap-4 text-[15px] group">
  <div className="p-2.5 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-sm"><MapPin className="w-4 h-4" /></div>
  <span className="text-gray-800 dark:text-gray-200 font-medium">{proctor.cabin}</span>
  </div>
  )}
  {proctor.school && (
  <div className="flex items-center gap-4 text-[15px] group">
  <div className="p-2.5 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors shadow-sm"><GraduationCap className="w-4 h-4" /></div>
  <span className="text-gray-800 dark:text-gray-200 font-medium">{proctor.school}</span>
  </div>
  )}
  </div>
  ) : (
  <div className="text-center py-6 text-gray-500">
  <p>Proctor information not found.</p>
  <p className="text-xs mt-2">Log in again to refresh your profile data.</p>
  </div>
  )}
 </CardContent>
 </Card>
 </div>

 {/* Faculty Section */}
 <div className="md:col-span-2 space-y-6">
 <Card className="dark:bg-[#0a0a0f] border-gray-800">
 <CardHeader className="border-b border-gray-800">
 <CardTitle className="text-purple-500 text-lg flex items-center gap-2">
 <Users className="w-5 h-5" />
 My Course Faculty
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6">
 {facultyList.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {facultyList.map((faculty, i) => (
 <div key={i} className="p-4 rounded-lg border border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-gray-900">
 <div className="flex items-start gap-3">
 <div className="p-2 bg-gray-900 dark:bg-gray-800 rounded-full text-gray-500 mt-1">
 <GraduationCap className="w-4 h-4" />
 </div>
 <div>
 <h4 className="font-bold text-sm text-gray-100 line-clamp-2">
 {faculty.facultyName}
 </h4>
 <div className="mt-2 space-y-1">
 <div className="text-xs font-mono text-purple-400">
 {faculty.courseCode} ({faculty.slot})
 </div>
 <div className="text-xs text-gray-500 line-clamp-1">
 {faculty.courseTitle}
 </div>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-12 text-gray-500 border border-dashed border-gray-700 rounded-lg">
 <p>No faculty information found.</p>
 <p className="text-xs mt-2">Course faculty will appear here automatically from your attendance data.</p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </div>
 );
}
