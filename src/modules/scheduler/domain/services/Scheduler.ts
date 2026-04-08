import { Task } from "../../../task/domain/entities/Task";
import { Worker } from "../entities/Worker";
import { eventBus } from "../events/EventBus";
import { TaskQueue } from "../queue/TaskQueue";
import { RoundRobinStrategy } from "./AssignmentStrategy";

export class Scheduler {
  private strategy = new RoundRobinStrategy();
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private queue: TaskQueue,
    private workers: Worker[],
  ) {}

  private getNextAvailableWorker(task: Task): Worker | null {
    const attempts = this.workers.length;

    for (let i = 0; i < attempts; i++) {
      const worker = this.strategy.assign(this.workers);

      if (!worker.isBusy && worker.id !== task.lastWorkerId) {
        return worker;
      }
    }

    return null;
  }

  schedule() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => this.run(), 100);
  }

  run() {
    if (this.queue.isEmpty()) {
      return;
    }

    const tasks = this.queue.dequeueBatch(1);
    if (tasks.length === 0) {
      return;
    }

    const task = tasks[0];
    const worker = this.getNextAvailableWorker(task);

    if (!worker) {
      this.queue.enqueue(task);
      return;
    }

    task.assign();

    console.log("Assigned:", task.id, "to", worker.id);

    eventBus.emit("taskAssigned", {
      task,
      workerId: worker.id,
    });
  }
}
