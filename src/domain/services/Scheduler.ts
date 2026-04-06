import { TaskQueue } from "../queue/TaskQueue";
import { Worker } from "../entities/Worker";
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

        if (!worker) {
            console.log("No free worker");
            return;
        }

        task.assign();

        console.log("Assigned:", task.id);

        eventBus.emit("taskAssigned", { task, worker });
    }
}
}