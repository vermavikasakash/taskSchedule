import { v4 as uuidv4 } from "uuid";
import { taskQueue, scheduler } from "../../../scheduler/bootstrap/schedulerInstance";
import { Task, TaskPayload } from "../../domain/entities/Task";

export class TaskService {
  createTasks(tasks: TaskPayload[]) {
    const taskObjects = tasks.map((taskPayload) => {
      const task = new Task(uuidv4(), taskPayload);
      task.queue();
      return task;
    });

    console.log("Tasks added:", taskObjects.length);

    taskQueue.enqueueBulk(taskObjects);

    scheduler.schedule();
  }
}
