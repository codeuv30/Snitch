import { body, validationResult } from "express-validator"

function validateRequest(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    next();

}

export const productValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Amount must be a number"),
    body("currency").notEmpty().withMessage("Currency is required").isIn(["INR", "EUR", "GBP", "JPY", "USD"]).withMessage("Currency must be one of the following: INR, EUR, GBP, JPY, USD"),
    validateRequest,
];