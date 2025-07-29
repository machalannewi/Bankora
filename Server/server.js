import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import authRoute from "./Route/authRoute.js"
import transfer from "./Route/transfer.js"
import fetchUser from "./Route/transfer.js"
import updateProfile from "./Route/updateProfile.js"
import updateBalance from "./Route/updateBalance.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;


const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "https://bankora.vercel.app", 
        methods: ["GET", "POST"]
    }
});


app.use(express.json())
app.use(cors({
    origin: "https://bankora.vercel.app"
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io available to routes
app.set('io', io);

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Join user to a room based on their email/phone
    socket.on("join", (userIdentifier) => {
        socket.join(userIdentifier);
        console.log(`User ${userIdentifier} joined room`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


app.use("/api", authRoute)
app.use("/api", transfer)
app.use("/api/user", fetchUser)
app.use("/api/profile", updateProfile)
app.use("/api/user", updateBalance)

// Start server with Socket.IO
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with Socket.IO`);
});