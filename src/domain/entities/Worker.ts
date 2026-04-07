import { Task } from "./Task";
export class Worker {
    public isBusy: boolean = false;   

    constructor(public readonly id: string) {}

    async process(task: Task): Promise<void> {
        this.isBusy = true;

        task.start();

        try {
            if (Math.random() < 0.7) { // real failure simulation
            throw new Error("Random failure");
        }
            await new Promise((res) => setTimeout(res, 1000));
            task.complete();
        } catch (err) {
            console.log("Failed to process task", task.id);
            task.fail();
        }

        this.isBusy = false;
    }
}