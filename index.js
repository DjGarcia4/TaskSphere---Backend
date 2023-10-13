import express from "express";
import conDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

//* Configure CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS error"));
    }
  },
};

app.use(cors(corsOptions));

//*Routing
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

conDB();

const PORT = process.env.PORT || 4000;
const serverApp = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Socket.io
import { Server } from "socket.io";
const io = new Server(serverApp, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  //*Define the event's socket io
  socket.on("openProject", (project) => {
    socket.join(project);
  });
  socket.on("newTask", (task) => {
    const project = task.project;
    socket.to(project).emit("taskAdded", task);
  });
  socket.on("deleteTask", (task) => {
    const project = task.project;
    socket.to(project).emit("taskDeleted", task);
  });
  socket.on("updateTask", (task) => {
    console.log(task);
    const project = task.project._id;
    socket.to(project).emit("taskUpdated", task);
  });
  socket.on("stateTask", (task) => {
    console.log(task);
    const project = task.project._id;
    socket.to(project).emit("taskComplete", task);
  });
});
