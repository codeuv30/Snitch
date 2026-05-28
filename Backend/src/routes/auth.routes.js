import { Router } from 'express';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { login, register } from '../controllers/auth.controller.js';

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

export default authRouter;