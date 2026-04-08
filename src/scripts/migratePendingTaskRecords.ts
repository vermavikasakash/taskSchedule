import dotenv from "dotenv";
import mongoose from "mongoose";
import { TaskStatus } from "../shared/enums/enums";
import {
  TaskModel,
  TaskRecordStatus,
} from "../modules/task/infrastructure/models/TaskModel";

type LegacyPendingTaskRecord = {
  _id: mongoose.Types.ObjectId;
  internalStatus?: string;
};

export type NormalizedTaskRecord = {
  status: TaskRecordStatus;
  internalStatus: TaskStatus;
};

export const normalizeLegacyPendingTaskRecord = (
  record: Pick<LegacyPendingTaskRecord, "internalStatus">,
): NormalizedTaskRecord => {
  if (record.internalStatus === TaskStatus.COMPLETED) {
    return {
      status: "completed",
      internalStatus: TaskStatus.COMPLETED,
    };
  }

  if (record.internalStatus === TaskStatus.FAILED) {
    return {
      status: "failed",
      internalStatus: TaskStatus.FAILED,
    };
  }

  return {
    status: "failed",
    internalStatus: TaskStatus.FAILED,
  };
};

async function migratePendingTaskRecords() {
  dotenv.config();

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(mongoUri);

  try {
    const legacyPendingTasks = await TaskModel.find(
      { status: "pending" },
      { internalStatus: 1 },
    ).lean<LegacyPendingTaskRecord[]>();

    if (legacyPendingTasks.length === 0) {
      console.log("No legacy pending task records found.");
      return;
    }

    const now = new Date();
    const bulkOperations = legacyPendingTasks.map((task) => {
      const normalized = normalizeLegacyPendingTaskRecord(task);

      return {
        updateOne: {
          filter: { _id: task._id },
          update: {
            $set: {
              ...normalized,
              updatedAt: now,
            },
          },
        },
      };
    });

    await TaskModel.bulkWrite(bulkOperations, { ordered: false });

    console.log(
      `Migrated ${legacyPendingTasks.length} legacy pending task record(s) to terminal states.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  migratePendingTaskRecords().catch((error) => {
    console.error("Task record migration failed:", error);
    process.exit(1);
  });
}
