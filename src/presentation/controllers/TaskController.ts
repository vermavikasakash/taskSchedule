import { Request, Response } from "express";
import { TaskService } from "../../application/TaskService";

const taskService = new TaskService();

export const createTaskController = async (
    req: Request,
    res: Response
) => {
    try {
        const { tasks } = req.body;

        await taskService.createTasks(tasks);

        return res.status(202).json({
            success: true,
            message: "Tasks are being processed",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error in task creation",
        });
    }
};