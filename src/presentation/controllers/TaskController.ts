import { Request, Response } from "express";
import { TaskService } from "../../application/TaskService";
import { UserModel } from "../../infrastructure/model/UserModel";
import { TaskModel } from "../../infrastructure/model/TaskModel";
import { AuthRequest } from "../types/AuthRequest";

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
// ? PATCH TASK STATUS CONTROLLER
export const updateTaskStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await TaskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.agentId.toString() !== req.user?._id && req.user?.role !== 1) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
    });
  }
};

//? GET AGENTS
export const getAgentsController = async (req: Request, res: Response) => {
  try {
    let agent = await UserModel.find({ role: 0 });

    if (!agent || agent.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No agents available for task assignment",
      });
    }

    res
      .status(200)
      .send({ success: true, message: "Agent fetched successfully", agent });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't find agent",
      error,
    });
  }
};

//? GET ALL TASKS
export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    let task = await TaskModel.find({});
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
    const task = await TaskModel.find({ agentId: req.user?._id });

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
    const totalTasks = await TaskModel.countDocuments();
    const totalAgents = await UserModel.countDocuments({ role: 0 });

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