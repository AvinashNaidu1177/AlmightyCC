"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalApiLimiter = exports.fileTransferLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Very strict limiter for login attempts (10 requests per 10 minutes)
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { error: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
// Strict limiter for file uploads/downloads (30 requests per 15 minutes)
exports.fileTransferLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: "File transfer limit reached. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
// General API limiter for endpoints like grades, attendance, etc (150 requests per 10 minutes)
exports.generalApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 150,
    message: { error: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map