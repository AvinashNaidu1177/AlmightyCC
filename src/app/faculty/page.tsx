"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Briefcase, Users, GraduationCap } from "lucide-react";

type ProctorInfo = {
    proctorName?: string;
    proctorEmail?: string;
    proctorMobile?: string;
    proctorDesignation?: string;
};

type FacultyCourseInfo = {
    facultyName: string;
    courseCode: string;
    courseTitle: string;
    slot: string;
};

export default function FacultyPage() {
    const [proctor, setProctor] = useState<ProctorInfo | null>(null);
    const [facultyList, setFacultyList] = useState<FacultyCourseInfo[]>([]);

    useEffect(() => {
        try {
            // Load Proctor from Hostel/Profile data
            const hostelRaw = localStorage.getItem("hostel");
            if (hostelRaw) {
                const parsed = JSON.parse(hostelRaw);
                if (parsed?.hostelInfo) {
                    setProctor({
                        proctorName: parsed.hostelInfo.proctorName,
                        proctorEmail: parsed.hostelInfo.proctorEmail,
                        proctorMobile: parsed.hostelInfo.proctorMobile,
                        proctorDesignation: parsed.hostelInfo.proctorDesignation,
                    });
                }
            }

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
            console.error("Failed to parse faculty data:", e);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 midnight:text-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                
                <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <a href="/" className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-sm font-medium">← Back</a>
                    <div>
                        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Faculty & Proctor Info</h1>
                        <p className="text-sm text-gray-500">Contact information for your academic advisors</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Proctor Section */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="dark:bg-[#111827] midnight:bg-[#111827] border-purple-200 dark:border-purple-900/50 shadow-md shadow-purple-500/10">
                            <CardHeader className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
                                <CardTitle className="text-purple-600 dark:text-purple-400 text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    My Proctor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {proctor?.proctorName ? (
                                    <>
                                        <div>
                                            <h3 className="font-bold text-lg">{proctor.proctorName}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Briefcase className="w-3 h-3" />
                                                {proctor.proctorDesignation || "Proctor"}
                                            </p>
                                        </div>
                                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                            {proctor.proctorEmail && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Mail className="w-4 h-4" /></div>
                                                    <a href={`mailto:${proctor.proctorEmail}`} className="hover:text-purple-500 transition-colors">{proctor.proctorEmail}</a>
                                                </div>
                                            )}
                                            {proctor.proctorMobile && (
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Phone className="w-4 h-4" /></div>
                                                    <a href={`tel:${proctor.proctorMobile}`} className="hover:text-purple-500 transition-colors">{proctor.proctorMobile}</a>
                                                </div>
                                            )}
                                        </div>
                                    </>
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
                        <Card className="dark:bg-[#111827] midnight:bg-[#111827] border-gray-200 dark:border-gray-800">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                                <CardTitle className="text-purple-500 text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    My Course Faculty
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {facultyList.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {facultyList.map((faculty, i) => (
                                            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-gray-900">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 mt-1">
                                                        <GraduationCap className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                                            {faculty.facultyName}
                                                        </h4>
                                                        <div className="mt-2 space-y-1">
                                                            <div className="text-xs font-mono text-purple-600 dark:text-purple-400">
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
                                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
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
