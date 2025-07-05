import express from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/authUtils.js"
import registerModel from "../Model/register.js";
import loginRoute from "../Model/login.js";
import { registerValidationRules, validateRegister } from "../Middleware/validationRegister.js";
import { LoginValidationRules, validateLogin } from "../Middleware/validationLogin.js";

const router = express.Router();

router.post("/auth/register", registerValidationRules(), validateRegister,
async (req, res) => {
    try {
        console.log('Request body:', req.body);
        
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            username
        } = req.body;

        console.log('Extracted fields:', { firstName, lastName, email, phone, username, passwordLength: password?.length });

        if (!firstName || !lastName || !email || !password || !phone || !username) {
            console.log('Missing required fields');
            return res.status(400).json({message: "Missing required parameter"})
        }

        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed successfully');

        console.log('Creating user...');
        const user = await registerModel(
            firstName,
            lastName,
            email,
            hashedPassword,
            phone,
            username
        );

        const token = generateToken(user)

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                username: user.username,
                balance: user.balance
            }, 
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error message:', error.message);
        

        if (error.message === 'User already exists') {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Database error",
            error: error.message || error.toString()
        });
    }
});


router.post("/auth/login", LoginValidationRules(), validateLogin, async (req, res) => {
    try {
       const {
        email,
        password
       } = req.body;
       
       console.log('Login request body:', req.body);
       
       if (!email || !password) {
        return res.status(400).json({message: "Please fill all details"});
       }
       
       console.log("Checking for user....");
       const user = await loginRoute(email);
       console.log('User found:', user);
       
       if (!user) {
        return res.status(404).json({message: "User not found"});
       }
       
       const isMatch = await bcrypt.compare(password, user.password);
       
       if(!isMatch) {
        return res.status(400).json({message: "Invalid Credential"});
       }
       
        const token = generateToken(user);

        // Set cookie (optional)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });


       res.json({
        success: true,
        message: "User Logged In successfully",
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            username: user.username,
            balance: user.balance
        },
        token
       });
       
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Database error",
            error: error.message
        });
    }
});

export default router;