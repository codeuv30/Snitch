import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export const authenticateSeller = async (req, res, next) => {
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

        if(user.role !== "seller") {
            return res.status(403).json({ success: false, message: "Forbidden access. You do not have permission to perform this action.", redirect: "/" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in and try again.", redirect: "/login" });
    }
}