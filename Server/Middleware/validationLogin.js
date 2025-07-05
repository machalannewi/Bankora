import {body, validationResult} from "express-validator"

const LoginValidationRules = () => {
    return [
          body("email")
            .trim()
            .isEmail().withMessage("Enter a valid email")
            .normalizeEmail(),

          body("password")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({min: 6}).withMessage("Password must be at least 6 characters")
            .matches(/[0-9]/).withMessage("Password must contain a number")
            .matches(/[a-zA-Z]/).withMessage("Password must contain a letter")
        ];
};

const validateLogin = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
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


}

export {LoginValidationRules, validateLogin};