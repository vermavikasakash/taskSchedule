
import mongoose, { Document, Schema } from "mongoose";

export interface IAssignmentState extends Document {
    lastAssignedAgentIndex: number;
}

const assignmentStateSchema = new Schema<IAssignmentState>({
    lastAssignedAgentIndex: {
        type: Number,
        default: -1
    }
});

export const AssignmentStateModel = mongoose.model<IAssignmentState>(
    "AssignmentState",
    assignmentStateSchema
);