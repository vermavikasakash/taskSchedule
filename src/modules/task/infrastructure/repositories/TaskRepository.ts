import { TaskStatus } from "../../../../shared/enums/enums";
import { TaskPersistencePort } from "../../../scheduler/domain/ports/TaskPersistencePort";
import { Task } from "../../domain/entities/Task";
import { TaskModel } from "../models/TaskModel";

export class TaskRepository implements TaskPersistencePort {
  private getRecordStatus(task: Task): "pending" | "completed" | "failed" {
    if (task.status === TaskStatus.COMPLETED) {
      return "completed";
    }

    if (task.status === TaskStatus.FAILED) {
      return "failed";
    }

    return "pending";
  }

  async saveTasks(tasks: any[]): Promise<void> {
    try {
      await TaskModel.insertMany(tasks);
    } catch (error) {
      console.error("Error saving tasks:", error);
      throw error;
    }
  }

  async createTask(task: any): Promise<any> {
    try {
      return await TaskModel.create(task);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async createTaskRecord(task: Task): Promise<void> {
    await this.createTask({
      firstName: task.payload.firstName,
      phone: task.payload.phone,
      notes: task.payload.notes,
      status: this.getRecordStatus(task),
      taskId: task.id,
      retryCount: task.retryCount,
      internalStatus: task.status,
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return TaskModel.findByIdAndUpdate(taskId, { status }, { returnDocument: "after" });
  }

  async getAllTasks() {
    return TaskModel.find({});
  }

  async countTasks() {
    return TaskModel.countDocuments();
  }

  async getTasksByTaskId(taskId: string) {
    return TaskModel.findById(taskId);
  }
}
