import { TaskModel } from "./model/TaskModel";

export class TaskRepository {
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

  async getTasksByAgent(agentId: string): Promise<any[]> {
    return TaskModel.find({ agentId });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return TaskModel.findByIdAndUpdate(taskId, { status }, { new: true });
  }
  async getAllTasks() {
    return TaskModel.find({});
  }
  async countTasks() {
  return TaskModel.countDocuments();
}
}
