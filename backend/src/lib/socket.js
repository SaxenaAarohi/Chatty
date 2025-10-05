import { Server } from 'socket.io';
import http from 'http';
import cors from "cors";
import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3001"],
        credentials: true,
    },
});


let onlineUsers = {};
let userSockets = {};

 io.on("connection", (socket) => {
    console.log("A user connected with socket id:", socket.id);

    socket.on("user-connected", (userid) => {
        onlineUsers[socket.id] = userid;
        userSockets[userid] = socket.id;
        io.emit("update-user-list", Object.values(onlineUsers));
    });

    socket.on("send-message", ({ toUserId, message, fromUserId }) => {
        const toSocketId = userSockets[toUserId];

        console.log(`send-message from ${fromUserId} -> ${toUserId}`, { message });

        if (toSocketId) {

            io.to(toSocketId).emit("receive-message", {
                message,
            });

        }
    });

     socket.on("disconnect", () => {
       console.log("A user disconnected with socket id:", socket.id);
        const userid = onlineUsers[socket.id];

        if (userid) {
            delete userSockets[userid];
        }
        delete onlineUsers[socket.id];
        io.emit("update-user-list", Object.values(onlineUsers));
    });
 });


 export { io, app, server };