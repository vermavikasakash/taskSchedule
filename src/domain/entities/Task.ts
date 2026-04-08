import { TaskStatus } from "../../types/enums";

export class Task {
  public status: string = "PENDING";
  public retryCount: number = 0;
  public maxRetries: number = 3;
  lastWorkerId?: string;
  nextRetryAt: number = 0;

  constructor(
    public id: string,
    public payload: any,
  ) {}

  queue() {
    this.status = "QUEUED";
  }

  assign() {
    this.status = "ASSIGNED";
  }

  start() {
    this.status = "PROCESSING";
  }

  complete() {
    this.status = "COMPLETED";
  }
  retry() {
    this.retryCount++;

    if (this.retryCount >= this.maxRetries) {
      this.status = "FAILED";
    } else {
      this.status = "QUEUED";
      const delay = 1000 * Math.pow(2, this.retryCount); // exponential
      this.nextRetryAt = Date.now() + delay;
    }
  }
}
