import { Request, Response, NextFunction } from "express";

export const validateVtopSession = (req: Request, res: Response, next: NextFunction): void => {
    const { cookies, authorizedID, csrf } = req.body;

    if (!cookies || !authorizedID || !csrf) {
        res.status(400).json({ error: "Missing required VTOP session parameters: cookies, authorizedID, or csrf" });
        return;
    }

    if (typeof authorizedID !== "string" || typeof csrf !== "string") {
        res.status(400).json({ error: "Invalid type for VTOP session parameters" });
        return;
    }

    next();
};
