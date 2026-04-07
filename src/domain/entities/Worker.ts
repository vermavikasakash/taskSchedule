import { Task } from "./Task";

export class Worker {
    public isBusy: boolean = false;   

    // RATE LIMIT STATE
    private processedCount = 0;
    private windowStart = Date.now();

    private RATE_LIMIT = 2;       // max tasks
    private WINDOW_SIZE = 1000;   // per 1 second

    constructor(public readonly id: string) {}

    private canProcess(): boolean {
        const now = Date.now();

        // reset window
        if (now - this.windowStart >= this.WINDOW_SIZE) {
            this.windowStart = now;
            this.processedCount = 0;
        }

        return this.processedCount < this.RATE_LIMIT;
    }

    async process(task: Task): Promise<void> {

        // RATE LIMIT CHECK
        if (!this.canProcess()) {
            console.log(`Worker ${this.id} rate limited`);

            task.queue(); // push back to queue
            task.nextRetryAt = Date.now() + 200; // 200ms delay
            return;
        }

        this.processedCount++; // count task

        this.isBusy = true;

        task.start();

        try {
            if (Math.random() < 0.7) {
                throw new Error("Random failure");
            }

            await new Promise((res) => setTimeout(res, 1000));
            task.complete();

        } catch (err) {
            console.log("Failed to process task", task.id);
            task.fail();
        }

        this.isBusy = false;
    }
}