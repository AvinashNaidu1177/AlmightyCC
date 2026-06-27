import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { startCleanupCron } from "./lib/cleanupExpiredFiles";

import statusRoutes from "./routes/status";
import calendarRoutes from "./routes/calendar";
import loginRoutes from "./routes/login/login";
import hostelRoutes from "./routes/hostel";
import proctorRoutes from "./routes/proctor";
import gradesRoutes from "./routes/grades";
import scheduleRoutes from "./routes/schedule";
import attendanceRoutes from "./routes/attendance";
import allGradesRoutes from "./routes/allGrades";
import UploadFile from "./routes/files/UploadFile";
import fetchFiles from "./routes/files/fetchFiles";
import deleteFile from "./routes/files/deleteFile";
import downloadFile from "./routes/files/downloadFile";
import fetchLMSdata from "./routes/FetchLMSdata";
import fetchVitoldata from "./routes/FetchVitoldata";
import subscribe from "./routes/notifications/subscribe";
import unsubscribe from "./routes/notifications/unsubscribe";
import notifConfig from "./routes/notifications/config";
import notifTest from "./routes/notifications/test";
import notifStatus from "./routes/notifications/status";
import mail from "./routes/files/mail";
import { verifyMailer } from "./lib/clients/nodemailer";
import { initDB } from "./lib/clients/sequalize";
import { routeLogger, visitorLogger } from "./lib/Logger";
import stats from "./routes/stats";
import webpush from 'web-push'
import { vitolReminder } from "./lib/VitolReminder";

import { swaggerSpec } from "./lib/clients/swagger";
import swaggerUi from "swagger-ui-express";
import { loginLimiter, fileTransferLimiter, generalApiLimiter } from "./middleware/rateLimiter";

const app: Application = express();

// Secure Headers with Helmet (CSP disabled to prevent breaking changes as requested)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",") 
    : ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (
        req.path.startsWith("/.") ||
        req.path.includes(".git") ||
        req.path.includes(".env")
    ) {
        return res.sendStatus(404);
    }
    next();
});

app.use("/api/status", visitorLogger);
app.use("/api/status", statusRoutes);
app.use("/stats", stats);
app.use("/api/files/fetch", fetchFiles);

app.use("/api", routeLogger);

app.use("/api/calendar", generalApiLimiter, calendarRoutes);
app.use("/api/login", loginLimiter, loginRoutes);
app.use("/api/hostel", generalApiLimiter, hostelRoutes);
app.use("/api/proctor", generalApiLimiter, proctorRoutes);
app.use("/api/grades", generalApiLimiter, gradesRoutes);
app.use("/api/schedule", generalApiLimiter, scheduleRoutes);
app.use("/api/attendance", generalApiLimiter, attendanceRoutes);
app.use("/api/all-grades", generalApiLimiter, allGradesRoutes);
app.use("/api/files/upload", fileTransferLimiter, UploadFile);
app.use("/api/files/delete", fileTransferLimiter, deleteFile);
app.use("/api/files/download", fileTransferLimiter, downloadFile);
app.use("/api/lms-data", generalApiLimiter, fetchLMSdata);
app.use("/api/vitol-data", generalApiLimiter, fetchVitoldata);
app.use("/api/notifications/subscribe", subscribe);
app.use("/api/notifications/unsubscribe", unsubscribe);
app.use("/api/notifications/config", notifConfig);
app.use("/api/notifications/test", notifTest);
app.use("/api/notifications/status", notifStatus);
app.use("/api/files/mail/send", mail);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

app.listen(PORT, async () => {
    console.log(`🚀 Express TS server running on port ${PORT}`);
    await initDB();
    startCleanupCron();
    await verifyMailer();
    vitolReminder();
});
