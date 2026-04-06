export interface IQueue<T> {
    enqueue(item: T): void;
    enqueueBulk(items: T[]): void;
    dequeueBatch(size: number): T[];
    isEmpty(): boolean;
}

export class TaskQueue<T> implements IQueue<T> {
    private queue: T[] = [];

    enqueue(item: T): void {
        this.queue.push(item);
    }

    enqueueBulk(items: T[]): void {
        this.queue.push(...items);
    }

    dequeueBatch(size: number): T[] {
        return this.queue.splice(0, size);
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}