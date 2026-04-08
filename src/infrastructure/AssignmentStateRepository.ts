import { AssignmentStateModel } from "./model/AssignmentStateModel";

export class AssignmentStateRepository {

  async getState() {
    return AssignmentStateModel.findOne();
  }

  async createInitialState() {
    return AssignmentStateModel.create({
      lastAssignedAgentIndex: -1,
    });
  }

  async updateIndex(index: number) {
    return AssignmentStateModel.findOneAndUpdate(
      {},
      { lastAssignedAgentIndex: index },
      { upsert: true, returnDocument: "after" }
    );
  }
}