"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const ExampleMinionJob_1 = require("./ExampleMinionJob");
const JobListeners_1 = require("./JobListeners");
const ExampleOverlordJob_1 = require("./ExampleOverlordJob");
const JobBuilderInterface_1 = require("./JobBuilderInterface");
function run() {
    const testQueue = new bull_1.default('test-queue');
    const startURL = 'URL.com';
    const job1 = new ExampleMinionJob_1.ExampleMinionJobModel(ExampleMinionJob_1.ExampleMinionJobType.Minion1, 'Job 1 description', startURL);
    const minionJobs = [job1, job1, job1];
    new JobListeners_1.QueueExampleOverlordJobListener(testQueue, (job, jobModel) => {
        console.log(job.id, 'overlord job id');
        console.log(jobModel, 'completed overlord job model');
        console.log(jobModel.result, 'overlord job result');
        testQueue.close();
    }, (jobModel) => {
        console.log(jobModel, 'failed overlord job');
        console.log(jobModel.result.error, 'failed overlord error');
        console.log(jobModel.result.failedMinionJobModel, 'the failed minion job');
        testQueue.close();
    });
    // @TODO: use an overlord manager
    testQueue.process(async (job) => {
        const jobData = job.data;
        const builtJob = new JobBuilderInterface_1.ExampleOverlordJobBuilder().build(jobData);
        return builtJob.run().catch((error) => {
            console.log('movedToFailed from overlord');
            job.moveToFailed({ message: error.message }, true);
        });
    });
    const overlordjob1 = new ExampleOverlordJob_1.ExampleOverlordJobModel(ExampleOverlordJob_1.ExampleOverlordJobType.Overlord1, 'Overlord Job 1 description', 'url or whatever needed', minionJobs);
    testQueue.add(overlordjob1);
}
run();
//# sourceMappingURL=BullQueueExample.js.map