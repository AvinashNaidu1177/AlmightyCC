const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../backend/src/routes');
const vtopRoutes = [
    'allGrades.ts',
    'attendance.ts',
    'grades.ts',
    'hostel.ts',
    'marks.ts',
    'schedule.ts',
    'FetchLMSdata.ts',
    'FetchVitoldata.ts',
    'calendar.ts'
];

vtopRoutes.forEach(file => {
    const filePath = path.join(routesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if not exists
    if (!content.includes('validateVtopSession')) {
        content = content.replace(
            /import express(.*) from "express";/g,
            `import express$1 from "express";\nimport { validateVtopSession } from "../middleware/validateSession";`
        );
    }

    // Inject middleware
    content = content.replace(
        /router\.post\("\/", async \(req: Request, res: Response\) => \{/g,
        `router.post("/", validateVtopSession, async (req: Request, res: Response) => {`
    );

    // Remove old internal stack trace exposes
    content = content.replace(
        /res\.status\(500\)\.json\(\{ error: err\.message \}\);/g,
        `res.status(500).json({ error: "Internal Server Error" });`
    );

    // Remove another pattern for 500
    content = content.replace(
        /res\.status\(500\)\.json\(\{ error: err \}\);/g,
        `res.status(500).json({ error: "Internal Server Error" });`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
