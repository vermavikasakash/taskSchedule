import { TaskStatus } from "../../../../shared/enums/enums";
import { Worker, WorkerProcessResult } from "../entities/Worker";
import { eventBus } from "../events/EventBus";
import { TaskQueue } from "../queue/TaskQueue";

export class WorkerRunner {
  constructor(
    private worker: Worker,
    private taskQueue: TaskQueue,
  ) {
    this.listen();
  }

  listen() {
    eventBus.on("taskAssigned", async ({ task, workerId }) => {
      if (workerId !== this.worker.id) {
        return;
      }

      if (this.worker.isBusy) {
        return;
      }

      console.log(`Worker ${this.worker.id} processing:`, task.id);

      try {
        const result = await this.worker.process(task);

        if (result === WorkerProcessResult.REQUEUED) {
          console.log("Re-enqueue (retry or rate limit):", task.id);
          this.taskQueue.enqueue(task);
        } else if (result === WorkerProcessResult.FAILED) {
          console.log("Failed permanently:", task.id);
        } else {
          console.log("Completed:", task.id);
        }
      } catch (error) {
        console.error(
          `Worker ${this.worker.id} crashed while processing ${task.id}:`,
          error,
        );

        task.retry();

        if (task.status === TaskStatus.RETRY) {
          console.log("Re-enqueue (unexpected crash):", task.id);
          this.taskQueue.enqueue(task);
        } else {
          console.log("Failed permanently:", task.id);
        }
      } finally {
        eventBus.emit("taskCompleted");
      }
    });
  }
}
