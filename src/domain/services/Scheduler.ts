import { TaskQueue } from "../queue/TaskQueue";
import { Worker } from "../entities/Worker";
import { eventBus } from "../events/EventBus";
import { RoundRobinStrategy } from "./AssignmentStrategy";

export class Scheduler {
  private strategy = new RoundRobinStrategy();

  constructor(
    private queue: TaskQueue,
    private workers: Worker[],
  ) {}

  private getNextAvailableWorker(): Worker | null {
    const attempts = this.workers.length;

    for (let i = 0; i < attempts; i++) {
      const worker = this.strategy.assign(this.workers);

      if (!worker.isBusy) {
        return worker;
      }
    }

    return null;
  }

  schedule() {
    setInterval(() => this.run(), 100);
  }

  run() {
    if (this.queue.isEmpty()) return;

    const tasks = this.queue.dequeueBatch(1);
    if (tasks.length === 0) return;

    const task = tasks[0];

    //  avoid same worker
    const worker = this.workers.find(
      (w) => !w.isBusy && w.id !== task.lastWorkerId,
    );

    if (!worker) return;

    task.assign();

    console.log("Assigned:", task.id, "→", worker.id);

    eventBus.emit("taskAssigned", {
      task,
      workerId: worker.id,
    });
  }
}
