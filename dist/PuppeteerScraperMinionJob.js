"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bull = require("bull");
const DeferredPromise_1 = require("./DeferredPromise");
const uuid_1 = require("uuid");
class PuppeteerScraperMinionJobModel {
    constructor(jobDescription, action, result) {
        this.jobDescription = jobDescription;
        this.action = action;
        this.result = result;
    }
}
exports.PuppeteerScraperMinionJobModel = PuppeteerScraperMinionJobModel;
class PuppeteerScraperMinionJobResult {
    constructor(result) {
        this.result = result;
    }
}
exports.PuppeteerScraperMinionJobResult = PuppeteerScraperMinionJobResult;
class PuppeteerScraperMinionJob {
    constructor(job) {
        this.job = job;
    }
    async run() {
        console.log(`Running Job: ${this.job.jobDescription}`);
        console.log(this.job.action);
        const actionResult = await this.job.action();
        // const result: any = `Job Completed: ${this.job.jobDescription}`;
        // if (actionResult != null && actionResult !== undefined) {
        //   result = actionResult;
        // }
        const finalResult = new PuppeteerScraperMinionJobResult(actionResult);
        const finalJob = new PuppeteerScraperMinionJobModel(this.job.jobDescription, this.job.action, finalResult);
        console.log(`Completing Job: ${this.job.jobDescription}`);
        return finalJob;
    }
}
exports.PuppeteerScraperMinionJob = PuppeteerScraperMinionJob;
class PuppeteerScraperOverlordJobModel {
    constructor(jobDescription, minionJobs, result) {
        this.jobDescription = jobDescription;
        this.minionJobs = minionJobs;
        this.result = result;
    }
}
exports.PuppeteerScraperOverlordJobModel = PuppeteerScraperOverlordJobModel;
// ------------------------------------------------------------------------------
class PuppeteerScraperOverlordJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on("completed", jobResultCallback).on("error", errorCallback);
    }
}
exports.PuppeteerScraperOverlordJobListener = PuppeteerScraperOverlordJobListener;
class PuppeteerScraperMinionJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on("completed", jobResultCallback).on("error", errorCallback);
    }
}
exports.PuppeteerScraperMinionJobListener = PuppeteerScraperMinionJobListener;
class PuppeteerScraperJobManager {
    constructor(queue) {
        this.queue = queue;
        // Job Consumer
        queue.process(async (job) => {
            const builtJob = new PuppeteerScraperMinionJob(job.data);
            return builtJob.run().catch((error) => {
                job.moveToFailed({ message: error.message }, true);
            });
        });
    }
    // Job Producer
    addJob(job) {
        console.log(`Add job to overlord ${job.jobDescription}`);
        this.queue.add(job);
    }
}
exports.PuppeteerScraperJobManager = PuppeteerScraperJobManager;
class PuppeteerScraperOverlordJobResult {
    constructor(result, error, failedMinionJobModel) {
        this.result = result;
        this.error = error;
        this.failedMinionJobModel = failedMinionJobModel;
    }
}
exports.PuppeteerScraperOverlordJobResult = PuppeteerScraperOverlordJobResult;
class PuppeteerScraperOverlordJob {
    constructor(job) {
        this.job = job;
        this.result = [];
        this.deferredPromise = new DeferredPromise_1.DeferredPromise();
        // @TODO: find a way to pass in queue instead of create in init
        const overlordUUID = uuid_1.v4();
        const queue = new bull(overlordUUID);
        this.queue = queue;
        this.queueManager = new PuppeteerScraperJobManager(queue);
        this.minionJobs = job.minionJobs;
        new PuppeteerScraperMinionJobListener(queue, (job, jobModel) => {
            this.handleResult(job, jobModel);
        }, error => {
            this.handleError(error);
        });
    }
    run() {
        console.log(`Started running Overlord Job: ${this.job.jobDescription}`);
        const firstJob = this.minionJobs.shift();
        const newJobsArray = this.minionJobs;
        this.currentMinionJobs = newJobsArray;
        this.currentJob = firstJob;
        this.queueManager.addJob(this.currentJob);
        return this.deferredPromise.promise;
    }
    startNextMinionJob() {
        if (this.currentMinionJobs.length === 0) {
            this.complete();
            return;
        }
        const firstJob = this.currentMinionJobs.shift();
        const newJobsArray = this.currentMinionJobs;
        this.currentMinionJobs = newJobsArray;
        this.currentJob = firstJob;
        this.queueManager.addJob(this.currentJob);
    }
    complete(error, failedJob) {
        console.log("completeing overlord job");
        this.queue.close();
        const finalResult = new PuppeteerScraperOverlordJobResult(this.result, error, failedJob);
        const final = new PuppeteerScraperOverlordJobModel(this.job.jobDescription, this.job.minionJobs, finalResult);
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
exports.PuppeteerScraperOverlordJob = PuppeteerScraperOverlordJob;
//# sourceMappingURL=PuppeteerScraperMinionJob.js.map