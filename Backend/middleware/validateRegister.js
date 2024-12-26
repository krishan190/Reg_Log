import { body } from "express-validator";


// Validation Middleware
export const validateRegister = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
