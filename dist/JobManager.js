"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExampleMinionJob_1 = require("./ExampleMinionJob");
class QueueExampleJobManager {
    constructor(queue) {
        this.queue = queue;
        // Job Consumer
        queue.process(async (job) => {
            const builtJob = new ExampleMinionJob_1.ExampleMinionJob(job.data);
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