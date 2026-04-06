import express from "express";
import { createTaskController } from "./interfaces/controllers/TaskController";

const app = express();

app.use(express.json());

// route
app.post("/tasks", createTaskController);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});