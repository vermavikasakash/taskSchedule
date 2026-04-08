import express from "express";
import {
  loginController,
  registerController,
  testController,
} from "../controllers/authController";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware";
import {
  createTaskController,
  getAllTasksController,
  getDashboardStatsController,
  updateTaskStatusController,
} from "../../../task/presentation/controllers/TaskController";

export const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.post("/createTask", requireSignIn, isAdmin, createTaskController);
router.patch("/task/:id/status", requireSignIn, isAdmin, updateTaskStatusController);
router.get("/get", requireSignIn, isAdmin, testController);
router.get("/getTasks", requireSignIn, isAdmin, getAllTasksController);
router.get("/dashboard-stats", requireSignIn, isAdmin, getDashboardStatsController);
