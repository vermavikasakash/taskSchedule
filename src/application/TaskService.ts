
import { Task } from "../domain/entities/Task";
import { taskQueue, scheduler } from "../config/schedulerInstance";

export class TaskService {
    createTasks(tasks: any[]) {
        const taskObjects = tasks.map(
            (t) => new Task(Date.now().toString(), t)
        );

        taskQueue.enqueueBulk(taskObjects);
        console.log("Tasks added:", taskObjects.length);
        scheduler.schedule();
    }
}