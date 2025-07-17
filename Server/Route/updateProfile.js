import express from "express"
import multer from "multer"
import fs from "fs"  // Added missing import
import path from "path"
import { fileURLToPath } from 'url';
import insertProfile from "../Model/profile.js"

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post("/update/:userId", upload.single('image'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        
        const userId = parseInt(req.params.userId);
        console.log(userId)
       
        const {
            firstName,
            lastName,
            username,
            phone,
            email
        } = req.body;


        let imagePath = null;
        if (req.file) {
            try {
                // Generate unique filename
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
                const finalPath = path.join(uploadsDir, uniqueName);
                
                // Move file to permanent location
                fs.renameSync(req.file.path, finalPath);
                
                // Store relative path in database
                imagePath = `http://localhost:5000/uploads/${uniqueName}`;
                
                console.log('Image saved to:', finalPath);
            } catch (fileError) {
                console.error('Error saving file:', fileError);
            }
        }
        const image = imagePath

        const user = await insertProfile(
            userId,
            firstName,
            lastName,
            username,
            phone,
            email,
            image
        );

        console.log(image);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                phone: user.phone,
                email: user.email,
                image: user.image
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        
        return res.status(500).json({
            success: false,
            message: "Database Error",
            errors: error.message || error
        });
    }
});

export default router;