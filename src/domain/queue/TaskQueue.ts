import { Task } from "../entities/Task";

export class TaskQueue {
  private queue: Task[] = [];

  enqueue(task: any) {
    this.queue.push(task);
  }

  enqueueBulk(tasks: Task[]) {
    this.queue.push(...tasks);
  }

  dequeueBatch(size: number) {
    const now = Date.now();

    const selected: any[] = [];
    const remaining: any[] = [];

    for (let task of this.queue) {
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
}
