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
  setInterval(() => {
    if (this.queue.isEmpty()) return;

    const worker = this.getNextAvailableWorker();
    if (!worker) return;

    const tasks = this.queue.dequeueBatch(1);
    if (tasks.length === 0) return;

    const task = tasks[0];

    task.assign();

    console.log("Assigned:", task.id, "→", worker.id);

    eventBus.emit("taskAssigned", {
      task,
      workerId: worker.id
    });

  }, 100);
}
}
