import { eventBus } from "../events/EventBus";
import { taskQueue } from "../../config/schedulerInstance";
import { TaskRepository } from "../../infrastructure/TaskRepository";

export class WorkerRunner {
  constructor(
    private worker: any,
    private taskRepository: TaskRepository,
  ) {
    this.listen();
  }

  listen() {
    eventBus.on("taskAssigned", async ({ task, worker }) => {
      if (worker.id !== this.worker.id) return;

      console.log("Processing:", task.id);

      await worker.process(task);

      await this.taskRepository.createTask({
        firstName: task.payload.firstName,
        phone: task.payload.phone,
        notes: task.payload.notes,
        // frontend-compatible fields
        status: task.status === "COMPLETED" ? "completed" : "pending",
        // backend fields
        taskId: task.id,
        retryCount: task.retryCount,
        internalStatus: task.status,
      });

      if (task.status === "QUEUED") {
        console.log("Retrying:", task.id);

        taskQueue.enqueue(task);
      } else {
        console.log("Done:", task.id);
      }

      eventBus.emit("taskCompleted");
    });
  }
}
