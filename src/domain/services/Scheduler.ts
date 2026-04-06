
import { Worker } from "../entities/Worker";
import { TaskQueue } from "../queue/TaskQueue";
import { RoundRobinStrategy } from "./AssignmentStrategy";
import { eventBus } from "../events/EventBus";

export class Scheduler {
    constructor(
        private queue: TaskQueue,
        private workers: Worker[]
    ) {}

    schedule() {
        while (!this.queue.isEmpty()) {
            const task = this.queue.dequeueBatch(1)[0];

            const worker = this.workers.find(w => !w.isBusy);

            if (!worker) break;

            task.assign();

            // 🔥 emit event instead of direct call
            eventBus.emit("taskAssigned", { task, worker });
        }
    }
}