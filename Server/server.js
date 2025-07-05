import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoute from "./Route/authRoute.js"
import transfer from "./Route/transfer.js"

dotenv.config();

const app = express();
const PORT = 5000;


const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173"
}));

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

// Start server with Socket.IO
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with Socket.IO`);
});