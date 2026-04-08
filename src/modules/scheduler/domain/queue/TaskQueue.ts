import { Task } from "../../../task/domain/entities/Task";

export class TaskQueue {
  private queue: Task[] = [];

  enqueue(task: Task) {
    this.queue.push(task);
  }

  enqueueBulk(tasks: Task[]) {
    this.queue.push(...tasks);
  }

  dequeueBatch(size: number) {
    const now = Date.now();

    const selected: Task[] = [];
    const remaining: Task[] = [];

    for (const task of this.queue) {
      if (
        selected.length < size &&
        (!task.nextRetryAt || task.nextRetryAt <= now)
      ) {
        selected.push(task);
      } else {
        remaining.push(task);
      }
    }

    this.queue = remaining;

    return selected;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  getPendingCount() {
    return this.queue.length;
  }
}
