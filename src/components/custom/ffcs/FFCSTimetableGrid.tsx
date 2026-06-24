import React from "react";
import { DAYS, THEORY_TIMES, THEORY_TIMES_END, LAB_TIMES, LAB_TIMES_END, THEORY_BLOCKS, LAB_BLOCKS } from "@/lib/ffcsConstants";

export type Course = {
    id: string | number;
    code: string;
    name: string;
    faculty: string;
    room: string;
    credits: number;
    slots: string[];
    combos: string[][];
    hasConflict: boolean;
};

export const getUsedSlotsMap = (courses: Course[]) => {
    const map: Record<string, string[]> = {};
    courses.forEach((c) =>
        c.slots.forEach((s) => {
            if (!map[s]) map[s] = [];
            map[s].push(c.id.toString());
        })
    );
    return map;
};

export const getCourseForBlock = (courses: Course[], block: string) => {
    if (block === "-" || block === "LUNCH") return null;
    return courses.find((c) => c.slots.includes(block)) || null;
};

export const buildTimeOverlapSet = (courses: Course[]) => {
    const overlaps = new Set<string>();
    DAYS.forEach((day) => {
        const tBlocks = THEORY_BLOCKS[day];
        const lBlocks = LAB_BLOCKS[day];
        for (let raw = 0; raw < tBlocks.length; raw++) {
            if (tBlocks[raw] === "LUNCH") continue;
            const tCourse = getCourseForBlock(courses, tBlocks[raw]);
            const lCourse = getCourseForBlock(courses, lBlocks[raw]);
            if (tCourse && lCourse) overlaps.add(day + ":" + raw);
        }
    });
    return overlaps;
};

export const recalcConflicts = (courses: Course[]) => {
    const map = getUsedSlotsMap(courses);
    const overlaps = buildTimeOverlapSet(courses);

    const overlapBlocks = new Set<string>();
    DAYS.forEach((day) => {
        const tBlocks = THEORY_BLOCKS[day];
        const lBlocks = LAB_BLOCKS[day];
        for (let raw = 0; raw < tBlocks.length; raw++) {
            if (overlaps.has(day + ":" + raw)) {
                if (tBlocks[raw] !== "LUNCH" && tBlocks[raw] !== "-") overlapBlocks.add(tBlocks[raw]);
                if (lBlocks[raw] !== "LUNCH" && lBlocks[raw] !== "-") overlapBlocks.add(lBlocks[raw]);
            }
        }
    });

    return courses.map((c) => {
        const dup = c.slots.some((s) => map[s] && map[s].length > 1);
        const time = c.slots.some((s) => overlapBlocks.has(s));
        return { ...c, hasConflict: dup || time };
    });
};

export default function FFCSTimetableGrid({ courses }: { courses: Course[] }) {
    if (!courses.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-gray-200 dark:border-gray-800 rounded-lg">
                <p className="text-gray-500 font-mono text-sm">NO_COURSES_FOUND</p>
                <p className="text-gray-400 text-xs mt-2">Add courses to populate your timetable</p>
            </div>
        );
    }

    const overlaps = buildTimeOverlapSet(courses);
    const usedSlots = getUsedSlotsMap(courses);

    const isSlotDuplicate = (block: string) => {
        return usedSlots[block] && usedSlots[block].length > 1;
    };

    return (
        <div className="overflow-x-auto w-full border border-gray-200 dark:border-gray-800 rounded-lg pb-4">
            <table className="w-full text-xs font-mono border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <th className="p-2 border-r border-gray-200 dark:border-gray-800 w-16" rowSpan={3}>DAY</th>
                        <th className="p-2 border-r border-gray-200 dark:border-gray-800 w-16" rowSpan={3}>
                            <span className="text-purple-600 dark:text-purple-400 font-bold block text-[10px]">Theory</span>
                            <span className="text-gray-500 block text-[10px] my-1">─────</span>
                            <span className="text-pink-600 dark:text-pink-400 font-bold block text-[10px]">Lab</span>
                        </th>
                        {/* Theory Time Headers */}
                        {THEORY_TIMES.slice(0, 6).map((t, i) => (
                            <th key={i} className="p-1 border-r border-gray-200 dark:border-gray-800 font-normal text-[10px] text-gray-600 dark:text-gray-400">
                                {t}<br />-{THEORY_TIMES_END[i]}
                            </th>
                        ))}
                        <th className="p-1 border-r border-gray-200 dark:border-gray-800 text-[10px] w-8 bg-gray-200 dark:bg-gray-800" rowSpan={3}>🍽<br />LUNCH</th>
                        {THEORY_TIMES.slice(7).map((t, i) => (
                            <th key={i} className="p-1 border-r border-gray-200 dark:border-gray-800 font-normal text-[10px] text-gray-600 dark:text-gray-400">
                                {t}<br />-{THEORY_TIMES_END[i + 7]}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        {LAB_TIMES.slice(0, 6).map((t, i) => (
                            <th key={i} className="p-1 border-r border-gray-200 dark:border-gray-800 font-normal text-[10px] text-gray-600 dark:text-gray-400">
                                {t}<br />-{LAB_TIMES_END[i]}
                            </th>
                        ))}
                        {LAB_TIMES.slice(7).map((t, i) => (
                            <th key={i} className="p-1 border-r border-gray-200 dark:border-gray-800 font-normal text-[10px] text-gray-600 dark:text-gray-400">
                                {t}<br />-{LAB_TIMES_END[i + 7]}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        {[...Array(6)].map((_, i) => (
                            <th key={`p${i}`} className="p-1 border-r border-gray-200 dark:border-gray-800 font-bold text-[10px] text-gray-700 dark:text-gray-300">P{i + 1}</th>
                        ))}
                        {[...Array(6)].map((_, i) => (
                            <th key={`p${i + 6}`} className="p-1 border-r border-gray-200 dark:border-gray-800 font-bold text-[10px] text-gray-700 dark:text-gray-300">P{i + 7}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {DAYS.map((day) => {
                        const tBlocks = THEORY_BLOCKS[day];
                        const lBlocks = LAB_BLOCKS[day];

                        return (
                            <React.Fragment key={day}>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <td className="p-2 font-bold text-center border-r border-gray-200 dark:border-gray-800" rowSpan={2}>{day}</td>
                                    <td className="p-1 text-[10px] font-bold text-center text-purple-600 dark:text-purple-400 border-r border-gray-200 dark:border-gray-800">Theory</td>
                                    {tBlocks.map((block, raw) => {
                                        if (block === "LUNCH") return <td key={raw} className="border-r border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-gray-800" rowSpan={2}></td>;
                                        if (block === "-") return <td key={raw} className="text-center p-1 border-r border-gray-200 dark:border-gray-800 text-gray-400">—</td>;

                                        const course = getCourseForBlock(courses, block);
                                        const dupConf = isSlotDuplicate(block);
                                        const timeOver = overlaps.has(`${day}:${raw}`);

                                        let bgClass = "bg-transparent";
                                        if (dupConf || timeOver) bgClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-600 dark:text-red-400 font-bold";
                                        else if (course) bgClass = "bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300 font-bold";

                                        return (
                                            <td key={raw} className={`p-1 text-center text-[10px] border border-gray-200 dark:border-gray-800 ${bgClass}`} title={timeOver ? "Theory + Lab clash!" : ""}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="opacity-80">{block}</span>
                                                    {course && <span className="mt-1 break-words">{course.code}</span>}
                                                    {(timeOver && course) && <span className="text-[8px] bg-red-500 text-white px-1 mt-1 rounded">CLASH</span>}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <td className="p-1 text-[10px] font-bold text-center text-pink-600 dark:text-pink-400 border-r border-gray-200 dark:border-gray-800">Lab</td>
                                    {lBlocks.map((block, raw) => {
                                        if (block === "LUNCH") return null;
                                        if (block === "-") return <td key={raw} className="text-center p-1 border-r border-gray-200 dark:border-gray-800 text-gray-400">—</td>;

                                        const course = getCourseForBlock(courses, block);
                                        const dupConf = isSlotDuplicate(block);
                                        const timeOver = overlaps.has(`${day}:${raw}`);

                                        let bgClass = "bg-transparent";
                                        if (dupConf || timeOver) bgClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-600 dark:text-red-400 font-bold";
                                        else if (course) bgClass = "bg-pink-100 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300 font-bold";

                                        return (
                                            <td key={raw} className={`p-1 text-center text-[10px] border border-gray-200 dark:border-gray-800 ${bgClass}`} title={timeOver ? "Theory + Lab clash!" : ""}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="opacity-80">{block}</span>
                                                    {course && <span className="mt-1 break-words">{course.code}</span>}
                                                    {(timeOver && course) && <span className="text-[8px] bg-red-500 text-white px-1 mt-1 rounded">CLASH</span>}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            
            <div className="flex gap-4 mt-4 px-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-transparent border border-gray-300 dark:border-gray-700"></div> Empty</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-200 dark:bg-purple-900/50 border border-purple-500"></div> Scheduled (Theory)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-200 dark:bg-pink-900/50 border border-pink-500"></div> Scheduled (Lab)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-200 dark:bg-red-900/50 border border-red-500"></div> Conflict</div>
            </div>
        </div>
    );
}
