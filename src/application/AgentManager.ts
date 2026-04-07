import { UserRepository } from "../infrastructure/UserRepository";
import { AssignmentStateModel } from "../infrastructure/model/AssignmentStateModel";

export class AgentManager {
  constructor(private userRepo: UserRepository) {}

  async getNextAgent() {
    const agents = await this.userRepo.getAgents();

    if (!agents.length) return null;

    let state = await AssignmentStateModel.findOne();

    if (!state) {
      state = await AssignmentStateModel.create({
        lastAssignedAgentIndex: -1,
      });
    }

    let index = state.lastAssignedAgentIndex;

    index = (index + 1) % agents.length;

    const agent = agents[index];

    state.lastAssignedAgentIndex = index;
    await state.save();

    return agent;
  }
}