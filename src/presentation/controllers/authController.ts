import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../helper/authHelper";
import { UserModel } from "../../infrastructure/model/UserModel";
import { TaskModel } from "../../infrastructure/model/TaskModel";
import JWT from "jsonwebtoken";
import {TaskService} from "../../application/TaskService";
import { AuthRequest } from "../types/AuthRequest";


// REGISTER
export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).send({ error: "All fields required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered",
      });
    }

    const hashPass = await hashPassword(password);

    const user = await new UserModel({
      name,
      email,
      password: hashPass,
      phone,
    }).save();

    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// LOGIN
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send({ message: "Invalid password" });

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.send({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// CREATE TASK
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    const validTasks = tasks.filter(
      (t: any) => t.firstName && t.phone && t.notes,
    );

    if (!validTasks.length) {
      return res.status(400).json({ message: "No valid tasks" });
    }

    await TaskService(validTasks);

    return res.status(202).json({
      success: true,
      message: "Tasks queued",
    });
  } catch {
    res.status(500).json({ message: "Error" });
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

//? TEST TOKEN
export const testController = (req: Request, res: Response) => {
  res.send("Token working");
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
