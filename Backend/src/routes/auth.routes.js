import { Router } from 'express';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { googleCallback, login, register } from '../controllers/auth.controller.js';
import passport from 'passport';
import config from '../config/config.js';

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