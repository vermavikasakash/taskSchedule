import { eventBus } from "../events/EventBus";
import { Worker } from "../entities/Worker";
import { Task } from "../entities/Task";

export class WorkerRunner {
  constructor(private worker: Worker) {
    this.listen();
  }

  listen() {
    eventBus.on(
      "taskAssigned",
      async ({ task, worker }: { task: Task; worker: Worker }) => {
        if (worker.id !== this.worker.id) return;

        await this.worker.process(task);
        console.log(`Task ${task.id} completed with status ${task.status}`);
        eventBus.emit("taskCompleted", task);
      },
    );
  }
}
