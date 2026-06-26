import { Course } from "@/components/custom/ffcs/FFCSTimetableGrid";
import { DAYS, THEORY_TIMES, THEORY_TIMES_END, LAB_TIMES, LAB_TIMES_END, THEORY_BLOCKS, LAB_BLOCKS } from "./ffcsConstants";

const getNextDayOfWeek = (dayName: string) => {
    const dayMap: Record<string, number> = { "SUN": 0, "MON": 1, "TUE": 2, "WED": 3, "THU": 4, "FRI": 5, "SAT": 6 };
    const date = new Date();
    const targetDay = dayMap[dayName];
    const currentDay = date.getDay();
    const distance = (targetDay + 7 - currentDay) % 7 || 7;
    date.setDate(date.getDate() + distance);
    return date;
};

const formatDateICS = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const d = new Date(date);
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

export const exportToICS = (courses: Course[]) => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AlmightyCC//FFCS Planner//EN\n";
    
    courses.forEach(course => {
        course.slots.forEach(slot => {
            DAYS.forEach(day => {
                const theoryIndex = THEORY_BLOCKS[day].indexOf(slot);
                const labIndex = LAB_BLOCKS[day].indexOf(slot);

                if (theoryIndex !== -1 && slot !== "LUNCH" && slot !== "-") {
                    const date = getNextDayOfWeek(day);
                    const dtstart = formatDateICS(date, THEORY_TIMES[theoryIndex]);
                    const dtend = formatDateICS(date, THEORY_TIMES_END[theoryIndex]);
                    
                    icsContent += `BEGIN:VEVENT\nSUMMARY:${course.code} - ${course.name}\nDESCRIPTION:Faculty: ${course.faculty}\nLOCATION:${course.room}\nDTSTART:${dtstart}\nDTEND:${dtend}\nRRULE:FREQ=WEEKLY;UNTIL=20270101T000000Z\nEND:VEVENT\n`;
                }

                if (labIndex !== -1 && slot !== "LUNCH" && slot !== "-") {
                    const date = getNextDayOfWeek(day);
                    const dtstart = formatDateICS(date, LAB_TIMES[labIndex]);
                    const dtend = formatDateICS(date, LAB_TIMES_END[labIndex]);

                    icsContent += `BEGIN:VEVENT\nSUMMARY:${course.code} - ${course.name} (Lab)\nDESCRIPTION:Faculty: ${course.faculty}\nLOCATION:${course.room}\nDTSTART:${dtstart}\nDTEND:${dtend}\nRRULE:FREQ=WEEKLY;UNTIL=20270101T000000Z\nEND:VEVENT\n`;
                }
            });
        });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AlmightyCC_Timetable.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
