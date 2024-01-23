import { Socket } from "socket.io";
import http from "http";

import express from "express";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();

app.use(express.json());

io.on("connection", (socket: Socket) => {
  console.log("user connected");
  userManager.addUser("name", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
