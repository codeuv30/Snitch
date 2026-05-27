import { body, validationResult } from "express-validator"

function validateRequest(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();

}

export const registerValidator = [
    body("email")
        .isEmail().withMessage("Invalid email format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .isLength({ min: 10, max: 15 }).withMessage("Contact must be between 10 and 15 characters")
        .isMobilePhone().withMessage("Contact must be a valid mobile number"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("fullName")
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolean value"),

    validateRequest
];