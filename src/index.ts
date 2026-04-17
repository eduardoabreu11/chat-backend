import "dotenv/config";
import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import router from "./routes.js";

interface ChatMessage {
  room?: string;
  author: string;
  text: string;
}

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  constructor() {
    this.app = express();

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(router);

    this.http = http.createServer(this.app);

    this.io = new Server(this.http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.listenSocket();
  }

  listenServer() {
    const port = Number(process.env.PORT) || 3000;

    this.http.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      console.log("a user connected =>", socket.id);

      socket.on("join_room", (room: string) => {
        socket.join(room);
        console.log(`socket ${socket.id} joined room ${room}`);
      });

      socket.on("message", (data: ChatMessage) => {
        if (data.room && data.room.trim() !== "") {
          this.io.to(data.room).emit("message", data);
          return;
        }

        this.io.emit("message", data);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected =>", socket.id);
      });
    });
  }
}

const app = new App();
app.listenServer();