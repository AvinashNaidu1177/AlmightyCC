const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    "src/components/custom/Exams/AllGradesDisplay.tsx",
    "src/components/custom/Exams/CGPAPredictor.tsx",
    "src/components/custom/Exams/GradesModal.tsx",
    "src/components/custom/Exams/SchduleDisplay.tsx",
    "src/components/custom/Exams/VitolDisplay.tsx",
    "src/components/custom/Exams/moodleDisplay.tsx",
    "src/components/custom/Hostel/LeaveDisplay.tsx",
    "src/components/custom/attendance/CalendarView.tsx",
    "src/components/custom/attendance/PopupCard.tsx",
    "src/components/custom/attendance/courseCard.tsx",
    "src/components/custom/attendance/overallAttendancePredictor.tsx",
    "src/components/custom/footer/DataPage.tsx",
    "src/components/custom/header/Files.tsx",
    "src/components/custom/header/Links.tsx",
    "src/components/custom/statCards.tsx"
];

for (const relPath of filesToUpdate) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace all occurrences of green- with purple-
        content = content.replace(/green-/g, 'purple-');
        // Replace border-green with border-purple
        // Since we did green- globally, border-green-x will become border-purple-x automatically
        // Add neon glow class if necessary (but let's stick to base colors for now)
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${relPath}`);
    } else {
        console.log(`Not found: ${relPath}`);
    }
}
