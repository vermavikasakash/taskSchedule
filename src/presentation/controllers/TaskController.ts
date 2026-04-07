import { Request, Response } from "express";
import { TaskService } from "../../application/TaskService";
import { UserModel } from "../../infrastructure/model/UserModel";
import { TaskModel } from "../../infrastructure/model/TaskModel";
import { AuthRequest } from "../types/AuthRequest";
import { TaskRepository } from "../../infrastructure/TaskRepository";
import { UserRepository } from "../../infrastructure/UserRepository";

const taskRepo = new TaskRepository();
const userRepo = new UserRepository();

const taskService = new TaskService();

export const createTaskController = async (req: Request, res: Response) => {
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
// ? PATCH TASK STATUS CONTROLLER
export const updateTaskStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.agentId.toString() !== req.user._id && req.user.role !== 1) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await taskRepo.updateTaskStatus(taskId, status);

    res.status(200).json({
      success: true,
      message: "Task updated",
    });
  } catch {
    res.status(500).json({ message: "Error updating task" });
  }
};

//? GET ALL TASKS
export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const task = await taskRepo.getAllTasks();
    res
      .status(200)
      .send({ success: true, message: "Tasks fetched successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't find agent",
      error,
    });
  }
};

//? GET AGENT TASKS
export const getMyTasksController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const task = await taskRepo.getTasksByAgent(userId);

    res.status(200).send({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching tasks",
    });
  }
};

//? GET DASHBOARD STATS
export const getDashboardStatsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const totalTasks = await taskRepo.countTasks();
    const totalAgents = await userRepo.countDocuments({ role: 0 });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        totalAgents,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};
