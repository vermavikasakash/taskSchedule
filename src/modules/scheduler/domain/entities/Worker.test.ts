import assert from "node:assert/strict";
import test from "node:test";
import { TaskStatus } from "../../../../shared/enums/enums";
import { Task } from "../../../task/domain/entities/Task";
import { Worker, WorkerProcessResult } from "./Worker";

const createTask = () => {
  const task = new Task("task-1", {
    firstName: "Test",
    phone: "9999999999",
    notes: "test task",
  });

  task.queue();
  return task;
};

test("worker requeues a task after a retryable failure", async () => {
  const storedTasks: Task[] = [];
  const worker = new Worker(
    "W1",
    {
      createTaskRecord: async (task: Task) => {
        storedTasks.push(task);
      },
    },
  );

  const originalRandom = Math.random;
  Math.random = () => 0.1;

  try {
    const task = createTask();
    const result = await worker.process(task);

    assert.equal(result, WorkerProcessResult.REQUEUED);
    assert.equal(task.status, TaskStatus.QUEUED);
    assert.equal(task.retryCount, 1);
    assert.equal(worker.isBusy, false);
    assert.equal(storedTasks.length, 0);
    assert.ok(task.nextRetryAt > Date.now());
  } finally {
    Math.random = originalRandom;
  }
});

test("worker marks a task as failed after the final retry", async () => {
  const persistedStatuses: TaskStatus[] = [];
  const worker = new Worker(
    "W1",
    {
      createTaskRecord: async (task: Task) => {
        persistedStatuses.push(task.status);
      },
    },
  );

  const originalRandom = Math.random;
  Math.random = () => 0.1;

  try {
    const task = createTask();
    task.retryCount = task.maxRetries - 1;

    const result = await worker.process(task);

    assert.equal(result, WorkerProcessResult.FAILED);
    assert.equal(task.status, TaskStatus.FAILED);
    assert.equal(task.retryCount, task.maxRetries);
    assert.deepEqual(persistedStatuses, [TaskStatus.FAILED]);
    assert.equal(worker.isBusy, false);
  } finally {
    Math.random = originalRandom;
  }
});

test("worker persists the final completed status after successful processing", async () => {
  const persistedStatuses: TaskStatus[] = [];
  const worker = new Worker(
    "W1",
    {
      createTaskRecord: async (task: Task) => {
        persistedStatuses.push(task.status);
      },
    },
  );

  const originalRandom = Math.random;
  Math.random = () => 0.9;

  try {
    const task = createTask();
    const result = await worker.process(task);

    assert.equal(result, WorkerProcessResult.COMPLETED);
    assert.equal(task.status, TaskStatus.COMPLETED);
    assert.deepEqual(persistedStatuses, [TaskStatus.COMPLETED]);
    assert.equal(worker.isBusy, false);
  } finally {
    Math.random = originalRandom;
  }
});
