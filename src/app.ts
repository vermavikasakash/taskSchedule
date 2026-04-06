import express from "express";
import { createTaskController } from "./presentation/controllers/TaskController";

const app = express();

// middleware
app.use(express.json());

// route
app.post("/tasks", createTaskController);

// health check (optional but useful)
app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});