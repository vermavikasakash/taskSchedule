import { v4 as uuidv4 } from "uuid";
import { taskQueue, scheduler } from "../../../scheduler/bootstrap/schedulerInstance";
import { Task, TaskPayload } from "../../domain/entities/Task";
import { TaskRepository } from "../../infrastructure/repositories/TaskRepository";

export class TaskService {
  constructor(private taskRepo = new TaskRepository()) {}

  async createTasks(tasks: TaskPayload[]): Promise<void> {
    const taskObjects = tasks.map((taskPayload) => {
      const task = new Task(uuidv4(), taskPayload);
      task.queue();
      return task;
    });

    console.log("Tasks added:", taskObjects.length);

    await Promise.all(
      taskObjects.map((task) => this.taskRepo.createTaskRecord(task)),
    );

    taskQueue.enqueueBulk(taskObjects);

    scheduler.schedule();
  }
}
