import { body, validationResult } from "express-validator";

const registerValidationRules = () => {
  return [
    body("firstName")
      .trim()
      .notEmpty().withMessage("First name is required")
      .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters'),
      
    body("lastName")
      .trim()
      .notEmpty().withMessage("Last name is required")
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters'),
      
    body("email")
      .trim()
      .isEmail().withMessage("Enter a valid email")
      .normalizeEmail(),
      
    body("password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
      .matches(/[0-9]/).withMessage("Password must contain a number")
      .matches(/[a-zA-Z]/).withMessage("Password must contain a letter"),
      
    body("phone")
      .trim()
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone().withMessage("Enter a valid phone number"),
      
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
      .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
  ];
};

const validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().reduce((acc, err) => {
    acc[err.param] = err.msg;
    return acc;
  }, {});

  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: extractedErrors
  });
};

export { registerValidationRules, validateRegister };