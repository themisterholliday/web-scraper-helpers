"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const bull_1 = __importDefault(require("bull"));
const DeferredPromise_1 = require("./DeferredPromise");
const JobManager_1 = require("./JobManager");
const JobListeners_1 = require("./JobListeners");
class ExampleOverlordJobModel {
    constructor(jobDescription, url, minionJobs, result) {
        this.jobDescription = jobDescription;
        this.url = url;
        this.minionJobs = minionJobs;
        this.result = result;
    }
}
exports.ExampleOverlordJobModel = ExampleOverlordJobModel;
class ExampleOverlordJobResult {
    constructor(result, error, failedMinionJobModel) {
        this.result = result;
        this.error = error;
        this.failedMinionJobModel = failedMinionJobModel;
    }
}
exports.ExampleOverlordJobResult = ExampleOverlordJobResult;
class ExampleOverlordJob {
    constructor(job) {
        this.job = job;
        this.result = [];
        this.deferredPromise = new DeferredPromise_1.DeferredPromise();
        // @TODO: find a way to pass in queue instead of create in init
        const overlordUUID = v4_1.default();
        const queue = new bull_1.default(overlordUUID);
        this.queue = queue;
        this.queueManager = new JobManager_1.QueueExampleJobManager(queue);
        this.minionJobs = job.minionJobs;
        new JobListeners_1.QueueExampleMinionJobListener(queue, (job, jobModel) => {
            this.handleResult(job, jobModel);
        }, error => {
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
        const final = new ExampleOverlordJobModel(this.job.jobDescription, this.job.url, this.job.minionJobs, finalResult);
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
//# sourceMappingURL=ExampleOverlordJob.js.map