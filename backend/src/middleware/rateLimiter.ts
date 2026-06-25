import rateLimit from "express-rate-limit";

// Very strict limiter for login attempts (10 requests per 10 minutes)
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 10,
    message: { error: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for file uploads/downloads (30 requests per 15 minutes)
export const fileTransferLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: "File transfer limit reached. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API limiter for endpoints like grades, attendance, etc (150 requests per 10 minutes)
export const generalApiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 150,
    message: { error: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
