import { Task } from "../entities/Task";

export class TaskQueue {
    private queue: Task[] = [];

    enqueue(task: any) {       
        this.queue.push(task);
    }
    
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