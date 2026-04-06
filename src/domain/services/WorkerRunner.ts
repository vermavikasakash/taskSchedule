import { eventBus } from "../events/EventBus";

export class WorkerRunner {
    constructor(private worker: any) {
        this.listen();
    }

    listen() {
        eventBus.on("taskAssigned", async ({ task, worker }) => {
            if (worker.id !== this.worker.id) return;

            console.log("Processing:", task.id);

            await worker.process(task);

            console.log("Done:", task.id);
            
            eventBus.emit("taskCompleted");
        });
        
        
    }
}