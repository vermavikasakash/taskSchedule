import { TaskQueue } from "../queue/TaskQueue";
import { WorkerManager } from "./WorkerManager";

export class AutoScaler {
  private HIGH_THRESHOLD = 3;
  private LOW_THRESHOLD = 1;

  constructor(
    private manager: WorkerManager,
    private queue: TaskQueue,
  ) {}

  start() {
    setInterval(() => {
      const pendingTasks = this.queue.getPendingCount();
      const workers = this.manager.getWorkerCount();

      console.log(`Tasks: ${pendingTasks}, Workers: ${workers}`);

      const effectiveWorkers = workers || 1;

      // SCALE UP
      if (pendingTasks > effectiveWorkers * this.HIGH_THRESHOLD) {
        this.manager.addWorker();
      }

      // SCALE DOWN
      else if (pendingTasks < workers && workers > 1) {
        this.manager.removeWorker();
      }

    }, 3000);
  }
}