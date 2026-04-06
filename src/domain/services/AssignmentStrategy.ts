import { Worker } from "../entities/Worker";

export class RoundRobinStrategy {
    private index = 0;

    assign(workers: Worker[]): Worker {
        const worker = workers[this.index];
        this.index = (this.index + 1) % workers.length;
        return worker;
    }
}