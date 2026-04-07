import { TaskQueue } from "../domain/queue/TaskQueue";
import { Scheduler } from "../domain/services/Scheduler";
import { Worker } from "../domain/entities/Worker";
import { WorkerRunner } from "../domain/services/WorkerRunner";
import { TaskRepository } from "../infrastructure/TaskRepository";
import { eventBus } from "../domain/events/EventBus";

export const taskQueue = new TaskQueue();

const workers = [
    new Worker("W1"),
    new Worker("W2"),
];

const taskRepository = new TaskRepository();

workers.forEach(w => new WorkerRunner(w,taskRepository));

export const scheduler = new Scheduler(taskQueue, workers);

eventBus.on("taskCompleted", () => {
    scheduler.schedule();
});
