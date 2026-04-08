
export enum TaskStatus {
    PENDING = "PENDING",
    QUEUED = "QUEUED",
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
