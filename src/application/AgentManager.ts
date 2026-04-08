import { UserRepository } from "../infrastructure/UserRepository";
import { AssignmentStateRepository } from "../infrastructure/AssignmentStateRepository";

export class AgentManager {
  constructor(
    private userRepo: UserRepository,
    private stateRepo: AssignmentStateRepository
  ) {}

  async getNextAgent() {
    const agents = await this.userRepo.getAgents();

    if (!agents.length) return null;

    let state = await this.stateRepo.getState();

    if (!state) {
      state = await this.stateRepo.createInitialState();
    }

    let index = state.lastAssignedAgentIndex;

    index = (index + 1) % agents.length;

    const agent = agents[index];

    await this.stateRepo.updateIndex(index);

    return agent;
  }
}