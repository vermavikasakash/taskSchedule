// config/schedulerInstance.ts

import { TaskQueue } from "../domain/queue/TaskQueue";
import { Scheduler } from "../domain/services/Scheduler";
import { WorkerRunner } from "../domain/services/WorkerRunner"; 
import { Worker } from "../domain/entities/Worker";

export const taskQueue = new TaskQueue();


const workers = [
    new Worker("W1"),
    new Worker("W2"),
];

workers.forEach(w => new WorkerRunner(w));

export const scheduler = new Scheduler(taskQueue, workers);