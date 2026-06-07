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
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized access. Please log in and try again.",
        redirect: "/login",
      });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET); // sync, no await needed

    const user = await userModel.findById(decoded.id);

    if (!user) {
      await drainBody(req);
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized access. Please log in and try again.",
          redirect: "/login",
        });
    }

    if (user.role !== "seller") {
      await drainBody(req);
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Forbidden access. You do not have permission to perform this action.",
          redirect: "/",
        });
    }

    req.user = user;
    next();
  } catch (error) {
    await drainBody(req);
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized access. Please log in and try again.",
        redirect: "/login",
      });
  }
};

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized access. Please log in and try again.",
        redirect: "/login",
      });
  }

  try {
    const decoded = await jwt.verify(token, config.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized access. Please log in and try again.",
          redirect: "/login",
        });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized access. Please log in and try again.",
          redirect: "/login",
        });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized access. Please log in and try again.",
        redirect: "/login",
      });
  }
};

export const setVisitorId = (req, res, next) => {
  let visitorId = req.cookies.visitorId;

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  req.visitorId = visitorId;

  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    req.user = user || null;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
