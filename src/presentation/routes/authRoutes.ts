import express from "express";
import {
  registerController,
  loginController,
  testController,
  getAgentsController,
} from "../controllers/authController";
import {
  createTaskController,
  getAllTasksController,
  getDashboardStatsController,
  updateTaskStatusController,
  getMyTasksController,
} from "../controllers/TaskController";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware";

//router object
export const router = express.Router();

//routing
// ! REGISTER  (METHOD POST)
router.post("/register", registerController);

// ! LOGIN  (METHOD POST)
router.post("/login", loginController);

// !protected rotes auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// ! CREATE AGENTS  (METHOD POST)
router.post("/createTask", requireSignIn, createTaskController);

// ! UPDATE TASK STATUS  (METHOD PATCH)
router.patch("/task/:id/status", requireSignIn, updateTaskStatusController);

// !protected roUtes demo
router.get("/get", requireSignIn, isAdmin, testController);

// ! GET AGENTS
router.get("/getAgents", requireSignIn, getAgentsController);

// ! GET TASKS
router.get("/getTasks", requireSignIn, isAdmin, getAllTasksController);

// ! GET AGENT TASKS
router.get("/myTasks", requireSignIn, getMyTasksController);

// ! GET DASHBOARD STATS
router.get("/dashboard-stats", getDashboardStatsController);
