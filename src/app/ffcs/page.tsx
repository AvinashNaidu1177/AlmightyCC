"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    THEORY_TIMES, THEORY_TIMES_END, LAB_TIMES, LAB_TIMES_END, DAYS,
    THEORY_BLOCKS, LAB_BLOCKS
} from "@/lib/ffcsConstants";
import FFCSTimetableGrid, { Course } from "@/components/custom/ffcs/FFCSTimetableGrid";
import FFCSSummary from "@/components/custom/ffcs/FFCSSummary";
import FFCSControls from "@/components/custom/ffcs/FFCSControls";
import { toast } from "sonner";
// Removed useToast



export default function FFCSPage() {
    // Removed toast init
    const [courses, setCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState<"add" | "timetable" | "summary">("add");
    const [currentPane, setCurrentPane] = useState<"theory" | "lab">("theory");

    // Load persisted data on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem("ffcs-cyber-v1-courses");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setCourses(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load FFCS data from localStorage", e);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("ffcs-cyber-v1-courses", JSON.stringify(courses));
    }, [courses]);

    const handleClearAll = () => {
        if (confirm("Remove ALL courses from your timetable? This cannot be undone.")) {
            setCourses([]);
            toast.success("All courses cleared.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 midnight:text-gray-100 p-4 md:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <a href="/">← Back</a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">FFCS Timetable Builder</h1>
                            <p className="text-sm text-gray-500">Fully Flexible Credit System</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant={activeTab === "add" ? "default" : "outline"} onClick={() => setActiveTab("add")}>Add Course</Button>
                        <Button variant={activeTab === "timetable" ? "default" : "outline"} onClick={() => setActiveTab("timetable")}>Timetable</Button>
                        <Button variant={activeTab === "summary" ? "default" : "outline"} onClick={() => setActiveTab("summary")}>Summary</Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-6">
                    {activeTab === "add" && (
                        <div className="space-y-6">
                            <Card className="dark:bg-[#111827] midnight:bg-[#111827] border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-purple-500 text-lg">Course Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FFCSControls courses={courses} setCourses={setCourses} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "timetable" && (
                        <Card className="dark:bg-[#111827] midnight:bg-[#111827] border-gray-200 dark:border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-purple-500 text-lg">Timetable View</CardTitle>
                                <Button variant="outline" size="sm">Export</Button>
                            </CardHeader>
                            <CardContent className="overflow-x-auto p-4 md:p-6">
                                <FFCSTimetableGrid courses={courses} />
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "summary" && (
                        <Card className="dark:bg-[#111827] midnight:bg-[#111827] border-gray-200 dark:border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-purple-500 text-lg">Summary & Conflicts</CardTitle>
                                <Button variant="destructive" size="sm" onClick={handleClearAll}>Clear All</Button>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <FFCSSummary courses={courses} />
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}
