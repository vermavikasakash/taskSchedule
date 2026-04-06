import { TaskStatus } from "../../types/enums";

export class Task {
    public status: TaskStatus = TaskStatus.PENDING;
    public retryCount = 0;

    constructor(
        public readonly id: string,
        public payload: any
    ) {}

    assign() {
        this.status = TaskStatus.ASSIGNED;
    }

    start() {
        this.status = TaskStatus.PROCESSING;
    }

    complete() {
        this.status = TaskStatus.COMPLETED;
    }

    fail() {
        this.retryCount++;
        this.status = TaskStatus.FAILED;
    }
}