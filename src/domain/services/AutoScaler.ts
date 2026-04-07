import { WorkerManager } from "./WorkerManager";

export class AutoScaler {
  private HIGH_THRESHOLD = 3;
  private LOW_THRESHOLD = 1;

  constructor(
    private manager: WorkerManager,
    private queue: any // your queue
  ) {}

  start() {
    setInterval(async () => {
      const pendingTasks = await this.queue.getPendingCount();
      const workers = this.manager.getWorkerCount();

      console.log(`📊 Tasks: ${pendingTasks}, Workers: ${workers}`);

      // 🔼 SCALE UP
      if (pendingTasks > workers * this.HIGH_THRESHOLD) {
        this.manager.addWorker();
      }

      // 🔽 SCALE DOWN
      else if (pendingTasks < workers * this.LOW_THRESHOLD) {
        this.manager.removeWorker();
      }

    }, 3000);
  }
}