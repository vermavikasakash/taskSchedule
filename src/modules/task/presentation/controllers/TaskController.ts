import { Request, Response } from "express";
import { AuthRequest } from "../../../auth/presentation/types/AuthRequest";
import { TaskService } from "../../application/services/TaskService";
import { TaskRepository } from "../../infrastructure/repositories/TaskRepository";
import { TaskRecordStatus } from "../../infrastructure/models/TaskModel";

const taskRepo = new TaskRepository();

const taskService = new TaskService();

const isTaskRecordStatus = (value: unknown): value is TaskRecordStatus =>
  value === "completed" || value === "failed";

const toTaskResponse = (taskRecord: any) => {
  const plainTask =
    typeof taskRecord?.toObject === "function"
      ? taskRecord.toObject()
      : taskRecord;

  return {
    ...plainTask,
    currentStatus: plainTask.internalStatus ?? plainTask.status ?? "QUEUED",
  };
};

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    await taskService.createTasks(tasks);

    return res.status(202).json({
      status: true,
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

export const updateTaskStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status } = req.body;

    if (!isTaskRecordStatus(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await taskRepo.getTasksByTaskId(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRepo.updateTaskStatus(taskId, status);

    return res.status(200).json({
      status: true,
      success: true,
      message: "Task updated",
    });
  } catch {
    return res.status(500).json({ message: "Error updating task" });
  }
};

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await taskRepo.getAllTasks();

    return res.status(200).send({
      status: true,
      success: true,
      message: "Tasks fetched successfully",
      task: tasks.map(toTaskResponse),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Can't fetch tasks",
      error,
    });
  }
};

export const getDashboardStatsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const totalTasks = await taskRepo.countTasks();

    return res.status(200).json({
      status: true,
      success: true,
      data: {
        totalTasks,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};
