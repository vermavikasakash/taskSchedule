import { Task } from "./Task";
import { WorkerStatus } from "../../types/enums";

export class Worker {
    public status: WorkerStatus = WorkerStatus.IDLE;

    constructor(public readonly id: string) {}

    async process(task: Task) {
        this.status = WorkerStatus.BUSY;

        task.start();

        // simulate processing
        await new Promise((res) => setTimeout(res, 1000));

        task.complete();

        this.status = WorkerStatus.IDLE;
    }
}