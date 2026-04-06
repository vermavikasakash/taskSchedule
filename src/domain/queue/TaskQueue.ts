import { Task } from "../entities/Task";

export class TaskQueue {
    private queue: Task[] = [];

    enqueueBulk(tasks: Task[]) {
        this.queue.push(...tasks);
    }

    dequeueBatch(size: number): Task[] {
        return this.queue.splice(0, size);
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}