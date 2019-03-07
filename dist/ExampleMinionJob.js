"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExampleMinionJobModel {
    constructor(jobDescription, url, result) {
        this.jobDescription = jobDescription;
        this.url = url;
        this.result = result;
    }
}
exports.ExampleMinionJobModel = ExampleMinionJobModel;
class ExampleMinionJobResult {
    constructor(result) {
        this.result = result;
    }
}
exports.ExampleMinionJobResult = ExampleMinionJobResult;
class ExampleMinionJob {
    constructor(job) {
        this.job = job;
    }
    run() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = new ExampleMinionJobResult(`Job 1 complete for url: ${this.job.url}`);
                const finalJob = new ExampleMinionJobModel(this.job.jobDescription, this.job.url, result);
                resolve(finalJob);
            }, 1000);
        });
    }
}
exports.ExampleMinionJob = ExampleMinionJob;
//# sourceMappingURL=ExampleMinionJob.js.map