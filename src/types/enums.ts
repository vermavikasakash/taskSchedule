
export enum TaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    RETRY = "RETRY"
}

export enum WorkerStatus {
    IDLE = "IDLE",
    BUSY = "BUSY"
}
