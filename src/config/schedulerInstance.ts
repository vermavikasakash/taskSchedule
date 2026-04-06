// config/schedulerInstance.ts

import { TaskQueue } from "../domain/queue/TaskQueue";
import { Scheduler } from "../domain/services/Scheduler";
import { RoundRobinStrategy } from "../domain/services/AssignmentStrategy";
import { UserRepository } from "../infrastructure/UserRepository";
import {TaskRepository} from "../infrastructure/TaskRepository";

export const taskQueue = new TaskQueue();

const userRepository = new UserRepository();
const taskRepository = new TaskRepository();

const strategy = new RoundRobinStrategy();

export const scheduler = new Scheduler(
    taskQueue,
    strategy,
    userRepository,
    taskRepository
);