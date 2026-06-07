import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message,
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { email, contact, fullName, isSeller, provider } = req.body;
  const password = req.body.password;

  if (!password && provider !== "google") {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password?.length < 6 && provider !== "google") {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const userDetails = {
      email,
      contact,
      fullName,
      role: isSeller ? "seller" : "buyer",
      provider,
    };

    if (password) {
      userDetails.password = password;
    }

    const user = await userModel.create(userDetails);

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to create your account at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to log you in at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  return res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      contact: req.user.contact,
      fullName: req.user.fullName,
      role: req.user.role,
      provider: req.user.provider,
    },
  });
};

export const googleCallback = async (req, res) => {
  if (!req.user.isNewUser) {
    const token = jwt.sign(
      {
        id: req.user.user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      config.NODE_ENV === "production"
        ? config.FRONTEND_PRODUCTION_URL
        : config.FRONTEND_DEVELOPMENT_URL,
    );
  }

  const email = encodeURIComponent(req.user.googleProfile.emails[0].value);

  const fullName = encodeURIComponent(req.user.googleProfile.displayName);

  const redirectURL = `${config.FRONTEND_PRODUCTION_URL}/register?email=${email}&fullName=${fullName}`;

  return res.status(200).json({
    success: true,
    token,
  });
};
