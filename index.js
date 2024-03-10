const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Your Socket.IO code
socketIO.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("join", (data) => {
        const username = data.username;
        socketIO.emit("user joined", { username: username });
    });

    socket.on("chat message", (data) => {
        const username = data.username;
        const message = data.message;
        socketIO.emit("chat message", { username: username, message: message });
    });

    socket.on("typing", (data) => {
        const username = data.username;
        const inputValue = data.inputValue;
        socket.broadcast.emit("typing", {
            username: username,
            inputValue: inputValue,
        });
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
