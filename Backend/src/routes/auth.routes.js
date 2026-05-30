import { Router } from 'express';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { getMe, googleCallback, login, logout, register } from '../controllers/auth.controller.js';
import passport from 'passport';
import config from '../config/config.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const authRouter = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 * @body { email: String, contact: String, password: String, fullName: String, role: Enum('buyer', 'seller') }
*/
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login a user
 * @access Public
 * @body { email: String, password: String }
*/
authRouter.post("/login", loginValidator, login)

/**
 * @route GET /api/v1/auth/logout
 * @desc Logout a user
 * @access Private
*/
authRouter.get("/logout", authenticateUser, logout);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current logged in user details
 * @access Private
*/
authRouter.get("/me", authenticateUser, getMe);

/**
 * @route GET /api/v1/auth/google
 * @desc Authenticate user with Google
 * @access Public
*/
authRouter.get("/google", passport.authenticate("google", { scope: ['profile', 'email'], prompt: "select_account" } ))

/**
 * @route GET /api/v1/auth/google/callback
 * @desc Google authentication callback
 * @access Public
*/
authRouter.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: config }), googleCallback)

export default authRouter;