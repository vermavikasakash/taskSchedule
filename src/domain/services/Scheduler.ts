
import { Worker } from "../entities/Worker";
import { TaskQueue } from "../queue/TaskQueue";
import { RoundRobinStrategy } from "./AssignmentStrategy";

export class Scheduler {
    constructor(
        private queue: TaskQueue,
        private workers: Worker[],
        private strategy: RoundRobinStrategy
    ) {}

    async schedule() {
        if (this.queue.isEmpty()) return;

        const tasks = this.queue.dequeueBatch(10);

        for (const task of tasks) {
            const worker = this.strategy.assign(this.workers);

            task.assign();

            await worker.process(task);
        }
    }
}