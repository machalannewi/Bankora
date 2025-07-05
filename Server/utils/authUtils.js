import jwt from 'jsonwebtoken';
import dotenv from "dotenv"


dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};


