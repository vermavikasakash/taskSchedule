import mongoose, { Document, Schema } from "mongoose";
import { TaskStatus } from "../../../../shared/enums/enums";

export type TaskRecordStatus = "completed" | "failed";

export interface ITask extends Document {
    firstName: string;
    phone: string;
    notes: string;
    status?: TaskRecordStatus;

    taskId?: string;
    retryCount?: number;
    internalStatus: TaskStatus;
}

const taskSchema = new Schema<ITask>(
    {
        firstName: { type: String, trim: true, required: true },
        phone: { type: String, required: true },
        notes: { type: String, required: true, trim: true },

        status: {
            type: String,
            enum: ["completed", "failed"],
            required: false
        },
        
        taskId: { type: String },
        retryCount: { type: Number, default: 0 },
        internalStatus: {
            type: String,
            enum: Object.values(TaskStatus),
            required: true,
            default: TaskStatus.QUEUED
        }
    },
    { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("tasks", taskSchema);
