"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JobBuilderInterface_1 = require("./JobBuilderInterface");
class QueueExampleJobManager {
    constructor(queue) {
        this.queue = queue;
        // Job Consumer
        queue.process(async (job) => {
            const builtJob = new JobBuilderInterface_1.ExampleMinionJobBuilder().build(job.data);
            return builtJob.run().catch((error) => {
                job.moveToFailed({ message: error.message }, true);
            });
        });
    }
    // Job Producer
    addJob(job) {
        this.queue.add(job);
    }
}
exports.QueueExampleJobManager = QueueExampleJobManager;
//# sourceMappingURL=JobManager.js.map