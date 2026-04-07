import { Worker } from "../entities/Worker";
import { WorkerRunner } from "./WorkerRunner";
import { TaskRepository } from "../../infrastructure/TaskRepository";

export class WorkerManager {
  private workers: Worker[] = [];
  private runners: WorkerRunner[] = [];

  private MIN_WORKERS = 1;
  private MAX_WORKERS = 10;

  constructor(private taskRepository: TaskRepository) {}

  start(initialWorkers: number = 2) {
    for (let i = 0; i < initialWorkers; i++) {
      this.addWorker();
    }
  }

  addWorker() {
    if (this.workers.length >= this.MAX_WORKERS) return;

    const worker = new Worker(
      `worker-${Date.now()}-${Math.random()}`,
      this.taskRepository,
    );
    const runner = new WorkerRunner(worker, this.taskRepository);

    this.workers.push(worker);
    this.runners.push(runner);

    console.log("✅ Worker added:", worker.id);
  }

  removeWorker() {
    if (this.workers.length <= this.MIN_WORKERS) return;

    const worker = this.workers.pop();
    this.runners.pop();

    console.log("❌ Worker removed:", worker?.id);
  }

  getWorkerCount() {
    return this.workers.length;
  }

  getIdleWorker(): Worker | null {
    return this.workers.find((w) => !w.isBusy) || null;
  }
}
