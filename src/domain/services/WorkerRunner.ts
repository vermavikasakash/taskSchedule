import { eventBus } from "../events/EventBus";
import { taskQueue } from "../../config/schedulerInstance";
import { TaskRepository } from "../../infrastructure/TaskRepository";
import { Worker } from "../entities/Worker";

export class WorkerRunner {
  constructor(
    private worker: Worker,
    private taskRepository: TaskRepository,
  ) {
    this.listen();
  }

  listen() {
    eventBus.on("taskAssigned", async ({ task, workerId }) => {
      // Only process if this worker is assigned
      if (workerId !== this.worker.id) return;

      //  Prevent double processing
      if (this.worker.isBusy) return;

      console.log(`Worker ${this.worker.id} processing:`, task.id);

      await this.worker.process(task);

      // Save result
      await this.taskRepository.createTask({
        firstName: task.payload.firstName,
        phone: task.payload.phone,
        notes: task.payload.notes,

        status: task.status === "COMPLETED" ? "completed" : "pending",

        taskId: task.id,
        retryCount: task.retryCount,
        internalStatus: task.status,
      });

      // ✅ Retry logic
      if (task.status === "QUEUED") {
        console.log("Re-enqueue (retry or rate limit):", task.id);
        taskQueue.enqueue(task);
      } else {
        console.log("Done:", task.id);
      }

      eventBus.emit("taskCompleted");
    });
  }
}
