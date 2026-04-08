import { TaskRepository } from "../../task/infrastructure/repositories/TaskRepository";
import { eventBus } from "../domain/events/EventBus";
import { Worker } from "../domain/entities/Worker";
import { TaskQueue } from "../domain/queue/TaskQueue";
import { Scheduler } from "../domain/services/Scheduler";
import { WorkerRunner } from "../domain/services/WorkerRunner";

export const taskQueue = new TaskQueue();

const taskRepository = new TaskRepository();

const workers = [
  new Worker("W1", taskRepository),
  new Worker("W2", taskRepository),
];

workers.forEach((worker) => new WorkerRunner(worker, taskQueue));

export const scheduler = new Scheduler(taskQueue, workers);

eventBus.on("taskCompleted", () => {
  scheduler.schedule();
});
