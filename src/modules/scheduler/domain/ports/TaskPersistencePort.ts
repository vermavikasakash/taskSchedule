import { Task } from "../../../task/domain/entities/Task";

export interface TaskPersistencePort {
  createTaskRecord(task: Task): Promise<void>;
}
