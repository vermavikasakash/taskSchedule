import { UserModel } from "../models/UserModel";

export class UserRepository {
  async getUserById(userId: string): Promise<any | null> {
    return UserModel.findById(userId);
  }

  async getUserByEmail(email: string): Promise<any | null> {
    return UserModel.findOne({ email });
  }

  async createUser(data: any): Promise<any> {
    return UserModel.create(data);
  }
}
