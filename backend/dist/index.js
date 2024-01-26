"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const users_router_1 = require("./routes/users.router");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const database_service_1 = require("./services/database.service");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173/",
    },
});
const userManager = new UserManager_1.UserManager();
app.use(express_1.default.json());
io.on("connection", (socket) => {
    console.log("user connected");
    userManager.addUser("name", socket);
    socket.on("disconnect", () => {
        console.log("user disconnected");
        userManager.removeUser(socket.id);
    });
});
app.use("/", users_router_1.userRouter);
(0, database_service_1.connectToDatabase)().then(() => {
    server.listen(4000, () => {
        console.log("listening on *:4000");
    });
});
