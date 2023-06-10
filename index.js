const { Server } = require("socket.io");
const cors = require("cors");
const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("asdasd");
});

io.on("connection", (socket) => {
    socket.emit("my_id", socket.id);

    socket.on("offer_created", (data) => {
        io.to(data.remoteId).emit("offer_send", {
            senderId: data.senderId,
            offer: data.offer,
        });
    });

    socket.on("answer_created", (data) => {
        io.to(data.remoteId).emit("answer_send", {
            senderId: data.answeringId,
            answer: data.answer,
        });
    });
});

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
