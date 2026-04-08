import assert from "node:assert/strict";
import test from "node:test";
import { TaskStatus } from "../shared/enums/enums";
import { normalizeLegacyPendingTaskRecord } from "./migratePendingTaskRecords";

test("normalizes legacy pending records that already reached completion", () => {
  const result = normalizeLegacyPendingTaskRecord({
    internalStatus: TaskStatus.COMPLETED,
  });

  assert.deepEqual(result, {
    status: "completed",
    internalStatus: TaskStatus.COMPLETED,
  });
});

test("normalizes legacy pending records with unknown lifecycle state to failed", () => {
  const result = normalizeLegacyPendingTaskRecord({
    internalStatus: TaskStatus.PROCESSING,
  });

  assert.deepEqual(result, {
    status: "failed",
    internalStatus: TaskStatus.FAILED,
  });
});

