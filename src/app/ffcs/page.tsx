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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, CalendarDays, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { exportToICS } from "@/lib/exportICS";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FFCSPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState<"add" | "timetable" | "summary">("add");
    const [currentPane, setCurrentPane] = useState<"theory" | "lab">("theory");

    // Auth check on mount
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
        toast("Remove ALL courses from your timetable?", {
            description: "This cannot be undone.",
            action: {
                label: "Confirm",
                onClick: () => {
                    setCourses([]);
                    toast.success("All courses cleared.");
                }
            }
        });
    };

    const handleExportImage = async () => {
        const gridElement = document.getElementById("ffcs-timetable-grid");
        if (!gridElement) {
            toast.error("Timetable not found for export.");
            return;
        }

        try {
            const dataUrl = await toPng(gridElement, {
                backgroundColor: "#0a0a0f",
                pixelRatio: 2,
            });
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "AlmightyCC_Timetable.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Timetable exported as PNG.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export image.");
        }
    };

    const handleExportICS = () => {
        if (!courses.length) {
            toast.error("Add some courses before exporting.");
            return;
        }
        try {
            exportToICS(courses);
            toast.success("Timetable exported as .ics calendar.");
        } catch (e) {
            console.error("Export ICS failed:", e);
            toast.error("Failed to export calendar.");
        }
    };

    if (isAuth === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] text-gray-200 dark:text-gray-100 midnight:text-gray-100 p-4 md:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 dark:border-gray-800 pb-4">
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
                            <Card className="dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] border-gray-800 dark:border-gray-800">
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
                        <Card className="dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] border-gray-800 dark:border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-purple-500 text-lg">Timetable View</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="w-4 h-4" /> Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] border-gray-800">
                                        <DropdownMenuItem onClick={handleExportImage} className="cursor-pointer gap-2 focus:bg-gray-800">
                                            <ImageIcon className="w-4 h-4 text-purple-400" /> Export as PNG Image
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleExportICS} className="cursor-pointer gap-2 focus:bg-gray-800">
                                            <CalendarDays className="w-4 h-4 text-pink-400" /> Export as .ics Calendar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="overflow-x-auto p-4 md:p-6" id="ffcs-timetable-grid">
                                <FFCSTimetableGrid courses={courses} />
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "summary" && (
                        <Card className="dark:bg-[#0a0a0f] midnight:bg-[#0a0a0f] border-gray-800 dark:border-gray-800">
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
