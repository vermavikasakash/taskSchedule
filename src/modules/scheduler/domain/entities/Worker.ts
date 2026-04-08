import { Task } from "../../../task/domain/entities/Task";
import { TaskStatus } from "../../../../shared/enums/enums";
import { TaskPersistencePort } from "../ports/TaskPersistencePort";

export enum WorkerProcessResult {
  REQUEUED = "REQUEUED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export class Worker {
  public isBusy: boolean = false;

  private processedCount = 0;
  private windowStart = Date.now();

  private RATE_LIMIT = 2;
  private WINDOW_SIZE = 1000;

  constructor(
    public readonly id: string,
    private taskStore: TaskPersistencePort,
  ) {}

  private canProcess(): boolean {
    const now = Date.now();

    if (now - this.windowStart >= this.WINDOW_SIZE) {
      this.windowStart = now;
      this.processedCount = 0;
    }

    return this.processedCount < this.RATE_LIMIT;
  }

  private getRetryOutcome(task: Task): WorkerProcessResult {
    return task.status === TaskStatus.FAILED
      ? WorkerProcessResult.FAILED
      : WorkerProcessResult.REQUEUED;
  }

  private async persistTaskState(task: Task) {
    try {
      await this.taskStore.createTaskRecord(task);
    } catch (error) {
      console.error("Error saving task record:", error);
    }
  }

  async process(task: Task): Promise<WorkerProcessResult> {
    task.lastWorkerId = this.id;

    if (!this.canProcess()) {
      console.log(`Worker ${this.id} rate limited`);
      task.retry();
      await this.persistTaskState(task);
      const result = this.getRetryOutcome(task);

      return result;
    }

    this.processedCount++;
    this.isBusy = true;

    task.start();
    await this.persistTaskState(task);

    try {
      if (Math.random() < 0.7) {
        throw new Error("Random failure");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      task.complete();
      await this.persistTaskState(task);
      return WorkerProcessResult.COMPLETED;
    } catch (err) {
      console.log("Failed to process task", task.id);
      task.retry();
      await this.persistTaskState(task);
      const result = this.getRetryOutcome(task);

      return result;
    } finally {
      this.isBusy = false;
    }
  }
}
