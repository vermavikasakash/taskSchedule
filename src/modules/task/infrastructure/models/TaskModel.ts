import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    firstName: string;
    phone: string;
    notes: string;
    status: "pending" | "completed" | "failed";

    taskId?: string;
    retryCount?: number;
    internalStatus?: string;
}

const taskSchema = new Schema<ITask>(
    {
        firstName: { type: String, trim: true, required: true },
        phone: { type: String, required: true },
        notes: { type: String, required: true, trim: true },

        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },
        
        taskId: { type: String },
        retryCount: { type: Number, default: 0 },
        internalStatus: { type: String }
    },
    { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("tasks", taskSchema);
