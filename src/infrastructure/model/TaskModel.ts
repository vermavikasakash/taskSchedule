import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    firstName: string;
    phone: string;
    notes: string;
    agentId: mongoose.Types.ObjectId;
    agentName: string;
    status: "pending" | "completed";
}

const taskSchema = new Schema<ITask>(
    {
        firstName: { type: String, trim: true, required: true },
        phone: { type: String, required: true },
        notes: { type: String, required: true, trim: true },

        agentId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        agentName: { type: String, required: true, trim: true },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("tasks", taskSchema);