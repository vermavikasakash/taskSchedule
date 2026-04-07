import { TaskQueue } from "../queue/TaskQueue";
import { Worker } from "../entities/Worker";
import { eventBus } from "../events/EventBus";

export class Scheduler {   
    private retryTimer: NodeJS.Timeout | null = null;

    constructor(
        private queue: TaskQueue,
        private workers: Worker[]
    ) {}

  schedule() {
    while (true) {
        if (this.queue.isEmpty()) return;

        const worker = this.workers.find(w => !w.isBusy);

        if (!worker) return;

        const task = this.queue.dequeueBatch(1)[0];

        task.assign();

        console.log("Assigned:", task.id);

        eventBus.emit("taskAssigned", { task, worker });
    }
}
}