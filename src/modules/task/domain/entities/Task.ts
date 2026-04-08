import { TaskStatus } from "../../../../shared/enums/enums";

export interface TaskPayload {
  firstName: string;
  phone: string;
  notes: string;
}

export class Task {
  public status: TaskStatus = TaskStatus.PENDING;
  public retryCount: number = 0;
  public maxRetries: number = 3;
  lastWorkerId?: string;
  nextRetryAt: number = 0;

  constructor(
    public readonly id: string,
    public readonly payload: TaskPayload,
  ) {}

  queue() {
    this.status = TaskStatus.QUEUED;
  }

  assign() {
    this.status = TaskStatus.ASSIGNED;
  }

  start() {
    this.status = TaskStatus.PROCESSING;
  }

  complete() {
    this.status = TaskStatus.COMPLETED;
  }

  retry() {
    this.retryCount++;

    if (this.retryCount >= this.maxRetries) {
      this.status = TaskStatus.FAILED;
    } else {
      this.status = TaskStatus.QUEUED;
      const delay = 1000 * Math.pow(2, this.retryCount);
      this.nextRetryAt = Date.now() + delay;
    }
  }
}
