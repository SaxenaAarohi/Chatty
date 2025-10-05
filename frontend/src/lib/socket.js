 import { io } from "socket.io-client";

 let socket = null;

export const connectSocket = (token,dispatch) => {
    if (!socket) {
        socket = io('http://localhost:3000', {
            auth: { token },
            withCredentials: true,
            transports: ["websocket"],
        });
        socket.on('connect', () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("user-connected", token);
        });

        socket.on("update-user-list", (users) => {
            dispatch({ type: "auth/setonlineUsers", payload: users });
        });

        socket.on('disconnect', () => {
            console.log("🔴 Socket disconnected. ");
        });

    }
    else {
        console.log("⚠️ Socket already initialized.");
    }

    return socket;

};



export const disconnectSocket = () => {

    if (socket) {
        console.log("🚫 Disconnecting socket...");
        socket.disconnect();
        socket = null;
    }
};


export const getSocket = () => socket;