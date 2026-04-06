import { Task } from "../domain/entities/Task";
import { taskQueue, scheduler } from "../config/schedulerInstance";
import {v4 as uuidv4} from "uuid";

export class TaskService {
    createTasks(tasks: any[]) {
        const taskObjects = tasks.map(t => {
            const task = new Task(uuidv4(), t);
            task.queue();
            return task;
        });

        console.log("Tasks added:", taskObjects.length);

        taskQueue.enqueueBulk(taskObjects);

        scheduler.schedule();
    }
}