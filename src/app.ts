import express from "express";
import {connectDB} from "./config/db";
import { createTaskController } from "./presentation/controllers/TaskController";
import dotenv from "dotenv";
const cors = require("cors")
const colors = require("colors");

const app = express();

// configure env
dotenv.config();

// db connect
connectDB();

// middleware
app.use(cors())
app.use(express.json());

// route
app.post("/tasks", createTaskController);

// health check (optional but useful)
app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 8080;
const dev = process.env.DEV_MODE;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(colors.bgRed(`server run on ${dev} port ${PORT}`));
});