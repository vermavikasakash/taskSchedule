import { TaskStatus } from "../../../../shared/enums/enums";
import { Task } from "../../domain/entities/Task";
import { TaskPersistencePort } from "../../../scheduler/domain/ports/TaskPersistencePort";
import { TaskModel, TaskRecordStatus } from "../models/TaskModel";

export class TaskRepository implements TaskPersistencePort {
  private getTerminalStatus(task: Task): TaskRecordStatus | null {
    if (task.status === TaskStatus.COMPLETED) {
      return "completed";
    }

    if (task.status === TaskStatus.FAILED) {
      return "failed";
    }

    return null;
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
    const terminalStatus = this.getTerminalStatus(task);

    await TaskModel.findOneAndUpdate(
      { taskId: task.id },
      {
        $set: {
          firstName: task.payload.firstName,
          phone: task.payload.phone,
          notes: task.payload.notes,
          taskId: task.id,
          retryCount: task.retryCount,
          internalStatus: task.status,
          ...(terminalStatus ? { status: terminalStatus } : {}),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async updateTaskStatus(taskId: string, status: TaskRecordStatus) {
    const internalStatus =
      status === "completed" ? TaskStatus.COMPLETED : TaskStatus.FAILED;

    return TaskModel.findByIdAndUpdate(
      taskId,
      { status, internalStatus },
      { returnDocument: "after" },
    );
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
