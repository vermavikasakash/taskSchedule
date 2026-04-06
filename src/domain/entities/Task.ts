import { TaskStatus } from "../../types/enums";

export class Task {
    public status: string = "PENDING";

    constructor(public id: string, public payload: any) {}

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
    fail() {
    this.status = "FAILED";
}
}