import { Task } from "./Task";
export class Worker {
    public isBusy: boolean = false;   

    constructor(public readonly id: string) {}

    async process(task: Task): Promise<void> {
        this.isBusy = true;

        task.start();

        try {
            await new Promise((res) => setTimeout(res, 1000));
            task.complete();
        } catch (err) {
            task.fail();
        }

        this.isBusy = false;
    }
}