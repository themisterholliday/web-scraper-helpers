"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const v4_1 = __importDefault(require("uuid/v4"));
var ExampleMinionJobType;
(function (ExampleMinionJobType) {
    ExampleMinionJobType[ExampleMinionJobType["Minion1"] = 0] = "Minion1";
})(ExampleMinionJobType = exports.ExampleMinionJobType || (exports.ExampleMinionJobType = {}));
var ExampleOverlordJobType;
(function (ExampleOverlordJobType) {
    ExampleOverlordJobType[ExampleOverlordJobType["Overlord1"] = 0] = "Overlord1";
})(ExampleOverlordJobType = exports.ExampleOverlordJobType || (exports.ExampleOverlordJobType = {}));
class ExampleMinionJobModel {
    constructor(jobType, jobDescription, url, result) {
        this.jobType = jobType;
        this.jobDescription = jobDescription;
        this.url = url;
        this.result = result;
    }
}
class ExampleOverlordJobModel {
    constructor(jobType, jobDescription, url, minionJobs, result) {
        this.jobType = jobType;
        this.jobDescription = jobDescription;
        this.url = url;
        this.minionJobs = minionJobs;
        this.result = result;
    }
}
class ExampleMinionJobResult {
    constructor(result) {
        this.result = result;
    }
}
class ExampleOverlordJobResult {
    constructor(result, error, failedJob) {
        this.result = result;
        this.error = error;
        this.failedJob = failedJob;
    }
}
class ExampleMinionJob {
    constructor(job) {
        this.job = job;
    }
    run() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = new ExampleMinionJobResult(`Job 1 complete for url: ${this.job.url}`);
                const finalJob = new ExampleMinionJobModel(this.job.jobType, this.job.jobDescription, this.job.url, result);
                resolve(finalJob);
            }, 1000);
        });
    }
}
class ExampleMinionJobBuilder {
    build(job) {
        switch (job.jobType) {
            case ExampleMinionJobType.Minion1:
                return new ExampleMinionJob(job);
        }
    }
}
exports.ExampleMinionJobBuilder = ExampleMinionJobBuilder;
class ExampleOverlordJobBuilder {
    build(job) {
        switch (job.jobType) {
            case ExampleOverlordJobType.Overlord1:
                return new ExampleOverlordJob(job);
        }
    }
}
exports.ExampleOverlordJobBuilder = ExampleOverlordJobBuilder;
class QueueExampleJobManager {
    constructor(queue) {
        this.queue = queue;
        // Job Consumer
        queue.process(async (job) => {
            const builtJob = new ExampleMinionJobBuilder().build(job.data);
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
class QueueExampleMinionJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on('completed', jobResultCallback).on('error', errorCallback);
    }
}
exports.QueueExampleMinionJobListener = QueueExampleMinionJobListener;
class QueueExampleOverlordJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on('completed', jobResultCallback).on('error', errorCallback);
    }
}
exports.QueueExampleOverlordJobListener = QueueExampleOverlordJobListener;
class ExampleOverlordJob {
    constructor(job) {
        this.job = job;
        this.result = [];
        this.deferredPromise = new DeferredPromise();
        // @TODO: find a way to pass in queue instead of create in init
        const overlordUUID = v4_1.default();
        const queue = new bull_1.default(overlordUUID);
        this.queue = queue;
        this.queueManager = new QueueExampleJobManager(queue);
        this.minionJobs = job.minionJobs;
        new QueueExampleMinionJobListener(queue, (job, jobModel) => {
            this.handleResult(job, jobModel);
        }, (error) => {
            this.handleError(error);
        });
    }
    run() {
        this.startNextMinionJob();
        return this.deferredPromise.promise;
    }
    startNextMinionJob() {
        if (this.minionJobs.length === 0) {
            this.complete();
            return;
        }
        const firstJob = this.minionJobs.shift();
        const newJobsArray = this.minionJobs.filter((_, i) => i !== 0);
        this.minionJobs = newJobsArray;
        this.currentJob = firstJob;
        this.queueManager.addJob(firstJob);
    }
    complete(error, failedJob) {
        console.log('completeing overlord job');
        this.queue.close();
        const finalResult = new ExampleOverlordJobResult(this.result, error, failedJob);
        const final = new ExampleOverlordJobModel(this.job.jobType, this.job.jobDescription, this.job.url, this.job.minionJobs, finalResult);
        if (error != null) {
            this.deferredPromise.reject(final);
            return;
        }
        this.deferredPromise.resolve(final);
    }
    failWithError(error) {
        this.complete(error, this.currentJob);
    }
    handleResult(job, jobModel) {
        this.result.push(jobModel);
        this.startNextMinionJob();
    }
    handleError(error) {
        this.failWithError(error);
    }
}
exports.ExampleOverlordJob = ExampleOverlordJob;
class DeferredPromise {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
function run() {
    const testQueue = new bull_1.default('test-queue');
    const startURL = 'URL.com';
    const job1 = new ExampleMinionJobModel(ExampleMinionJobType.Minion1, 'Job 1 description', startURL);
    const minionJobs = [job1, job1, job1];
    new QueueExampleOverlordJobListener(testQueue, (job, jobModel) => {
        console.log(job.id, 'overlord job id');
        console.log(jobModel, 'completed overlord job model');
        console.log(jobModel.result, 'overlord job result');
        testQueue.close();
    }, (jobModel) => {
        console.log(jobModel, 'failed overlord job');
        console.log(jobModel.result.error, 'failed overlord error');
        console.log(jobModel.result.failedJob, 'the failed minion job');
        testQueue.close();
    });
    // @TODO: use an overlord manager
    testQueue.process(async (job) => {
        const jobData = job.data;
        const builtJob = new ExampleOverlordJobBuilder().build(jobData);
        return builtJob.run().catch((error) => {
            console.log('movedToFailed from overlord');
            job.moveToFailed({ message: error.message }, true);
        });
    });
    const overlordjob1 = new ExampleOverlordJobModel(ExampleOverlordJobType.Overlord1, 'Overlord Job 1 description', 'url or whatever needed', minionJobs);
    testQueue.add(overlordjob1);
}
run();
//# sourceMappingURL=BullJobBuilder.js.map