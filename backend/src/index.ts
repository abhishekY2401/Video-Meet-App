import { Socket } from "socket.io";
import http from "http";
import { userRouter } from "./routes/users.router";
import express from "express";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";
import { connectToDatabase } from "./services/database.service";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
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

app.use("/", userRouter);

connectToDatabase().then(() => {
  server.listen(4000, () => {
    console.log("listening on *:4000");
  });
});
