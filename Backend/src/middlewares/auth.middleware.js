import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

// Add this helper at the top of the file
const drainBody = (req) =>
  new Promise((resolve) => {
    if (req.readableEnded || !req.readable) return resolve();
    req.resume();
    req.once("end", resolve);
    req.once("error", resolve);
  });

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        await drainBody(req);
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET); // sync, no await needed

        const user = await userModel.findById(decoded.id);

        if (!user) {
            await drainBody(req);
            return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
        }

        if (user.role !== "seller") {
            await drainBody(req);
            return res.status(403).json({ success: false, message: "Forbidden access. You do not have permission to perform this action.", redirect: "/" });
        }

        req.user = user;
        next();
    } catch (error) {
        await drainBody(req);
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
    }
};

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
    }

    try {
        const decoded = await jwt.verify(token, config.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
        }

        const user = await userModel.findById(decoded.id);

        if(!user) {
            return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
        }

        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
    }
}