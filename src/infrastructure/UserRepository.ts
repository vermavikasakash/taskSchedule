import { UserModel } from "./model/UserModel"; 

export class UserRepository {

    async getAgents(): Promise<any[]> {
        try {
            return await UserModel.find({ role: 0 }); // agents
        } catch (error) {
            console.error("Error fetching agents:", error);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<any | null> {
        return UserModel.findById(userId);
    }

    async createUser(data: any): Promise<any> {
        return UserModel.create(data);
    }
}