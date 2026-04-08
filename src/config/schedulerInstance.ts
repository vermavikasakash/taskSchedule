import { TaskQueue } from "../domain/queue/TaskQueue";
import { Scheduler } from "../domain/services/Scheduler";
import { Worker } from "../domain/entities/Worker";
import { WorkerRunner } from "../domain/services/WorkerRunner";
import { TaskRepository } from "../infrastructure/TaskRepository";
import { eventBus } from "../domain/events/EventBus";
import { UserRepository } from "../infrastructure/UserRepository";
import { AgentManager } from "../application/AgentManager";
import { AssignmentStateRepository } from "../infrastructure/AssignmentStateRepository";

export const taskQueue = new TaskQueue();

const userRepo = new UserRepository();
const stateRepo = new AssignmentStateRepository();
const taskRepository = new TaskRepository();

const agentManager = new AgentManager(userRepo, stateRepo);

const workers = [
  new Worker("W1", taskRepository, agentManager),
  new Worker("W2", taskRepository, agentManager),
];

workers.forEach((w) => new WorkerRunner(w, taskRepository));

export const scheduler = new Scheduler(taskQueue, workers);

eventBus.on("taskCompleted", () => {
  scheduler.schedule();
});
