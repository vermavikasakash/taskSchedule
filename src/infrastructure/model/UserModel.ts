
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email?: string;
    password: string;
    phone: string;
    role: number;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, trim: true, required: true },
        email: { type: String, trim: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        role: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("users", userSchema);