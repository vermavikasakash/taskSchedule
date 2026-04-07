import { TaskQueue } from "../queue/TaskQueue";
import { Worker } from "../entities/Worker";
import { eventBus } from "../events/EventBus";

export class Scheduler {
  constructor(
    private queue: TaskQueue,
    private workers: Worker[],
  ) {}

  schedule() {
    while (true) {
      if (this.queue.isEmpty()) return;

      const worker = this.workers.find((w) => !w.isBusy);

      if (!worker) return;

      const tasks = this.queue.dequeueBatch(1);

      if(tasks.length === 0) return;
      
      const task = tasks[0];

      task.assign();

      console.log("Assigned:", task.id);

      eventBus.emit("taskAssigned", { task, worker });
    }
  }
}
