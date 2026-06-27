import express, { Request, Response } from "express";
import { validateVtopSession } from "../middleware/validateSession";
import VTOPClient from "../lib/clients/VTOPClient";
import * as cheerio from "cheerio";
import { URLSearchParams } from "url";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", validateVtopSession, async (req: Request, res: Response) => {
    try {
        const cookies = req.body.cookies || req.headers.cookies;
        let cookieHeader = "";
        if (Array.isArray(cookies)) {
            cookieHeader = cookies.join("; ");
        } else if (typeof cookies === "string") {
            cookieHeader = cookies;
        }

        const authorizedID = req.body.authorizedID || req.headers.authorizedid;
        const csrf = req.body.csrf || req.headers.csrf;

        if (!csrf || !authorizedID) {
            return res.status(400).json({ success: false, error: "Cannot find _csrf or authorizedID" });
        }

        const client = VTOPClient();

        // 1. Fetch dashboard to dynamically extract the "View Proctor Details" URL
        const dashboardRes = await client.get("/vtop/open/page", {
            headers: {
                Cookie: cookieHeader,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const dashboardHtml = dashboardRes.data;
        const $dashboard = cheerio.load(dashboardHtml);
        
        let proctorEndpoint = "";
        
        // VTOP menus usually use ajaxcall or loadProcess in onclick or href
        // We look for any element containing "View Proctor Details"
        $dashboard("*").each((i, el) => {
            const text = $dashboard(el).text().trim();
            if (text.includes("View Proctor Details")) {
                const html = $dashboard(el).parent().html() || "";
                const onclick = $dashboard(el).attr("onclick") || $dashboard(el).parent().attr("onclick") || "";
                const href = $dashboard(el).attr("href") || $dashboard(el).parent().attr("href") || "";
                
                // Typical VTOP structure: loadProcess('/vtop/proctor/viewProctorDetails', ...) or similar
                const match = (onclick + href + html).match(/['"](\/vtop\/[^'"]+Proctor[^'"]+)['"]/i);
                if (match) {
                    proctorEndpoint = match[1];
                }
            }
        });

        // Fallback to verified existing flow if dynamic extraction fails but we know StudentProfileAllView exists
        if (!proctorEndpoint) {
            // VTOP menus might be loaded dynamically, but StudentProfileAllView is a verified endpoint 
            // that contains Proctor details in the existing flow (used by hostel.ts)
            proctorEndpoint = "/vtop/studentsRecord/StudentProfileAllView";
        }

        const proctorRes = await client.post(
            proctorEndpoint,
            new URLSearchParams({
                verifyMenu: "true",
                authorizedID: String(authorizedID),
                _csrf: String(csrf),
                nocache: Date.now().toString(),
            }).toString(),
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/x-www-form-urlencoded",
                    Referer: "https://vtopcc.vit.ac.in/vtop/open/page",
                },
            }
        );

        const html = proctorRes.data;
        const $ = cheerio.load(html);
        
        let proctorName = "";
        let designation = "";
        let email = "";
        let mobile = "";
        let cabin = "";
        let school = "";

        // Parse intelligently without assuming strict td/th positioning
        // Find all cells that contain the text and grab the next adjacent cell or sibling
        $("*").each((i, el) => {
            const tagName = el.tagName.toLowerCase();
            if (tagName !== "td" && tagName !== "th" && tagName !== "span" && tagName !== "div") return;

            const label = $(el).text().trim().toLowerCase();
            
            // Skip if the label is too long (not a label)
            if (label.length > 50) return;

            let value = "";
            if (tagName === "td" || tagName === "th") {
                // Usually the value is in the next sibling cell
                value = $(el).next().text().trim();
            } else {
                value = $(el).parent().next().text().trim();
            }

            if (!value) return;

            if (label.includes("proctor") && label.includes("name")) proctorName = value;
            else if (label.includes("proctor") && (label.includes("email") || label.includes("mail"))) email = value;
            else if (label.includes("proctor") && (label.includes("mobile") || label.includes("phone"))) mobile = value;
            else if (label.includes("proctor") && label.includes("designation")) designation = value;
            else if (label.includes("cabin") || label.includes("room")) cabin = value;
            else if (label.includes("school") || label.includes("department")) school = value;
            else if (label.includes("faculty advisor") && label.includes("name") && !proctorName) proctorName = value;
        });

        if (!proctorName && !email && !mobile) {
            return res.status(200).json({
                success: false,
                message: "No proctor information found.",
                debugEndpointUsed: proctorEndpoint
            });
        }

        return res.status(200).json({
            success: true,
            proctorInfo: {
                proctorName,
                designation,
                email,
                mobile,
                cabin,
                school
            }
        });

    } catch (err: any) {
        console.error("Proctor API Error:", err);
        // Do not throw an exception that crashes the route, return gracefully
        return res.status(200).json({ 
            success: false, 
            message: "No proctor information found." 
        });
    }
});

export default router;
